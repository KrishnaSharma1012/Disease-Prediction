import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from sklearn.ensemble import RandomForestClassifier
from src.utils.logger import get_logger

logger = get_logger(__name__)

# Ensure figures directory exists
FIGURES_DIR = "reports/figures"
os.makedirs(FIGURES_DIR, exist_ok=True)

# Plotting configuration
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_context("paper", font_scale=1.2)

def load_data(filepath="data/interim/pima_cleaned.csv"):
    if not os.path.exists(filepath):
        logger.error(f"File not found: {filepath}")
        return None
    return pd.read_csv(filepath)

def plot_target_distribution(df, target_col="Outcome"):
    logger.info("Plotting target distribution...")
    plt.figure(figsize=(8, 6))
    ax = sns.countplot(x=target_col, data=df, palette="viridis")
    plt.title("Target Distribution (0 = No Diabetes, 1 = Diabetes)")
    
    # Add counts above bars
    for p in ax.patches:
        ax.annotate(f'{int(p.get_height())}', (p.get_x() + p.get_width() / 2., p.get_height()),
                    ha='center', va='center', xytext=(0, 5), textcoords='offset points')
        
    plt.savefig(os.path.join(FIGURES_DIR, "target_distribution.png"), bbox_inches="tight", dpi=300)
    plt.close()

def plot_histograms(df, target_col="Outcome"):
    logger.info("Plotting feature histograms...")
    features = [col for col in df.columns if col != target_col]
    
    fig, axes = plt.subplots(nrows=3, ncols=3, figsize=(15, 12))
    axes = axes.flatten()
    
    for i, feature in enumerate(features):
        sns.histplot(data=df, x=feature, hue=target_col, kde=True, ax=axes[i], palette="viridis", alpha=0.6)
        axes[i].set_title(f"Distribution of {feature}")
        
    # Remove the extra empty subplot if 8 features
    if len(features) < len(axes):
        for j in range(len(features), len(axes)):
            fig.delaxes(axes[j])
            
    plt.tight_layout()
    plt.savefig(os.path.join(FIGURES_DIR, "histograms.png"), bbox_inches="tight", dpi=300)
    plt.close()

def plot_boxplots(df, target_col="Outcome"):
    logger.info("Plotting feature boxplots...")
    features = [col for col in df.columns if col != target_col]
    
    fig, axes = plt.subplots(nrows=3, ncols=3, figsize=(15, 12))
    axes = axes.flatten()
    
    for i, feature in enumerate(features):
        sns.boxplot(data=df, x=target_col, y=feature, ax=axes[i], palette="viridis")
        axes[i].set_title(f"Boxplot of {feature} by Class")
        
    if len(features) < len(axes):
        for j in range(len(features), len(axes)):
            fig.delaxes(axes[j])
            
    plt.tight_layout()
    plt.savefig(os.path.join(FIGURES_DIR, "boxplots_by_class.png"), bbox_inches="tight", dpi=300)
    plt.close()

def plot_correlation_heatmap(df):
    logger.info("Plotting correlation heatmap...")
    plt.figure(figsize=(10, 8))
    corr = df.corr()
    
    # Generate a mask for the upper triangle
    mask = np.triu(np.ones_like(corr, dtype=bool))
    
    sns.heatmap(corr, mask=mask, annot=True, fmt=".2f", cmap="coolwarm", vmin=-1, vmax=1, square=True)
    plt.title("Feature Correlation Heatmap")
    plt.savefig(os.path.join(FIGURES_DIR, "correlation_heatmap.png"), bbox_inches="tight", dpi=300)
    plt.close()

def plot_pairplot(df, top_features, target_col="Outcome"):
    logger.info(f"Plotting pairplot for top features: {top_features}...")
    cols = top_features + [target_col]
    
    # Suppress warnings for seaborn pairplot KDE
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        g = sns.pairplot(df[cols], hue=target_col, palette="viridis", corner=True, plot_kws={'alpha':0.5})
        g.fig.suptitle("Pairplot of Top 4 Features", y=1.02)
        plt.savefig(os.path.join(FIGURES_DIR, "pairplot_top4.png"), bbox_inches="tight", dpi=300)
        plt.close()

def compute_feature_importance(df, target_col="Outcome"):
    logger.info("Computing Random Forest feature importance...")
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X, y)
    
    importances = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=False)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x=importances.values, y=importances.index, palette="viridis")
    plt.title("Random Forest Feature Importance (Quick Evaluation)")
    plt.xlabel("Gini Importance Score")
    plt.savefig(os.path.join(FIGURES_DIR, "feature_importance.png"), bbox_inches="tight", dpi=300)
    plt.close()
    
    logger.info(f"Top 4 features: {importances.index[:4].tolist()}")
    return importances.index[:4].tolist()

def run_eda_pipeline():
    logger.info("Starting EDA Pipeline...")
    df = load_data()
    
    if df is not None:
        plot_target_distribution(df)
        plot_histograms(df)
        plot_boxplots(df)
        plot_correlation_heatmap(df)
        
        # Determine top features using quick RF and plot pairplot
        top_4_features = compute_feature_importance(df)
        plot_pairplot(df, top_4_features)
        
        logger.info("EDA Pipeline complete. All figures saved to reports/figures/")

if __name__ == "__main__":
    run_eda_pipeline()
