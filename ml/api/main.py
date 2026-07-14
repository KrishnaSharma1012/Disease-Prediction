import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import logging

# Ensure the project root is in the python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.models.predictor import DiseasePredictor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="MediPredict ML Inference Service")

# Initialize the predictor (loads model and scaler into memory)
try:
    predictor = DiseasePredictor(model_dir="models/v1", config_dir="config")
    logger.info("Successfully loaded DiseasePredictor.")
except Exception as e:
    logger.error(f"Failed to load DiseasePredictor: {e}")
    predictor = None

class PredictionRequest(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float

@app.get("/health")
def health_check():
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "healthy"}

@app.post("/predict")
def predict(request: PredictionRequest):
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Convert Pydantic model to dict
        patient_data = request.model_dump()
        
        # Predict using a threshold of 0.35 as specified in docs
        result = predictor.predict(patient_data, threshold=0.35)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")

if __name__ == "__main__":
    uvicorn.run("ml_service.main:app", host="0.0.0.0", port=5000, reload=False)
