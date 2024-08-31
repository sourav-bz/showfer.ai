import Image from "next/image";
import VoiceOrb from "./VoiceOrb";
import { useEffect, useRef, useState } from "react";
import OpenAI from "openai";
import { usePlaygroundStore } from "@/app/store/PlaygroundStore";

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
  handleSendMessage;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const isSpeakingRef = useRef(false);
  const silenceTimeoutRef = useRef(null);
  const [message, setMessage] = useState("");
  const { messageThread, setMessageThread } = usePlaygroundStore();

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

  const handleTextToSpeech = async (text) => {
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

  return (
    <div
      className={` ${
        mobile ? "" : "h-full p-6 flex flex-col justify-center items-center"
      }`}
    >
      {!mobile && (
        <div className="mb-8">
          <VoiceOrb width={200} height={200} />
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
