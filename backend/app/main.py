from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import routes

app = FastAPI(
    title="HR Decision Support System",
    description="Backend for Employee Attrition Prediction & Analysis",
    version="1.0.0"
)

# CORS Configuration
# Allow all for development simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(routes.router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "ok", "service": "HR Analytics Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
