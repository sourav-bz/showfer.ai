import { base64ToFloat32Array } from "./base64ToFloat32Array";

export class WebSocketManager {
  private socket: WebSocket;
  private audioQueue: Array<{ sentence: string; audioData: Float32Array }> = [];
  private isPlaying: boolean = false;
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    this.socket = new WebSocket("ws://localhost:8000/ws");
    this.connect();
  }

  private connect() {
    this.socket.onopen = this.handleOpen;
    this.socket.onmessage = this.handleMessage;
    this.socket.onclose = this.handleClose;
  }

  private handleOpen = () => {
    console.log("WebSocket Connected");
  };

  private handleMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);

    switch (message.type) {
      case "queue_update":
        console.log("Queue updated:", message.message);
        break;
      case "audio_data":
        console.log("Received audio data for:", message.sentence);
        this.audioQueue.push({
          sentence: message.sentence,
          audioData: base64ToFloat32Array(message.data),
        });
        if (!this.isPlaying) {
          this.playNextAudio();
        }
        break;
      case "queue_empty":
        console.log("Audio queue is empty");
        break;
    }
  };

  private handleClose = () => {
    console.log("WebSocket Disconnected");
    setTimeout(() => this.connect(), 5000);
  };

  private playNextAudio() {
    if (this.audioQueue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const { sentence, audioData } = this.audioQueue.shift()!;

    const audioBuffer = this.audioContext.createBuffer(
      1,
      audioData.length,
      22050
    );
    audioBuffer.copyToChannel(audioData, 0);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const seventyPercentDuration = audioBuffer.duration * 0.7;

    setTimeout(() => {
      this.requestNextAudio();
    }, seventyPercentDuration * 1000);

    source.onended = () => {
      console.log("Audio playback ended");
      this.playNextAudio();
    };
    source.start();
    console.log("Audio playback started for:", sentence);
  }

  requestNextAudio() {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: "get_next_audio" }));
    }
  }

  async getAIResponse(text: string): Promise<string[]> {
    // Implement AI response logic here
    // This is a placeholder and should be replaced with actual implementation
    return ["Placeholder response"];
  }

  sendSentences(sentences: string[]) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          type: "add_sentences",
          sentences: sentences,
        })
      );
    }
  }
}
