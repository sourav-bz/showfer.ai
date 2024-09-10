import create from "zustand";
import Cartesia from "@cartesia/cartesia-js";

export const characters = [
  {
    id: 1,
    name: "Dr. Aman",
    avatar: "/personality/trustworthy-bg.jpg",
    primaryColor: "#709291",
  },
  {
    id: 2,
    name: "Imogen",
    avatar: "/personality/creative-bg.jpg",
    primaryColor: "#EAAF3B",
  },
  {
    id: 3,
    name: "Conrad",
    avatar: "/personality/friendly-bg.jpg",
    primaryColor: "#EAAF3B",
  },
  {
    id: 4,
    name: "Edison",
    avatar: "/personality/innovative-bg.jpg",
    primaryColor: "#4A959B",
  },
  {
    id: 5,
    name: "Buddy",
    avatar: "/personality/playful-bg.jpg",
    primaryColor: "#DA884B",
  },
  {
    id: 6,
    name: "Griffin",
    avatar: "/personality/rugged-bg.jpg",
    primaryColor: "#C8924D",
  },
  {
    id: 7,
    name: "Grennie",
    avatar: "/personality/greenie.png",
    primaryColor: "#7CAC4C",
  },
  {
    id: 8,
    name: "Sassy",
    avatar: "/personality/sassy.png",
    primaryColor: "#C65D46",
  },
];

export const speedLevels = ["slowest", "slow", "normal", "fast", "fastest"];
export const emotions = [
  "anger",
  "positivity",
  "surprise",
  "sadness",
  "curiosity",
];
export const emotionLevels = [
  "none",
  "lowest",
  "low",
  "medium",
  "high",
  "highest",
];

interface PersonalityState {
  id?: string; // Add this line
  character: {
    id: number;
    name: string;
    avatar: string;
    primaryColor: string;
  };
  visualizer: string;
  dimensions: string;
  voice: Voice | undefined;
  selectedTab: string;
  selectedSpeed: string;
  selectedEmotion: string | null;
  emotionConfig: Array<{ emotion: string; level: string }>;
  setSelectedTab: (tab: string) => void;
  setCharacter: (character: {
    id: number;
    name: string;
    avatar: string;
    primaryColor: string;
  }) => void;
  setVisualizer: (visualizer: string) => void;
  setDimensions: (dimensions: string) => void;
  setVoice: (voice: Voice) => void;
  setSettings: (settings: Partial<PersonalityState>) => void;
  setSelectedSpeed: (speed: string) => void;
  setSelectedEmotion: (emotion: string | null) => void;
  setSelectedEmotionLevel: (level: string) => void;
}

export interface Voice {
  id: string; // Change this from number to string
  is_public: boolean;
  name: string;
  description: string;
  language: string;
}

export const usePersonalityStore = create<PersonalityState>((set) => ({
  character: characters[0],
  visualizer: "Orb",
  dimensions: "2D",
  voice: undefined,
  selectedTab: "Personality",
  selectedSpeed: "normal",
  emotionConfig: [
    {
      emotion: "positivity",
      level: "none",
    },
    {
      emotion: "curiosity",
      level: "none",
    },
    {
      emotion: "surprise",
      level: "none",
    },
    {
      emotion: "sadness",
      level: "none",
    },
    {
      emotion: "anger",
      level: "none",
    },
  ],

  selectedEmotion: null,
  setSelectedTab: (tab: string) => set({ selectedTab: tab }),
  setCharacter: (character) => set({ character }),
  setVisualizer: (visualizer) => set({ visualizer }),
  setDimensions: (dimensions) => set({ dimensions }),
  setVoice: (voice) => set({ voice }),
  setSettings: (settings) => set(settings),

  setSelectedSpeed: (speed) => set({ selectedSpeed: speed }),
  setSelectedEmotion: (emotion) =>
    set({
      selectedEmotion: emotion,
    }),
  setSelectedEmotionLevel: (level) =>
    set((state) => ({
      emotionConfig: state.emotionConfig.map((config) =>
        config.emotion === state.selectedEmotion ? { ...config, level } : config
      ),
    })),
}));

// Initialize Cartesia client
const cartesia = new Cartesia({
  apiKey: process.env.NEXT_PUBLIC_CARTESIA_API_KEY || "",
});

// Function to fetch available voices
export const fetchAvailableVoices = async () => {
  try {
    const voices = await cartesia.voices.list();
    return voices;
  } catch (error) {
    console.error("Error fetching voices:", error);
    return [];
  }
};
