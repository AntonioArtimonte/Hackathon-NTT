from fastapi import APIRouter, HTTPException, Body
from controllers.img_proc.image_controller import process_image, ImageData
from controllers.img_proc.thermal_image import process_thermal, ImageData
from controllers.img_proc.river_image import process_river, ImageData

router = APIRouter()

# Rota que recebe uma imagem, processa ela e retorna a mesma processada
@router.post("/process_image", status_code=200)
async def process_image_endpoint(data: ImageData = Body(...)):
    try:
        return await process_image(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/process_thermal", status_code=200)
async def process_thermal_endpoint(data: ImageData = Body(...)):
    try:
        return await process_thermal(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/process_river", status_code=200)
async def process_river_endpoint(data: ImageData = Body(...)):
    try:
        return await process_river(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))