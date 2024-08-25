from fastapi import APIRouter
from .crud import router as crud
from .route_processing import router as route_processing
from .image_processing import router as image_processing

router = APIRouter()

# Define os prefixos para os roteadores de CRUD e de processamento de imagem
router.include_router(crud, prefix="/crud")
router.include_router(route_processing, prefix="/route_processing")
router.include_router(image_processing, prefix="/image_processing")