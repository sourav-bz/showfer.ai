import DesktopText from "./DesktopText";
import DesktopVoice from "./DesktopVoice";
import { PersonalitySettings } from "../../_types/Widget";
import DesktopHeader from "./DesktopHeader";

export default function Desktop({
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
  return (
    <div className="w-[280px] h-[400px] mb-2 rounded-[20px] bg-white shadow-md overflow-hidden flex flex-col">
      <DesktopHeader
        personalitySettings={personalitySettings}
        isChatMode={isChatMode}
        toggleMode={toggleMode}
      />
      {isChatMode ? (
        <DesktopText
          personalitySettings={personalitySettings}
          handleSendMessage={handleSendMessage}
        />
      ) : (
        <DesktopVoice
          personalitySettings={personalitySettings}
          toggleChat={toggleChat}
          toggleMode={toggleMode}
        />
      )}
    </div>
  );
}
