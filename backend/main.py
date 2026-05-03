from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from models.resume import TailorRequest
from ai.graph import app_graph

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/tailor")
async def tailor_resume(request: TailorRequest):
    initial_state = {
        "base_resume_text": request.base_resume_text,
        "job_description_text": request.job_description_text
    }

    result = app_graph.invoke(initial_state)
    return result["final_resume"]