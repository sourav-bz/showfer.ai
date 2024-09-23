import React, { useState } from "react";
import { PersonalitySettings } from "./_types/Widget";
import Mobile from "./_ui/Mobile/Mobile";
import Desktop from "./_ui/Desktop/Desktop";

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
    const props = {
      personalitySettings,
      handleSendMessage,
      toggleChat,
      isChatMode,
      toggleMode,
    };
    if (mobile) {
      return <Mobile {...props} />;
    } else {
      return <Desktop {...props} />;
    }
  };

  return <>{renderInterface()}</>;
};

export default BotWindow;
