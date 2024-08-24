import base64
import cv2
import numpy as np
import json
from fastapi import HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import tinydb

# Carrega o modelo Yolo pré treinado
model = YOLO("../yoloModel/antoniomodel.pt")

# Abre a base de dados


def get_next_id():
    try:
        db = tinydb.TinyDB("../database/db.json")
        max_id = max(item.get("ID", 0) for item in db.all())
        db.close()
        return max_id + 1
    except ValueError:
        return 1


# Função para converter resultados em um JSON com um limite minimo de 0.7 de "confidence"
def results_to_json(results, model, confidence_threshold=0.4):
    detections = []
    for result in results:
        for box in result.boxes:
            if float(box.conf) >= confidence_threshold:
                detection = {
                    "class": int(box.cls),
                    "label": model.names[int(box.cls)],
                    "confidence": float(box.conf),
                    "box": {
                        "x_center": float(box.xywh[0][0]),
                        "y_center": float(box.xywh[0][1]),
                        "width": float(box.xywh[0][2]),
                        "height": float(box.xywh[0][3]),
                    },
                }
                detections.append(detection)
    return json.dumps(detections, indent=4)


class ImageData(BaseModel):
    image: str

async def process_image(data: ImageData):
    try:
        db = tinydb.TinyDB("../database/db.json")
        id = get_next_id()
        # Decodifica a imagem em formato base64
        image_data = base64.b64decode(data.image)
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # Verifica se a imagem veio corretamente
        if image is None:
            raise HTTPException(status_code=400, detail="Error loading image.")

        # Roda o YoloV8 na imagem
        results = model(image, conf=0.70)

        # Adiciona as anotações a imagem
        annotated_image = results[0].plot()

        # Encoda a imagem em formato base64
        _, buffer = cv2.imencode(".jpg", annotated_image)
        annotated_image_base64 = base64.b64encode(buffer).decode("utf-8")

        result_var = "Nada detectado"
        if results and results[0].boxes:
            for box in results[0].boxes:
                if model.names[int(box.cls)] == "person":
                    result_var = "Detectado sobrevivente"
                    break

        # Salva na base de dados
        new_entry = {
            "ID": id,
            "LAT": "v1.0",
            "LONG": annotated_image_base64,
            "Survivors": result_var,
            "Peso": (float(box.conf) * 100),
        }
        db.insert(new_entry)
        db.close()

        return {
            "ID": id,
            "LAT": "v1.0",
            "LONG": annotated_image_base64,
            "Survivors": result_var,
            "Peso": (float(box.conf) * 100),
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))