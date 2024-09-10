import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePersonalityStore } from "@/app/(onboarding)/onboarding/personality/store";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Center } from "@react-three/drei";
import Aman from "@/app/_ui/Characters/Aman";
import Conrad from "@/app/_ui/Characters/Conrad";
import Imogen from "@/app/_ui/Characters/Imogen";
import Edison from "@/app/_ui/Characters/Edison";
import Buddy from "@/app/_ui/Characters/Buddy";
import Griffin from "@/app/_ui/Characters/Griffin";
import Grennie from "@/app/_ui/Characters/Grennie";
import Sassy from "@/app/_ui/Characters/Sassy";
import VoiceOrb from "@/app/(dashboard)/playground/_ui/VoiceOrb";
import IconSVG from "@/app/_ui/IconSvg";
import { useTTS } from "@cartesia/cartesia-js/react";
import { EmotionControl } from "@cartesia/cartesia-js";

export default function VoiceInterface({ mobile }: { mobile: boolean }) {
  const [isRecording, setIsRecording] = useState(false);

  const {
    visualizer,
    dimensions,
    character,
    selectedTab,
    voice,
    selectedSpeed,
    emotionConfig,
  } = usePersonalityStore();
  const [storyState, setStoryState] = useState<"user" | "assistant">(
    "assistant"
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const sampleText =
    "Hello, my name is Griffin. I am a friendly AI assistant. How can I help you today?";

  const getComponentForCharacter = (character: any) => {
    switch (character.id) {
      case 1:
        return (
          <Aman position={[0, 0, 0]} scale={1.5} storyState={storyState} />
        );
      case 2:
        return (
          <Imogen position={[0, 0, 0]} scale={1} storyState={storyState} />
        );
      case 3:
        return (
          <Conrad position={[0, 0, 0]} scale={0.8} storyState={storyState} />
        );
      case 4:
        return (
          <Edison position={[0, 0, 0]} scale={1} storyState={storyState} />
        );
      case 5:
        return (
          <Buddy position={[0, 0, 0]} scale={0.7} storyState={storyState} />
        );
      case 6:
        return (
          <Griffin position={[0, 0, 0]} scale={0.5} storyState={storyState} />
        );
      case 7:
        return (
          <Grennie position={[0, 0, 0]} scale={1} storyState={storyState} />
        );
      case 8:
        return <Sassy position={[0, 0, 0]} scale={1} storyState={storyState} />;
      default:
        return null;
    }
  };

  const NodCamera = ({ storyState }: { storyState: "user" | "assistant" }) => {
    const isVertical = useRef(Math.random() < 0.5);

    useFrame((state) => {
      if (storyState === "assistant") {
        const movement = Math.sin(state.clock.elapsedTime * 4) * 0.5;
        if (isVertical.current) {
          state.camera.position.y = movement;
        } else {
          state.camera.position.x = movement;
        }
      }
    });

    return null;
  };

  const tts = useTTS({
    apiKey: process.env.NEXT_PUBLIC_CARTESIA_API_KEY!,
    sampleRate: 44100,
  });

  const handlePlay = async () => {
    console.log("voice: ", voice);
    const emotion = emotionConfig
      .filter((emotion) => emotion.level !== "none")
      .map(
        (emotion) =>
          `${
            emotion.level === "medium"
              ? `${emotion.emotion}`
              : `${emotion.emotion}:${emotion.level}`
          }`
      ) as EmotionControl[];
    console.log("emotion: ", emotion);
    setIsPlaying(true);
    try {
      await tts.buffer({
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: voice!.id,
          __experimental_controls: {
            speed: selectedSpeed as
              | "normal"
              | "slowest"
              | "slow"
              | "fast"
              | "fastest"
              | number,
            emotion: emotion,
          },
        },
        transcript: sampleText,
      });
      await tts.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <div
      className={` ${
        mobile ? "" : "h-full p-6 flex flex-col justify-center items-center"
      }`}
    >
      {!mobile && (
        <div className="mb-8">
          {visualizer === "Orb" ? (
            <VoiceOrb width={200} height={200} />
          ) : dimensions === "2D" ? (
            <Image
              src={character.avatar}
              width={200}
              height={200}
              alt={character.name}
              className="rounded-full"
            />
          ) : (
            <div style={{ width: 250, height: 300 }}>
              <Canvas shadows>
                <color attach="background" args={["#fff"]} />
                <PerspectiveCamera
                  makeDefault
                  position={[0, 1.5, 5.5]}
                  fov={45}
                />
                <NodCamera storyState={storyState} />
                <OrbitControls enableZoom={false} enablePan={false} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                <Center>{getComponentForCharacter(character)}</Center>
                <Environment preset="sunset" />
              </Canvas>
            </div>
          )}
        </div>
      )}

      {selectedTab === "Personality" ? (
        <button>
          <IconSVG
            name="mic"
            color={character.primaryColor}
            className={`${
              isRecording ? "animate-pulse " : ""
            } transition-all duration-300`}
          />
        </button>
      ) : (
        <div
          className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white hover:bg-gray-100 transition-all duration-300 cursor-pointer"
          style={{
            boxShadow: `0px 0px 9px 0px rgba(31, 28, 70, 0.13)`,
          }}
          onClick={handlePlay}
        >
          <IconSVG
            name="play"
            color={character.primaryColor}
            className={`${
              isPlaying ? "animate-pulse " : ""
            } transition-all duration-300`}
          />
        </div>
      )}
    </div>
  );
}
