"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsVerifying(true);
    // Here you would typically send a verification email
    // For now, we're just changing the state
  };

  const handleNext = () => {
    router.push("/onboarding/personality");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-white">
          <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
              Let&apos;s get started!
            </h2>
            <ul className="space-y-6">
              <ListItem
                text="Manage all support channels from one screen"
                description="Showfer.ai integrates with WhatsApp, IG DMs, Facebook Messenger, IG & FB post comments, Email & Live Chat."
              />
              <ListItem
                text="Use WhatsApp Marketing to grow your sales"
                description="Send broadcasts to your customers using official WhatsApp API. Automate abandoned cart, order tracking, COD order verification and more."
              />
              <ListItem
                text="Collaborate with your whole team"
                description="Post internal comments to resolve questions, assign and take over threads, and have complete visibility over your team's communication with customers."
              />
              <ListItem
                text="View customer profile & order data"
                description="Showfer.ai deeply integrates with platforms such as Shopify to bring you all the information about a customer and their orders in one place."
              />
            </ul>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Image
              src="./brand-logo/dark.svg"
              alt="Showfer.ai Logo"
              width={150}
              height={40}
            />
            {!isVerifying && (
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Welcome to Showfer.ai 👋
              </h2>
            )}
          </div>
          {!isVerifying ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Full legal name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="At least 8 characters"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Account
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Please check your email
              </h2>
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                We&apos;ve sent a sign-up link to
                <br />
                <span className="font-medium">{email}</span>
              </p>
              <button
                onClick={() => setIsVerifying(false)}
                className="text-sm text-indigo-600 hover:text-indigo-500 mb-4"
              >
                Didn&apos;t get a link? Click here to try again
              </button>
              <button
                onClick={handleNext}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          )}
          {!isVerifying && (
            <>
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in here
                </Link>
              </p>
              <p className="mt-4 text-center text-xs text-gray-500">
                By creating an account, you agree to Showfer.ai&apos;s Terms of
                Service and Privacy Policy.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ListItem({
  text,
  description,
}: {
  text: string;
  description: string;
}) {
  return (
    <li className="flex">
      <div className="flex-shrink-0">
        <svg
          className="h-6 w-6 text-indigo-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-medium text-gray-900">{text}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </li>
  );
}
