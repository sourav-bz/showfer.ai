import React from "react";
import Image from "next/image";
import IconSVG from "@/app/_ui/IconSvg";
import { PersonalitySettings } from "../../_types/Widget";

interface DesktopHeaderProps {
  personalitySettings: PersonalitySettings;
  isChatMode: boolean;
  toggleMode: () => void;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  personalitySettings,
  isChatMode,
  toggleMode,
}) => {
  return (
    <div
      className="bg-[#6D67E4] p-4 flex justify-between items-center"
      style={{ backgroundColor: personalitySettings.primaryColor }}
    >
      <div className="items-center">
        <Image
          src={"/brand-logo/light.svg"}
          width={65}
          height={30}
          alt="showfer-ai-logo"
        />
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-white text-xs">Online</span>
        </div>
      </div>
      <button
        onClick={toggleMode}
        className="bg-white text-indigo-500 px-2 py-1 rounded-lg text-sm font-medium flex items-center"
      >
        <IconSVG
          name={isChatMode ? "message-text" : "voice"}
          color={personalitySettings.primaryColor}
          className="mr-1"
        />
        <div style={{ color: personalitySettings.primaryColor }}>
          {isChatMode ? "Voice" : "Chat"}
        </div>
      </button>
    </div>
  );
};

export default DesktopHeader;
