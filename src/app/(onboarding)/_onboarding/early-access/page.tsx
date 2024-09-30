"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { initializePaddle, Paddle } from "@paddle/paddle-js";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // Add these imports
import IconSVG from "@/app/_ui/IconSvg";
import { PopupButton } from "react-calendly";
import axios from "axios"; // Add this import

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
      eventCallback(event) {
        console.log("Paddle event:", event);
        if (event.name === "checkout.completed") {
          console.log("Checkout completed");
          // Add this code to store the transaction
          storeTransaction(event.data);
        }
      },
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

  const handleGetEarlyAccess = () => {
    if (paddle && email) {
      paddle.Checkout.open({
        items: [{ priceId: "pri_01j80v36t12ew9ka5mqbzm6d3r", quantity: 1 }],
        customer: {
          email: email,
        },
      });
    } else {
      console.error("Paddle is not initialized or user email is not available");
    }
  };

  // Add this function to store the transaction
  const storeTransaction = async (transactionData: any) => {
    try {
      const response = await axios.post("/api/billing", {
        email: email,
        planType: "main",
        transactionData: transactionData,
      });
      console.log("Transaction stored:", response.data);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      // Update pro_user status in the users table
      const { error } = await supabase
        .from("users")
        .update({ pro_user: true })
        .eq("id", user?.id);

      if (error) {
        console.error("Error updating pro_user status:", error);
      } else {
        console.log("Pro user status updated successfully");
        router.push("/dashboard/home");
      }
    } catch (error) {
      console.error("Error storing transaction:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <div className="p-[40px] flex flex-col w-full h-full items-center text-center">
        <h1 className="text-[24px] font-medium mb-4 text-left flex items-center self-start">
          <Image
            src="/icons/back.svg"
            alt="Back"
            width={24}
            height={24}
            className="mr-2 cursor-pointer"
            onClick={() => router.back()}
          />
          Early Access
        </h1>

        <div className="mt-8">
          {/* <s className="text-black text-[32px] font-light">$149/month</s> */}
          <h2 className="text-[40px] font-medium text-[#6D67E4] mt-2 ">
            <span className="font-semibold">$99</span> For Early access
          </h2>
        </div>

        <div className="mt-6 flex border border-[#E3E4EC] py-[10px] px-[20px] items-center justify-center rounded-full">
          <div className="mr-4 flex items-center">
            <IconSVG className="mr-2" name="bullet" color="#6D67E4" />
            <span>20,000 text messages</span>
          </div>
          <div className="mr-4 flex items-center">
            <IconSVG className="mr-2" name="bullet" color="#6D67E4" />
            <span>10,000 voice minutes</span>
          </div>
        </div>

        <p className="mt-6 text-[#8F93A5] text-[16px] font-light">
          You can add on the features based on your
          <br />
          need after activating the plan
        </p>

        <div
          className="p-[5px] rounded-[15px] cursor-pointer mt-10"
          style={{ background: `rgba(109, 103, 228, 0.15)` }}
          onClick={handleGetEarlyAccess}
        >
          <div
            className="w-[250px] h-[48px] rounded-[15px] flex items-center justify-center"
            style={{
              backgroundImage: `url('/bg.svg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <span className="text-white text-[16px] font-medium">
              Get Early Access
            </span>
          </div>
        </div>

        <p className="mt-4 text-gray-400">or</p>

        <button
          className="mt-4 w-[250px] h-[48px] bg-[#F0F2F7] text-[#6D67E4] rounded-[10px] font-medium hover:bg-gray-200 transition-colors"
          onClick={() => {}}
        >
          <PopupButton
            url="https://calendly.com/showfer-support/demo"
            text="Schedule a demo"
            rootElement={document.body}
          />
        </button>
      </div>
    </div>
  );
}
