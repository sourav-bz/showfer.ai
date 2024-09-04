import React, { useEffect, useRef, useState } from "react";
import { useSwipeable } from "react-swipeable";
import Image from "next/image";
import VoiceInterface from "./VoiceInterface";
import TextInterface from "./TextInterface";
import OpenAI from "openai";
import { usePlaygroundStore } from "../../_store/PlaygroundStore";

const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side use
};
const openai = new OpenAI(configuration);

const BotWindow = ({
  mobile,
  toggleChat,
}: {
  mobile?: boolean;
  toggleChat: () => void;
}) => {
  const [isChatMode, setIsChatMode] = useState(false);
  const { addMessage, messageThread, setMessageThread, updateLastMessage } =
    usePlaygroundStore();

  const toggleMode = () => setIsChatMode(!isChatMode);
  const handleSwiped = (event: any) => {
    if (event.dir === "Down") {
      toggleChat();
    }
  };

  const handlers = useSwipeable({
    onSwiped: handleSwiped,
    onTouchStartOrOnMouseDown: ({ event }) => event.preventDefault(),
    touchEventOptions: { passive: false },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleSendMessage = async ({
    message,
    setMessage,
    handleTextToSpeech = () => {},
  }: {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleTextToSpeech?: (text: string) => void;
  }) => {
    if (message.trim() === "") return;

    const newMessage: { type: "user" | "ai"; content: string } = {
      type: "user",
      content: message,
    };
    addMessage(newMessage);
    setMessage("");

    var threadId = messageThread?.id || "";
    if (!messageThread) {
      console.log("creating new messageThread: ", messageThread);

      const newMessageThread = await openai.beta.threads.create();
      console.log("thread: ", newMessageThread.id);
      setMessageThread(newMessageThread);
      threadId = newMessageThread.id;
    }
    const thread = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `${message}`,
    });
    console.log("thread: ", thread);

    let accumulatedMessage = "";
    const run = openai.beta.threads.runs
      .stream(threadId, {
        assistant_id: "asst_jBAwKYxYlnsLOFbfweGveOFV",
      })
      .on("textCreated", (text) => {
        console.log("textCreated: ", text);
        // Initialize the AI message when the text is created
        addMessage({ type: "ai", content: "" });
      })
      .on("textDelta", (textDelta, snapshot) => {
        console.log("textDelta: ", textDelta);
        accumulatedMessage += textDelta.value;
        // Update the last message (which is the AI's response) with the accumulated content
        updateLastMessage({ type: "ai", content: accumulatedMessage });
      })
      .on("end", () => {
        console.log("Stream ended");
        if (!isChatMode) {
          handleTextToSpeech(accumulatedMessage);
        }
      });
  };

  return mobile && !isChatMode ? (
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
            <div className="rounded-full bg-white p-1 w-[70px] h-[70px] blur-sm"></div>
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
          <button className="flex self-end" onClick={toggleMode}>
            <div className="flex bg-[#6D67E4] text-white rounded-md p-1 text-[10px] mb-2">
              <Image
                src={"/playground/message-text.svg"}
                alt="Chat"
                width={14}
                height={14}
                className="mr-1"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              Chat
            </div>
          </button>
          <p className="text-[11px] text-center mb-0.5">
            Hi, how can I help you?
          </p>
          <VoiceInterface mobile={true} handleSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  ) : (
    <div
      className={`${
        mobile
          ? "w-[276px] h-[560px] -mb-7 -mr-3 rounded-[20px]"
          : "w-[330px] h-[530px] mb-4 rounded-lg "
      } bg-white shadow-md overflow-hidden flex flex-col`}
      {...(mobile ? handlers : {})}
    >
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
      {isChatMode ? (
        <TextInterface handleSendMessage={handleSendMessage} />
      ) : (
        <VoiceInterface mobile={false} handleSendMessage={handleSendMessage} />
      )}
    </div>
  );
};

export default BotWindow;
