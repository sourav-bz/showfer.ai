"use client";

import React from "react";
import Mobile from "./_ui/Mobile/Mobile";
import Desktop from "./_ui/Desktop/Desktop";
import { useBotStore } from "./_store/botStore";

const BotWindow = () => {
  const botStore = useBotStore();

  return <>{botStore.isMobile ? <Mobile /> : <Desktop />}</>;
};

export default BotWindow;
