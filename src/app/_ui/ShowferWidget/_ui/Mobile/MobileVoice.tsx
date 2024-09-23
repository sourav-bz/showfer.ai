import Image from "next/image";
import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { characters } from "@/app/(onboarding)/onboarding/personality/store";
import { PersonalitySettings } from "../../_types/Widget";
import IconSVG from "@/app/_ui/IconSvg";

export default function MobileVoice({
  personalitySettings,
  toggleChat,
  toggleMode,
}: {
  personalitySettings: PersonalitySettings;
  toggleChat: () => void;
  toggleMode: () => void;
}) {
  const [isRecording, setIsRecording] = useState(false);

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

  return (
    <div
      className="w-full h-full bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col items-center justify-center relative p-2 -mr-0.5 touch-none"
      {...handlers}
    >
      <div className="flex flex-row items-center w-full">
        <div className="w-1/3 relative">
          <IconSVG
            name="mobile-orb-bg"
            color={personalitySettings?.primaryColor}
            className="w-[80px] h-[80px]"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full bg-white p-1 w-[70px] h-[70px] blur-sm"></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85px] h-[88px]">
            <Image
              src={
                characters.find(
                  (c) => c.name === personalitySettings.character.name
                )?.avatar!
              }
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
            <div
              className="flex bg-[#6D67E4] text-white rounded-md p-1 text-[10px] mb-2"
              style={{ backgroundColor: personalitySettings?.primaryColor }}
            >
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
          <button>
            <IconSVG
              name="mic"
              color={personalitySettings?.primaryColor}
              className={`${
                isRecording ? "animate-pulse " : ""
              } transition-all duration-300 w-10 h-10`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
