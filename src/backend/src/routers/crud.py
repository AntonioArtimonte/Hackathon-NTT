from fastapi import APIRouter, HTTPException, Query, Body
from controllers.crud.update import update
from controllers.crud.delete import delete
from controllers.crud.read import read, read_all
from typing import Optional

router = APIRouter()

# Rota /update que recebe um id e os campos que deseja atualizar
@router.patch("/update/{id}", status_code=200)
async def update_by_id(
    id: int,
    version: Optional[str] = Body(default=None),
    image: Optional[str] = Body(default=None),
    result: Optional[str] = Body(default=None),
):
    update_data = {
        k: v
        for k, v in {"version": version, "image": image, "result": result}.items()
        if v is not None
    }
    try:
        if not update_data:
            raise ValueError("No valid data provided for update")
        return await update(id, **update_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Rota /delete que recebe um id e deleta o registro correspondente
@router.delete("/delete/{id}", status_code=200)
async def delete_by_id(id: int):
    try:
        return await delete(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Rota /read que retorna todos os registros
@router.get("/read", status_code=200)
async def read_all_records():
    try:
        return await read_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Rota /read/{id} que retorna um registro específico
@router.get("/read/{id}", status_code=200)
async def read_record_by_id(id: int):
    try:
        return await read(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))