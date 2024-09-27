import { useState } from "react";
import MobileText from "./MobileText";
import MobileVoice from "./MobileVoice";
import { PersonalitySettings } from "../../_types/Widget";
import MobileHeader from "./MobileHeader";
import { useBotStore } from "../../_store/botStore";

export default function Mobile() {
  const botStore = useBotStore();
  const { isChatMode, conversationHistory, productRecommendations } = botStore;

  const isLastMessageFromAssistant =
    conversationHistory.length > 0 &&
    conversationHistory[conversationHistory.length - 1].role === "assistant";

  return isChatMode ? (
    <div className="w-[285px] h-[500px] rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col">
      <MobileHeader />
      <MobileText />
    </div>
  ) : (
    <div
      className={`w-[285px] h-[${
        isLastMessageFromAssistant && productRecommendations.length > 0
          ? "190px"
          : "20%"
      }] rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col`}
    >
      <MobileVoice />
    </div>
  );
}
