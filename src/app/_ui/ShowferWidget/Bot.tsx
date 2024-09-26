"use client";

import React, { useEffect } from "react";
import BotWindow from "./BotWindow";
import OrbIcon from "./_ui/Orb/OrbIcon";
import { fetchUserData } from "@/app/_utils/fetchUserData";
import { useBotStore } from "./_store/botStore";

const Bot = () => {
  const botStore = useBotStore();

  useEffect(() => {
    const fetchData = async () => {
      const { userId, personalitySettings, assistantId } =
        await fetchUserData();
      botStore.setUserId(userId);
      botStore.setPersonalitySettings(personalitySettings);
      botStore.setAssistantId(assistantId);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col mt-auto items-end justify-end h-full">
      {botStore.isOpen && <BotWindow />}
      {(!botStore.isMobile || !botStore.isOpen) && (
        <button onClick={botStore.toggleChatWindow}>
          <OrbIcon
            width={botStore.isMobile ? 40 : 50}
            height={botStore.isMobile ? 40 : 50}
            primaryColor={botStore.personalitySettings?.primaryColor}
          />
        </button>
      )}
    </div>
  );
};

export default Bot;
