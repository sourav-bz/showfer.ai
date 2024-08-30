import OpenAI from 'openai';
import { PassThrough } from 'stream';

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

export async function POST(req) {
  const { text } = await req.json();

  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
      response_format: "mp3",
    });
    // Create a PassThrough stream
    const stream = new PassThrough();

    // Pipe the response body to the PassThrough stream
    response.body.pipe(stream);

    // Set appropriate headers for streaming
    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    });

    // Return a streaming response
    return new Response(stream, { headers });
  } catch (error) {
    console.error('Error converting text to speech:', error);
    return new Response(JSON.stringify({ error: 'Error converting text to speech' }), { status: 500 });
  }
}