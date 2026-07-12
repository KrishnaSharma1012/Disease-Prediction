import os
import shap
import joblib
import pandas as pd
import matplotlib.pyplot as plt
from src.utils.logger import get_logger

logger = get_logger(__name__)

FIGURES_DIR = "reports/figures"

def generate_shap_plots(model_path="models/v1/model_final_v1.pkl", data_dir="data/processed"):
    logger.info("Generating SHAP explanations...")
    
    if not os.path.exists(model_path):
        logger.error(f"Model not found at {model_path}")
        return
        
    model = joblib.load(model_path)
    X_test = pd.read_csv(os.path.join(data_dir, "X_test.csv"))
    
    # Extract the actual classifier from the imblearn pipeline
    if hasattr(model, "named_steps"):
        # The pipeline has steps. We assume the classifier is the last step.
        classifier = model.steps[-1][1]
    else:
        classifier = model
        
    # Tree explainer is best for RF/XGBoost
    try:
        explainer = shap.TreeExplainer(classifier)
        shap_values = explainer.shap_values(X_test)
        
        # XGBoost returns single array for binary classification, RF returns list of arrays
        if isinstance(shap_values, list):
            shap_values = shap_values[1] # Use positive class
            
        # Summary Plot
        plt.figure(figsize=(10, 8))
        shap.summary_plot(shap_values, X_test, show=False)
        plt.title("SHAP Summary Plot")
        plt.savefig(os.path.join(FIGURES_DIR, "shap_summary.png"), bbox_inches="tight", dpi=300)
        plt.close()
        
        # Decision Plot / Waterfall alternative for top 3 instances
        # To avoid issues with waterfall needing Explanation object in newer shap versions,
        # we'll use force_plot saved as html or a simple bar plot.
        # Since we need PNG, we'll plot a simple bar chart of global importance from SHAP.
        
        shap_sum = np.abs(shap_values).mean(axis=0)
        importance_df = pd.DataFrame([X_test.columns.tolist(), shap_sum.tolist()]).T
        importance_df.columns = ['Feature', 'SHAP_Importance']
        importance_df = importance_df.sort_values('SHAP_Importance', ascending=False)
        
        plt.figure(figsize=(10, 6))
        import seaborn as sns
        sns.barplot(x='SHAP_Importance', y='Feature', data=importance_df, palette="viridis")
        plt.title("Global Feature Importance (SHAP)")
        plt.savefig(os.path.join(FIGURES_DIR, "shap_global_importance.png"), bbox_inches="tight", dpi=300)
        plt.close()
        
        logger.info("SHAP plots generated successfully in reports/figures/")
        
    except Exception as e:
        logger.error(f"Could not generate SHAP plots for this model type: {e}")

if __name__ == "__main__":
    import numpy as np # imported locally for safety
    generate_shap_plots()
