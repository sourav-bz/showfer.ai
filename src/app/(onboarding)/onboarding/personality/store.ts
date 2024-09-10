import create from "zustand";
import Cartesia from "@cartesia/cartesia-js";

interface PersonalityState {
  id?: string; // Add this line
  character: { id: number; name: string; avatar: string };
  visualizer: string;
  dimensions: string;
  primaryColor: string;
  voice: Voice | undefined;
  speed: number;
  stability: number;
  setCharacter: (character: {
    id: number;
    name: string;
    avatar: string;
  }) => void;
  setVisualizer: (visualizer: string) => void;
  setDimensions: (dimensions: string) => void;
  setPrimaryColor: (color: string) => void;
  setVoice: (voice: Voice) => void;
  setSpeed: (speed: number) => void;
  setStability: (stability: number) => void;
  setSettings: (settings: Partial<PersonalityState>) => void;
}

export interface Voice {
  id: string; // Change this from number to string
  is_public: boolean;
  name: string;
  description: string;
  language: string;
}

export const usePersonalityStore = create<PersonalityState>((set) => ({
  character: {
    id: 1,
    name: "Dr. Aman",
    avatar: "/personality/trustworthy-bg.jpg",
  },
  visualizer: "Orb",
  dimensions: "2D",
  primaryColor: "#6D67E4",
  voice: undefined,
  speed: 50,
  stability: 50,
  setCharacter: (character) => set({ character }),
  setVisualizer: (visualizer) => set({ visualizer }),
  setDimensions: (dimensions) => set({ dimensions }),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setVoice: (voice) => set({ voice }),
  setSpeed: (speed) => set({ speed }),
  setStability: (stability) => set({ stability }),
  setSettings: (settings) => set(settings),
}));

// Initialize Cartesia client
const cartesia = new Cartesia({
  apiKey: process.env.NEXT_PUBLIC_CARTESIA_API_KEY || "",
});

// Function to fetch available voices
export const fetchAvailableVoices = async () => {
  try {
    const voices = await cartesia.voices.list();
    console.log("voices", voices);
    return voices;
  } catch (error) {
    console.error("Error fetching voices:", error);
    return [];
  }
};
