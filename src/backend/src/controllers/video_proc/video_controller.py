import base64
import cv2
import numpy as np
import json
from fastapi import HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from ultralytics import YOLO
import tinydb
from datetime import datetime

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
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_file, fourcc, 20.0, (int(cap.get(3)), int(cap.get(4))))
        
        result_var = "Nada detectado"

        while(cap.isOpened()):
            ret, frame = cap.read()
            if not ret:
                break
            
            # Processando cada frame com o modelo YOLO
            results = model(frame, conf=0.30)
            
            # Adiciona as anotações ao frame
            annotated_frame = results[0].plot()
            
            if results and results[0].boxes:
                for box in results[0].boxes:
                    if model.names[int(box.cls)] == "person":
                        result_var = "Detectado sobrevivente"
                        break
            
            # Escreve o frame anotado no vídeo de saída
            out.write(annotated_frame)
        
        # Libera o vídeo
        cap.release()
        out.release()

        # Devolver o vídeo processado
        def iterfile():
            with open(output_file, mode="rb") as file_like:
                yield from file_like

        return StreamingResponse(iterfile(), media_type="video/mp4")
                
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
