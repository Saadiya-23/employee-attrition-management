import pandas as pd
from typing import List, Dict
import logging
from .risk_agent import RiskAgent
from .impact_agent import ImpactAgent
from .shap_agent import SHAPAgent

logger = logging.getLogger(__name__)

class CoordinatorAgent:
    @staticmethod
    def process_data(df: pd.DataFrame) -> List[Dict]:
        results = []
        
        # 1. Pre-calculate global maxima for Impact Agent
        # We use the dataset's max values for normalization
        global_maxima = {
            'PerformanceRating': df['PerformanceRating'].max(),
            'TotalWorkingYears': df['TotalWorkingYears'].max(),
            'YearsAtCompany': df['YearsAtCompany'].max(),
            'MonthlyIncome': df['MonthlyIncome'].max()
        }

        # 2. Bulk Predict Risk (Optimization)
        # It's faster to predict in bulk if model allows, but for clarity/error handling 
        # inside agents, we'll iterate or batch.
        # RiskAgent.predict_risk takes the whole dataframe.
        try:
            risk_results = RiskAgent.predict_risk(df)
        except Exception as e:
            logger.error(f"Batch prediction failing, attempting row-by-row or aborting: {e}")
            raise e

        # 3. Iterate and Coordinate
        for idx, row in df.iterrows():
            try:
                # Merge logic
                risk_data = risk_results[idx]
                risk_prob = risk_data['probability']
                risk_label = risk_data['risk_label']
                
                # Calculate Impact
                impact_data = ImpactAgent.calculate_impact(row, global_maxima)
                impact_score = impact_data['score']
                
                # Priority Score
                # PriorityScore = (AttritionRiskProbability × 0.6) + (ImpactScoreNormalized × 0.4)
                # impact_score is 0-100, so we normalize to 0-1
                priority_score = (risk_prob * 0.6) + ((impact_score / 100.0) * 0.4)
                
                # Explainability
                # Only compute SHAP for High/Medium risk to save time? 
                # User asked for "GET /employees/{id} ... Human-readable summary"
                # We can compute it lazily or pre-compute. for usage simplicity, let's pre-compute.
                reasons = SHAPAgent.explain_risk(df, idx)
                
                # Construct Employee Result
                employee_result = {
                    "EmployeeID": str(row.get('EmployeeID', idx)),
                    "Name": row.get('Name', f"Employee {row.get('EmployeeID', idx)}"),
                    "Department": row.get('Department', 'Unknown'),
                    "Risk": {
                        "Label": risk_label,
                        "Probability": float(risk_prob) # Internal use only
                    },
                    "Impact": impact_data,
                    "PriorityScore": float(round(priority_score * 100, 1)),
                    "KeyFactors": reasons,
                    "RecommendedActions": CoordinatorAgent._recommend_actions(risk_label, impact_data['category']),
                    "RawData": row.to_dict() # Store for simulation
                }
                
                results.append(employee_result)
                
            except Exception as e:
                logger.error(f"Error processing row {idx}: {e}")
                continue
                
        # Sort by Priority Score Descending
        results.sort(key=lambda x: x['PriorityScore'], reverse=True)
        return results

    @staticmethod
    def _recommend_actions(risk_label, impact_category):
        actions = []
        
        if risk_label == "High Risk":
            if impact_category == "Critical":
                actions.append("IMMEDIATE: Schedule 1-on-1 retention interview with VP/Director.")
                actions.append("Prepare counter-offer or role expansion proposal.")
            else:
                actions.append("Schedule check-in meeting to discuss career path.")
        
        elif risk_label == "Medium Risk":
             actions.append("Review recent workload and feedback.")
             actions.append("Ensure regular recognition of contributions.")
             
        if impact_category == "Critical":
            actions.append("Draft succession plan immediately.")
            
        if not actions:
            actions.append("Monitor during regular review cycles.")
            
        return actions
