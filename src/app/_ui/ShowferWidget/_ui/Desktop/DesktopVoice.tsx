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
          <div className="w-[150px] h-[150px] relative mb-4">
            <IconSVG
              name="mobile-orb-bg"
              color={personalitySettings?.primaryColor}
              className="w-[150px] h-[150px]"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="rounded-full bg-white p-1 w-[130px] h-[130px] blur-sm"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px]">
              <Image
                src={
                  characters.find(
                    (c) => c.name === personalitySettings.character.name
                  )?.avatar!
                }
                alt="Avatar"
                className="rounded-full"
                width={150}
                height={150}
                objectFit="contain"
              />
            </div>
          </div>
        ) : (
          <div style={{ width: 250, height: 170 }}>
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
      <div className="bg-[#F0F2F7] w-[220px] px-[4px] py-[4px] text-xs font-light rounded-lg text-center mb-4">
        Hi, how can i help you?
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
