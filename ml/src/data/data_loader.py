import os
import pandas as pd
from sklearn.datasets import fetch_openml
from src.utils.logger import get_logger

logger = get_logger(__name__)

def fetch_pima_dataset(save_dir="data/raw"):
    """
    Fetches the Pima Indians Diabetes dataset from OpenML and saves it as CSV.
    """
    logger.info("Fetching Pima dataset from OpenML...")
    try:
        # Pima dataset ID on OpenML is 37
        dataset = fetch_openml(data_id=37, as_frame=True, parser='auto')
        df = dataset.frame
        
        # Rename columns to match the standard Kaggle Pima dataset
        column_mapping = {
            'preg': 'Pregnancies',
            'plas': 'Glucose',
            'pres': 'BloodPressure',
            'skin': 'SkinThickness',
            'insu': 'Insulin',
            'mass': 'BMI',
            'pedi': 'DiabetesPedigreeFunction',
            'age': 'Age'
        }
        df.rename(columns=column_mapping, inplace=True)
        
        # Map target variable to 0 and 1, and rename to 'Outcome'
        if 'class' in df.columns:
            df['Outcome'] = df['class'].map({'tested_negative': 0, 'tested_positive': 1})
            df.drop(columns=['class'], inplace=True)
            
        # Ensure the directory exists
        os.makedirs(save_dir, exist_ok=True)
        
        # Save to CSV
        save_path = os.path.join(save_dir, "pima_diabetes_raw.csv")
        df.to_csv(save_path, index=False)
        logger.info(f"Dataset successfully saved to {save_path}")
        logger.info(f"Dataset shape: {df.shape}")
        
    except Exception as e:
        logger.error(f"Failed to fetch dataset: {e}")
        raise

if __name__ == "__main__":
    fetch_pima_dataset()
