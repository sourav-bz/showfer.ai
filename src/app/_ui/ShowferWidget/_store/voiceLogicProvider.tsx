import React, { createContext, useContext, useEffect, useState } from "react";
import { useAudioStore } from "./audioStore";
import { startAudio, stopAudio } from "../_utils/AudioUtils";
import { useAnimation } from "framer-motion";

interface VoiceLogicContextType {
  isPlaying: boolean;
  isLoading: boolean;
  errorMessage: string;
  handleStartAudio: () => Promise<void>;
  handleStopAudio: () => void;
  isAudioPlaying: boolean;
  controls: any;
  animationProps: any;
}

const VoiceLogicContext = createContext<VoiceLogicContextType | undefined>(
  undefined
);

export const VoiceLogicProvider: React.FC = ({ children }) => {
  const {
    isPlaying,
    setIsPlaying,
    errorMessage,
    setErrorMessage,
    isAudioPlaying,
  } = useAudioStore();
  const [isLoading, setIsLoading] = useState(true);
  const controls = useAnimation();

  const animationProps = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
    },
  };

  useEffect(() => {
    const { initializeProtobuf } = useAudioStore.getState();
    initializeProtobuf().catch(console.error);
  }, []);

  useEffect(() => {
    const setup = async () => {
      try {
        // Initialize any necessary setup here
        setIsLoading(false);
      } catch (err) {
        setErrorMessage("Error during setup: " + err.message);
      }
    };
    setup();

    return () => {
      stopAudio();
    };
  }, [setErrorMessage]);

  useEffect(() => {
    if (isAudioPlaying) {
      controls.start(animationProps);
    } else {
      controls.stop();
    }
  }, [isAudioPlaying, controls]);

  const handleStartAudio = async (isFirstConnection) => {
    try {
      await startAudio(setIsPlaying, isFirstConnection);
      setErrorMessage("");
    } catch (error) {
      console.error("Error starting audio:", error);
      setErrorMessage("Error accessing microphone");
      setIsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    stopAudio(setIsPlaying);
  };

  const value = {
    isPlaying,
    isLoading,
    errorMessage,
    handleStartAudio,
    handleStopAudio,
    isAudioPlaying,
    controls,
    animationProps,
  };

  return (
    <VoiceLogicContext.Provider value={value}>
      {children}
    </VoiceLogicContext.Provider>
  );
};

export const useVoiceLogic = () => {
  const context = useContext(VoiceLogicContext);
  if (context === undefined) {
    throw new Error("useVoiceLogic must be used within a VoiceLogicProvider");
  }
  return context;
};
