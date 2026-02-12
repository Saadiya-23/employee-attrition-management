import pandas as pd
import numpy as np

class ImpactAgent:
    @staticmethod
    def calculate_impact(row: pd.Series, global_maxima: dict) -> dict:
        """
        Calculates the Business Impact Score (0-100) and Category.
        
        Formula:
        ImpactScore = (Perf * 0.35) + (Exp * 0.25) + (Tenure * 0.25) + (Cost * 0.15)
        
        All factors are normalized by the global maxima from the uploaded dataset.
        """
        
        # 1. Normalize Factors
        # Avoid division by zero
        max_perf = global_maxima.get('PerformanceRating', 4) or 4
        max_exp = global_maxima.get('TotalWorkingYears', 1) or 1
        max_tenure = global_maxima.get('YearsAtCompany', 1) or 1
        max_income = global_maxima.get('MonthlyIncome', 1) or 1
        
        norm_perf = row.get('PerformanceRating', 1) / max_perf
        norm_exp = row.get('TotalWorkingYears', 0) / max_exp
        norm_tenure = row.get('YearsAtCompany', 0) / max_tenure
        norm_income = row.get('MonthlyIncome', 0) / max_income
        
        # Clip to 1.0 just in case
        norm_perf = min(norm_perf, 1.0)
        norm_exp = min(norm_exp, 1.0)
        norm_tenure = min(norm_tenure, 1.0)
        norm_income = min(norm_income, 1.0)
        
        # 2. Compute Weighted Score
        raw_score = (
            (norm_perf * 0.35) +
            (norm_exp * 0.25) +
            (norm_tenure * 0.25) +
            (norm_income * 0.15)
        )
        
        # 3. Scale to 0-100
        impact_score = round(raw_score * 100, 1)
        
        # 4. Categorize
        if impact_score >= 70:
            category = "Critical"
        elif impact_score >= 40:
            category = "Important"
        else:
            category = "Standard"
            
        return {
            "score": impact_score,
            "category": category,
            "explanation": ImpactAgent._generate_explanation(impact_score, category, row)
        }

    @staticmethod
    def _generate_explanation(score, category, row):
        if category == "Critical":
            return "High value due to strong performance and extensive institutional knowledge."
        elif category == "Important":
            return "Valuable contributor with significant experience."
        else:
            return "Standard business impact role."
