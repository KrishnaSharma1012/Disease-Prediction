import pytest
from src.models.predictor import DiseasePredictor

@pytest.fixture
def predictor():
    try:
        return DiseasePredictor(model_dir="models/v1", config_dir="config")
    except Exception as e:
        pytest.skip(f"Could not load predictor: {e}")

def test_api_contract_format(predictor):
    valid_data = {
        'Pregnancies': 0,
        'Glucose': 90,
        'BloodPressure': 70,
        'SkinThickness': 20,
        'Insulin': 80,
        'BMI': 22.5,
        'DiabetesPedigreeFunction': 0.2,
        'Age': 25
    }
    result = predictor.predict(valid_data, threshold=0.5)
    
    # Contract validation
    expected_keys = {"prediction", "confidence_score", "risk_level", "threshold_used"}
    assert set(result.keys()) == expected_keys
    assert isinstance(result["prediction"], str)
    assert isinstance(result["confidence_score"], float)
    assert isinstance(result["risk_level"], str)
    assert isinstance(result["threshold_used"], float)
    
    assert result["prediction"] in ["Diabetes", "Healthy"]
