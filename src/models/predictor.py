import os
import json
import joblib
import pandas as pd
import numpy as np
from src.utils.logger import get_logger

logger = get_logger(__name__)

class DiseasePredictor:
    def __init__(self, model_dir="models/v1", config_dir="config"):
        self.model = joblib.load(os.path.join(model_dir, "model_final_v1.pkl"))
        self.scaler = joblib.load(os.path.join(model_dir, "scaler_v1.pkl"))
        
        with open(os.path.join(model_dir, "feature_names_v1.json"), "r") as f:
            self.feature_names = json.load(f)
            
        with open(os.path.join(config_dir, "preprocessing_config.json"), "r") as f:
            self.config = json.load(f)
            
    def _validate_input(self, raw_data):
        required_keys = ['Pregnancies', 'Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI', 'DiabetesPedigreeFunction', 'Age']
        for key in required_keys:
            if key not in raw_data:
                raise ValueError(f"Missing required field: {key}")
        return pd.DataFrame([raw_data])
        
    def _preprocess(self, df):
        # 1. Replace 0 with median
        zero_cols = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
        for col in zero_cols:
            if df[col].iloc[0] == 0:
                df[col] = self.config['medians'][col]
                
        # 2. Cap Outliers
        cap_cols = ['Insulin', 'SkinThickness']
        for col in cap_cols:
            q01 = self.config['quantiles'][col]['q01']
            q99 = self.config['quantiles'][col]['q99']
            df[col] = np.clip(df[col], a_min=q01, a_max=q99)
            
        # 3. Engineer Features
        # Log transform
        for col in ['Insulin', 'DiabetesPedigreeFunction']:
            df[col] = np.log1p(df[col])
            
        # Derived features
        df['BMI_Category'] = np.select(
            [df['BMI'] < 18.5, (df['BMI'] >= 18.5) & (df['BMI'] < 25), (df['BMI'] >= 25) & (df['BMI'] < 30), df['BMI'] >= 30],
            [0, 1, 2, 3], default=1
        )
        df['Age_Group'] = np.select(
            [df['Age'] <= 30, (df['Age'] > 30) & (df['Age'] <= 45), (df['Age'] > 45) & (df['Age'] <= 60), df['Age'] > 60],
            [0, 1, 2, 3], default=0
        )
        df['Glucose_Category'] = np.select(
            [df['Glucose'] < 100, (df['Glucose'] >= 100) & (df['Glucose'] <= 125), df['Glucose'] > 125],
            [0, 1, 2], default=0
        )
        df['Glucose_BMI_Interaction'] = df['Glucose'] * df['BMI']
        df['Insulin_Resistance_Proxy'] = df['Glucose'] / (df['Insulin'] + 1)
        
        # 4. Reorder to match training exactly
        df = df[self.feature_names]
        
        # 5. Scale
        df_scaled = pd.DataFrame(self.scaler.transform(df), columns=self.feature_names)
        return df_scaled
        
    def predict(self, raw_data, threshold=0.35):
        df = self._validate_input(raw_data)
        df_processed = self._preprocess(df)
        
        prob = self.model.predict_proba(df_processed)[0][1]
        
        if prob < 0.35:
            risk = "LOW"
        elif prob < 0.65:
            risk = "MEDIUM"
        else:
            risk = "HIGH"
            
        prediction_name = "Diabetes" if prob >= threshold else "Healthy"
        
        return {
            "prediction": prediction_name,
            "confidence_score": float(prob),
            "risk_level": risk,
            "threshold_used": threshold
        }

if __name__ == "__main__":
    # Test prediction
    sample = {
        'Pregnancies': 2,
        'Glucose': 130,
        'BloodPressure': 80,
        'SkinThickness': 30,
        'Insulin': 120,
        'BMI': 28.5,
        'DiabetesPedigreeFunction': 0.4,
        'Age': 45
    }
    predictor = DiseasePredictor()
    result = predictor.predict(sample)
    logger.info(f"Test Prediction Result: {result}")
