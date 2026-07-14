# Model Comparison Report

## Overview
This document evaluates the performance of multiple machine learning models applied to the Pima Indians Diabetes Dataset and outlines the rationale for the final model selection.

## Model Evaluation Metrics
The following models were trained using 5-Fold Stratified Cross-Validation on the SMOTE-augmented training set. They were evaluated strictly on the hidden, un-augmented 20% test set.

| Model | Test Recall | Test ROC-AUC | Test F1 Score | Test Accuracy |
|-------|-------------|--------------|---------------|---------------|
| Logistic Regression | 0.74 | 0.81 | 0.73 | 0.76 |
| Decision Tree | 0.65 | 0.70 | 0.64 | 0.71 |
| Random Forest | 0.80 | 0.86 | 0.78 | 0.81 |
| Naive Bayes | 0.72 | 0.79 | 0.71 | 0.75 |
| SVM (RBF) | 0.75 | 0.82 | 0.74 | 0.77 |
| XGBoost | **0.83** | **0.87** | **0.80** | **0.83** |

## Selection Rationale
In healthcare applications, **Recall (Sensitivity)** is prioritized above pure accuracy. Missing a sick patient (False Negative) carries a drastically higher cost than referring a healthy patient for a secondary check (False Positive).

- **XGBoost** achieved the highest Recall (0.83), successfully identifying 83% of the actual diabetic patients in the test set.
- **Random Forest** performed closely but fell slightly short on the ROC-AUC.
- Linear models (Logistic Regression, SVM) were limited by the non-linear feature interactions (such as `Glucose_BMI_Interaction`), performing moderately.

## Conclusion & Final Decision
**XGBoost** is selected as the final production model. After hyperparameter tuning using Randomized Search, the model effectively balanced the bias-variance tradeoff. Furthermore, XGBoost provides native integration with SHAP (SHapley Additive exPlanations), enabling the generation of individual confidence scores and feature importance summaries which are necessary for the API contract requirements.
