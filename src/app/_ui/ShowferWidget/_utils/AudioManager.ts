import {
  createClient,
  LiveTranscriptionEvents,
  LiveClient,
} from "@deepgram/sdk";

export class AudioManager {
  private connection: LiveClient | null;
  private transcriptCallback: (transcript: string) => void;
  private mediaRecorder: MediaRecorder | null;

  constructor() {
    this.connection = null;
    this.mediaRecorder = null;
    this.transcriptCallback = () => {};
  }

  async startListening(callback: (transcript: string) => void) {
    console.log("Starting deepgram connection");
    if (this.connection) {
      console.log("Connection already active");
      return;
    }

    this.transcriptCallback = callback;
    const deepgramApiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
    if (!deepgramApiKey) {
      console.error("Deepgram API key is missing");
      return;
    }

    const deepgram = createClient(deepgramApiKey);
    console.log("Deepgram client created");

    try {
      this.connection = await deepgram.listen.live({
        model: "nova-2",
        language: "en-US",
        smart_format: true,
        interim_results: true,
        endpointing: 800,
      });
      console.log("Deepgram connection established");

      this.connection.addListener(
        LiveTranscriptionEvents.Open,
        this.handleOpen
      );
      this.connection.addListener(
        LiveTranscriptionEvents.Close,
        this.handleClose
      );
      this.connection.addListener(
        LiveTranscriptionEvents.Transcript,
        this.handleTranscript
      );
      this.connection.addListener(
        LiveTranscriptionEvents.Error,
        this.handleError
      );

      // Start capturing audio immediately after connection is established
      await this.startCapturingAudio();
    } catch (error) {
      console.error("Error establishing Deepgram connection:", error);
    }
  }

  stopListening() {
    console.log("Stopping listening");
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = null;
    }
    if (this.connection) {
      this.connection.finish();
      this.connection = null;
    }
  }

  private handleOpen = () => {
    console.log("Deepgram WebSocket connection opened");
  };

  private handleClose = () => {
    console.log("Deepgram WebSocket connection closed");
  };

  private handleTranscript = (data: any) => {
    console.log("Raw transcript data received:", JSON.stringify(data, null, 2));
    if (
      data.channel &&
      data.channel.alternatives &&
      data.channel.alternatives.length > 0
    ) {
      const newTranscript = data.channel.alternatives[0].transcript;
      if (newTranscript && newTranscript.trim()) {
        console.log("New transcript:", newTranscript);
        this.transcriptCallback(newTranscript);
      } else {
        console.log("Received empty transcript");
      }
    } else {
      console.log("Unexpected transcript data structure");
    }
  };

  private handleError = (err: any) => {
    console.error("Deepgram Error:", err);
  };

  private async startCapturingAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Audio stream obtained");
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start(250);

      this.mediaRecorder.ondataavailable = (event) => {
        console.log(`Audio data available, size: ${event.data.size} bytes`);
        if (
          event.data.size > 0 &&
          this.connection &&
          this.connection.getReadyState() === 1
        ) {
          console.log("Sending audio data to Deepgram");
          this.connection.send(event.data);
        } else {
          console.log(
            "Not sending audio data. Connection state:",
            this.connection ? this.connection.getReadyState() : "No connection"
          );
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error("MediaRecorder error:", event);
      };
    } catch (err) {
      console.error("Error accessing the microphone:", err);
    }
  }
}
