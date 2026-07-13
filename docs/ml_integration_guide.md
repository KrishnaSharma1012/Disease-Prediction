# ML Integration Guide for Backend (FastAPI / Express)

This guide provides instructions for integrating the trained ML model (`model_final_v1.pkl`) and its associated preprocessing artifacts into the backend service.

## Artifacts Needed
All required artifacts are located in the `models/v1` and `config` directories:
1. **Model**: `models/v1/model_final_v1.pkl`
2. **Scaler**: `models/v1/scaler_v1.pkl`
3. **Feature Names**: `models/v1/feature_names_v1.json`
4. **Preprocessing Config**: `config/preprocessing_config.json`

## Python / FastAPI Integration
We have already provided a ready-to-use Python class: `DiseasePredictor` located in `src/models/predictor.py`.

### 1. Initialization
You should initialize the predictor **once** when your application starts to keep the model loaded in memory.
```python
from src.models.predictor import DiseasePredictor

# Initialize globally or via Dependency Injection
predictor = DiseasePredictor(model_dir="models/v1", config_dir="config")
```

### 2. Making a Prediction
When your `/predict` endpoint is hit, simply pass the raw JSON dictionary to the `.predict()` method.

```python
@app.post("/predict")
def predict_disease(patient_data: dict):
    try:
        # Default threshold is 0.35 for healthcare sensitivity
        result = predictor.predict(patient_data, threshold=0.35)
        return result
    except ValueError as e:
        return {"error": str(e)}, 400
```

## Troubleshooting & Important Notes
- **Never fit the scaler during inference**: The `predictor.py` script specifically calls `.transform()` on the loaded scaler. Re-fitting will cause incorrect predictions.
- **Missing Values**: The frontend should attempt to collect all values. If a value comes in as `0` for fields like `Insulin` or `Glucose`, the `DiseasePredictor` will automatically impute it using the training dataset medians.
- **Model Upgrades**: When a new model `v2` is trained, you will need to update the directory references or load the new `.pkl` files and `feature_names_v2.json`.
