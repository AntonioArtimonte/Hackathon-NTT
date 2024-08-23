# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import routers

app = FastAPI()

origins = ["*"]

# Permite o CORS para testes, pode retirar antes do deploy
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Adiciona prefixo /api nos roteadores
app.include_router(routers.router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, port=8000)
