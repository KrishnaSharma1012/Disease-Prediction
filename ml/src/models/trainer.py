import os
import pandas as pd
import numpy as np
import json
import joblib
import mlflow
import mlflow.sklearn
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.model_selection import cross_validate, StratifiedKFold
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE
from src.utils.logger import get_logger
from src.models.evaluator import evaluate_model, plot_roc_curves, plot_confusion_matrices

logger = get_logger(__name__)

MODELS = {
    "LogisticRegression": LogisticRegression(random_state=42, max_iter=1000),
    "DecisionTree": DecisionTreeClassifier(random_state=42),
    "RandomForest": RandomForestClassifier(random_state=42, n_estimators=100),
    "NaiveBayes": GaussianNB(),
    "SVM": SVC(probability=True, random_state=42),
    "XGBoost": XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss')
}

def load_processed_data(data_dir="data/processed"):
    X_train = pd.read_csv(os.path.join(data_dir, "X_train.csv"))
    X_test = pd.read_csv(os.path.join(data_dir, "X_test.csv"))
    y_train = pd.read_csv(os.path.join(data_dir, "y_train.csv"))['Outcome']
    y_test = pd.read_csv(os.path.join(data_dir, "y_test.csv"))['Outcome']
    return X_train, X_test, y_train, y_test

def train_and_evaluate_models():
    logger.info("Starting Model Training Pipeline...")
    X_train, X_test, y_train, y_test = load_processed_data()
    
    # Calculate scale_pos_weight for XGBoost
    neg_count = sum(y_train == 0)
    pos_count = sum(y_train == 1)
    scale_pos_weight = neg_count / pos_count
    
    MODELS["XGBoost"].set_params(scale_pos_weight=scale_pos_weight)
    
    mlflow.set_experiment("Disease_Prediction_Baseline")
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    trained_models = {}
    
    for name, model in MODELS.items():
        logger.info(f"Training {name}...")
        
        with mlflow.start_run(run_name=f"{name}_Baseline"):
            # Create pipeline with SMOTE
            # We apply class_weight='balanced' where applicable instead of SMOTE for linear models,
            # but to be uniform and test SMOTE, we'll use it in the pipeline.
            # XGBoost handles imbalance well with scale_pos_weight, but we will still test SMOTE.
            
            pipeline = ImbPipeline([
                ('smote', SMOTE(random_state=42)),
                ('classifier', model)
            ])
            
            # Cross-validation (SMOTE is applied only on training folds internally)
            cv_results = cross_validate(
                pipeline, X_train, y_train, cv=cv, scoring=['roc_auc', 'recall', 'f1', 'accuracy'], n_jobs=-1
            )
            
            # Train final model on full training set
            pipeline.fit(X_train, y_train)
            trained_models[name] = pipeline
            
            # Evaluate on test set
            metrics, y_pred, y_prob = evaluate_model(pipeline, X_test, y_test)
            
            # Log to MLflow
            mlflow.log_param("model_type", name)
            mlflow.log_param("uses_smote", True)
            
            # Log CV metrics
            mlflow.log_metric("cv_mean_auc", cv_results['test_roc_auc'].mean())
            mlflow.log_metric("cv_mean_recall", cv_results['test_recall'].mean())
            
            # Log Test metrics
            for k, v in metrics.items():
                mlflow.log_metric(f"test_{k}", v)
                
            # Save model internally in MLflow
            mlflow.sklearn.log_model(pipeline, "model", serialization_format="cloudpickle")
            
            logger.info(f"{name} Results - Test Recall: {metrics['recall']:.4f}, Test AUC: {metrics['roc_auc']:.4f}")

    # Generate comparative plots
    plot_roc_curves(trained_models, X_test, y_test)
    
    # Plot confusion matrix for top 3 (based on a quick check, usually XGB, RF, LR)
    top_models = {k: trained_models[k] for k in ["XGBoost", "RandomForest", "LogisticRegression"] if k in trained_models}
    plot_confusion_matrices(top_models, X_test, y_test)
    
    logger.info("Baseline training and evaluation complete.")

if __name__ == "__main__":
    train_and_evaluate_models()
