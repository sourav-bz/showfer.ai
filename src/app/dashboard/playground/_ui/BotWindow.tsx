import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import VoiceInterface from "./VoiceInterface";
import TextInterface from "./TextInterface";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/16/solid";

const BotWindow = ({ mobile, toggleChat }: { mobile?: boolean, toggleChat: () => void }) => {
  const [isChatMode, setIsChatMode] = useState(false);

  const toggleMode = () => setIsChatMode(!isChatMode);
  const handleSwiped = (event: any) => {
    if (event.dir === "Down") {
      toggleChat();
    }
  };

  const handlers = useSwipeable({
    onSwiped: handleSwiped,
    onTouchStartOrOnMouseDown: (({ event }) => event.preventDefault()),
    touchEventOptions: { passive: false },
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  return mobile ?
    <div
      className="w-[258px] h-auto bg-white rounded-xl border border-gray-200 overflow-hidden mb-4 flex flex-col items-center justify-center relative p-2 -mr-0.5 touch-none"
      {...handlers}
    >
      <div className="flex flex-row items-center w-full">
        <div className="w-1/3 relative">
          <Image
            src="/playground/orb_big.svg"
            alt="Circle background"
            width={102}
            height={102}
            objectFit="contain"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full bg-white p-1 w-[70px] h-[70px] blur-sm">
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85px] h-[88px]">
            <Image
              src="/playground/friendly-avatar.svg"
              alt="Avatar"
              className="rounded-full"
              width={85}
              height={88}
              objectFit="contain"
            />
          </div>
        </div>
        <div className="w-2/3 flex flex-col items-center pl-2">
          <div className="flex self-end">
            <div className="flex bg-[#6D67E4] text-white rounded-md p-1 text-[10px] mb-2">
              <ChatBubbleBottomCenterTextIcon className="w-3 h-3 fill-current mr-1 mt-0.5" />
              Chat
            </div>
          </div>
          <p className="text-[11px] text-center mb-0.5">Hi, how can I help you?</p>
          <button className="p-1 rounded-full ">
            <Image
              src="/playground/mic.svg"
              alt="Microphone"
              width={35}
              height={35}
            />
          </button>
        </div>
      </div>
    </div>
    : <div className="w-[330px] h-[530px] bg-white rounded-lg shadow-md overflow-hidden mb-4 flex flex-col">
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
};

export default BotWindow;
