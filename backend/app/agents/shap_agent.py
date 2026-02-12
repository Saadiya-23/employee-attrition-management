import shap
import pandas as pd
import numpy as np
import logging
from .risk_agent import RiskAgent

logger = logging.getLogger(__name__)

class SHAPAgent:
    _explainer = None

    @classmethod
    def get_explainer(cls, background_data=None):
        # In a real scenario, we'd initialize the explainer once with training data.
        # Here we might need to initialize it lazily or use a lightweight background.
        model = RiskAgent.load_model()
        
        # Check if we can use TreeExplainer (fast)
        if cls._explainer is None:
            try:
                cls._explainer = shap.TreeExplainer(model)
                logger.info("Initialized TreeExplainer")
            except Exception:
                try:
                    # Fallback to explainer that handles generic models
                    # Using a small summary of background data if provided, else just the model
                    # For production, we usually pickle the explainer too.
                    # Here we might fallback to generic if specific explainer fails.
                    logger.warning("TreeExplainer failed. Explainability might be slow or limited without training data background.")
                    # We will create a new explainer per batch if needed or try to persist.
                    # For this implementation, we will try-catch the explanation process.
                    pass
                except Exception as e:
                    logger.error(f"Failed to initialize SHAP explainer: {e}")
        
        return cls._explainer

    @staticmethod
    def explain_risk(data: pd.DataFrame, row_index: int) -> list:
        """
        Returns top 3 factors for a specific employee.
        """
        try:
            model = RiskAgent.load_model()
            row = data.iloc[[row_index]]
            
            # ATTEMPT SHAP
            # Note: Computing SHAP on the fly for heavy ensembles can be slow.
            # We'll try a fast approximation or KernelExplainer with small background if needed.
            
            # Heuristic/Fallback Logic immediately if model is complex pipeline not compatible with simple usage
            # For the purpose of this defined task where we have "Ensemble_Model.pkl" without X_train:
            
            # 1. Try simple feature contribution analysis (e.g. TreeExplainer)
            try:
                explainer = shap.TreeExplainer(model)
                shap_values = explainer.shap_values(row)
                
                # shap_values might be list (for classifier) or array
                if isinstance(shap_values, list):
                    # For binary classification, usually index 1 is positive class
                    vals = shap_values[1][0]
                else:
                    vals = shap_values[0]
                    
                feature_names = data.columns
                
                # Create (feature, score) pairs
                contributions = zip(feature_names, vals)
                # Sort by absolute impact (or positive impact for attrition risk?)
                # Usually we want to know what pushes risk UP.
                positive_contributions = [(f, v) for f, v in contributions if v > 0]
                positive_contributions.sort(key=lambda x: x[1], reverse=True)
                
                top_factors = positive_contributions[:3]
                
                return [SHAPAgent._humanize_reason(f, v, row.iloc[0]) for f, v in top_factors]

            except Exception as e:
                logger.warning(f"SHAP explanation failed: {e}. Falling back to heuristic.")
                return SHAPAgent._heuristic_explanation(row.iloc[0])

        except Exception as e:
            logger.error(f"Explainability Agent Error: {e}")
            return ["Review generic risk factors."]

    @staticmethod
    def _heuristic_explanation(row):
        """
        Fallback if SHAP fails. Logic based on common attrition drivers.
        """
        reasons = []
        if row.get('OverTime') == 'Yes' or row.get('OverTime') == 1:
            reasons.append("Working overtime may lead to burnout.")
        
        if row.get('MonthlyIncome', 5000) < 3000:
             reasons.append("Compensation is lower than market benchmark.") # simplified
             
        if row.get('YearsAtCompany', 5) < 2:
            reasons.append("New hires are statistically more volatile.")
            
        if row.get('DistanceFromHome', 0) > 20:
            reasons.append("Long commute time.")
            
        if row.get('WorkLifeBalance', 3) == 1:
            reasons.append("Poor work-life balance reported.")

        if not reasons:
            reasons.append("Combination of tenure and role factors.")
            
        return reasons[:3]

    @staticmethod
    def _humanize_reason(feature, value, row_data):
        # Convert feature name + value to English
        val = row_data.get(feature, "")
        
        map_names = {
            "OverTime": "Excessive overtime",
            "MonthlyIncome": "Compensation level",
            "DistanceFromHome": "Commute distance",
            "TotalWorkingYears": "Career tenure",
            "EnvironmentSatisfaction": "Work environment satisfaction",
            "JobSatisfaction": "Job satisfaction score",
            "WorkLifeBalance": "Work-life balance",
            "YearsSinceLastPromotion": "Time since last promotion"
        }
        
        friendly_name = map_names.get(feature, feature)
        return f"{friendly_name} is a contributing factor."
