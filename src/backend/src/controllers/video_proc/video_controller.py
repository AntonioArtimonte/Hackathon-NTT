import base64
import cv2
import numpy as np
import json
from fastapi import HTTPException, UploadFile
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel
from ultralytics import YOLO
import tinydb
from datetime import datetime
import subprocess
from moviepy.video.io.VideoFileClip import VideoFileClip
from moviepy.video.fx.all import resize

# Carregando modelos
model = YOLO("../yoloModel/antoniomodel.pt")

class VideoData(BaseModel):
    video: str


async def process_video(file: UploadFile):
    try:
        print(f"Video '{file.filename}' recebido no controler")

        video_temp_file = f"/tmp/{file.filename}"
        output_file = f"/tmp/output_annotated.mp4"
        with open(video_temp_file, "wb") as f:
            f.write(await file.read())

        cap = cv2.VideoCapture(video_temp_file)

        # CHeckar se o video foi processado corretamente
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Erro ao abrir o vídeo.")
        
        # Codificador para o vídeo anotado
        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        # out = cv2.VideoWriter(output_file, fourcc, 20.0, (int(cap.get(3)), int(cap.get(4))))
        out = cv2.VideoWriter(output_file, fourcc, cap.get(cv2.CAP_PROP_FPS), 
                              (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))))
        
        result_var = "Nada detectado"

        # Processando video
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            results = model(frame, conf=0.30)
            annotated_frame = results[0].plot()
            out.write(annotated_frame)
        
        # Libera o vídeo
        cap.release()
        out.release()

        output_file_2 = f"/tmp/output_annotated_2.mp4"

        # return StreamingResponse(iterfile(), media_type="video/mp4")

        # Converter para H.264
        clip = VideoFileClip(output_file)
        clip.write_videofile(output_file_2, codec="libx264", audio_codec="aac", temp_audiofile="temp-audio.m4a", remove_temp=True, threads=4)

        return FileResponse(output_file_2, media_type='video/mp4')
                
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
