"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast, { Toaster } from "react-hot-toast";
import { checkUserStatus } from "./_utils/checkUserStatus";
import PuffLoader from "react-spinners/PuffLoader";

export default function Signup() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [earlyAccessApproved, setEarlyAccessApproved] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);

  const changes = supabase
    .channel("schema-db-changes")
    .on(
      "postgres_changes",
      {
        schema: "public", // Subscribes to the "public" schema in Postgres
        event: "UPDATE",
        table: "users",
      },
      (payload) => {
        //console.log("payload", payload);
        setEarlyAccessApproved(payload.new.early_access_approved);
      }
    )
    .subscribe();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      //console.log("Session:", session);
      if (session) {
        setIsAuthenticated(true);
        const userStatus = await checkUserStatus(email);
        if (userStatus?.exists) {
          setEarlyAccessApproved(userStatus.early_access_approved);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setIsAuthenticated(true);
        createNewUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  useEffect(() => {
    if (isAuthenticated && earlyAccessApproved) {
      router.push("/onboarding/personality");
    }
  }, [isAuthenticated, earlyAccessApproved, router]);

  const createNewUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { full_name, website_url } = user?.user_metadata || {};

      const response = await fetch("/api/users/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: full_name, websiteUrl: website_url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.user) {
        // User created successfully, show appropriate UI
        setEarlyAccessApproved(data.user.early_access_approved);
      } else {
        // Handle error
        console.error("Error creating user:", data.error);
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const userStatus = await checkUserStatus(email);
    if (userStatus?.exists) {
      toast("User already exists, please sign in", {
        icon: "👋",
        style: {
          borderRadius: "10px",
          background: "#6D67E4",
          color: "#fff",
        },
      });
      setIsLoading(false);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } else {
      setIsVerifying(true);
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `https://showfer.ai/api/callback?redirectTo=${encodeURIComponent(
              `${window.location.pathname}`
            )}`,
            data: { full_name: fullName, website_url: websiteUrl },
          },
        });

        if (error) throw error;
        // Magic link sent successfully
      } catch (error) {
        console.error("Error sending magic link:", error);
        setIsVerifying(false);
      }
    }
  };

  return (
    <div className="flex h-full bg-white rounded-lg justify-center">
      <Toaster position="top-right" />
      {/* <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#E3E4EC] to-transparent"></div>
          <div className="max-w-2xl px-[70px] h-full flex flex-col justify-center">
            <h2 className="text-2xl font-medium text-gray-900 mb-[40px]">
              Let&apos;s get started!
            </h2>
            <ul className="space-y-[32px]">
              <ListItem
                text="Give voice to your brand and website"
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
      </div> */}
      <div className="flex-1 flex flex-col justify-center px-4 items-center sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            {!isVerifying && !isAuthenticated && (
              <h2 className="text-2xl font-medium text-gray-900 text-center">
                Welcome to Showfer.ai 👋
              </h2>
            )}
          </div>
          {!isVerifying && !isAuthenticated ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-6 shadow-lg p-6 rounded-[20px] border border-[#E3E4EC]"
            >
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-normal text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="mt-1 block w-full px-[15px] py-[10px] rounded-md focus:outline-none focus:ring-0 bg-[#F0F2F7] placeholder-gray-400 placeholder-opacity-100 font-light"
                  placeholder="Full legal name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-normal text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-[15px] py-[10px] rounded-md focus:outline-none focus:ring-0 bg-[#F0F2F7] placeholder-gray-400 placeholder-opacity-100 font-light"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-normal text-gray-700"
                >
                  Website URL
                </label>
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="text"
                  required
                  className="mt-1 block w-full px-[15px] py-[10px] rounded-md focus:outline-none focus:ring-0 bg-[#F0F2F7] placeholder-gray-400 placeholder-opacity-100 font-light"
                  placeholder="https://www.yourwebsite.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center p-[10px] border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6D67E4] hover:bg-[#5652b5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6D67E4]"
                >
                  {isLoading ? "Loading..." : "Get early access"}
                </button>
              </div>
            </form>
          ) : isVerifying && !isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-900 text-center mb-[40px]">
                Please check your email
              </h2>
              <div className="flex flex-col items-center mb-[40px] p-[30px] rounded-[20px] border border-[#E3E4EC] shadow-lg">
                <div className="mb-[30px]">
                  {/* Replace with your loader component */}
                  <PuffLoader color="#6D67E4" size={50} />
                </div>
                <div className="text-[16px] font-[400] text-gray-600 mb-[10px]">
                  We&apos;ve sent a sign-up link to
                </div>
                <div className="flex items-center font-medium px-[15px] py-[10px] rounded-md bg-[#F0F2F7] mb-[30px]">
                  <div className="mr-[10px]">{email}</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M15.1653 0.0103353C16.6038 -0.0795717 18.0224 0.419911 19.0913 1.3989C20.0703 2.46779 20.5697 3.88633 20.4898 5.33483V14.6652C20.5797 16.1137 20.0703 17.5322 19.1013 18.6011C18.0323 19.5801 16.6038 20.0796 15.1653 19.9897H5.83487C4.38636 20.0796 2.96781 19.5801 1.89891 18.6011C0.919915 17.5322 0.420428 16.1137 0.510335 14.6652V5.33483C0.420428 3.88633 0.919915 2.46779 1.89891 1.3989C2.96781 0.419911 4.38636 -0.0795717 5.83487 0.0103353H15.1653ZM9.48113 14.845L16.2042 8.10196C16.8136 7.4826 16.8136 6.48364 16.2042 5.87427L14.9056 4.57561C14.2862 3.95625 13.2872 3.95625 12.6679 4.57561L11.9985 5.25491C11.8986 5.35481 11.8986 5.52463 11.9985 5.62453C11.9985 5.62453 13.5869 7.20289 13.6169 7.24285C13.7268 7.36273 13.7967 7.52256 13.7967 7.70238C13.7967 8.06201 13.507 8.36169 13.1374 8.36169C12.9675 8.36169 12.8077 8.29177 12.6978 8.18188L11.0295 6.5236C10.9496 6.44368 10.8098 6.44368 10.7298 6.5236L5.96474 11.2887C5.63507 11.6183 5.44527 12.0579 5.43528 12.5274L5.37534 14.8949C5.37534 15.0248 5.4153 15.1447 5.50521 15.2346C5.59512 15.3245 5.71499 15.3744 5.84486 15.3744H8.19245C8.67196 15.3744 9.13149 15.1846 9.48113 14.845Z"
                      fill="#6D67E4"
                    />
                  </svg>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#E3E4EC] to-transparent mb-[30px]"></div>
                <div className="text-[16px] font-[400] text-black mb-[10px]">
                  Didn&apos;t get a link?
                </div>
                <div className="text-[#8F93A5] text-sm">
                  Check your spam/junk folder, or{" "}
                  <button
                    onClick={() => setIsVerifying(false)}
                    className="text-sm text-indigo-600 hover:text-indigo-500 inline"
                  >
                    try again
                  </button>
                </div>
              </div>
            </div>
          ) : isAuthenticated && !earlyAccessApproved ? (
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-900 text-center mb-[40px]">
                Please wait for the approval
              </h2>
              <div className="flex flex-col items-center mb-[40px] p-[30px] rounded-[20px] border border-[#E3E4EC] shadow-lg">
                <div className="text-[16px] font-[400] text-gray-600 mb-[20px]">
                  Hey, you are in queue for Early Access, you will be approved
                  soon!
                </div>

                <div className="mt-[30px]">
                  <Image
                    src="/icons/waiting.svg"
                    alt="waitlist"
                    width={64}
                    height={100}
                  />
                </div>
              </div>
            </div>
          ) : isAuthenticated && earlyAccessApproved ? (
            <div className="text-center">
              <h2 className="text-2xl font-medium text-gray-900 text-center mb-[40px]">
                Sign up successful!
              </h2>
              <div className="flex flex-col items-center mb-[40px] p-[30px] rounded-[20px] border border-[#E3E4EC] shadow-lg">
                <div className="mb-[30px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                  >
                    <path
                      d="M30 5C16.225 5 5 16.225 5 30C5 43.775 16.225 55 30 55C43.775 55 55 43.775 55 30C55 16.225 43.775 5 30 5ZM41.95 24.25L27.775 38.425C27.425 38.775 26.95 38.975 26.45 38.975C25.95 38.975 25.475 38.775 25.125 38.425L18.05 31.35C17.325 30.625 17.325 29.425 18.05 28.7C18.775 27.975 19.975 27.975 20.7 28.7L26.45 34.45L39.3 21.6C40.025 20.875 41.225 20.875 41.95 21.6C42.675 22.325 42.675 23.5 41.95 24.25Z"
                      fill="#17B26A"
                    />
                  </svg>
                </div>
                <div className="text-[16px] font-[400] text-gray-600 mb-[10px]">
                  Redirecting to onboarding...
                </div>
              </div>
            </div>
          ) : null}
          {!isVerifying && !isAuthenticated && (
            <>
              <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-normal text-[#6D67E4] hover:text-[#5652b5]"
                >
                  Sign in here
                </Link>
              </p>
              <p className="mt-4 text-center text-xs text-gray-500">
                By creating an account, you agree to Showfer.ai&apos;s{" "}
                <Link
                  href="/terms-and-conditions"
                  className="text-[#6D67E4] hover:text-[#5652b5]"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="text-[#6D67E4] hover:text-[#5652b5]"
                >
                  Privacy Policy
                </Link>
                .
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
        <Image
          src="/icons/tick-square.svg"
          alt="Tick square"
          width={24}
          height={24}
        />
      </div>
      <div className="ml-3">
        <h3 className="text-lg font-normal text-gray-900">{text}</h3>
        <p className="mt-1 text-lg font-light text-[#8F93A5]">{description}</p>
      </div>
    </li>
  );
}
