import pandas as pd
import logging
from .risk_agent import RiskAgent
from .impact_agent import ImpactAgent

logger = logging.getLogger(__name__)

class SimulatorAgent:
    @staticmethod
    def simulate_change(employee: dict, changes: dict) -> dict:
        """
        Re-calculates Risk and Impact based on proposed changes.
        changes: {'MonthlyIncome': 5000, 'Promotion': True, 'RemoteWork': False, ...}
        """
        try:
            # 1. Base Prediction (Financial Factors)
            raw_data = employee.get('RawData', {})
            if not raw_data:
                return {"error": "Raw data not available for simulation."}
                
            # Create a DataFrame for prediction with financial updates
            simulated_data = raw_data.copy()
            
            # Apply financial changes if any (MonthlyIncome, etc applied to DF)
            if 'MonthlyIncome' in changes:
                simulated_data['MonthlyIncome'] = changes['MonthlyIncome']
            
            # Convert to DF and predict base risk
            df = pd.DataFrame([simulated_data])
            base_risk_result = RiskAgent.predict_risk(df)[0]
            
            # Log for debugging
            logger.info(f"Employee ID: {employee.get('EmployeeID', 'Unknown')}")
            logger.info(f"Original Risk: {employee.get('Risk', {}).get('Label', 'Unknown')}")
            logger.info(f"Base prediction probability: {base_risk_result['probability']}")
            
            # 2. Apply Retention Heuristics (Non-Financial Factors)
            # Start with the base prediction (which includes salary changes)
            current_prob = base_risk_result['probability']
            
            # Calculate salary increase percentage for heuristic
            original_income = raw_data.get('MonthlyIncome', 5000)
            new_income = changes.get('MonthlyIncome', original_income)
            salary_increase_pct = ((new_income - original_income) / original_income) * 100 if original_income > 0 else 0
            
            # Heuristic Multipliers (Impact on Attrition Probability)
            # Lower multiplier = stronger retention effect
            factors = []
            
            # Salary Impact: Each 10% increase reduces risk by ~15%
            if salary_increase_pct > 0:
                salary_multiplier = max(0.5, 1 - (salary_increase_pct * 0.005))  # Cap at 50% reduction
                current_prob *= salary_multiplier
                factors.append(f"Salary +{salary_increase_pct:.0f}%")
                logger.info(f"After salary adjustment: {current_prob}")
            
            if changes.get('Promotion'):
                current_prob *= 0.70  # 40% reduction - Very strong retention factor
                factors.append("Promotion")
                logger.info(f"After promotion: {current_prob}")
                
            if changes.get('RemoteWork'):
                current_prob *= 0.60 # 25% reduction - Strong work-life balance improvement
                factors.append("Remote Work")
                logger.info(f"After remote work: {current_prob}")
                
            if changes.get('Training'):
                current_prob *= 0.75  # 20% reduction - Career growth investment
                factors.append("Training")
                logger.info(f"After training: {current_prob}")
            
            # Ensure probability stays valid
            new_prob = max(0.01, min(0.99, current_prob))
            
            # Recalculate Label with adjusted thresholds
            new_label = "Low Risk"
            if new_prob > 0.6:
                new_label = "High Risk"
            elif new_prob > 0.35:
                new_label = "Medium Risk"
            
            logger.info(f"Final probability: {new_prob}, Label: {new_label}")
                
            return {
                "original_risk": employee['Risk']['Label'],
                "original_probability": employee['Risk'].get('Probability', 0.5),
                "new_risk": new_label,
                "new_probability": new_prob,
                "changes_applied": changes,
                "factors_considered": factors
            }
            
        except Exception as e:
            logger.error(f"Simulation failed: {e}")
            return {"error": str(e)}
