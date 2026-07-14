import numpy as np
import matplotlib.pyplot as plt
import seaborn as plt_sns
import os
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, roc_curve

FIGURES_DIR = "reports/figures"
os.makedirs(FIGURES_DIR, exist_ok=True)

def evaluate_model(model, X_test, y_test, threshold=0.35):
    """
    Evaluates a model and returns standard metrics.
    Uses a custom threshold (default 0.35) for healthcare priority (Recall).
    """
    if hasattr(model, "predict_proba"):
        y_prob = model.predict_proba(X_test)[:, 1]
    else:
        # Fallback for models without predict_proba (e.g., hard SVM)
        y_prob = model.predict(X_test)
        
    y_pred = (y_prob >= threshold).astype(int)
    
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred),
        'f1': f1_score(y_test, y_pred),
        'roc_auc': roc_auc_score(y_test, y_prob)
    }
    
    return metrics, y_pred, y_prob

def plot_roc_curves(models_dict, X_test, y_test):
    plt.figure(figsize=(10, 8))
    
    for name, model in models_dict.items():
        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test)[:, 1]
            fpr, tpr, _ = roc_curve(y_test, y_prob)
            auc = roc_auc_score(y_test, y_prob)
            plt.plot(fpr, tpr, label=f"{name} (AUC = {auc:.3f})")
            
    plt.plot([0, 1], [0, 1], 'k--', label='Random Guess')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate (Recall)')
    plt.title('ROC Curves Comparison')
    plt.legend(loc='lower right')
    plt.savefig(os.path.join(FIGURES_DIR, "roc_curves_all_models.png"), bbox_inches="tight", dpi=300)
    plt.close()

def plot_confusion_matrices(models_dict, X_test, y_test, threshold=0.35):
    n_models = len(models_dict)
    fig, axes = plt.subplots(1, n_models, figsize=(5 * n_models, 4))
    
    if n_models == 1:
        axes = [axes]
        
    for ax, (name, model) in zip(axes, models_dict.items()):
        if hasattr(model, "predict_proba"):
            y_prob = model.predict_proba(X_test)[:, 1]
        else:
            y_prob = model.predict(X_test)
            
        y_pred = (y_prob >= threshold).astype(int)
        cm = confusion_matrix(y_test, y_pred)
        
        plt_sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax, cbar=False)
        ax.set_title(f"{name} (Threshold: {threshold})")
        ax.set_xlabel("Predicted Label")
        ax.set_ylabel("True Label")
        
    plt.tight_layout()
    plt.savefig(os.path.join(FIGURES_DIR, "confusion_matrices.png"), bbox_inches="tight", dpi=300)
    plt.close()
