# backend/services/my_service.py

import bentoml
from backend.services.router import register_predict_routes

# Criar serviço do bento ( nao sei pra q serve o nome mas tem q ter assim ent fdc)
svc = bentoml.Service("my_service")

# adicionar as rotas do roteador
register_predict_routes(svc)
