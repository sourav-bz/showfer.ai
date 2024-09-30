import { useEffect, useRef, useState } from "react";
import IconSVG from "@/app/_ui/IconSvg";
import { useBotStore } from "../../_store/botStore";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

// Helper function to process the response
const processResponse = (content: string) => {
  const blocks = [];
  let currentBlock = "";
  let inCodeBlock = false;
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        blocks.push({ type: "code", content: currentBlock.trim() });
        currentBlock = "";
        inCodeBlock = false;
      } else {
        if (currentBlock) {
          blocks.push({ type: "text", content: currentBlock.trim() });
          currentBlock = "";
        }
        inCodeBlock = true;
      }
    } else {
      currentBlock += line + "\n";
    }

    if (index === lines.length - 1 && currentBlock) {
      blocks.push({
        type: inCodeBlock ? "code" : "text",
        content: currentBlock.trim(),
      });
    }
  });

  return blocks;
};

export default function DesktopText() {
  const botStore = useBotStore();
  const {
    personalitySettings,
    conversationHistory,
    setCurrentUrl,
    addToConversation,
    threadId,
    setThreadId,
    assistantId,
  } = botStore;
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to conversation history
    addToConversation("user", message);

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          thread_id: threadId,
          assistant_id: assistantId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add AI response to conversation history
      addToConversation("assistant", data.response.value);
      // Update thread ID if it's a new conversation
      if (!threadId) {
        setThreadId(data.thread_id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally add an error message to the conversation history
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (message) => {
    if (message?.products?.length > 0) {
      return (
        <div className="w-full h-[100px] mb-2 overflow-hidden">
          <div className="flex space-x-2 pb-2 overflow-x-auto">
            {message.products.map((product, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[120px]"
                onClick={() => {
                  setCurrentUrl(product.productUrl);
                }}
              >
                <div className="flex flex-col items-center border border-gray-200 rounded-[10px] w-full cursor-pointer">
                  <div
                    className="w-full h-[50px] rounded-t-[10px]"
                    style={{
                      background: `url(${product.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="w-full text-[10px] h-[26px] p-1 overflow-hidden">
                    <p className="truncate">{product.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      const blocks = processResponse(message.content);
      return (
        <div
          className={`${
            message.role === "user"
              ? `ml-auto rounded-br-sm text-white`
              : `mr-auto rounded-bl-md break-words`
          }  py-2 px-3 rounded-xl  mb-4 max-w-[80%] text-sm font-normal w-fit`}
          style={{
            backgroundColor:
              message.role === "user"
                ? personalitySettings.primaryColor
                : "#F0F2F7",
          }}
        >
          {blocks.map((block, index) => (
            <div key={index}>
              {block.type === "text" ? (
                <ReactMarkdown>{block.content}</ReactMarkdown>
              ) : (
                <SyntaxHighlighter
                  language="javascript"
                  style={tomorrow}
                  customStyle={{
                    margin: "10px 0",
                    borderRadius: "5px",
                  }}
                >
                  {block.content}
                </SyntaxHighlighter>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto mb-4 p-4 pb-16"
      >
        {conversationHistory.map((message, index) => (
          <div key={index}>{renderMessage(message)}</div>
        ))}
        {isLoading && (
          <div className="text-center">
            <span className="text-gray-500">AI is thinking...</span>
          </div>
        )}
      </div>
      <div className="flex p-2 sticky bottom-0 bg-white items-center border-t border-[#E3E4EC]">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          onClick={() => inputRef.current?.focus()}
          placeholder="Ask whatever you want."
          className={`flex-grow bg-white text-black rounded-lg p-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[${personalitySettings.primaryColor}]`}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="ml-2 p-2 rounded-full bg-blue-500 text-white disabled:opacity-50"
        >
          <IconSVG name="send" color="white" />
        </button>
      </div>
    </div>
  );
}
