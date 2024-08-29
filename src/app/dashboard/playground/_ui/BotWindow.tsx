import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import VoiceInterface from "./VoiceInterface";
import TextInterface from "./TextInterface";

const BotWindow = () => {
  const [isChatMode, setIsChatMode] = useState(false);

  const toggleMode = () => setIsChatMode(!isChatMode);

  return (
    <div className="w-[330px] h-[530px] bg-white rounded-lg shadow-md overflow-hidden mb-4 flex flex-col">
      <div className="bg-[#6D67E4] p-4 flex justify-between items-center">
        <div className="items-center">
          <Image
            src={"/brand-logo/light.svg"}
            width={65}
            height={30}
            alt="showfer-ai-logo"
          />
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-white text-xs">Online</span>
          </div>
        </div>
        <button
          onClick={toggleMode}
          className="bg-white text-indigo-500 px-2 py-1 rounded-lg text-sm font-medium flex items-center"
        >
          <Image
            src={
              isChatMode
                ? "/playground/voice.svg"
                : "/playground/message-text.svg"
            }
            width={18}
            height={18}
            alt={isChatMode ? "microphone" : "chat"}
            className="mr-1"
          />
          <div>{isChatMode ? "Voice" : "Chat"}</div>
        </button>
      </div>
      {isChatMode ? <TextInterface /> : <VoiceInterface />}
    </div>
  );
};

export default BotWindow;
