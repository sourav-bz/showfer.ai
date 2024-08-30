import OpenAI from 'openai';

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

export async function POST(req: any) {
  const formData = await req.formData();
  const audioFile = formData.get('file');

  try {
    const response = await openai.audio.translations.create({
        file: audioFile,
        model: "whisper-1",
    });
    console.log('response: ', response);
    return new Response(JSON.stringify({ text: response.text }), { status: 200 });
  } catch (error) {
    console.error('Error converting speech to text:', error);
    return new Response(JSON.stringify({ error: 'Error converting speech to text' }), { status: 500 });
  }
}
