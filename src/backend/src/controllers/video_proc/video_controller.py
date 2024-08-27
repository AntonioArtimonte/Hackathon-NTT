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
import os

# Carregando modelos
model = YOLO("../yoloModel/antoniomodel.pt")

class VideoData(BaseModel):
    video: str


async def process_video(file: UploadFile):
    try:
        print(f"Video '{file.filename}' recebido no controler")

        output_dir = "processed_videos"
        os.makedirs(output_dir, exist_ok=True)

        video_temp_file = os.path.join(output_dir, file.filename)
        output_file = os.path.join(output_dir, "output_annotated.mp4")
        output_file_2 = os.path.join(output_dir, "output_annotated_2.mp4")

        with open(video_temp_file, "wb") as f:
            f.write(await file.read())

        cap = cv2.VideoCapture(video_temp_file)

        # Verificar se o vídeo foi aberto corretamente
        if not cap.isOpened():
            raise HTTPException(status_code=400, detail="Erro ao abrir o vídeo.")
        
        # Obter FPS e configurar fallback
        fps = cap.get(cv2.CAP_PROP_FPS)
        if fps is None or fps == 0:
            fps = 30
        print(f"FPS detectado: {fps}")

        # Codificador para o vídeo anotado
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        if width == 0 or height == 0:
            raise HTTPException(status_code=500, detail="Erro ao obter as dimensões do vídeo.")
        print(f"Resolução: {width}x{height}")

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_file, fourcc, fps, (width, height))

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

        # Verificar se o arquivo foi criado corretamente
        if not os.path.exists(output_file) or os.path.getsize(output_file) == 0:
            raise HTTPException(status_code=500, detail="Erro ao criar o arquivo de vídeo.")

        print(f"Arquivo de vídeo anotado criado: {output_file}")

        clip = VideoFileClip(output_file)
    
        # Verificar propriedades do vídeo
        print(f"Duração do vídeo: {clip.duration}")
        print(f"FPS do vídeo: {clip.fps}")

        clip.write_videofile(output_file_2, codec="libx264", audio=False, preset="medium", threads=4)
        print(f"Arquivo de vídeo final criado: {output_file_2}")

        return FileResponse(output_file_2, media_type='video/mp4')
             
    except Exception as e:
        print(f"Erro durante o processamento: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
