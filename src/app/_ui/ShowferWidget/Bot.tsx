import React, { useEffect, useRef } from "react";
import BotWindow from "./BotWindow";
import OrbIcon from "./_ui/Orb/OrbIcon";
import { fetchUserData } from "@/app/_utils/fetchUserData";
import { useBotStore } from "./_store/botStore";
import { base64ToFloat32Array } from "./_utils/base64ToFloat32Array";

const Bot = ({ mobile }: { mobile?: boolean }) => {
  const {
    isOpen,
    userId,
    personalitySettings,
    assistantId,
    setIsOpen,
    setUserId,
    setPersonalitySettings,
    setAssistantId,
    transcript,
    isListening,
    aiResponse,
    streamingResponse,
    currentSentence,
    connected,
    setTranscript,
    setIsListening,
    setAiResponse,
    setStreamingResponse,
    setCurrentSentence,
    setConnected,
  } = useBotStore();

  const connectionRef = useRef(null);
  const socketRef = useRef(null);
  const audioContext = useRef(null);
  const audioQueue = useRef([]);
  const isPlaying = useRef(false);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchData = async () => {
      const { userId, personalitySettings, assistantId } =
        await fetchUserData();
      setUserId(userId);
      setPersonalitySettings(personalitySettings);
      setAssistantId(assistantId);
    };

    fetchData();
  }, []);

  useEffect(() => {
    audioContext.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    connectWebSocket();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case "queue_update":
          console.log("Queue updated:", message.message);
          break;
        case "audio_data":
          console.log("Received audio data for:", message.sentence);
          audioQueue.current.push({
            sentence: message.sentence,
            audioData: base64ToFloat32Array(message.data),
          });
          if (!isPlaying.current) {
            playNextAudio();
          }
          break;
        case "queue_empty":
          console.log("Audio queue is empty");
          break;
      }
    };
    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setConnected(false);
      setTimeout(connectWebSocket, 5000);
    };

    socketRef.current = ws;
  };

  const playNextAudio = () => {
    if (audioQueue.current.length === 0) {
      isPlaying.current = false;
      return;
    }

    isPlaying.current = true;
    const { sentence, audioData } = audioQueue.current.shift();
    setCurrentSentence(sentence);

    const audioBuffer = audioContext.current.createBuffer(
      1,
      audioData.length,
      22050
    );
    audioBuffer.copyToChannel(audioData, 0);
    const source = audioContext.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.current.destination);

    // Calculate 70% of the audio duration
    const seventyPercentDuration = audioBuffer.duration * 0.7;

    // Set a timeout to request the next audio at 70% of playback
    setTimeout(() => {
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify({ type: "get_next_audio" }));
      }
    }, seventyPercentDuration * 1000);

    source.onended = () => {
      console.log("Audio playback ended");
      playNextAudio();
    };
    source.start();
    console.log("Audio playback started for:", sentence);
  };

  const getAIResponse = async (text: string) => {
    try {
      setStreamingResponse(""); // Reset streaming response
      setAiResponse([]); // Reset final AI response as an array
      let currentSentence = "";
      let sentences = [];

      const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        currentSentence += content;
        setStreamingResponse((prev) => prev + content);

        // Check if the current sentence is complete and has at least 10 words
        if (
          currentSentence.match(/[.!?,]\s*$/) &&
          currentSentence.trim().split(/\s+/).length >= 10
        ) {
          sentences.push(currentSentence.trim());
          setAiResponse(sentences);
          currentSentence = "";
        }
      }

      // Add any remaining content to the final response
      if (currentSentence.trim()) {
        sentences.push(currentSentence.trim());
        setAiResponse(sentences);
      }

      // Send all sentences to the server
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(
          JSON.stringify({
            type: "add_sentences",
            sentences: sentences,
          })
        );
      }

      // Request the first audio file
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify({ type: "get_next_audio" }));
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
    }
  };

  return (
    <div className="flex flex-col mt-auto items-end justify-end h-full">
      {isOpen && (
        <BotWindow
          mobile={mobile}
          toggleChat={toggleChat}
          assistantId={assistantId!}
          personalitySettings={personalitySettings}
        />
      )}
      {(!mobile || !isOpen) && (
        <button onClick={toggleChat}>
          <OrbIcon
            width={mobile ? 40 : 50}
            height={mobile ? 40 : 50}
            primaryColor={personalitySettings?.primaryColor}
          />
        </button>
      )}
    </div>
  );
};

export default Bot;
