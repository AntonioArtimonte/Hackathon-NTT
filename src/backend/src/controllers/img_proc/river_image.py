import base64
import cv2
import os
import numpy as np
from fastapi import HTTPException
from pydantic import BaseModel
from ultralytics import YOLO
import tinydb
from PIL import Image, ImageDraw, ImageFont

# Carrega o modelo Yolo pré-treinado
model = YOLO("../yoloModel/river.pt")

# Define o diretório onde as imagens processadas serão salvas
SAVE_DIR = "./processed_images/"
os.makedirs(SAVE_DIR, exist_ok=True)  # Cria o diretório se ele não existir

# Abre a base de dados
def get_next_id():
    try:
        db = tinydb.TinyDB("database/db.json")
        max_id = max(item.get("ID", 0) for item in db.all())
        db.close()
        return max_id + 1
    except ValueError:
        return 1

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

        # Verifica se a imagem foi carregada corretamente
        if image is None:
            raise HTTPException(status_code=400, detail="Error loading image.")

        # Roda o YoloV8 na imagem
        results = model.predict(image, )
        print(results)

        # Converte o numpy array para PIL Image
        img = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(img)

        # Definindo uma fonte para as labels
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except IOError:
            font = ImageFont.load_default()

        # Desenhar as caixas delimitadoras (bounding boxes) e as labels na imagem
        for box in results[0].boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            label = results[0].names[int(box.cls[0])]
            
            # Desenhar o retângulo da caixa delimitadora
            draw.rectangle([x1, y1, x2, y2], outline=(0, 255, 0), width=2)
            
            # Desenhar a label acima da caixa delimitadora
            text_size = draw.textsize(label, font=font)
            text_background = (x1, y1 - text_size[1] - 2, x1 + text_size[0] + 4, y1)
            draw.rectangle(text_background, fill=(0, 255, 0))
            draw.text((x1 + 2, y1 - text_size[1] - 1), label, fill=(0, 0, 0), font=font)

        # Salvar a imagem com as caixas e labels
        image_filename = f"processed_image_{id}.jpg"
        save_path = os.path.join(SAVE_DIR, image_filename)
        img.save(save_path)

        # Opcional: encodar a imagem anotada em formato base64
        buffered = cv2.imencode(".jpg", np.array(img))[1]
        annotated_image_base64 = base64.b64encode(buffered).decode("utf-8")

        return {
            "annotated_image": annotated_image_base64
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))