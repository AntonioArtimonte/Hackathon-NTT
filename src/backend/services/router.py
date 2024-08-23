# backend/services/predict_router.py

from bentoml import Service
from bentoml.io import JSON, NumpyNdarray
from backend.models.model import PeopleModel

# Instanciando o modelo
model_instance = PeopleModel()

def register_predict_routes(svc: Service):
    @svc.api(input=NumpyNdarray(), output=JSON(), route="/api/predict")
    def predict(input_array):
        predictions = model_instance.predict(input_array)
        return {"predictions": predictions.tolist()}
