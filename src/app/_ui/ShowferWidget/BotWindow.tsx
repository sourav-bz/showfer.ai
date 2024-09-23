import React, { useState } from "react";
import { PersonalitySettings } from "./types/Widget";
import MobileText from "./_ui/MobileText";
import DesktopText from "./_ui/DesktopText";
import DesktopVoice from "./_ui/DesktopVoice";
import MobileVoice from "./_ui/MobileVoice";
import MobileHeader from "./_ui/MobileHeader";
import DesktopHeader from "./_ui/DesktopHeader";

const BotWindow = ({
  mobile,
  toggleChat,
  personalitySettings,
  assistantId,
}: {
  mobile?: boolean;
  toggleChat: () => void;
  personalitySettings: PersonalitySettings;
  assistantId: string;
}) => {
  const [isChatMode, setIsChatMode] = useState(false);

  const toggleMode = () => setIsChatMode(!isChatMode);
  const handleSendMessage = (
    message: string,
    setMessage: (message: string) => void
  ) => {
    console.log(message);
  };

  const renderInterface = () => {
    if (mobile) {
      return isChatMode ? (
        <MobileText
          personalitySettings={personalitySettings}
          handleSendMessage={handleSendMessage}
        />
      ) : (
        <MobileVoice
          personalitySettings={personalitySettings}
          toggleChat={toggleChat}
          toggleMode={toggleMode}
        />
      );
    } else {
      return isChatMode ? (
        <DesktopText
          personalitySettings={personalitySettings}
          handleSendMessage={handleSendMessage}
        />
      ) : (
        <DesktopVoice personalitySettings={personalitySettings} />
      );
    }
  };

  const renderHeader = () => {
    if (mobile) {
      return (
        <MobileHeader
          personalitySettings={personalitySettings}
          isChatMode={isChatMode}
          toggleMode={toggleMode}
        />
      );
    } else {
      return (
        <DesktopHeader
          personalitySettings={personalitySettings}
          isChatMode={isChatMode}
          toggleMode={toggleMode}
        />
      );
    }
  };

  return (
    <div
      className={`${
        mobile
          ? "w-[276px] h-[560px] -mb-7 -mr-3 rounded-[20px]"
          : "w-[280px] h-full rounded-lg "
      } bg-white shadow-md overflow-hidden flex flex-col`}
    >
      {renderHeader()}
      {renderInterface()}
    </div>
  );
};

export default BotWindow;
