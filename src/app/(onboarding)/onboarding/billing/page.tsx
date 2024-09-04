"use client";
import Image from "next/image";
import { useState } from "react";

const plans = [
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
    name: "Enterprise",
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

  const handleGetStarted = (plan: (typeof plans)[number]) => {
    setSelectedPlan(plan);
    setShowOrderSummary(true);
  };

  const handleBackToPlans = () => {
    setShowOrderSummary(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Image
          src="/brand-logo/dark.svg"
          alt="Showfer.ai Logo"
          width={150}
          height={40}
        />
      </div>

      {!showOrderSummary ? (
        <>
          <h1 className="text-3xl font-bold mb-4">
            Pricing plans of Showfer.ai
          </h1>
          <p className="text-gray-600 mb-8">
            We offer a variety of plans to fit your needs. Whether you&apos;re
            just getting started or are a large enterprise, we have a plan for
            you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white p-6 rounded-lg shadow-md ${
                  plan.popular ? "border-2 border-purple-500" : ""
                }`}
              >
                {plan.popular && (
                  <div className="text-purple-500 font-semibold mb-2">
                    Most Popular
                  </div>
                )}
                <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                <p className="text-3xl font-bold mb-4">
                  ${plan.price}
                  <span className="text-sm font-normal">/month</span>
                </p>
                <ul className="mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="mb-2">
                      • {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleGetStarted(plan)}
                  className={`w-full py-2 rounded-md ${
                    plan.popular
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <button onClick={handleBackToPlans} className="mb-4 text-purple-500">
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
  );
}
