from fastapi import APIRouter, HTTPException, Body
from controllers.img_proc.image_controller import thermal_image, ImageData

router = APIRouter()

# Rota que recebe uma imagem, processa ela e retorna a mesma processada
@router.post("/process_thermal", status_code=200)
async def process_image_endpoint(data: ImageData = Body(...)):
    try:
        return await thermal_image(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))