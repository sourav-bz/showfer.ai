import React, { useEffect, useState } from "react";
import { useAudioStore } from "../_store/audioStore";
import { startAudio, stopAudio } from "../_utils/AudioUtils";

interface VoiceLogicProps {
  children: (props: {
    isPlaying: boolean;
    isLoading: boolean;
    errorMessage: string;
    handleStartAudio: () => void;
    handleStopAudio: () => void;
  }) => React.ReactNode;
}

const VoiceLogic: React.FC<VoiceLogicProps> = ({ children }) => {
  const { isPlaying, setIsPlaying, errorMessage, setErrorMessage } =
    useAudioStore();
  const [isLoading, setIsLoading] = useState(true);

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

  const handleStartAudio = async () => {
    try {
      await startAudio();
      setIsPlaying(true);
      setErrorMessage("");
    } catch (error) {
      console.error("Error starting audio:", error);
      setErrorMessage("Error accessing microphone");
      setIsPlaying(false);
    }
  };

  const handleStopAudio = () => {
    stopAudio();
    setIsPlaying(false);
  };

  return (
    <>
      {children({
        isPlaying,
        isLoading,
        errorMessage,
        handleStartAudio,
        handleStopAudio,
      })}
    </>
  );
};

export default VoiceLogic;
