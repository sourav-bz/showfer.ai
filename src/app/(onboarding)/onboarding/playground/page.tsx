"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { usePlaygroundStore } from "@/app/dashboard/_store/PlaygroundStore";
import Bot from "@/app/_ui/ShowferWidget/Bot";
import toast, { Toaster } from "react-hot-toast"; // Change this line
import { useBotStore } from "@/app/_ui/ShowferWidget/_store/botStore";
import { motion, AnimatePresence } from "framer-motion";
import IconSVG from "@/app/_ui/IconSvg";

export default function Playground() {
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("Desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { assistantId, setAssistantId } = usePlaygroundStore();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const fullScreenContainerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const { setIsMobile, setUrl, currentUrl, setCurrentUrl } = useBotStore();

  useEffect(() => {
    setIsMobile(view === "Mobile");
  }, [view]);

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
          setCurrentUrl(data.website_url || "");
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
      fetchContent(currentUrl);
    }
  }, [assistantId, currentUrl]);

  const toggleFullScreen = useCallback(() => {
    setIsAnimating(true);
    if (!document.fullscreenElement) {
      fullScreenContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
      setIsAnimating(false);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
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
              height: 100%;
              margin: 0;
              padding: 0;
            }
            body {
              overflow-y: auto;
              -webkit-overflow-scrolling: touch;
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

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.onload = () => {
        try {
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.addEventListener("click", handleIframeClick, true);
          }
        } catch (error) {
          console.error("Error accessing iframe content:", error);
        }
      };
    }

    return () => {
      if (iframe) {
        const iframeDoc =
          iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.removeEventListener("click", handleIframeClick, true);
        }
      }
    };
  }, [htmlContent]);

  const handleIframeClick = useCallback((e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    toast("This is a website preview, it's not functional", {
      duration: 3000,
      position: "bottom-center",
      style: {
        fontSize: "14px",
        backgroundColor: "#ec7063",
        color: "white",
      },
    });
  }, []);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg relative">
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
            <div className="flex items-center bg-[#F0F2F7] rounded-[7px] p-[5px] h-[50px]">
              {["Desktop", "Mobile"].map((tab) => (
                <div key={tab} className="flex-1">
                  <button
                    className={`w-full flex items-center justify-center py-[8px] px-[20px] rounded-[7px] ${
                      view === tab
                        ? "bg-[#8F93A5] text-white"
                        : "text-[#8F93A5]"
                    }`}
                    onClick={() => setView(tab)}
                  >
                    <IconSVG
                      name={tab === "Desktop" ? "desktop" : "mobile"}
                      color={view === tab ? "white" : "#8F93A5"}
                      className="mr-2"
                    />
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
            <AnimatePresence>
              <motion.div
                ref={fullScreenContainerRef}
                className={`border-[10px] border-[#E3E4EC] rounded-[10px] ${
                  view === "Mobile" ? "w-[305px]" : "w-[1248px]"
                } h-[calc(100vh-350px)] relative overflow-hidden`}
                initial={false}
                animate={{
                  position: isFullScreen ? "fixed" : "relative",
                  inset: isFullScreen ? 0 : "auto",
                  width: isFullScreen
                    ? "100%"
                    : view === "Mobile"
                    ? "305px"
                    : "1248px",
                  height: isFullScreen ? "100%" : "calc(100vh-350px)",
                  borderWidth: isFullScreen ? 0 : 10,
                  zIndex: isFullScreen ? 50 : "auto",
                }}
                transition={{ duration: 0.3 }}
              >
                {view === "Desktop" && (
                  <button
                    onClick={toggleFullScreen}
                    className="absolute top-2 right-2 z-10 flex items-center justify-center shadow-md p-1 rounded-[5px] bg-[#E3E4EC]"
                  >
                    {isFullScreen ? (
                      <Image
                        src="/icons/fullscreen-exit.svg"
                        alt="fullscreen-exit"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <Image
                        src="/icons/fullscreen-enter.svg"
                        alt="fullscreen-enter"
                        width={24}
                        height={24}
                      />
                    )}
                  </button>
                )}
                <div className="w-full h-full">
                  {view === "Desktop" ? (
                    <iframe
                      ref={iframeRef}
                      srcDoc={htmlContent}
                      className="w-full h-full border-0"
                      sandbox="allow-same-origin"
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  ) : (
                    <iframe
                      ref={iframeRef}
                      srcDoc={htmlContent}
                      className="w-full h-full"
                      sandbox="allow-same-origin"
                      style={{ width: "100%", height: "100%", border: "none" }}
                    />
                  )}
                </div>
                <div className="absolute bottom-2 right-2 h-full w-full">
                  <Bot />
                </div>
                <Toaster
                  containerStyle={{
                    zIndex: 10000, // Increase this value to ensure it's above everything
                    position: "absolute", // Change to fixed positioning
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 10,
                    pointerEvents: "none",
                  }}
                  toastOptions={{
                    style: {
                      pointerEvents: "auto", // Make the toast itself clickable
                    },
                  }}
                />
              </motion.div>
            </AnimatePresence>
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
