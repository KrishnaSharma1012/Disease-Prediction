import pandas as pd
import numpy as np
import os
import json
from src.utils.logger import get_logger

logger = get_logger(__name__)

class PimaDataCleaner:
    def __init__(self):
        # Columns where 0 is biologically impossible
        self.zero_columns = ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']
        self.medians = {}
        self.quantiles = {}
        
    def remove_duplicates(self, df):
        logger.info(f"Shape before deduplication: {df.shape}")
        df = df.drop_duplicates(keep='first')
        logger.info(f"Shape after deduplication: {df.shape}")
        return df
        
    def replace_zeros_with_median(self, df, is_training=True):
        """
        Replaces 0s with median in specific columns.
        During training, computes and stores the medians.
        During inference, uses the stored medians.
        """
        df = df.copy()
        
        # Replace 0 with NaN temporarily
        for col in self.zero_columns:
            if col in df.columns:
                df[col] = df[col].replace(0, np.nan)
            
        if is_training:
            # Calculate medians on this dataset
            for col in self.zero_columns:
                if col in df.columns:
                    self.medians[col] = df[col].median()
            logger.info(f"Computed medians for imputation: {self.medians}")
            
        # Impute
        for col in self.zero_columns:
            if col in df.columns and col in self.medians:
                df[col] = df[col].fillna(self.medians[col])
                
        return df

    def cap_outliers(self, df, columns=['Insulin', 'SkinThickness'], is_training=True):
        """
        Caps outliers at the 1st and 99th percentiles.
        During training, computes the percentiles.
        During inference, uses stored percentiles.
        """
        df = df.copy()
        
        if is_training:
            # Calculate 1st and 99th percentiles
            for col in columns:
                if col in df.columns:
                    q01 = df[col].quantile(0.01)
                    q99 = df[col].quantile(0.99)
                    self.quantiles[col] = {'q01': q01, 'q99': q99}
            logger.info(f"Computed outlier caps: {self.quantiles}")
            
        # Apply capping
        for col in columns:
            if col in df.columns and col in self.quantiles:
                q01 = self.quantiles[col]['q01']
                q99 = self.quantiles[col]['q99']
                df[col] = np.clip(df[col], a_min=q01, a_max=q99)
                
        return df

    def validate_domains(self, df):
        """
        Ensures data values fall within biologically valid domains.
        """
        df = df.copy()
        # Domain boundaries for the features
        domain_rules = {
            'Pregnancies': (0, 20),
            'Glucose': (44, 300),
            'BloodPressure': (30, 180),
            'SkinThickness': (7, 120),
            'Insulin': (14, 900),
            'BMI': (10, 80),
            'Age': (18, 100)
        }
        
        for col, (min_val, max_val) in domain_rules.items():
            if col in df.columns:
                out_of_bounds = df[(df[col] < min_val) | (df[col] > max_val)]
                if not out_of_bounds.empty:
                    logger.warning(f"Found {len(out_of_bounds)} rows out of domain bounds for {col}. Capping to boundaries.")
                    df[col] = np.clip(df[col], a_min=min_val, a_max=max_val)
                    
        return df

    def save_config(self, filepath="config/preprocessing_config.json"):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        config = {
            "medians": self.medians,
            "quantiles": self.quantiles
        }
        with open(filepath, 'w') as f:
            json.dump(config, f, indent=4)
        logger.info(f"Saved preprocessing config to {filepath}")


def run_cleaning_pipeline(input_path="data/raw/pima_diabetes_raw.csv", output_path="data/interim/pima_cleaned.csv"):
    logger.info("Starting Data Cleaning Pipeline...")
    
    if not os.path.exists(input_path):
        logger.error(f"Input file {input_path} not found.")
        return
        
    df = pd.read_csv(input_path)
    cleaner = PimaDataCleaner()
    
    # Remove duplicates
    df = cleaner.remove_duplicates(df)
    
    # Replace zeros
    df = cleaner.replace_zeros_with_median(df, is_training=True)
    
    # Cap outliers
    df = cleaner.cap_outliers(df, columns=['Insulin', 'SkinThickness'], is_training=True)
    
    # Validate domains
    df = cleaner.validate_domains(df)
    
    # Save output
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    logger.info(f"Cleaned dataset saved to {output_path}")
    
    # Save config
    cleaner.save_config()
    logger.info("Data Cleaning Pipeline complete.")

if __name__ == "__main__":
    run_cleaning_pipeline()
