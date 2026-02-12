import pytest
import pandas as pd
from app.agents.impact_agent import ImpactAgent
from app.agents.coordinator_agent import CoordinatorAgent

def test_impact_score_calculation():
    # Test Data: High Performer, Low Cost
    row = pd.Series({
        'PerformanceRating': 4,
        'TotalWorkingYears': 10,
        'YearsAtCompany': 5,
        'MonthlyIncome': 5000
    })
    
    # Global Maxima (Normalize against these)
    global_max = {
        'PerformanceRating': 4,
        'TotalWorkingYears': 20,
        'YearsAtCompany': 10,
        'MonthlyIncome': 20000
    }
    
    # Expected Calculation:
    # Perf: 4/4 = 1.0 * 0.35 = 0.35
    # Exp: 10/20 = 0.5 * 0.25 = 0.125
    # Tenure: 5/10 = 0.5 * 0.25 = 0.125
    # Cost: 5000/20000 = 0.25 * 0.15 = 0.0375
    # Total: 0.6375 -> 63.8 Score
    
    result = ImpactAgent.calculate_impact(row, global_max)
    assert result['score'] == 63.8
    assert result['category'] == "Important"

def test_impact_critical():
    # Test Data: Max everything
    row = pd.Series({
        'PerformanceRating': 4,
        'TotalWorkingYears': 20,
        'YearsAtCompany': 10,
        'MonthlyIncome': 20000
    })
    global_max = {
        'PerformanceRating': 4,
        'TotalWorkingYears': 20,
        'YearsAtCompany': 10,
        'MonthlyIncome': 20000
    }
    
    result = ImpactAgent.calculate_impact(row, global_max)
    assert result['score'] == 100.0
    assert result['category'] == "Critical"

def test_coordinator_integration_structure():
    # Mock Risk Logic via patching would be ideal, 
    # but here we just check if logic flow syntax is valid.
    pass
