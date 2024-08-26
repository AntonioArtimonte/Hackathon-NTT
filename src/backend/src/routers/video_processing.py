from fastapi import APIRouter, HTTPException, Body, UploadFile, File
from controllers.video_proc.video_controller import process_video, VideoData

router = APIRouter()

# Rota para processar vídeos
@router.post("/process_video", status_code=200)
async def process_video_endpoint(file: UploadFile = File(...)):
    try:
        print(f"Video '{file.filename}' recebido")
        return await process_video(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))