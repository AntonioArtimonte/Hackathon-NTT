# backend/models/my_model.py

import joblib
import os

class MyModel:
    def __init__(self, model_path=None):
        # Default path to the model file
        if model_path is None:
            model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')

        # Load the model from the file
        self.model = joblib.load(model_path)

    def predict(self, data):
        # Make a prediction using the loaded model
        return self.model.predict(data)
