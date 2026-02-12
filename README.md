# 🎯 Employee Attrition Prediction & Decision Support System

A production-grade AI-powered HR analytics platform that predicts employee attrition risk, analyzes impact, and provides actionable retention strategies. Built with FastAPI, React, and machine learning.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-19.2.0-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-latest-green.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Model Information](#model-information)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

This system helps HR teams and business leaders make data-driven decisions about employee retention by:

- **Predicting attrition risk** for each employee using ensemble machine learning models
- **Analyzing business impact** of potential departures (Critical, High, Medium, Low)
- **Identifying key risk factors** using SHAP (SHapley Additive exPlanations) values
- **Simulating interventions** to test retention strategies before implementation
- **Generating personalized retention emails** using AI
- **Comparing employees** side-by-side for strategic decision-making
- **Calculating ROI** for retention initiatives

---

## ✨ Key Features

### 🔍 **Risk Assessment**
- Multi-level risk classification (High, Medium, Low)
- Real-time prediction on employee data upload
- Department-wise risk breakdown

### 💼 **Impact Analysis**
- Business impact scoring based on:
  - Performance rating
  - Years of experience
  - Tenure at company
  - Monthly income (proxy for seniority)
- Critical talent identification

### 📊 **Explainable AI**
- SHAP-based feature importance for each prediction
- Top 5 risk factors per employee
- Visual explanations for model decisions

### 🎮 **Retention Simulator**
- Test "what-if" scenarios before implementing changes
- Simulate salary increases, promotions, work-life balance improvements
- See predicted risk changes in real-time

### 💬 **AI Chat Assistant**
- Context-aware Q&A about your workforce data
- Natural language insights
- Strategic recommendations

### 📧 **Email Generator**
- AI-powered personalized retention emails
- Customizable tone and content
- Based on individual risk factors

### 📈 **Comparison View**
- Side-by-side employee analysis
- Risk and impact comparison
- Strategic decision support

### 💰 **ROI Calculator**
- Calculate cost of attrition vs. retention investment
- Data-driven budget planning

---

## 🛠️ Tech Stack

### **Backend**
- **FastAPI** - Modern, high-performance Python web framework
- **Pandas & NumPy** - Data processing and analysis
- **Scikit-learn** - Machine learning models
- **SHAP** - Model explainability
- **Joblib** - Model serialization

### **Frontend**
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **React Dropzone** - File upload

### **Machine Learning**
- Ensemble model (Random Forest, Gradient Boosting, etc.)
- SHAP for interpretability
- Feature engineering pipeline

---

## 📁 Project Structure

```
employee-attrition/
├── backend/
│   ├── app/
│   │   ├── agents/
│   │   │   ├── coordinator_agent.py    # Orchestrates all analysis
│   │   │   ├── risk_agent.py           # Attrition risk prediction
│   │   │   ├── impact_agent.py         # Business impact scoring
│   │   │   ├── shap_agent.py           # SHAP explainability
│   │   │   ├── simulator_agent.py      # What-if simulations
│   │   │   └── chat_agent.py           # AI chat assistant
│   │   ├── api/
│   │   │   └── routes.py               # API endpoints
│   │   └── main.py                     # FastAPI app entry point
│   ├── models/
│   │   └── Ensemble_Model.pkl          # Trained ML model (required)
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx           # Main dashboard
│   │   │   ├── Upload.jsx              # File upload
│   │   │   ├── EmployeeList.jsx        # Employee table
│   │   │   ├── EmployeeDetail.jsx      # Individual analysis
│   │   │   ├── Simulator.jsx           # Retention simulator
│   │   │   ├── ComparisonView.jsx      # Side-by-side comparison
│   │   │   ├── EmailGenerator.jsx      # AI email writer
│   │   │   ├── ROICalculator.jsx       # ROI analysis
│   │   │   ├── ChatWidget.jsx          # AI assistant
│   │   │   └── Sidebar.jsx             # Navigation
│   │   ├── App.jsx
│   │   ├── api.js                      # API client
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
├── .env                                # Environment variables
├── .gitignore
└── README.md                           # This file
```

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **Node.js 16+** and **npm** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- A trained ML model file (`Ensemble_Model.pkl`) - see [Model Information](#model-information)

---

## 🚀 Installation & Setup

### **1. Clone the Repository**

```bash
git clone <your-repo-url>
cd employee-attrition
```

### **2. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Place your trained model
# Ensure Ensemble_Model.pkl is in backend/models/
# If you don't have a model, see Model Information section
```

### **3. Frontend Setup**

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### **4. Environment Variables (Optional)**

Create a `.env` file in the project root if you need custom configuration:

```env
# Backend
BACKEND_PORT=8000
BACKEND_HOST=0.0.0.0

# Frontend
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 🎯 Usage Guide

### **Starting the Application**

#### **Option 1: Run Both Services Separately**

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### **Option 2: Quick Start (Both Services)**

```bash
# From project root, you can run both in separate terminals
# Or use a process manager like concurrently (install separately)
```

### **Accessing the Application**

- **Frontend UI:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)

### **Step-by-Step Workflow**

1. **Upload Employee Data**
   - Click "Upload Dataset" in the sidebar
   - Upload a CSV or Excel file with employee data
   - Supported columns: EmployeeID, Name, MonthlyIncome, TotalWorkingYears, YearsAtCompany, PerformanceRating, etc.
   - The system auto-maps common column variations

2. **View Dashboard**
   - See overall risk breakdown (High/Medium/Low)
   - Identify critical talent at risk
   - Review top risk factors across organization
   - Explore department-wise risk distribution

3. **Analyze Individual Employees**
   - Click on any employee in the list
   - View detailed risk assessment
   - See SHAP-based key risk factors
   - Understand business impact score

4. **Simulate Retention Strategies**
   - Navigate to "Retention Simulator"
   - Select an employee
   - Adjust factors (salary, work-life balance, job satisfaction, etc.)
   - See predicted risk change in real-time

5. **Compare Employees**
   - Use "Comparison View" to analyze 2 employees side-by-side
   - Make strategic decisions about retention investments

6. **Generate Retention Emails**
   - Use the AI Email Generator
   - Customize tone and content
   - Get personalized retention messages

7. **Calculate ROI**
   - Use ROI Calculator to justify retention budgets
   - Input costs and see break-even analysis

8. **Ask Questions**
   - Use the AI Chat Assistant (bottom-right corner)
   - Ask about workforce trends, risk factors, recommendations

---

## 📚 API Documentation

### **Key Endpoints**

#### **Upload Data**
```http
POST /api/v1/upload
Content-Type: multipart/form-data

Body: file (CSV or Excel)
```

#### **Get Dashboard Summary**
```http
GET /api/v1/dashboard/summary

Response:
{
  "total_employees": 150,
  "risk_breakdown": {"High": 20, "Medium": 45, "Low": 85},
  "critical_talent": 8,
  "department_risk": {...},
  "top_risk_factors": [...],
  "insights": [...]
}
```

#### **Get All Employees**
```http
GET /api/v1/employees

Response: Array of employee objects with risk, impact, and factors
```

#### **Get Employee Detail**
```http
GET /api/v1/employees/{employee_id}

Response: Detailed employee analysis
```

#### **Simulate Risk Change**
```http
POST /api/v1/simulate
Content-Type: application/json

Body:
{
  "employee_id": "EMP001",
  "changes": {
    "MonthlyIncome": 75000,
    "JobSatisfaction": 4,
    "WorkLifeBalance": 3
  }
}

Response:
{
  "original_risk": 0.75,
  "new_risk": 0.42,
  "risk_change": -0.33,
  "recommendation": "..."
}
```

#### **Chat with AI Assistant**
```http
POST /api/v1/chat
Content-Type: application/json

Body:
{
  "message": "What are the top risk factors?",
  "history": []
}

Response:
{
  "response": "Based on your data, the top risk factors are..."
}
```

For complete API documentation, visit http://localhost:8000/docs when the backend is running.

---

## 🤖 Model Information

### **Required Model File**

The application requires a trained ensemble model saved as:
```
backend/models/Ensemble_Model.pkl
```

### **Model Requirements**

- **Type:** Scikit-learn compatible classifier
- **Format:** Joblib-serialized pickle file
- **Expected Features:** The model should be trained on employee features like:
  - Age, MonthlyIncome, TotalWorkingYears, YearsAtCompany
  - JobSatisfaction, WorkLifeBalance, PerformanceRating
  - DistanceFromHome, NumCompaniesWorked, etc.

### **Training Your Own Model**

If you need to train a model:

1. Prepare your historical employee data with attrition labels
2. Train an ensemble classifier (Random Forest, Gradient Boosting, etc.)
3. Save using joblib:
   ```python
   import joblib
   joblib.dump(model, 'backend/models/Ensemble_Model.pkl')
   ```
4. Ensure feature names match what the application expects

### **Sample Data Format**

Your CSV/Excel upload should include columns like:

| EmployeeID | Name | Age | MonthlyIncome | TotalWorkingYears | YearsAtCompany | PerformanceRating | JobSatisfaction | WorkLifeBalance |
|------------|------|-----|---------------|-------------------|----------------|-------------------|-----------------|-----------------|
| EMP001 | John Doe | 35 | 65000 | 10 | 5 | 3 | 4 | 3 |
| EMP002 | Jane Smith | 28 | 52000 | 6 | 2 | 4 | 2 | 2 |

**Note:** The system is lenient with column names and will auto-map common variations (e.g., "salary" → "MonthlyIncome").

---

## 🧪 Testing

### **Backend Tests**

```bash
cd backend
pytest
```

### **Manual Testing**

1. Use the provided sample data file (`temp_data (2).csv`) for testing
2. Upload through the UI and verify all features work
3. Check API responses in Swagger UI (http://localhost:8000/docs)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **SHAP Library** for model interpretability
- **FastAPI** for the excellent web framework
- **React Team** for the powerful UI library
- **Scikit-learn** for machine learning tools

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Contact the development team
- Check the API documentation at `/docs`

---

## 🔮 Future Enhancements

- [ ] Multi-tenant support with database persistence
- [ ] Advanced time-series risk trend analysis
- [ ] PDF report generation
- [ ] Integration with HR systems (Workday, BambooHR, etc.)
- [ ] Mobile app for on-the-go insights
- [ ] Real-time alerts for high-risk employees
- [ ] A/B testing framework for retention strategies

---

**Built with ❤️ for better HR decision-making**
