"use client";

import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { characters } from "@/app/(onboarding)/onboarding/personality/store";
import IconSVG from "@/app/_ui/IconSvg";
import { useBotStore } from "../../_store/botStore";
import VoiceEnd from "../Desktop/VoiceEnd";
import VoiceStart from "../Desktop/VoiceStart";
import { useAudioStore } from "../../_store/audioStore";
import { useAnimation, motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import { useVoiceLogic } from "../../_store/voiceLogicProvider";

export default function MobileVoice() {
  const {
    personalitySettings,
    toggleChatWindow,
    toggleMedium,
    conversationHistory,
    productRecommendations,
    setProductRecommendations,
    setCurrentUrl,
  } = useBotStore();

  const {
    isPlaying,
    isLoading,
    errorMessage,
    handleStartAudio,
    handleStopAudio,
    isAudioPlaying,
    controls,
    animationProps,
  } = useVoiceLogic();

  // Use useEffect to update the animation when isAudioPlaying changes
  useEffect(() => {
    if (isAudioPlaying) {
      controls.start(animationProps);
    } else {
      controls.stop();
    }
  }, [isAudioPlaying, controls, animationProps]);

  const handlers = useSwipeable({
    onSwiped: (event: any) => {
      if (event.dir === "Down") {
        toggleChatWindow();
      }
    },
    onTouchStartOrOnMouseDown: ({ event }) => event.preventDefault(),
    touchEventOptions: { passive: false },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const isLastMessageFromAssistant =
    conversationHistory.length > 0 &&
    conversationHistory[conversationHistory.length - 1].role === "assistant";

  return (
    <div
      className="w-full h-[100%] bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col items-center justify-center relative p-2 -mr-0.5 touch-none"
      {...handlers}
    >
      {isLastMessageFromAssistant && productRecommendations.length > 0 && (
        <div className="w-full h-[100px] mb-2 overflow-hidden">
          <div className="flex space-x-2 pb-2 overflow-x-auto">
            {productRecommendations.map((product, index) => (
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
      )}
      <div className="flex flex-row h-[90px] items-center w-full">
        <div className="w-1/3 relative">
          <motion.div animate={controls}>
            <IconSVG
              name="mobile-orb-bg"
              color={personalitySettings?.primaryColor}
              className="w-[80px] h-[80px]"
            />
          </motion.div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className={`rounded-full bg-white p-1 w-[70px] h-[70px] blur-sm ${
                isPlaying ? "animate-pulse" : ""
              }`}
            ></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px]">
            <Image
              src={
                characters.find(
                  (c) => c.name === personalitySettings.character.name
                )?.avatar!
              }
              alt="Avatar"
              className="rounded-full"
              width={70}
              height={70}
              objectFit="contain"
            />
          </div>
        </div>
        <div className="w-2/3 h-full flex flex-col items-center justify-center pl-2 rounded-lg relative">
          <button className="absolute right-0 top-0" onClick={toggleMedium}>
            <div
              className="flex bg-[#6D67E4] text-white rounded-md p-1 text-[8px] mb-2"
              style={{ backgroundColor: personalitySettings?.primaryColor }}
            >
              <Image
                src={"/playground/message-text.svg"}
                alt="Chat"
                width={10}
                height={10}
                className="mr-1"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              Chat
            </div>
          </button>
          <div className="mr-10">
            {isPlaying ? (
              <VoiceEnd
                color={"#FF3B30"}
                disable={isLoading}
                onClick={handleStopAudio}
                isMobile={false}
              />
            ) : (
              <VoiceStart
                color={personalitySettings?.primaryColor}
                disable={isLoading}
                onClick={handleStartAudio}
                isMobile={false}
              />
            )}
          </div>
        </div>
      </div>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}
