from fastapi import APIRouter, HTTPException, Body
from controllers.crud.update import update
from controllers.crud.delete import delete
from controllers.crud.read import read, read_all
from controllers.crud.create import create
from typing import Optional

router = APIRouter()

# Route to update an entry by ID
@router.patch("/update/{id}", status_code=200)
async def update_by_id(
    id: int,
    lat: Optional[float] = Body(default=None),
    long: Optional[float] = Body(default=None),
    survivors: Optional[int] = Body(default=None),
    time: Optional[str] = Body(default=None),
):
    update_data = {
        k: v
        for k, v in {"LAT": lat, "LONG": long, "Survivors": survivors, "Time": time}.items()
        if v is not None
    }
    try:
        if not update_data:
            raise ValueError("No valid data provided for update")
        return await update(id, **update_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Route to delete an entry by ID
@router.delete("/delete/{id}", status_code=200)
async def delete_by_id(id: int):
    try:
        return await delete(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Route to read all entries
@router.get("/read", status_code=200)
async def read_all_records():
    try:
        return await read_all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Route to read an entry by ID
@router.get("/read/{id}", status_code=200)
async def read_record_by_id(id: int):
    try:
        return await read(id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create", status_code=200)
async def create_record(
    lat: float = Body(...),
    long: float = Body(...),
    survivors: int = Body(...),
    peso: int = Body(...),
):
    try:
        return await create(lat, long, survivors, peso)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))