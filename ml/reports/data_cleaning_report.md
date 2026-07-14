# Data Cleaning Report

## Overview
This report documents the data cleaning decisions and transformations applied to the Pima Indians Diabetes Dataset.

## Initial Data Assessment
- **Dataset Size**: 768 rows, 9 columns.
- **Problem**: Missing values in this dataset are encoded as `0`. This is biologically impossible for features such as Glucose, BloodPressure, SkinThickness, Insulin, and BMI.

## Cleaning Steps Executed

### 1. Duplicate Removal
- **Action**: Removed duplicate rows.
- **Reason**: Duplicate entries introduce bias into the training dataset and over-represent specific instances.

### 2. Zero Imputation
- **Action**: Replaced zero values with the median of the respective columns (`Glucose`, `BloodPressure`, `SkinThickness`, `Insulin`, `BMI`).
- **Reason**: `0` is an invalid biological measurement for these metrics. We used the median rather than the mean to prevent extreme outliers (particularly in `Insulin`) from skewing the imputed values.

### 3. Outlier Capping
- **Action**: Capped `Insulin` and `SkinThickness` at the 1st and 99th percentiles.
- **Reason**: Extreme values in these features disproportionately affect model performance, especially in linear models.

### 4. Domain Validation
- **Action**: Ensured all features fall within acceptable medical boundaries (e.g., `Glucose` between 44 and 300, `Age` between 18 and 100).
- **Reason**: Out-of-domain values act as noise and could disrupt generalization.

## Output
The cleaned dataset `data/interim/pima_cleaned.csv` is now ready for Exploratory Data Analysis (EDA) and Feature Engineering. The medians and quantiles used for capping are saved to `config/preprocessing_config.json` so they can be accurately reapplied during production inference.
