import { create } from "zustand";

interface BotState {
  isOpen: boolean;
  userId: string | null;
  personalitySettings: any | null;
  assistantId: string | null;
  transcript: string;
  isListening: boolean;
  aiResponse: string[];
  streamingResponse: string;
  currentSentence: string;
  connected: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setUserId: (userId: string | null) => void;
  setPersonalitySettings: (settings: any | null) => void;
  setAssistantId: (assistantId: string | null) => void;
  setTranscript: (transcript: string) => void;
  setIsListening: (isListening: boolean) => void;
  setAiResponse: (aiResponse: string[]) => void;
  setStreamingResponse: (streamingResponse: string) => void;
  setCurrentSentence: (currentSentence: string) => void;
  setConnected: (connected: boolean) => void;
}

export const useBotStore = create<BotState>((set) => ({
  isOpen: false,
  userId: null,
  personalitySettings: null,
  assistantId: null,
  transcript: "",
  isListening: false,
  aiResponse: [],
  streamingResponse: "",
  currentSentence: "",
  connected: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  setUserId: (userId) => set({ userId }),
  setPersonalitySettings: (personalitySettings) => set({ personalitySettings }),
  setAssistantId: (assistantId) => set({ assistantId }),
  setTranscript: (transcript) => set({ transcript }),
  setIsListening: (isListening) => set({ isListening }),
  setAiResponse: (aiResponse) => set({ aiResponse }),
  setStreamingResponse: (streamingResponse) => set({ streamingResponse }),
  setCurrentSentence: (currentSentence) => set({ currentSentence }),
  setConnected: (connected) => set({ connected }),
}));
