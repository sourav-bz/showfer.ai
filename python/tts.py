import asyncio
import os
import base64
from typing import List, Dict

from fastapi import FastAPI, WebSocket
from pydantic import BaseModel
from cartesia import Cartesia
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Cartesia setup
client = Cartesia(api_key=os.getenv("CARTESIA_API_KEY"))
voice_id = "996a8b96-4804-46f0-8e05-3fd4ef1a87cd"
voice = client.voices.get(id=voice_id)
model_id = "sonic-english"
output_format = {
    "container": "raw",
    "encoding": "pcm_f32le",
    "sample_rate": 22050,
}

# Global queue and audio cache
sentence_queue: List[str] = []
audio_cache: Dict[str, bytes] = {}

# Lock for thread-safe queue operations
queue_lock = asyncio.Lock()

class SentencesInput(BaseModel):
    sentences: List[str]

@app.post("/add_sentences")
async def add_sentences(sentences_input: SentencesInput):
    async with queue_lock:
        sentence_queue.extend(sentences_input.sentences)
    return {"message": f"Added {len(sentences_input.sentences)} sentences to queue"}

async def text_to_speech(sentence: str) -> bytes:
    if sentence in audio_cache:
        return audio_cache[sentence]
    
    ws = client.tts.websocket()
    try:
        audio_buffer = b''
        for output in ws.send(
            model_id=model_id,
            transcript=sentence,
            voice_embedding=voice["embedding"],
            stream=True,
            output_format=output_format,
        ):
            audio_buffer += output["audio"]
        audio_cache[sentence] = audio_buffer
        return audio_buffer
    finally:
        ws.close()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_json()
            if data['type'] == 'get_next_audio':
                if sentence_queue:
                    async with queue_lock:
                        sentence = sentence_queue.pop(0)
                    audio_data = await text_to_speech(sentence)
                    encoded = base64.b64encode(audio_data).decode('utf-8')
                    await websocket.send_json({
                        "type": "audio_data",
                        "sentence": sentence,
                        "data": encoded
                    })
                else:
                    await websocket.send_json({"type": "queue_empty"})
            elif data['type'] == 'add_sentences':
                sentences_input = SentencesInput(sentences=data['sentences'])
                await add_sentences(sentences_input)
                await websocket.send_json({"type": "queue_update", "message": f"Added {len(data['sentences'])} sentences to queue"})
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)