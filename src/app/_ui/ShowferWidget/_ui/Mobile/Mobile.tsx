import { useState } from "react";
import MobileText from "./MobileText";
import MobileVoice from "./MobileVoice";
import { PersonalitySettings } from "../../_types/Widget";
import MobileHeader from "./MobileHeader";

export default function Mobile({
  personalitySettings,
  handleSendMessage,
  toggleChat,
  isChatMode,
  toggleMode,
}: {
  personalitySettings: PersonalitySettings;
  handleSendMessage: (
    message: string,
    setMessage: (message: string) => void
  ) => void;
  toggleChat: () => void;
  isChatMode: boolean;
  toggleMode: () => void;
}) {
  return isChatMode ? (
    <div className="w-full h-full rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col">
      <MobileHeader
        personalitySettings={personalitySettings}
        isChatMode={isChatMode}
        toggleMode={toggleMode}
      />
      <MobileText
        personalitySettings={personalitySettings}
        handleSendMessage={handleSendMessage}
      />
    </div>
  ) : (
    <div className="w-full h-[20%] rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col">
      <MobileVoice
        personalitySettings={personalitySettings}
        toggleChat={toggleChat}
        toggleMode={toggleMode}
      />
    </div>
  );
}
