"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Playground() {
  const [content, setContent] = useState("");
  const [view, setView] = useState("Desktop");

  const router = useRouter();

  useEffect(() => {
    fetchContent("https://mlada.in");
  }, []);

  const fetchContent = async (url: string) => {
    try {
      const response = await axios.get(
        `/api/proxy?url=${encodeURIComponent(url)}`
      );
      setContent(response.data.content);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg">
      <div className="p-[40px] flex flex-col w-full h-full">
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
        <div className="flex justify-center items-center">
          <div
            className={`border-[10px] border-[#E3E4EC] rounded-[10px] p-4 ${
              view === "Mobile" ? "w-[305px]" : "w-[1248px]"
            } h-[calc(100vh-375px)] overflow-y-auto`}
          >
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
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
