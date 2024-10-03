"use client";

import React, { useEffect } from "react";
import OrbIcon from "./_ui/Orb/OrbIcon";
import { fetchUserData } from "@/app/_utils/fetchUserData";
import { useBotStore } from "./_store/botStore";
import Mobile from "./_ui/Mobile/Mobile";
import Desktop from "./_ui/Desktop/Desktop";
import { useSearchParams } from "next/navigation";

export default function BotWindow() {
  const botStore = useBotStore();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const { userId, personalitySettings, openaiAssistantId } =
        await fetchUserData(searchParams.get("assistant")!);
      botStore.setUserId(userId);
      botStore.setPersonalitySettings(personalitySettings);
      botStore.setAssistantId(openaiAssistantId);
    };

    if (searchParams.get("assistant")) {
      fetchData();
    }
  }, [searchParams]);

  useEffect(() => {
    console.log("isMobile", botStore.isMobile);
  }, [botStore.isMobile]);

  return (
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
  );
}
