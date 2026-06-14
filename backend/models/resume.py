from pydantic import BaseModel
from typing import Optional, List

class Experience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    description: List[str] = []

class Education(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None

class Certyficates(BaseModel):
    title: str
    institution: str
    date_of_receive: str
    id: Optional[str] = None
    link: Optional[str] = None

class Resume(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    summary: Optional[str] = None
    certyficates: Optional[List[Certyficates]] = []
    experiences: List[Experience] = []
    education: List[Education] = []

class TailorRequest(BaseModel):
    base_resume_text: str
    job_description_text: str