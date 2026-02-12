# HR Decision Support System - Backend

Production-grade FastAPI backend for Employee Attrition Prediction.

## Directory Structure
- `app/`: Main application code.
- `app/agents/`: Logic modules (Risk, Impact, SHAP, Coordinator).
- `app/api/`: API Routes.
- `models/`: Directory for ML models.

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Place Model File**
   Ensure your trained model is located at:
   `backend/models/Ensemble_Model.pkl`
   
   > **Note**: The application will fail to start predictions if this file is missing.

3. **Run Server**
   ```bash
   uvicorn app.main:app --reload
   ```

## API Documentation
Once running, visit `http://localhost:8000/docs` for the interactive Swagger UI.

## Testing
Run unit tests (requires `pytest`):
```bash
pytest
```
