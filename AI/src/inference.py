# src/inference.py

import os
import joblib
import numpy as np
from typing import Tuple, Dict, Any
from src.utils import get_disease_to_specialty_map

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../models/disease_model.pkl")
SCALER_PATH = os.path.join(os.path.dirname(__file__), "../models/scaler.pkl")

_model = None
_scaler = None
_feature_cols = None

def load_artifacts(feature_cols: list):
    global _model, _scaler, _feature_cols
    if _model is None or _scaler is None or _feature_cols is None:
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
        _feature_cols = feature_cols

def preprocess_and_predict(
    sample: Dict[str, Any],
    feature_cols: list
) -> Tuple[str, str, float]:
    load_artifacts(feature_cols)

    try:
        X_new = np.array([sample[col] for col in _feature_cols], dtype=float).reshape(1, -1)
    except KeyError as e:
        raise ValueError(f"Thiếu feature '{e.args[0]}'")

    X_scaled = _scaler.transform(X_new)

    pred_proba = _model.predict_proba(X_scaled)[0]
    pred_idx = np.argmax(pred_proba)
    predicted_label = _model.classes_[pred_idx]
    confidence_score = float(pred_proba[pred_idx])

    mapping = get_disease_to_specialty_map()
    specialty_title = mapping.get(predicted_label, "Nội tổng quát")

    return predicted_label, specialty_title, confidence_score
