# backend/models/my_model.py

import joblib
import os

# !!Botei qlqr merda aq dps muda!!
class PeopleModel:
    def __init__(self, model_path=None):

        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 'model.pkl') # Caminho do modelo


        self.model = joblib.load(model_path)

    def predict(self, data):

        return self.model.predict(data)
