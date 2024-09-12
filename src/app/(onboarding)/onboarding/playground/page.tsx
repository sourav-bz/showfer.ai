"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WifiIcon } from "@heroicons/react/16/solid"; // Make sure to install @heroicons/react
import Bot from "@/app/(dashboard)/playground/_ui/Bot";

export default function Playground() {
  const [url, setUrl] = useState<string>("https://mlada.in");
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("Desktop");
  const iframeRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchContent(url);
  }, []);

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
            <div className="flex items-center w-[200px] bg-[#F0F2F7] rounded-[15px] p-[5px] h-[50px]">
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
              } h-[calc(100vh-375px)] overflow-hidden relative`}
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
                  className="w-full h-[calc(100%-44px)]"
                  sandbox="allow-same-origin"
                />
              )}
              <div className="absolute bottom-0 w-full z-10">
                <Bot mobile={view === "Mobile"} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <footer className="p-6 flex justify-end mt-auto">
        <Link
          href="/onboarding/billing"
          className="bg-[#6D67E4] text-white px-6 py-2 rounded-[10px] flex items-center"
        >
          Go Live
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
          >
            <path
              d="M10.5198 5.32L13.7298 8.53L15.6998 10.49C16.5298 11.32 16.5298 12.67 15.6998 13.5L10.5198 18.68C9.83977 19.36 8.67977 18.87 8.67977 17.92V12.31V6.08C8.67977 5.12 9.83977 4.64 10.5198 5.32Z"
              fill="white"
            />
          </svg>
        </Link>
      </footer>
    </div>
  );
}
