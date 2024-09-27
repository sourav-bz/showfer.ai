"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrbIcon from "./_ui/Orb/OrbIcon";
import { fetchUserData } from "@/app/_utils/fetchUserData";
import { useBotStore } from "./_store/botStore";
import Mobile from "./_ui/Mobile/Mobile";
import Desktop from "./_ui/Desktop/Desktop";
import { EmotionControl } from "@cartesia/cartesia-js";
import { VoiceLogicProvider } from "./_store/voiceLogicProvider";

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

  useEffect(() => {
    console.log("isMobile", botStore.isMobile);
  }, [botStore.isMobile]);

  return (
    <VoiceLogicProvider>
      <div className="flex flex-col mt-auto items-end justify-end h-full w-full">
        {botStore.personalitySettings &&
          botStore.isOpen &&
          (botStore.isMobile ? <Mobile /> : <Desktop />)}
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
    </VoiceLogicProvider>
  );
};

export default Bot;
