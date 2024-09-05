import React, { useState } from "react";
import Image from "next/image";
import TextInterface from "@/app/(dashboard)/playground/_ui/TextInterface";
import VoiceInterface from "@/app/(dashboard)/playground/_ui/VoiceInterface";

const PreviewWindow = () => {
  const [isChatMode, setIsChatMode] = useState(false);
  const mobile = false;

  return (
    <div
      className={`bg-white shadow-md overflow-hidden flex flex-col ${
        mobile
          ? "w-[276px] h-[560px] -mb-7 -mr-3 rounded-[20px]"
          : "w-[330px] h-[530px] mb-4 rounded-lg"
      }`}
    >
      <div className="bg-[#6D67E4] p-4 flex justify-between items-center">
        <div className="items-center">
          <Image
            src="/brand-logo/light.svg"
            width={65}
            height={30}
            alt="showfer-ai-logo"
          />
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            <span className="text-white text-xs">Online</span>
          </div>
        </div>
        <button
          onClick={() => setIsChatMode(!isChatMode)}
          className="bg-white text-indigo-500 px-2 py-1 rounded-lg text-sm font-medium flex items-center"
        >
          <Image
            src={`/playground/${isChatMode ? "voice" : "message-text"}.svg`}
            width={18}
            height={18}
            alt={isChatMode ? "microphone" : "chat"}
            className="mr-1"
          />
          {isChatMode ? "Voice" : "Chat"}
        </button>
      </div>
      {isChatMode ? (
        <TextInterface handleSendMessage={() => {}} />
      ) : (
        <VoiceInterface mobile={false} handleSendMessage={() => {}} />
      )}
    </div>
  );
};

export default PreviewWindow;
