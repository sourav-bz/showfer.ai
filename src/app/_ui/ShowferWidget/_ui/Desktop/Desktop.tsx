"use client";

import DesktopText from "./DesktopText";
import DesktopVoice from "./DesktopVoice";
import { PersonalitySettings } from "../../_types/Widget";
import DesktopHeader from "./DesktopHeader";
import { useBotStore } from "../../_store/botStore";

export default function Desktop() {
  const botStore = useBotStore();
  const { personalitySettings, isChatMode, setIsChatMode } = botStore;

  return (
    <div className="w-[280px] h-[400px] mb-2 rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col">
      <DesktopHeader
        personalitySettings={personalitySettings}
        isChatMode={isChatMode}
        toggleMode={() => setIsChatMode(!isChatMode)}
      />
      {isChatMode ? <DesktopText /> : <DesktopVoice />}
    </div>
  );
}
