from fastapi import APIRouter, HTTPException, Body
from backend.src.controllers.img_proc.process_river import process_river_image, ImageData


router = APIRouter()

# Rota que recebe uma imagem de um rio e processa ela para identificar o rio
@router.post("/process_river_image", status_code=200)
async def process_river_image(data: ImageData = Body(...)):
    try:
        return await process_river_image(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))