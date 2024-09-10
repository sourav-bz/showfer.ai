import Image from "next/image";
import VoiceOrb from "./VoiceOrb";
import { useEffect, useRef, useState } from "react";
import OpenAI from "openai";
import { usePlaygroundStore } from "../../_store/PlaygroundStore";
import {
  characters,
  usePersonalityStore,
} from "@/app/(onboarding)/onboarding/personality/store";
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

const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side use
};
const openai = new OpenAI(configuration);

export default function VoiceInterface({
  mobile,
  handleSendMessage,
}: {
  mobile: boolean;
  handleSendMessage: (params: {
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    handleTextToSpeech: (text: string) => void;
  }) => void;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const isSpeakingRef = useRef(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [message, setMessage] = useState("");
  const { messageThread, setMessageThread } = usePlaygroundStore();

  const { visualizer, dimensions, character } = usePersonalityStore();
  const [storyState, setStoryState] = useState<"user" | "assistant">(
    "assistant"
  );

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

  useEffect(() => {
    const fetchMessages = async () => {
      const thread = await openai.beta.threads.create();
      console.log("thread: ", thread.id);
      setMessageThread(thread);
    };
    if (!messageThread) {
      fetchMessages();
    } else {
      console.log("messageThread: ", messageThread);
    }
  }, [messageThread]);

  const handleTextToSpeech = async (text: string) => {
    if (!audioRef.current) return;

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      audioRef.current.src = url;
      audioRef.current.play();

      audioRef.current.onended = () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleStartListening = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setIsRecording(true);
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const checkAudioLevel = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;

            if (average > 10) {
              isSpeakingRef.current = true;
              if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
              }
            } else if (isSpeakingRef.current) {
              silenceTimeoutRef.current = setTimeout(() => {
                isSpeakingRef.current = false;
                console.log("stoped isSpeaking: ", isSpeakingRef.current);
                handleStopListening();
              }, 1500); // Stop after 1.5 seconds of silence
            }

            requestAnimationFrame(checkAudioLevel);
          };

          mediaRecorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };

          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: "audio/wav",
            });
            const formData = new FormData();
            formData.append("file", audioBlob);

            const res = await fetch("/api/speech-to-text", {
              method: "POST",
              body: formData,
            });

            const data = await res.json();
            console.log("data: ", data);

            handleSendMessage({
              message: data.text,
              setMessage,
              handleTextToSpeech,
            });
          };

          mediaRecorder.start();
          checkAudioLevel();
        })
        .catch((error) => {
          console.error("Error accessing microphone", error);
        });
    }
  };

  const handleStopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    audioRef.current = typeof Audio !== "undefined" ? new Audio() : null;
  }, []);

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
      <button disabled={isRecording} onClick={() => handleStartListening()}>
        <Image
          src={"/playground/mic.svg"}
          width={mobile ? 35 : 70}
          height={mobile ? 35 : 70}
          alt="mic"
          className={`${
            isRecording ? "animate-pulse " : ""
          } transition-all duration-300`}
        />
      </button>
    </div>
  );
}
