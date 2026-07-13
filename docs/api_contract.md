# API Contract: Disease Prediction Service

This document describes the expected input and output format for the ML prediction API.

## Endpoint
**POST** `/predict`

## Request format (Input)
The API expects a JSON payload containing exactly 8 numerical features. 

```json
{
  "Pregnancies": 2,
  "Glucose": 130.0,
  "BloodPressure": 80.0,
  "SkinThickness": 30.0,
  "Insulin": 120.0,
  "BMI": 28.5,
  "DiabetesPedigreeFunction": 0.4,
  "Age": 45
}
```

### Constraints
- All fields are **required**.
- If a value is unknown for `Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, or `BMI`, the frontend may send `0`. The ML pipeline will automatically impute this value using the training data median.
- Missing keys will result in a HTTP 400 error.

## Response format (Output)
The API returns a JSON payload containing the prediction results, risk levels, and confidence scores.

```json
{
  "prediction": "Diabetes",
  "confidence_score": 0.87,
  "risk_level": "HIGH",
  "threshold_used": 0.35
}
```

### Definitions
- **prediction**: A string representation of the model's classification. Values: `"Diabetes"` or `"Healthy"`.
- **confidence_score**: A float between 0.0 and 1.0 representing the raw probability output by the model.
- **risk_level**: Categorical interpretation of the probability.
  - `LOW`: Score < 0.35
  - `MEDIUM`: Score between 0.35 and 0.65
  - `HIGH`: Score >= 0.65
- **threshold_used**: The classification threshold applied to map probabilities to the final prediction. Currently set to `0.35` for higher recall in healthcare settings.
