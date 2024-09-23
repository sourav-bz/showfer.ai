import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Center,
} from "@react-three/drei";
import {
  characters,
  usePersonalityStore,
} from "@/app/(onboarding)/onboarding/personality/store";
import { PersonalitySettings } from "../../_types/Widget";
import { getComponentForCharacter } from "../../_utils/getComponentForCharacter";
import IconSVG from "@/app/_ui/IconSvg";
import VoiceOrb from "../Orb/VoiceOrb";

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

export default function DesktopVoice({
  personalitySettings,
}: {
  personalitySettings: PersonalitySettings;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { visualizer, dimensions, character } = usePersonalityStore();
  const [storyState, setStoryState] = useState<"user" | "assistant">(
    "assistant"
  );

  useEffect(() => {
    audioRef.current = typeof Audio !== "undefined" ? new Audio() : null;
  }, []);

  return (
    <div className="h-full p-6 flex flex-col justify-center items-center">
      <div className="mb-8">
        {personalitySettings.visualizer === "Orb" ? (
          <VoiceOrb
            width={150}
            height={150}
            color={personalitySettings?.primaryColor}
          />
        ) : personalitySettings.dimensions === "2D" ? (
          <Image
            src={
              characters.find(
                (c) => c.name === personalitySettings.character.name
              )?.avatar!
            }
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
              <Center>
                {getComponentForCharacter(
                  personalitySettings.character,
                  storyState
                )}
              </Center>
              <Environment preset="sunset" />
            </Canvas>
          </div>
        )}
      </div>
      <button>
        <IconSVG
          name="mic"
          color={personalitySettings?.primaryColor}
          className={`${
            isRecording ? "animate-pulse " : ""
          } transition-all duration-300 w-12 h-12`}
        />
      </button>
    </div>
  );
}
