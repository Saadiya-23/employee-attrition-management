import pandas as pd
import joblib
import os
import logging

import logging
import sklearn.compose 

# --- SKLEARN COMPATIBILITY PATCH ---
# Fix for loading models trained on scikit-learn < 1.2 in newer versions
try:
    import sklearn.compose._column_transformer
    if not hasattr(sklearn.compose._column_transformer, '_RemainderColsList'):
        class _RemainderColsList:
            pass
        sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList
except ImportError:
    pass
# -----------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RiskAgent:
    _model = None

    @classmethod
    def load_model(cls):
        model_path = os.path.join(os.path.dirname(__file__), '../../models/Ensemble_Model.pkl')
        model_path = os.path.normpath(model_path)
        
        if cls._model is None:
            if not os.path.exists(model_path):
                logger.error(f"Model file not found at: {model_path}")
                raise FileNotFoundError(f"Model file missing! Expected at: {model_path}")
            
            try:
                cls._model = joblib.load(model_path)
                logger.info("Ensemble model loaded successfully.")
            except Exception as e:
                logger.error(f"Failed to load model: {e}")
                raise RuntimeError(f"Could not load model: {e}")
        return cls._model

    @staticmethod
    def predict_risk(data: pd.DataFrame):
        try:
            model = RiskAgent.load_model()
            # Predict probability (class 1 is attrition)
            # Assumption: model.predict_proba returns [n_samples, 2] array
            probs = model.predict_proba(data)[:, 1]
            
            results = []
            for prob in probs:
                if prob >= 0.7:
                    label = "High Risk"
                elif prob >= 0.4:
                    label = "Medium Risk"
                else:
                    label = "Low Risk"
                results.append({"probability": prob, "risk_label": label})
            
            return results
        except Exception as e:
            logger.error(f"Prediction failed: {e}")
            raise e
