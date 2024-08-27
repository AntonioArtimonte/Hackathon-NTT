import base64
import cv2
import numpy as np
import json
from fastapi import HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import tinydb
from datetime import datetime

# Carrega o modelo Yolo pré-treinado
model = YOLO("../yoloModel/river.pt")

# Abre a base de dados


def get_next_id():
    try:
        db = tinydb.TinyDB("database/db.json")
        max_id = max(item.get("ID", 0) for item in db.all())
        db.close()
        return max_id + 1
    except ValueError:
        return 1


# Função para converter resultados de segmentação em um JSON com um limite minimo de 0.7 de "confidence"
def results_to_json(results, model, confidence_threshold=0.3):
    detections = []
    for result in results:
        for mask in result.masks:
            if float(mask.conf) >= confidence_threshold:
                detection = {
                    "class": int(mask.cls),
                    "label": model.names[int(mask.cls)],
                    "confidence": float(mask.conf),
                    "segmentation": mask.data.tolist()  # Convert segmentation mask to a list
                }
                detections.append(detection)
    return json.dumps(detections, indent=4)


class ImageData(BaseModel):
    image: str


async def process_river(data: ImageData):
    try:
        db = tinydb.TinyDB("database/db.json")
        id = get_next_id()
        # Decodifica a imagem em formato base64
        image_data = base64.b64decode(data.image)
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Verifica se a imagem veio corretamente
        if image is None:
            raise HTTPException(status_code=400, detail="Error loading image.")

        # Roda o YoloV8 na imagem
        results = model(image, conf=0.30)

        # Adiciona as anotações a imagem
        annotated_image = results[0].plot()

        # Encoda a imagem em formato base64
        _, buffer = cv2.imencode(".jpg", annotated_image)
        annotated_image_base64 = base64.b64encode(buffer).decode("utf-8")

        result_var = "Nada detectado"
        if results and results[0].masks:
            for mask in results[0].masks:
                if model.names[int(mask.cls)] == "water":
                    result_var = "Detectado sobrevivente"
                    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    new_entry = {
                        "ID": id,
                        "LAT": "18.41294",
                        "LONG": "19.32131",
                        "Proc_img": annotated_image_base64,
                        "Survivors": result_var,
                        "Peso": (float(mask.conf) * 100),
                        "Time": current_time,
                    }
                    break
        else:
            return {
                "Proc_img": annotated_image_base64
            }

        # Salva na base de dados
        db.insert(new_entry)
        db.close()

        return {
            "ID": id,
            "LAT": "18.41294",
            "LONG": "19.32131",
            "Proc_img": annotated_image_base64,
            "Survivors": result_var,
            "Peso": (float(mask.conf) * 100),
            "Time": current_time,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))