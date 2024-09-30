import { create } from "zustand";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: ProductRecommendation[];
}

interface ProductRecommendation {
  name: string;
  image: string;
  productUrl: string;
}

interface BotState {
  isMobile: boolean;
  isOpen: boolean;
  url: string;
  currentUrl: string;
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
  threadId: string | null;
  talkingState: "user" | "assistant" | "neutral";
  conversationHistory: Message[];
  productRecommendations: ProductRecommendation[];
  setThreadId: (threadId: string) => void;
  setUrl: (url: string) => void;
  setCurrentUrl: (url: string) => void;
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
  setProductRecommendations: (productRecommendations: any[]) => void;
  toggleChatWindow: () => void;
  toggleMedium: () => void;
  addToConversation: (role: "user" | "assistant", content: string) => void;
  addProductRecommendation: (name: string, productUrl: string) => void;
}

async function getPreviewImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    let previewImage = doc.querySelector('meta[property="og:image"]');
    if (previewImage) {
      return previewImage.getAttribute("content");
    }

    previewImage = doc.querySelector('meta[name="twitter:image"]');
    if (previewImage) {
      return previewImage.getAttribute("content");
    }

    return null;
  } catch (error) {
    console.error("Error fetching preview image:", error);
    return null;
  }
}

export const useBotStore = create<BotState>((set, get) => ({
  isMobile: false,
  isOpen: false,
  isChatMode: false,
  userId: null,
  personalitySettings: null,
  assistantId: null,
  url: "",
  currentUrl: "",
  transcript: "",
  isListening: false,
  aiResponse: [],
  streamingResponse: "",
  currentSentence: "",
  connected: false,
  talkingState: "neutral",
  conversationHistory: [],
  productRecommendations: [],
  threadId: null,
  setThreadId: (threadId: string) => set({ threadId }),
  setUrl: (url: string) => set({ url }),
  setCurrentUrl: (currentUrl: string) => set({ currentUrl }),
  setTalkingState: (state: "user" | "assistant" | "neutral") =>
    set({ talkingState: state }),
  setIsMobile: (isMobile?: boolean) => {
    if (isMobile !== undefined) {
      set({ isMobile });
    } else if (typeof window !== "undefined") {
      const isMobileByScreenSize = window.innerWidth <= 768; // Adjust this breakpoint as needed
      set({ isMobile: isMobileByScreenSize });
    } else {
      // Default to false if window is not available (server-side)
      set({ isMobile: false });
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
  setProductRecommendations: (productRecommendations) =>
    set({ productRecommendations }),
  toggleChatWindow: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleMedium: () => set((state) => ({ isChatMode: !state.isChatMode })),
  addToConversation: async (role: "user" | "assistant", content: string) => {
    const cleanedContent = content.replace(/【\d+:\d+†source】/g, "").trim();

    set((state) => ({
      conversationHistory: [
        ...state.conversationHistory,
        { role, content: cleanedContent },
      ],
    }));

    // Reset product recommendations when a new conversation starts
    set({ productRecommendations: [] });

    if (role === "assistant") {
      const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const currentUrl = get().url;
      let newProductRecommendations: ProductRecommendation[] = [];

      let match;
      while ((match = urlRegex.exec(content)) !== null) {
        console.log("url found");
        const name = match[1];
        let productUrl = match[2];

        // Add prefix to URLs that don't start with "https://" or a domain name
        if (
          !productUrl.startsWith("https://") &&
          !productUrl.match(/^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/)
        ) {
          const urlObject = new URL(currentUrl);
          productUrl = `${urlObject.origin}${
            productUrl.startsWith("/") ? "" : "/"
          }${productUrl}`;
        }

        const productRecommendation = await get().addProductRecommendation(
          name,
          productUrl
        );
        console.log("productRecommendation", productRecommendation);
        newProductRecommendations.push(productRecommendation);
      }

      // Add product recommendations to the conversation history
      if (newProductRecommendations.length > 0) {
        set((state) => ({
          conversationHistory: [
            ...state.conversationHistory,
            {
              role: "assistant",
              content: "",
              products: newProductRecommendations,
            },
          ],
        }));
      }
    }
  },
  addProductRecommendation: async (
    name: string,
    productUrl: string
  ): Promise<ProductRecommendation> => {
    let finalImage = "";
    if (!finalImage) {
      finalImage = (await getPreviewImage(productUrl)) || "";
    }
    const newRecommendation = { name, image: finalImage, productUrl };
    set((state) => ({
      productRecommendations: [
        ...state.productRecommendations,
        newRecommendation,
      ],
    }));
    return newRecommendation;
  },
}));

// Initialize isMobile on store creation
if (typeof window !== "undefined") {
  useBotStore.getState().setIsMobile();

  // Add event listener for window resize
  window.addEventListener("resize", () => useBotStore.getState().setIsMobile());
}
