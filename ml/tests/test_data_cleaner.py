import pandas as pd
import numpy as np
import pytest
from src.data.data_cleaner import PimaDataCleaner

@pytest.fixture
def sample_data():
    return pd.DataFrame({
        'Pregnancies': [1, 2, 0, 25], # 25 is out of bounds
        'Glucose': [0, 100, 150, 400], # 0 is invalid, 400 is out of bounds
        'BloodPressure': [80, 0, 90, 200], # 0 is invalid, 200 is out of bounds
        'SkinThickness': [0, 20, 30, 150], # 0 is invalid, 150 is out of bounds
        'Insulin': [0, 100, 200, 1000], # 0 is invalid, 1000 is out of bounds
        'BMI': [25.0, 0.0, 30.0, 90.0], # 0 is invalid, 90 is out of bounds
        'DiabetesPedigreeFunction': [0.1, 0.5, 0.8, 1.2],
        'Age': [20, 30, 40, -5] # -5 is out of bounds
    })

def test_remove_duplicates():
    cleaner = PimaDataCleaner()
    df = pd.DataFrame({'A': [1, 1, 2], 'B': [3, 3, 4]})
    clean_df = cleaner.remove_duplicates(df)
    assert len(clean_df) == 2

def test_replace_zeros_with_median(sample_data):
    cleaner = PimaDataCleaner()
    df = cleaner.replace_zeros_with_median(sample_data, is_training=True)
    
    # Check that zeros are gone for the zero_columns
    for col in cleaner.zero_columns:
        assert (df[col] == 0).sum() == 0

def test_validate_domains(sample_data):
    cleaner = PimaDataCleaner()
    df = cleaner.validate_domains(sample_data)
    
    assert df['Pregnancies'].max() <= 20
    assert df['Glucose'].max() <= 300
    assert df['BloodPressure'].max() <= 180
    assert df['SkinThickness'].max() <= 120
    assert df['Insulin'].max() <= 900
    assert df['BMI'].max() <= 80
    assert df['Age'].min() >= 18
