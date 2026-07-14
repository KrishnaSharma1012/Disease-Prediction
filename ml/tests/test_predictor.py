import pytest
from src.models.predictor import DiseasePredictor

@pytest.fixture
def predictor():
    try:
        return DiseasePredictor(model_dir="models/v1", config_dir="config")
    except Exception as e:
        pytest.skip(f"Could not load predictor: {e}")

def test_predictor_missing_fields(predictor):
    incomplete_data = {
        'Glucose': 130,
        'Age': 45
    }
    with pytest.raises(ValueError, match="Missing required field"):
        predictor.predict(incomplete_data)

def test_predictor_valid_input(predictor):
    valid_data = {
        'Pregnancies': 2,
        'Glucose': 130,
        'BloodPressure': 80,
        'SkinThickness': 30,
        'Insulin': 120,
        'BMI': 28.5,
        'DiabetesPedigreeFunction': 0.4,
        'Age': 45
    }
    result = predictor.predict(valid_data)
    
    assert "prediction" in result
    assert "confidence_score" in result
    assert "risk_level" in result
    assert "threshold_used" in result
    
    assert result["risk_level"] in ["LOW", "MEDIUM", "HIGH"]
    assert 0.0 <= result["confidence_score"] <= 1.0
