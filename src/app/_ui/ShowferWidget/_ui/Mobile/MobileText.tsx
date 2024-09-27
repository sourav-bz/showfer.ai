import { useEffect, useRef, useState } from "react";
import { usePlaygroundStore } from "../../../../dashboard/_store/PlaygroundStore";
import IconSVG from "@/app/_ui/IconSvg";
import { useBotStore } from "../../_store/botStore";

export default function MobileText() {
  const botStore = useBotStore();
  const { personalitySettings, conversationHistory, setCurrentUrl } = botStore;
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory]);

  return (
    <div className="h-full flex flex-col">
      <div
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto mb-4 p-4 pb-16"
      >
        {conversationHistory.map((message, index) => {
          console.log("message", message);
          if (message?.products?.length! > 0) {
            return (
              <div
                className="w-full h-[100px] mb-2 overflow-hidden"
                key={index}
              >
                <div className="flex space-x-2 pb-2 overflow-x-auto">
                  {message?.products!.map((product, index) => (
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
            return (
              <div
                key={index}
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
                {message.content}
              </div>
            );
          }
        })}
      </div>
      <div className="flex p-2 sticky bottom-0 bg-white items-center border-t border-[#E3E4EC]">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              // handleSendMessage({ message: message, setMessage });
            }
          }}
          onClick={() => inputRef.current?.focus()}
          placeholder="Ask whatever you want."
          className={`flex-grow bg-white text-black rounded-lg p-2 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-[${personalitySettings.primaryColor}]`}
        />
        <IconSVG name="send" color={personalitySettings.primaryColor} />
      </div>
    </div>
  );
}
