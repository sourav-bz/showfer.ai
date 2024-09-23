type EmotionLevel = "none" | "low" | "medium" | "high";

type Emotion = {
  level: EmotionLevel;
  emotion: string;
};

type Voice = {
  id: string;
  name: string;
  language: string;
  is_public: boolean;
  description: string;
};

type Character = {
  id: number;
  name: string;
  avatar: string;
  primaryColor: string;
};

export type PersonalitySettings = {
  id: number;
  character: Character;
  visualizer: string;
  dimensions: string;
  primaryColor: string;
  voice: Voice;
  speed: "slow" | "normal" | "fast";
  userId: string;
  emotionConfig: Emotion[];
};
