import { create } from "zustand";
import { AudioManager } from "../_utils/AudioManager";
import { WebSocketManager } from "../_utils/WebSocketManager";

interface BotState {
  isMobile: boolean;
  isOpen: boolean;
  isChatMode: boolean;
  userId: string | null;
  personalitySettings: any | null;
  assistantId: string | null;
  transcript: string;
  isListening: boolean;
  aiResponse: string[];
  streamingResponse: string;
  currentSentence: string;
  connected: boolean;
  audioManager: AudioManager;
  webSocketManager: WebSocketManager;
  talkingState: "user" | "assistant" | "neutral";
  setTalkingState: (state: "user" | "assistant" | "neutral") => void;
  setIsMobile: (isMobile?: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsChatMode: (isChatMode: boolean) => void;
  setUserId: (userId: string | null) => void;
  setPersonalitySettings: (settings: any | null) => void;
  setAssistantId: (assistantId: string | null) => void;
  setTranscript: (transcript: string) => void;
  setIsListening: (isListening: boolean) => void;
  setAiResponse: (aiResponse: string[]) => void;
  setStreamingResponse: (streamingResponse: string) => void;
  setCurrentSentence: (currentSentence: string) => void;
  setConnected: (connected: boolean) => void;
  toggleChatWindow: () => void;
  toggleMedium: () => void;
  startListening: () => void;
  stopListening: () => void;
  getAIResponse: (text: string) => Promise<void>;
}

export const useBotStore = create<BotState>((set, get) => ({
  isMobile: false,
  isOpen: false,
  isChatMode: false,
  userId: null,
  personalitySettings: null,
  assistantId: null,
  transcript: "",
  isListening: false,
  aiResponse: [],
  streamingResponse: "",
  currentSentence: "",
  connected: false,
  talkingState: "neutral",
  audioManager: new AudioManager(),
  webSocketManager: new WebSocketManager(),
  setTalkingState: (state: "user" | "assistant" | "neutral") =>
    set({ talkingState: state }),
  setIsMobile: (isMobile?: boolean) => {
    if (isMobile !== undefined) {
      set({ isMobile });
    } else {
      const isMobileByScreenSize = window.innerWidth <= 768; // Adjust this breakpoint as needed
      set({ isMobile: isMobileByScreenSize });
    }
  },
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsChatMode: (isChatMode) => set({ isChatMode }),
  setUserId: (userId) => set({ userId }),
  setPersonalitySettings: (personalitySettings) => set({ personalitySettings }),
  setAssistantId: (assistantId) => set({ assistantId }),
  setTranscript: (transcript) => set({ transcript }),
  setIsListening: (isListening) => set({ isListening }),
  setAiResponse: (aiResponse) => set({ aiResponse }),
  setStreamingResponse: (streamingResponse) => set({ streamingResponse }),
  setCurrentSentence: (currentSentence) => set({ currentSentence }),
  setConnected: (connected) => set({ connected }),
  toggleChatWindow: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMedium: () => set((state) => ({ isChatMode: !state.isChatMode })),
  startListening: async () => {
    const { audioManager, setIsListening, setTranscript } = get();
    try {
      await audioManager.startListening((newTranscript) => {
        console.log("Received new transcript in botStore:", newTranscript);
        setTranscript((prevTranscript) => {
          // If the new transcript starts with the previous one, replace it
          if (newTranscript.startsWith(prevTranscript.trim())) {
            return newTranscript;
          }
          // Otherwise, append it
          return prevTranscript + " " + newTranscript;
        });
      });
      setIsListening(true);
    } catch (error) {
      console.error("Error starting listening:", error);
      setIsListening(false);
    }
  },

  stopListening: () => {
    const { audioManager, setIsListening } = get();
    audioManager.stopListening();
    setIsListening(false);
  },

  getAIResponse: async (text: string) => {
    const {
      webSocketManager,
      setStreamingResponse,
      setAiResponse,
      setCurrentSentence,
    } = get();
    setStreamingResponse("");
    setAiResponse([]);

    const sentences = await webSocketManager.getAIResponse(text);
    setAiResponse(sentences);

    webSocketManager.requestNextAudio();
  },
}));

// Initialize isMobile on store creation
useBotStore.getState().setIsMobile();

// Add event listener for window resize
if (typeof window !== "undefined") {
  window.addEventListener("resize", () => useBotStore.getState().setIsMobile());
}
