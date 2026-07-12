import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import RobustScaler
from src.utils.logger import get_logger

logger = get_logger(__name__)

def split_and_scale(input_path="data/processed/pima_engineered.csv", output_dir="data/processed", models_dir="models/v1"):
    logger.info("Starting Train/Test Split and Scaling...")
    
    if not os.path.exists(input_path):
        logger.error(f"Input file {input_path} not found.")
        return
        
    df = pd.read_csv(input_path)
    
    if 'Outcome' not in df.columns:
        logger.error("Target column 'Outcome' not found in dataset.")
        return
        
    X = df.drop(columns=['Outcome'])
    y = df['Outcome']
    
    # Save feature names order for inference
    feature_names = X.columns.tolist()
    os.makedirs(models_dir, exist_ok=True)
    with open(os.path.join(models_dir, "feature_names_v1.json"), "w") as f:
        json.dump(feature_names, f, indent=4)
    logger.info(f"Saved feature names: {feature_names}")
    
    # M3.6 Stratified train/test split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    logger.info(f"Train set shape: {X_train.shape}, Test set shape: {X_test.shape}")
    
    # M3.7 Fit RobustScaler on X_train ONLY, transform both
    scaler = RobustScaler()
    
    # We apply the scaler to all columns (including derived categorical ones) 
    # since tree-based models don't care, and linear models need scaled inputs anyway.
    X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=X_train.columns)
    X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=X_test.columns)
    
    # Save scaled sets
    os.makedirs(output_dir, exist_ok=True)
    X_train_scaled.to_csv(os.path.join(output_dir, "X_train.csv"), index=False)
    X_test_scaled.to_csv(os.path.join(output_dir, "X_test.csv"), index=False)
    y_train.to_csv(os.path.join(output_dir, "y_train.csv"), index=False)
    y_test.to_csv(os.path.join(output_dir, "y_test.csv"), index=False)
    logger.info("Saved X_train, X_test, y_train, y_test to data/processed/")
    
    # M3.8 Save fitted scaler
    scaler_path = os.path.join(models_dir, "scaler_v1.pkl")
    joblib.dump(scaler, scaler_path)
    logger.info(f"Saved fitted RobustScaler to {scaler_path}")
    
    # Note: SMOTE will be applied dynamically inside the CV loop in the modeling phase, 
    # to prevent data leakage. We do not save a static SMOTE dataset here.
    logger.info("Preprocessing complete.")

if __name__ == "__main__":
    split_and_scale()
