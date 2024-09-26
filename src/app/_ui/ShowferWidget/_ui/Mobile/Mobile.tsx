import { useState } from "react";
import MobileText from "./MobileText";
import MobileVoice from "./MobileVoice";
import { PersonalitySettings } from "../../_types/Widget";
import MobileHeader from "./MobileHeader";
import { useBotStore } from "../../_store/botStore";

export default function Mobile() {
  const botStore = useBotStore();
  const { personalitySettings, isChatMode, toggleMedium, toggleChatWindow } =
    botStore;

  return isChatMode ? (
    <div className="w-full h-full rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col">
      <MobileHeader />
      <MobileText />
    </div>
  ) : (
    <div className="w-full h-[20%] rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col">
      <MobileVoice />
    </div>
  );
}
