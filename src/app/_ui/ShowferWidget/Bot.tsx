"use client";

import React from "react";
import { VoiceLogicProvider } from "./_store/voiceLogicProvider";
import BotWindow from "./BotWindow";

const Bot = () => {
  return (
    <VoiceLogicProvider>
      <BotWindow />
    </VoiceLogicProvider>
  );
};

export default Bot;
