import pandas as pd
import numpy as np
import pytest
from src.features.feature_engineer import FeatureEngineer

@pytest.fixture
def sample_features():
    return pd.DataFrame({
        'Glucose': [90, 110, 150],
        'BMI': [20.0, 27.0, 32.0],
        'Age': [25, 40, 65],
        'Insulin': [50, 100, 200],
        'DiabetesPedigreeFunction': [0.2, 0.5, 0.8],
        'Outcome': [0, 1, 1]
    })

def test_transform_skewed_features(sample_features):
    engineer = FeatureEngineer()
    df = engineer.transform_skewed_features(sample_features)
    
    # Check log transformation
    assert df.loc[0, 'Insulin'] == np.log1p(50)
    assert df.loc[0, 'DiabetesPedigreeFunction'] == np.log1p(0.2)

def test_create_derived_features(sample_features):
    engineer = FeatureEngineer()
    df = engineer.create_derived_features(sample_features)
    
    # Check that new columns are created
    assert 'BMI_Category' in df.columns
    assert 'Age_Group' in df.columns
    assert 'Glucose_Category' in df.columns
    assert 'Glucose_BMI_Interaction' in df.columns
    assert 'Insulin_Resistance_Proxy' in df.columns
    
    # Check values for BMI category
    # < 18.5 -> 0, < 25 -> 1, < 30 -> 2, >= 30 -> 3
    assert df.loc[0, 'BMI_Category'] == 1
    assert df.loc[1, 'BMI_Category'] == 2
    assert df.loc[2, 'BMI_Category'] == 3
