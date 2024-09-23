"use client";
import Image from "next/image";
import Bot from "../../_ui/ShowferWidget/Bot";
import { useEffect, useRef, useState } from "react";
import { useDashboardStore } from "@/app/dashboard/_store/DashboardStore";
import { WifiIcon } from "@heroicons/react/16/solid";

export default function Playground() {
  const [url, setUrl] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef(null);
  const { view } = useDashboardStore();

  const handleSubmit = async () => {
    if (!url) return;
    setError(null);
    setHtmlContent("");
    setLoading(true);
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
    try {
      const response = await fetch(proxyUrl);
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
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch content");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-md w-auto h-full overflow-hidden">
      <div className="relative mb-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Image
            src={"/dashboard/search.svg"}
            alt="search"
            height={24}
            width={24}
          />
        </div>
        <input
          type="text"
          name="price"
          id="price"
          className="block w-full rounded-md border-0 py-3 pl-12 pr-20 text-[#C0C4D2] placeholder:text-[#C0C4D2] "
          placeholder="Enter url here..."
          onChange={(e) => setUrl(e.target.value)}
          value={url}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
      </div>
      <div className="bg-white h-full rounded-md relative">
        {!htmlContent && !error && !loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <Image
              src={"/playground/playground_zero_state.svg"}
              alt="no_content"
              height={304}
              width={304}
            />
            <p className="text-center text-lg text-[#8F93A5]">
              Paste your URL and ask whatever you want!
            </p>
          </div>
        ) : error ? (
          <div className="h-[800px] flex items-center justify-center text-red-500 p-4 text-center">
            {error}
          </div>
        ) : view === "desktop" ? (
          <div className="w-full h-full rounded-md overflow-hidden">
            <iframe
              ref={iframeRef}
              srcDoc={htmlContent}
              className="w-full h-full"
              sandbox="allow-same-origin"
            />
            <Bot />
          </div>
        ) : (
          <div className="bg-white w-full h-full rounded-md relative">
            <div className="flex items-center justify-center h-full">
              <div className="relative w-[300px] h-[620px] bg-[#C0C4D2] rounded-[32px] overflow-hidden shadow-xl">
                <div className="absolute inset-[12px] bg-white rounded-[20px] overflow-hidden">
                  <div className="h-9 bg-[#E3E4EC] flex items-center justify-between px-6">
                    <span className="text-sm">9:41</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">
                        <Image
                          src={"/icons/signal_bars.svg"}
                          alt="signal_bars"
                          height={14}
                          width={14}
                        />
                      </span>
                      <span className="text-sm">
                        <WifiIcon className="w-4 h-4 fill-current" />
                      </span>
                      <span className="text-sm">
                        <Image
                          src={"/icons/battery_100.svg"}
                          alt="battery_100"
                          height={17}
                          width={17}
                        />
                      </span>
                    </div>
                  </div>
                  <iframe
                    ref={iframeRef}
                    srcDoc={htmlContent}
                    className="w-full h-[calc(100%-44px)]"
                    sandbox="allow-same-origin"
                  />
                </div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-black rounded-full"></div>
                <Bot mobile={true} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
