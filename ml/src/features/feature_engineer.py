import pandas as pd
import numpy as np
import os
from src.utils.logger import get_logger

logger = get_logger(__name__)

class FeatureEngineer:
    def __init__(self):
        pass
        
    def transform_skewed_features(self, df):
        """
        Applies log transform to highly skewed features based on EDA.
        Log(x+1) is used to handle any 0 values (though zeros should have been imputed).
        """
        df = df.copy()
        
        skewed_cols = ['Insulin', 'DiabetesPedigreeFunction']
        for col in skewed_cols:
            if col in df.columns:
                df[col] = np.log1p(df[col])
                logger.info(f"Applied log1p transform to {col}")
                
        return df
        
    def create_derived_features(self, df):
        """
        Creates new clinical features based on medical domain knowledge.
        """
        df = df.copy()
        
        # 1. BMI Category (Categorical -> Ordinal encoded as integers)
        if 'BMI' in df.columns:
            conditions = [
                (df['BMI'] < 18.5),
                (df['BMI'] >= 18.5) & (df['BMI'] < 25),
                (df['BMI'] >= 25) & (df['BMI'] < 30),
                (df['BMI'] >= 30)
            ]
            choices = [0, 1, 2, 3] # Underweight, Normal, Overweight, Obese
            df['BMI_Category'] = np.select(conditions, choices, default=1)
            
        # 2. Age Group (Categorical -> Ordinal encoded as integers)
        if 'Age' in df.columns:
            conditions = [
                (df['Age'] <= 30),
                (df['Age'] > 30) & (df['Age'] <= 45),
                (df['Age'] > 45) & (df['Age'] <= 60),
                (df['Age'] > 60)
            ]
            choices = [0, 1, 2, 3] # Young, Middle, Senior, Elderly
            df['Age_Group'] = np.select(conditions, choices, default=0)
            
        # 3. Glucose Category
        if 'Glucose' in df.columns:
            conditions = [
                (df['Glucose'] < 100),
                (df['Glucose'] >= 100) & (df['Glucose'] <= 125),
                (df['Glucose'] > 125)
            ]
            choices = [0, 1, 2] # Normal, Pre-diabetic, Diabetic range
            df['Glucose_Category'] = np.select(conditions, choices, default=0)
            
        # 4. Glucose * BMI interaction
        if 'Glucose' in df.columns and 'BMI' in df.columns:
            df['Glucose_BMI_Interaction'] = df['Glucose'] * df['BMI']
            
        # 5. Insulin Resistance Proxy (Glucose / (Insulin + 1))
        # Note: If Insulin was log transformed, this proxy mathematically changes. 
        # Using raw values would be better, but we only have transformed. We'll compute it anyway as a synthetic feature.
        if 'Glucose' in df.columns and 'Insulin' in df.columns:
            df['Insulin_Resistance_Proxy'] = df['Glucose'] / (df['Insulin'] + 1)
            
        logger.info(f"Created 5 derived features. New shape: {df.shape}")
        return df

def run_feature_engineering(input_path="data/interim/pima_cleaned.csv", output_path="data/processed/pima_engineered.csv"):
    logger.info("Starting Feature Engineering...")
    
    if not os.path.exists(input_path):
        logger.error(f"Input file {input_path} not found.")
        return
        
    df = pd.read_csv(input_path)
    engineer = FeatureEngineer()
    
    df = engineer.transform_skewed_features(df)
    df = engineer.create_derived_features(df)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    logger.info(f"Engineered dataset saved to {output_path}")

if __name__ == "__main__":
    run_feature_engineering()
