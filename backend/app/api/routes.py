from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict
import pandas as pd
import io
import shutil
import shutil
from ..agents.coordinator_agent import CoordinatorAgent
from ..agents.chat_agent import ChatAgent
from ..agents.simulator_agent import SimulatorAgent

router = APIRouter()

# In-memory storage for the session
# In production, this would be a database (PostgreSQL/Redis)
SESSION_DB = {
    "employees": [],
    "summary": {}
}

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Support CSV and Excel types
    allowed_types = [
        "text/csv", 
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
        "application/vnd.ms-excel",
        "application/pdf"
    ]
    
    # Check extension as fallback if content-type is generic
    filename = file.filename.lower()
    is_csv = filename.endswith('.csv')
    is_excel = filename.endswith(('.xls', '.xlsx'))
    is_pdf = filename.endswith('.pdf')

    if not (is_csv or is_excel or is_pdf):
         raise HTTPException(status_code=400, detail=f"Unsupported file format. Please upload CSV or Excel. detected: {file.filename}")
    
    try:
        content = await file.read()
        file_obj = io.BytesIO(content)
        
        if is_csv:
            df = pd.read_csv(file_obj)
        elif is_excel:
            df = pd.read_excel(file_obj)
        elif is_pdf:
            raise HTTPException(
                status_code=400, 
                detail="PDF Upload Detected. Please convert your PDF data to Excel (XLSX) or CSV format for analysis."
            )

        # --- LENIENT COLUMN MATCHING ---
        # Map common variations to standard names
        column_map = {
            'employee id': 'EmployeeID', 'id': 'EmployeeID', 'employee_id': 'EmployeeID',
            'monthly income': 'MonthlyIncome', 'income': 'MonthlyIncome', 'salary': 'MonthlyIncome',
            'total working years': 'TotalWorkingYears', 'experience': 'TotalWorkingYears', 'working years': 'TotalWorkingYears',
            'years at company': 'YearsAtCompany', 'tenure': 'YearsAtCompany', 'years in company': 'YearsAtCompany',
            'performance rating': 'PerformanceRating', 'rating': 'PerformanceRating', 'performance': 'PerformanceRating',
            'name': 'Name', 'employee name': 'Name'
        }
        
        # Normalize columns: lower case -> check map -> rename
        df.columns = [column_map.get(c.lower().strip(), c) for c in df.columns]

        # Handle Missing Critical Columns with Defaults or Generation
        if 'EmployeeID' not in df.columns:
            # Generate IDs if missing
            df['EmployeeID'] = [f"GEN-{i+1000}" for i in range(len(df))]
        
        # Ensure numeric types for calculation columns (fill NaN with 0 or mean)
        calc_cols = ['MonthlyIncome', 'TotalWorkingYears', 'YearsAtCompany', 'PerformanceRating']
        for col in calc_cols:
            if col not in df.columns:
                # If a critical calc column is missing, we can't score Impact accurately, 
                # but we shouldn't block the upload. We'll add it with default.
                df[col] = 0
            else:
                # Force numeric, coerce errors to NaN, then fill
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

        # Process with Coordinator
        results = CoordinatorAgent.process_data(df)
        
        # Store results
        SESSION_DB["employees"] = results
        
        # Compute Summary
        total = len(results)
        risks = [r['Risk']['Label'] for r in results]
        high = risks.count("High Risk")
        medium = risks.count("Medium Risk")
        low = risks.count("Low Risk")
        critical = len([r for r in results if r['Impact']['category'] == "Critical"])
        
        # --- NEW AGGREGATIONS ---
        # 1. Risk by Department
        dept_risk = {}
        for r in results:
            dept = r['Department']
            if r['Risk']['Label'] == 'High Risk':
                dept_risk[dept] = dept_risk.get(dept, 0) + 1
        
        # 2. Top Risk Factors (Systemic Issues)
        factor_counts = {}
        for r in results:
            if r['Risk']['Label'] in ['High Risk', 'Medium Risk']:
                for factor in r['KeyFactors']:
                    # clean up factor string if needed
                    factor_counts[factor] = factor_counts.get(factor, 0) + 1
        
        # Sort and take top 5
        top_factors = sorted(factor_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        SESSION_DB["summary"] = {
            "total_employees": total,
            "risk_breakdown": {"High": high, "Medium": medium, "Low": low},
            "critical_talent": critical,
            "department_risk": dept_risk,
            "top_risk_factors": top_factors, # List of (factor, count)
            "insights": _generate_insights(results)
        }
        
        return {"message": "File processed successfully", "count": total}
        
    except HTTPException as he:
        # Re-raise HTTP exceptions to preserve status code and detail
        raise he
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Corrupt or malformed file. Could not parse data.")
    except Exception as e:
        # Catch-all for other errors
        raise HTTPException(status_code=500, detail=f"System Error: {str(e)}")

@router.get("/dashboard/summary")
def get_summary():
    if not SESSION_DB["summary"]:
        # Return empty state if no data
        return {
            "total_employees": 0,
            "risk_breakdown": {"High": 0, "Medium": 0, "Low": 0},
            "critical_talent": 0,
            "insights": ["Please upload a dataset to generate insights."]
        }
    return SESSION_DB["summary"]

@router.get("/employees")
def get_employees():
    # Returns lightweight list for table view
    # Filter sensitive/large data if needed, but for now return all
    return SESSION_DB["employees"]

@router.get("/employees/{employee_id}")
def get_employee_detail(employee_id: str):
    emp = next((e for e in SESSION_DB["employees"] if e["EmployeeID"] == employee_id), None)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp

def _generate_insights(results):
    insights = []
    
    # 1. High Risk Volume
    high_risk = [r for r in results if r['Risk']['Label'] == "High Risk"]
    if len(high_risk) > 0:
        pct = (len(high_risk) / len(results)) * 100
        insights.append(f"{len(high_risk)} employees ({int(pct)}%) are identified as High Risk.")
        
    # 2. Critical Risk
    critical_risk = [r for r in high_risk if r['Impact']['category'] == "Critical"]
    if critical_risk:
        insights.append(f"URGENT: {len(critical_risk)} Critical Impact employees are at High Risk of leaving.")
        
    # 3. Driver Analysis (Simple aggregation of top factor)
    # Collect all factors
    all_reasons = []
    for r in high_risk:
        all_reasons.extend(r.get('KeyFactors', []))
    
    if all_reasons:
        # Find most common reason text (naive counting)
        from collections import Counter
        common = Counter(all_reasons).most_common(1)
        if common:
            insights.append(f"Primary attrition driver appears to be: {common[0][0]}.")
            
    if not insights:
        insights.append("Workforce stability looks good. Validated against current model.")
        
    return insights[:3]

# --- NEW ENDPOINTS ---
from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    history: List[Dict] = []

@router.post("/chat")
def chat_with_agent(req: ChatRequest):
    # Pass summary context
    context = SESSION_DB.get("summary", {})
    response = ChatAgent.chat(req.history + [{"role": "user", "content": req.message}], context)
    return {"response": response}

class SimulationRequest(BaseModel):
    employee_id: str
    changes: Dict

@router.post("/simulate")
def simulate_risk(req: SimulationRequest):
    # Find employee
    emp = next((e for e in SESSION_DB["employees"] if e["EmployeeID"] == req.employee_id), None)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    result = SimulatorAgent.simulate_change(emp, req.changes)
    return result
