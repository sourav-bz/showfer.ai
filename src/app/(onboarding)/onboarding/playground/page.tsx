"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Playground() {
  const [content, setContent] = useState("");
  const [view, setView] = useState("desktop");

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
    <div className="flex flex-col h-screen relative">
      <div className="flex-1 p-4 overflow-hidden">
        <h1 className="text-2xl font-bold mb-4">Playground</h1>
        <div className="mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${
              view === "desktop" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("desktop")}
          >
            Desktop
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === "mobile" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setView("mobile")}
          >
            Mobile
          </button>
        </div>
        <div
          className={`border p-4 ${
            view === "mobile" ? "max-w-sm" : "w-full"
          } h-[calc(100vh-280px)] overflow-y-auto`}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <button
          className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors"
          onClick={() => router.push("/onboarding/billing")}
        >
          Go Live
        </button>
      </div>
    </div>
  );
}
