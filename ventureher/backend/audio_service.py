import os
import base64
from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))
VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")

def text_to_audio_base64(text: str) -> str:
    try:
        audio_stream = client.text_to_speech.convert(
            voice_id=VOICE_ID,
            text=text,
            model_id="eleven_multilingual_v2",
            voice_settings={
                "stability": 0.7,
                "similarity_boost": 0.8,
                "style": 0.3,
                "use_speaker_boost": True
            }
        )
        audio_bytes = b"".join(chunk for chunk in audio_stream)
        return base64.b64encode(audio_bytes).decode("utf-8")
    except Exception as e:
        print(f"ElevenLabs error: {e}")
        return ""  # Frontend handles empty audio gracefully