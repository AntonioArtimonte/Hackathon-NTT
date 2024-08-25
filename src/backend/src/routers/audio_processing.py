from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
from controllers.audio_proc.audio_controller import AudioAnalyzer 

router = APIRouter()

class AudioRequest(BaseModel):
    audio_base64: str

@router.post("/analyze_audio/")
async def analyze_audio(audio_request: AudioRequest):
    analyzer = AudioAnalyzer()
    return analyzer.analyze_audio(audio_request.audio_base64)
