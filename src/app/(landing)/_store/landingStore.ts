import { create } from "zustand";

interface LandingStore {
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const useLandingStore = create<LandingStore>((set) => ({
  isLoaded: false,
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));
