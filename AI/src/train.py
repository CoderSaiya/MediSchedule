import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score
import joblib

def load_dataset(path: str) -> pd.DataFrame:
    return pd.read_csv(path)

def split_features_labels(df: pd.DataFrame, label_col: str = "disease_label"):
    feature_cols = [c for c in df.columns if c != label_col]
    X = df[feature_cols].values
    y = df[label_col].values
    return X, y, feature_cols

def main():
    data_path = os.path.join(os.path.dirname(__file__), "../data/training_data.csv")
    df = load_dataset(data_path)

    # Tách X / y (X gồm 11 feature + disease_label)
    X, y, feature_cols = split_features_labels(df, label_col="disease_label")

    # Chia train/test (stratify=y để giữ tỉ lệ mỗi nhãn)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Scale
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # MLPClassifier đa lớp (15 classes)
    mlp = MLPClassifier(
        hidden_layer_sizes=(128, 64),
        activation="relu",
        solver="adam",
        batch_size=32,
        max_iter=300,
        random_state=42,
        verbose=True,
    )

    # Train
    mlp.fit(X_train_scaled, y_train)

    # Đánh giá
    y_pred = mlp.predict(X_test_scaled)
    print("==== Classification Report ====")
    print(classification_report(y_test, y_pred, zero_division=0))
    print("==== Accuracy ====", accuracy_score(y_test, y_pred))

    # Lưu model + scaler
    models_dir = os.path.join(os.path.dirname(__file__), "../models")
    os.makedirs(models_dir, exist_ok=True)
    model_path = os.path.join(models_dir, "disease_model.pkl")
    scaler_path = os.path.join(models_dir, "scaler.pkl")
    joblib.dump(mlp, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"Saved trained model to: {model_path}")
    print(f"Saved scaler to: {scaler_path}")

if __name__ == "__main__":
    main()