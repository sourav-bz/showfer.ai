import React, { useState } from "react";
import Image from "next/image";
import TextInterface from "@/app/(dashboard)/playground/_ui/TextInterface";
import { usePersonalityStore } from "./store";
import IconSVG from "@/app/_ui/IconSvg";
import VoiceInterface from "./VoiceInterface";

const PreviewWindow = () => {
  const [isChatMode, setIsChatMode] = useState(false);
  const mobile = false;
  const { character } = usePersonalityStore();
  return (
    <div
      className={`bg-white shadow-md overflow-hidden flex flex-col ${
        mobile
          ? "w-[276px] h-[560px] -mb-7 -mr-3 rounded-[20px]"
          : "w-[330px] h-[530px] mb-4 rounded-lg"
      }`}
    >
      <div
        className="p-4 flex justify-between items-center"
        style={{ backgroundColor: character.primaryColor }}
      >
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
          className={`bg-white px-2 py-1 rounded-lg text-sm font-medium flex items-center`}
          style={{ color: character.primaryColor }}
        >
          <IconSVG
            name={isChatMode ? "voice" : "message-text"}
            color={character.primaryColor}
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
