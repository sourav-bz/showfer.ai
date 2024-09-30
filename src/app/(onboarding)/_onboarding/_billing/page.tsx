"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Add these imports

const plans = [
  {
    name: "Early Access",
    price: 99,
    features: [
      "10,000 messages per month",
      "5000 minutes of voice",
      "Voice chat",
      "200 web pages",
      "50 files",
    ],
  },
  {
    name: "Basic",
    price: 199,
    features: [
      "10,000 messages per month",
      "5000 minutes of voice",
      "Voice chat",
      "200 web pages",
      "50 files",
      "Support for CSV, TXT, PDF, DOCX, PPTX, MD files",
      "< 2mb files",
    ],
  },
  {
    name: "Pro",
    price: 499,
    features: [
      "20,000 messages per month",
      "10,000 minutes of voice",
      "Pre-designed 3D mascot",
      "500 web pages",
      "100 files",
      "Support for CSV, TXT, PDF, DOCX, PPTX, MD files",
      "< 5mb files",
    ],
    popular: true,
  },
  {
    name: "Custom",
    price: 749,
    features: [
      "50,000 messages per month",
      "30,000 minutes of voice",
      "Custom 3D mascot",
      "500 files",
      "Support for CSV, TXT, PDF, DOCX, PPTX, MD files",
      "< 10mb files",
      "Embedded on unlimited websites",
    ],
  },
];

type Plan = (typeof plans)[number];

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [paddle, setPaddle] = useState<Paddle>();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState<string | undefined>();

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const userEmail = session.user.email;
        setEmail(userEmail);
      }
    };

    checkSession();

    console.log("Initializing Paddle...");
    initializePaddle({
      environment: "sandbox",
      token: "test_90951bc0a2d2dd7842ab6866645",
    })
      .then((paddleInstance: Paddle | undefined) => {
        if (paddleInstance) {
          console.log("Paddle initialized successfully");
          setPaddle(paddleInstance);
        } else {
          console.error("Failed to initialize Paddle");
        }
      })
      .catch((error) => {
        console.error("Error initializing Paddle:", error);
      });
  }, []);

  const handleGetStarted = (plan: Plan) => {
    setSelectedPlan(plan);
    if (paddle && email) {
      paddle.Checkout.open({
        items: [{ priceId: getPriceIdForPlan(plan), quantity: 1 }],
        customer: {
          email: email,
        },
      });
    } else if (paddle) {
      paddle.Checkout.open({
        items: [{ priceId: getPriceIdForPlan(plan), quantity: 1 }],
      });
    } else {
      console.error("Paddle is not initialized or user email is not available");
      if (!paddle) console.error("Paddle is not initialized");
      if (!email) console.error("User email is not available");
    }
  };

  const getPriceIdForPlan = (plan: Plan) => {
    // Replace with actual price IDs from Paddle
    switch (plan.name) {
      case "Early Access":
        return "pri_01j80v36t12ew9ka5mqbzm6d3r";
      case "Basic":
        return "pri_01j7b2kb90snbp7ppsdfs0jqpf";
      case "Pro":
        return "pri_01j7b2m7e78h8pr6866wv2aedp";
      case "Custom":
        return "pri_01j7b2nbrbbv13wcg6kzwnz8q0";
      default:
        throw new Error("Invalid plan");
    }
  };

  const handleBackToPlans = () => {
    setShowOrderSummary(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <div className="p-[40px] flex flex-col w-full h-full">
        <h1 className="text-[24px] font-medium mb-4 text-left flex items-center">
          <Image
            src="/icons/back.svg"
            alt="Back"
            width={24}
            height={24}
            className="mr-2 cursor-pointer"
            onClick={() => router.back()}
          />
          Plans for you
        </h1>
        <div className="w-full rounded-[15px] p-[5px] flex flex-col justify-center items-center mb-[40px]">
          <h1 className="text-[24px] font-medium text-left flex items-center mb-4">
            Pricing plans of
            <div className="ml-2 p-2 rounded-[6px] bg-white shadow-custom transform -rotate-[5.978deg]">
              <Image
                src="/brand-logo/dark.svg"
                alt="Showfer.ai Logo"
                width={100}
                height={24}
              />
            </div>
          </h1>
          <p className="text-[#8F93A5] mb-8 w-[480px] text-center tracking-[0.1px]">
            We offer a variety of plans to fit your needs. Whether you&apos;re
            just getting started or are a large enterprise, we have a plan for
            you.
          </p>
        </div>

        {!showOrderSummary ? (
          <>
            <div className="flex justify-center items-center">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`bg-white w-[290px] rounded-[15px] shadow-md mr-[30px] ${
                    plan.popular
                      ? "border-[0.95px] border-purple-500"
                      : "border-[0.95px] border-[#E3E4EC]"
                  }`}
                >
                  <div
                    className={`${
                      plan.popular
                        ? "bg-[#6D67E4] text-white pt-[47px] pb-[27px] pl-[15px]"
                        : "bg-[#E3E4EC] py-[27px] pl-[15px]"
                    } rounded-t-[15px]  relative`}
                  >
                    {plan.popular && (
                      <div className="text-[#6D67E4] text-[12px] font-semibold mb-2 absolute top-3 right-3 px-[10px] py-[5px] rounded-full bg-white">
                        Most Popular
                      </div>
                    )}
                    <h2
                      className={`text-[15px] font-medium mb-1 ${
                        plan.popular ? "text-white" : "text-black"
                      }`}
                    >
                      {plan.name}
                    </h2>
                    <p
                      className={`text-[22px] font-semibold ${
                        plan.popular ? "text-white" : "text-black"
                      }`}
                    >
                      ${plan.price}
                      <span className="text-[15px] font-normal">/month</span>
                    </p>
                  </div>
                  <div className="p-[15px]">
                    <ul className="mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="mb-2 text-[14px] font-light flex"
                        >
                          <div className="w-[7px] h-[8px] rounded-full mr-2 mt-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="7"
                              height="8"
                              viewBox="0 0 7 8"
                              fill="none"
                            >
                              <circle
                                cx="3.5"
                                cy="3.5"
                                r="3.5"
                                transform="matrix(1 0 0 -1 0 7.5)"
                                fill="#6D67E4"
                                fill-opacity="0.5"
                              />
                            </svg>
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handleGetStarted(plan)}
                      className={`w-full py-2 rounded-md ${
                        plan.popular
                          ? "bg-[#6D67E4] text-white mt-[10px]"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <button
              onClick={handleBackToPlans}
              className="mb-4 text-purple-500"
            >
              &lt; Order summary
            </button>
            <h2 className="text-3xl font-bold text-purple-500 mb-2">
              7 days free
            </h2>
            <p className="text-gray-600 mb-6">
              Then ₹{selectedPlan?.price}/month, inc. GST
            </p>

            <div className="flex justify-between items-start mb-6 bg-gray-100 p-4 rounded-lg">
              <div>
                <h3 className="font-bold mb-2">Showfer.ai</h3>
                <p className="text-sm text-gray-600 mb-1">Qty: 1</p>
                <a href="#" className="text-sm text-purple-500 block mb-1">
                  Add discount
                </a>
                <a href="#" className="text-sm text-purple-500 block mb-1">
                  Add GST number
                </a>
                <p className="text-sm">Due today</p>
              </div>
              <div className="text-right">
                <p className="mb-2">7 days free</p>
                <p className="font-bold">₹ 0.00</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-4">Enter your card details</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Name on card"
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-1/2 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <button className="w-full py-2 rounded-md bg-purple-500 text-white">
              Start your free trail
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
