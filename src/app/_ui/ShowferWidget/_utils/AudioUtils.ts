import { EmotionControl } from "@cartesia/cartesia-js";
import { useAudioStore } from "../_store/audioStore";
import { useBotStore } from "../_store/botStore";

const SAMPLE_RATE = 16000;
const NUM_CHANNELS = 1;

let mediaStreamSource: MediaStreamAudioSourceNode | null = null;
let audioWorkletNode: AudioWorkletNode | null = null;
let webSocket: WebSocket | null = null;

export const startAudio = async () => {
  const { setErrorMessage, initializeAudioContext, initializeProtobuf } =
    useAudioStore.getState();
  const { assistantId } = useBotStore.getState();

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setErrorMessage("getUserMedia is not supported in your browser.");
    return;
  }

  try {
    await initializeProtobuf();
    const audioCtx = initializeAudioContext();

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: SAMPLE_RATE,
        channelCount: NUM_CHANNELS,
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    await audioCtx.audioWorklet.addModule("/audio-processor.js");

    mediaStreamSource = audioCtx.createMediaStreamSource(stream);
    audioWorkletNode = new AudioWorkletNode(audioCtx, "audio-processor");
    mediaStreamSource.connect(audioWorkletNode);
    audioWorkletNode.connect(audioCtx.destination);

    initWebSocket();

    audioWorkletNode.port.onmessage = (event) => {
      if (!webSocket) return;
      const { frameProtobuf } = useAudioStore.getState();
      if (!frameProtobuf) return;

      const { audioData } = event.data;
      const frame = frameProtobuf.create({
        audio: {
          audio: Array.from(new Uint8Array(audioData.buffer)),
          sampleRate: SAMPLE_RATE,
          numChannels: NUM_CHANNELS,
        },
      });
      const encodedFrame = frameProtobuf.encode(frame).finish();
      webSocket.send(encodedFrame);
    };

    setErrorMessage("");
  } catch (error) {
    console.error("Error accessing microphone:", error);
    setErrorMessage("Error accessing microphone");
    throw error;
  }
};

export const stopAudio = () => {
  if (audioWorkletNode) {
    audioWorkletNode.disconnect();
    audioWorkletNode = null;
  }
  if (mediaStreamSource) {
    mediaStreamSource.disconnect();
    mediaStreamSource = null;
  }
  const { audioContext, setAudioContext } = useAudioStore.getState();
  if (audioContext) {
    audioContext.close().catch(console.error);
    setAudioContext(null);
  }
  if (webSocket) {
    webSocket.close();
    webSocket = null;
  }
};

const initWebSocket = () => {
  const { addToConversation } = useBotStore.getState();
  const { setErrorMessage } = useAudioStore.getState();

  webSocket = new WebSocket("ws://localhost:8765");

  webSocket.addEventListener("open", () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      const botState = useBotStore.getState();
      const emotion = botState.personalitySettings.emotionConfig
        .filter((emotion) => emotion.level !== "none")
        .map(
          (emotion) =>
            `${
              emotion.level === "medium"
                ? `${emotion.emotion}`
                : `${emotion.emotion}:${emotion.level}`
            }`
        ) as EmotionControl[];
      webSocket.send(
        JSON.stringify({
          assistant_id: botState.assistantId,
          voice_id: botState.personalitySettings.voice.id, // Assuming you store voiceId in your bot state
          speed: botState.personalitySettings.speed, // Assuming you store speed in your bot state
          emotion: emotion, // Assuming you store emotions as an array in your bot state
        })
      );
    }
  });

  webSocket.addEventListener("message", (event) => {
    if (typeof event.data === "string") {
      try {
        const eventData = JSON.parse(event.data);
        if (eventData?.type === "transcript_and_response") {
          if (eventData?.transcript) {
            console.log("Transcript:", eventData?.transcript);
            addToConversation("user", eventData?.transcript);
          }
          if (eventData?.llm_response) {
            console.log("LLM Response:", eventData?.llm_response);
            addToConversation("assistant", eventData?.llm_response);
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      // Handle binary audio data
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        enqueueAudioFromProto(arrayBuffer);
      };
      reader.readAsArrayBuffer(event.data);
    }
  });

  webSocket.addEventListener("close", () => {
    stopAudio();
  });

  webSocket.addEventListener("error", () => {
    setErrorMessage("WebSocket error occurred");
  });
};

const audioQueue: AudioBuffer[] = [];
let isPlaying = false;

const enqueueAudioFromProto = (arrayBuffer: ArrayBuffer) => {
  const { frameProtobuf, audioContext } = useAudioStore.getState();
  if (!frameProtobuf || !audioContext) {
    console.error("frameProtobuf or audioContext not initialized");
    return;
  }

  try {
    const parsedFrame = frameProtobuf.decode(new Uint8Array(arrayBuffer));
    if (!parsedFrame?.audio?.audio) {
      console.error("No audio data in parsed frame");
      return;
    }

    const audioData = new Uint8Array(parsedFrame.audio.audio).buffer;

    audioContext.decodeAudioData(
      audioData,
      (buffer) => {
        audioQueue.push(buffer);
        if (!isPlaying) {
          playNextInQueue();
        }
      },
      (error) => {
        console.error("Error decoding audio data:", error);
      }
    );
  } catch (error) {
    console.error("Error in enqueueAudioFromProto:", error);
  }
};

const playNextInQueue = () => {
  const { audioContext, setIsAudioPlaying } = useAudioStore.getState();
  if (audioQueue.length === 0 || !audioContext) {
    isPlaying = false;
    setIsAudioPlaying(false);
    return;
  }

  isPlaying = true;
  setIsAudioPlaying(true);
  const nextAudio = audioQueue.shift();
  if (!nextAudio) return;

  const source = audioContext.createBufferSource();
  source.buffer = nextAudio;
  source.connect(audioContext.destination);

  source.onended = () => {
    playNextInQueue();
  };

  source.start();
};

export const isAudioPlaying = () => isPlaying;
