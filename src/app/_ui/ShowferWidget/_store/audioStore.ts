import { create } from "zustand";
import * as protobuf from "protobufjs";

interface AudioState {
  isPlaying: boolean;
  isAudioPlaying: boolean;
  errorMessage: string;
  audioContext: AudioContext | null;
  frameProtobuf: protobuf.Type | null;
  setIsAudioPlaying: (isAudioPlaying: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setErrorMessage: (message: string) => void;
  setAudioContext: (audioContext: AudioContext | null) => void;
  setFrameProtobuf: (frameProtobuf: protobuf.Type | null) => void;
  initializeAudioContext: () => AudioContext;
  initializeProtobuf: () => Promise<void>;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  isPlaying: false,
  isAudioPlaying: false,
  errorMessage: "",
  audioContext: null,
  frameProtobuf: null,
  setIsAudioPlaying: (isAudioPlaying) => set({ isAudioPlaying }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setErrorMessage: (message) => set({ errorMessage: message }),
  setAudioContext: (audioContext) => set({ audioContext }),
  setFrameProtobuf: (frameProtobuf) => set({ frameProtobuf }),
  initializeAudioContext: () => {
    const { audioContext } = get();
    if (!audioContext) {
      const newAudioContext = new (window.AudioContext ||
        window.webkitAudioContext)({
        latencyHint: "interactive",
        sampleRate: 16000, // SAMPLE_RATE
      });
      set({ audioContext: newAudioContext });
      return newAudioContext;
    }
    return audioContext;
  },
  initializeProtobuf: async () => {
    const { frameProtobuf } = get();
    if (frameProtobuf) return;

    try {
      const root = await protobuf.load("/proto/frames.proto");
      const newFrameProtobuf = root.lookupType("pipecat.Frame");
      set({ frameProtobuf: newFrameProtobuf });
    } catch (err) {
      console.error("Error loading protobuf:", err);
      throw err;
    }
  },
}));
