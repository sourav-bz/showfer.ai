import OpenAI from "openai";
import { create } from "zustand";

interface Message {
  content: string;
  type: "user" | "ai";
}

interface PlaygroundStore {
  messageThread: OpenAI.Beta.Threads.Thread | null;
  messages: Message[];
  addMessage: ({
    content,
    type,
  }: {
    content: string;
    type: "user" | "ai";
  }) => void;
  updateLastMessage: (message: Message) => void;
  setMessageThread: (thread: OpenAI.Beta.Threads.Thread) => void;
}

export const usePlaygroundStore = create<PlaygroundStore>((set) => ({
  messages: [],
  messageThread: null,
  addMessage: ({ content, type }) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          content,
          type,
          timestamp: new Date(),
        },
      ],
    })),
  updateLastMessage: (message) =>
    set((state) => {
      const updatedMessages = [...state.messages];
      if (
        updatedMessages.length > 0 &&
        updatedMessages[updatedMessages.length - 1].type === "ai"
      ) {
        updatedMessages[updatedMessages.length - 1] = message;
      } else {
        updatedMessages.push(message);
      }
      return { messages: updatedMessages };
    }),
  clearMessages: () => set({ messages: [] }),
  setMessageThread: (thread) => set({ messageThread: thread }),
}));
