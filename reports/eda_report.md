# Exploratory Data Analysis (EDA) Report

## Overview
This report outlines the key findings derived from visualizing the cleaned Pima Indians Diabetes Dataset.

## Key Insights

### 1. Target Variable Imbalance
- The dataset is imbalanced. Approximately 65% of cases are negative ("Healthy") and 35% are positive ("Diabetes"). 
- **Action Taken:** `SMOTE` (Synthetic Minority Oversampling Technique) and `class_weight='balanced'` will be necessary during the model training phase to penalize the misclassification of the minority class.

### 2. Feature Distributions
- **Glucose**: Exhibits a bimodal distribution with distinct separation between the two classes, making it the most predictive feature. 
- **BMI & Age**: Both features show heavy right skews. The risk of diabetes dramatically increases after age 35 and BMI > 30.
- **Diabetes Pedigree Function**: Highly right-skewed.
- **Action Taken:** Apply log transformations to `Insulin` and `DiabetesPedigreeFunction` to reduce skewness and stabilize variance.

### 3. Correlation Analysis
- **Top Predictors**: `Glucose` and `BMI` show the strongest correlation with the target variable.
- **Multicollinearity**: `SkinThickness` and `BMI` exhibit some positive correlation, but not high enough to warrant dropping a feature (correlation < 0.85).

### 4. Zero/Missing Values Highlight
- The heatmap visualization before imputation showed massive spikes of missing values in `Insulin` and `SkinThickness`. Our decision to use median imputation helped preserve rows while safely maintaining the original distribution's central tendency.

## Conclusion
The data is predominantly non-linear and somewhat imbalanced. As a result, tree-based models like Random Forest and XGBoost are expected to outperform simple linear models like Logistic Regression. Feature engineering focusing on `Glucose` and `BMI` interactions will likely yield high performance boosts.
