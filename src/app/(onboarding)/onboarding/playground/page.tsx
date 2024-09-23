"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePlaygroundStore } from "@/app/dashboard/_store/PlaygroundStore";
import Bot from "@/app/_ui/ShowferWidget/Bot";

export default function Playground() {
  const [url, setUrl] = useState<string>("https://mlada.in");
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("Desktop");
  const iframeRef = useRef(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { assistantId, setAssistantId } = usePlaygroundStore();

  const getUserSession = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  };

  useEffect(() => {
    const fetchAssistantSettings = async () => {
      try {
        const user = await getUserSession();
        if (!user) {
          console.error("No user found");
          return;
        }

        const { data, error } = await supabase
          .from("assistant_settings")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching assistant settings:", error);
          return;
        }

        if (data) {
          setUrl(data.website_url || "");
          setAssistantId(data.openai_assistant_id || "");
        } else {
          console.error("No assistant settings found");
        }
      } catch (error) {
        console.error("Error in fetchAssistantSettings:", error);
      }
    };

    fetchAssistantSettings();
  }, []);

  useEffect(() => {
    if (assistantId) {
      fetchContent(url);
    }
  }, [assistantId, url]);

  const fetchContent = async (url: string) => {
    if (!url) return;
    setError(null);
    setHtmlContent("");
    setLoading(true);
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (!response.ok) {
        console.error("Proxy error:", data);
        setError(data.error || "An error occurred");
      } else {
        const modifiedHtmlContent = data.content.replace(
          "</head>",
          `<style>
            html, body {
              overflow: auto;
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
            html::-webkit-scrollbar, body::-webkit-scrollbar {
              display: none;
            }
          </style>
          </head>`
        );
        setHtmlContent(modifiedHtmlContent);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      setError("Failed to fetch content");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <div className="p-[40px] flex flex-col w-full h-full">
        {/* Header section */}
        <div className="flex items-center mb-[40px] relative">
          <h1 className="text-[24px] font-medium mb-4 text-left flex items-center">
            <Image
              src="/icons/back.svg"
              alt="Back"
              width={24}
              height={24}
              className="mr-2 cursor-pointer"
              onClick={() => router.back()}
            />
            Playground
          </h1>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center bg-[#F0F2F7] rounded-[15px] p-[5px] h-[50px]">
              {["Desktop", "Mobile"].map((tab) => (
                <div key={tab} className="flex-1">
                  <button
                    className={`w-full py-[8px] px-[20px] rounded-[15px] ${
                      view === tab
                        ? "bg-white text-[#6D67E4]"
                        : "text-[#8F93A5]"
                    }`}
                    onClick={() => setView(tab)}
                  >
                    {tab}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content display */}
        <div className="flex justify-center items-center flex-grow">
          {!htmlContent && !error && !loading ? (
            <div className="flex flex-col items-center justify-center">
              <Image
                src={"/playground/playground_zero_state.svg"}
                alt="no_content"
                height={304}
                width={304}
              />
              <p className="text-center text-lg text-[#8F93A5]">
                Error fetching content
              </p>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : (
            <div
              className={`border-[10px] border-[#E3E4EC] rounded-[10px] p-4 ${
                view === "Mobile" ? "w-[305px]" : "w-[1248px]"
              } h-[calc(100vh-350px)] overflow-hidden relative`}
            >
              {view === "Desktop" ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  className="w-full h-full"
                  sandbox="allow-same-origin"
                />
              ) : (
                <iframe
                  ref={iframeRef}
                  srcDoc={htmlContent}
                  className="w-full h-[calc(100%)]"
                  sandbox="allow-same-origin"
                />
              )}
              <div className="absolute bottom-5 right-5 h-full">
                <Bot mobile={view === "Mobile"} parentHeight="100%" />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <footer className="pr-[40px] pb-[20px] flex justify-end mt-auto">
        <div
          className="bg-[#6D67E4] text-white px-6 py-2 rounded-[10px] flex items-center cursor-pointer"
          onClick={async () => {
            const updateUserOnboardingStatus = await fetch(
              "/api/users/update-onboarding",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ onboardingStatus: "playground_done" }),
              }
            );
            router.push("/onboarding/early-access");
          }}
        >
          Go Live
          <Image
            src="/icons/right-arrow.svg"
            alt="arrow-right"
            width={24}
            height={24}
            className="ml-2"
          />
        </div>
      </footer>
    </div>
  );
}
