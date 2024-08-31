import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import OpenAI from "openai";
import { usePlaygroundStore } from "@/app/store/PlaygroundStore";

const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side use
};
const openai = new OpenAI(configuration);

interface TextInterfaceProps {
  handleSendMessage: (params: {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
  }) => void;
}

export default function TextInterface({
  handleSendMessage,
}: TextInterfaceProps) {
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { messages, messageThread, setMessageThread } = usePlaygroundStore();

  useEffect(() => {
    const fetchMessages = async () => {
      const thread = await openai.beta.threads.create();
      console.log("thread: ", thread.id);
      setMessageThread(thread);
    };
    if (!messageThread) {
      fetchMessages();
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto mb-4 p-4 pb-16"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${
              message.type === "user"
                ? "ml-auto bg-[#6D67E4] rounded-br-sm text-white"
                : "mr-auto bg-[#F0F2F7] rounded-bl-md break-words"
            }  py-2 px-3 rounded-xl  mb-4 max-w-[80%] text-sm font-normal w-fit`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex p-2 sticky bottom-0 bg-white">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage({ message: message, setMessage });
            }
          }}
          onClick={() => inputRef.current?.focus()}
          placeholder="Ask whatever you want."
          className="flex-grow bg-[#F0F2F7] text-black rounded-lg p-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[#6D67E4]"
        />
      </div>
    </div>
  );
}
