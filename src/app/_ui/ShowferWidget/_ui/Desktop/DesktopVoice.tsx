import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  PerspectiveCamera,
  Center,
} from "@react-three/drei";
import { characters } from "@/app/(onboarding)/onboarding/personality/store";
import { getComponentForCharacter } from "../../_utils/getComponentForCharacter";
import IconSVG from "@/app/_ui/IconSvg";
import VoiceOrb from "../Orb/VoiceOrb";
import { useBotStore } from "../../_store/botStore";
import VoiceEnd from "./VoiceEnd";
import VoiceStart from "./VoiceStart";
import VoiceLogic from "../VoiceLogic";
import { motion, useAnimation } from "framer-motion";
import { useAudioStore } from "../../_store/audioStore";
import { useVoiceLogic } from "../../_store/voiceLogicProvider";

export default function DesktopVoice() {
  const {
    personalitySettings,
    conversationHistory,
    productRecommendations,
    setCurrentUrl,
    talkingState,
  } = useBotStore();

  const {
    isPlaying,
    isLoading,
    errorMessage,
    handleStartAudio,
    handleStopAudio,
    isAudioPlaying,
    controls,
    animationProps,
  } = useVoiceLogic();

  // Use useEffect to update the animation when isAudioPlaying changes
  React.useEffect(() => {
    if (isAudioPlaying) {
      controls.start(animationProps);
    } else {
      controls.stop();
    }
  }, [isAudioPlaying, controls, animationProps]);

  const isLastMessageFromAssistant =
    conversationHistory.length > 0 &&
    conversationHistory[conversationHistory.length - 1].role === "assistant";

  const NodCamera = ({ isAudioPlaying }: { isAudioPlaying: boolean }) => {
    useFrame((state) => {
      if (isAudioPlaying) {
        const movement = Math.sin(state.clock.elapsedTime * 4) * 0.5;
        state.camera.position.y = movement;
      }
    });
    return null;
  };

  return (
    <div className="h-full p-6 flex flex-col justify-center items-center">
      <div
        className={`mb-8 ${productRecommendations.length > 0 ? "mb-2" : ""}`}
      >
        {personalitySettings.visualizer === "Orb" ? (
          <VoiceOrb
            width={productRecommendations.length > 0 ? 120 : 150}
            height={productRecommendations.length > 0 ? 120 : 150}
            color={personalitySettings?.primaryColor}
          />
        ) : personalitySettings.dimensions === "2D" ? (
          <div
            className={`relative mb-4 ${
              productRecommendations.length > 0
                ? "w-[120px] h-[120px]"
                : "w-[150px] h-[150px]"
            }`}
          >
            <motion.div animate={controls}>
              <IconSVG
                name="mobile-orb-bg"
                color={personalitySettings?.primaryColor}
                className="w-full h-full"
              />
            </motion.div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className={`rounded-full bg-white p-1 blur-sm  ${
                  productRecommendations.length > 0
                    ? "w-[100px] h-[100px]"
                    : "w-[130px] h-[130px]"
                } ${isPlaying ? "animate-pulse" : ""}`}
              ></div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
              <Image
                src={
                  characters.find(
                    (c) => c.name === personalitySettings.character.name
                  )?.avatar!
                }
                alt="Avatar"
                className="rounded-full"
                width={productRecommendations.length > 0 ? 120 : 150}
                height={productRecommendations.length > 0 ? 120 : 150}
                objectFit="contain"
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              width: productRecommendations.length > 0 ? 200 : 250,
              height: productRecommendations.length > 0 ? 140 : 170,
            }}
          >
            <Canvas shadows>
              <color attach="background" args={["#fff"]} />
              <PerspectiveCamera
                makeDefault
                position={[0, 1.5, 5.5]}
                fov={45}
              />
              <NodCamera isAudioPlaying={isAudioPlaying} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <Center>
                {getComponentForCharacter(
                  personalitySettings.character,
                  isAudioPlaying
                )}
              </Center>
              <Environment preset="sunset" />
            </Canvas>
          </div>
        )}
      </div>
      {isLastMessageFromAssistant && productRecommendations.length > 0 && (
        <div className="w-full max-w-[300px] mb-2 overflow-hidden">
          <div className="flex space-x-2 pb-2 overflow-x-auto">
            {productRecommendations.map((product, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[120px]"
                onClick={() => {
                  setCurrentUrl(product.productUrl);
                }}
              >
                <div className="flex flex-col items-center border border-gray-200 rounded-[10px] w-full cursor-pointer">
                  <div
                    className="w-full h-[50px]"
                    style={{
                      background: `url(${product.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="w-full text-[10px] h-[26px] p-1 overflow-hidden">
                    <p className="truncate">{product.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {isPlaying ? (
        <VoiceEnd
          color={"#FF3B30"}
          disable={isLoading}
          onClick={handleStopAudio}
          isMobile={false}
        />
      ) : (
        <VoiceStart
          color={personalitySettings?.primaryColor}
          disable={isLoading}
          onClick={handleStartAudio}
          isMobile={false}
        />
      )}
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}
