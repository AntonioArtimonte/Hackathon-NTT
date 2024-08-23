# backend/services/my_service.py

import bentoml
from bentoml.io import JSON, NumpyNdarray
import numpy as np

# Define the BentoML service
svc = bentoml.Service("my_service")

# Endpoint to echo back the input JSON
@svc.api(input=JSON(), output=JSON())
def echo(input_json):
    return {"message": "Echo response", "input": input_json}

# Endpoint to add 1 to each element of a numpy array
@svc.api(input=NumpyNdarray(), output=JSON())
def add_one(input_array):
    result = input_array + 1
    return {"result": result.tolist()}
