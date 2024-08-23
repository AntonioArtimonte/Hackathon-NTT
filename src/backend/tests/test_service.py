# backend/tests/test_my_service.py

from backend.services.my_service import svc
from bentoml.testing import simulate_json_request

def test_echo_endpoint():
    response = simulate_json_request(svc, "/api/endpoint", {"key": "value"})
    assert response.json() == {"message": "Custom API endpoint response", "input": {"key": "value"}}
