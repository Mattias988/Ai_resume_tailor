from typing import TypedDict
from models.resume import Resume


class GraphState(TypedDict):
    base_resume_text: str
    job_description_text: str
    final_resume: Resume