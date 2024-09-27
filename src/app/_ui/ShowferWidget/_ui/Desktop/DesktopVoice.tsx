"use client";

import React, { useRef, useEffect, useState } from "react";
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
import * as protobuf from "protobufjs";
import VoiceEnd from "./VoiceEnd";
import VoiceStart from "./VoiceStart";

const SAMPLE_RATE = 16000;
const NUM_CHANNELS = 1;

const NodCamera = ({ talkingState }) => {
  // Implement NodCamera logic here
  return null;
};

import { motion, AnimatePresence } from "framer-motion";

export default function DesktopVoice() {
  const botStore = useBotStore();
  const {
    personalitySettings,
    addToConversation,
    conversationHistory,
    productRecommendations,
    setCurrentUrl,
  } = botStore;
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const frameRef = useRef(null);
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);
  const microphoneStreamRef = useRef(null);
  const audioWorkletNodeRef = useRef(null);

  const [microphoneStatus, setMicrophoneStatus] = useState("idle");

  useEffect(() => {
    const setup = async () => {
      try {
        const root = await protobuf.load("/proto/frames.proto");
        frameRef.current = root.lookupType("pipecat.Frame");
        setIsLoading(false);
      } catch (err) {
        setErrorMessage("Error loading protobuf: " + err.message);
      }
    };
    setup();

    return () => {
      stopAudio(true);
    };
  }, []);

  const initWebSocket = () => {
    wsRef.current = new WebSocket("ws://localhost:8765");
    wsRef.current.addEventListener("open", () => {
      // Send assistant_id when WebSocket is opened
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ assistant_id: botStore.assistantId })
        );
      }
    });
    wsRef.current.addEventListener("message", handleWebSocketMessage);
    wsRef.current.addEventListener("close", (event) => {
      stopAudio(false);
    });
    wsRef.current.addEventListener("error", (event) => {
      setErrorMessage("WebSocket error occurred");
    });
  };

  const handleWebSocketMessage = (event) => {
    if (typeof event.data === "string") {
      try {
        const eventData = JSON.parse(event.data);
        if (eventData?.type === "transcript_and_response") {
          if (eventData?.transcript) {
            console.log("Transcript:", eventData?.transcript);
            addToConversation("user", eventData?.transcript);
            // Update UI with transcript
          }
          if (eventData?.llm_response) {
            console.log("LLM Response:", eventData?.llm_response);
            addToConversation("assistant", eventData?.llm_response);
            // Update UI with LLM response
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        // Handle the error appropriately
      }
    } else {
      // Handle binary data (assuming it's audio data)
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        enqueueAudioFromProto(arrayBuffer);
      };
      reader.readAsArrayBuffer(event.data);
    }
  };

  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current) {
      return;
    }

    isPlayingRef.current = true;
    const nextAudio = audioQueueRef.current.shift();

    const source = audioContextRef.current.createBufferSource();
    source.buffer = nextAudio;
    source.connect(audioContextRef.current.destination);

    source.onended = () => {
      isPlayingRef.current = false;
      playNextInQueue(); // Play the next audio in queue
    };

    source.start();
  };

  const enqueueAudioFromProto = (arrayBuffer) => {
    try {
      const parsedFrame = frameRef.current.decode(new Uint8Array(arrayBuffer));
      if (!parsedFrame?.audio?.audio) {
        return false;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const audioData = new Uint8Array(parsedFrame.audio.audio).buffer;

      audioContextRef.current.decodeAudioData(
        audioData,
        (buffer) => {
          audioQueueRef.current.push(buffer);
          playNextInQueue(); // Attempt to play next audio in queue
        },
        (error) => {
          // Error decoding audio data
        }
      );
    } catch (error) {
      // Error in enqueueAudioFromProto
    }
  };

  const startAudio = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMessage("getUserMedia is not supported in your browser.");
      return;
    }

    setMicrophoneStatus("requesting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: SAMPLE_RATE,
          channelCount: NUM_CHANNELS,
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setMicrophoneStatus("granted");

      // Close any existing audio context
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }

      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)({
        latencyHint: "interactive",
        sampleRate: SAMPLE_RATE,
      });

      await audioContextRef.current.audioWorklet.addModule(
        "/audio-processor.js"
      );

      setIsPlaying(true);
      initWebSocket();

      microphoneStreamRef.current = stream;
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      audioWorkletNodeRef.current = new AudioWorkletNode(
        audioContextRef.current,
        "audio-processor"
      );
      sourceRef.current.connect(audioWorkletNodeRef.current);
      audioWorkletNodeRef.current.connect(audioContextRef.current.destination);

      audioWorkletNodeRef.current.port.onmessage = (event) => {
        if (!wsRef.current) return;
        const { audioData } = event.data;
        const frame = frameRef.current.create({
          audio: {
            audio: Array.from(new Uint8Array(audioData.buffer)),
            sampleRate: SAMPLE_RATE,
            numChannels: NUM_CHANNELS,
          },
        });
        const encodedFrame = new Uint8Array(
          frameRef.current.encode(frame).finish()
        );
        wsRef.current.send(encodedFrame);
      };

      setIsPlaying(true);
      setErrorMessage(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error accessing microphone:", error);
      handleAudioError(error);
    }
  };

  const handleAudioError = (error) => {
    console.log("Audio error type:", error.name);
    console.log("Audio error message:", error.message);
    console.log("Microphone status:", microphoneStatus);
    setErrorMessage("Error accessing microphone");
    setIsPlaying(false);
    setMicrophoneStatus("error");
  };

  const stopAudio = (closeWebsocket) => {
    setIsPlaying(false);

    if (wsRef.current && closeWebsocket) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.disconnect();
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error);
    }

    // Disengage the microphone
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      microphoneStreamRef.current = null;
    }
  };

  const tempDimensions = "2D";

  const isLastMessageFromAssistant =
    conversationHistory.length > 0 &&
    conversationHistory[conversationHistory.length - 1].role === "assistant";

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
        ) : tempDimensions === "2D" ? (
          <div
            className={`relative mb-4 ${
              productRecommendations.length > 0
                ? "w-[120px] h-[120px]"
                : "w-[150px] h-[150px]"
            }`}
          >
            <IconSVG
              name="mobile-orb-bg"
              color={personalitySettings?.primaryColor}
              className="w-full h-full"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className={`rounded-full bg-white p-1 blur-sm ${
                  productRecommendations.length > 0
                    ? "w-[100px] h-[100px]"
                    : "w-[130px] h-[130px]"
                }`}
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
              <NodCamera talkingState={botStore.talkingState} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <Center>
                {getComponentForCharacter(
                  personalitySettings.character,
                  botStore.talkingState
                )}
              </Center>
              <Environment preset="sunset" />
            </Canvas>
          </div>
        )}
      </div>
      <AnimatePresence>
        {isLastMessageFromAssistant && productRecommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-[300px] mb-2 overflow-hidden"
          >
            <div className="flex space-x-2 pb-2 overflow-x-auto">
              {productRecommendations.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[120px]"
                >
                  <div
                    className="flex flex-col items-center border border-gray-200 rounded-[10px] w-full cursour-pointer"
                    onClick={() => {
                      setCurrentUrl(product.productUrl);
                    }}
                  >
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
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isPlaying ? (
        <VoiceEnd
          color={"#FF3B30"}
          disable={isLoading}
          onClick={() => {
            stopAudio(true);
          }}
        />
      ) : (
        <VoiceStart
          color={personalitySettings?.primaryColor}
          disable={isLoading}
          onClick={() => {
            startAudio();
          }}
        />
      )}
    </div>
  );
}
