import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models import ApplicationStatus


class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str


class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: ApplicationStatus = ApplicationStatus.wishlist
    source: str | None = None
    job_url: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    applied_at: datetime | None = None


class ApplicationOut(BaseModel):
    id: uuid.UUID
    company: str
    role: str
    status: ApplicationStatus
    source: str | None = None
    job_url: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    applied_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ApplicationUpdate(BaseModel):
    company: str | None = None
    role: str | None = None
    status: ApplicationStatus | None = None
    source: str | None = None
    job_url: str | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    applied_at: datetime | None = None

class ContactCreate(BaseModel):
    name: str
    email: EmailStr | None = None
    linkedin_url: str | None = None
    title: str | None = None


class ContactOut(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr | None = None
    linkedin_url: str | None = None
    title: str | None = None

    model_config = ConfigDict(from_attributes=True)

class ContactUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    linkedin_url: str | None = None
    title: str | None = None

class InteractionCreate(BaseModel):
    type: str
    notes: str | None = None

class InteractionOut(BaseModel):
    id: uuid.UUID
    type: str
    notes: str | None = None
    occurred_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)

class InteractionUpdate(BaseModel):
    type: str | None = None
    notes: str | None = None

class ExtractedRequirements(BaseModel):
    required_skills: list[str] = []
    preferred_skills: list[str] = []
    years_experience: str | None = None
    education: str | None = None
    responsibilities: list[str] = []
    keywords: list[str] = []

class ParseJDRequest(BaseModel):
    job_description: str


class CoverLetterRequest(BaseModel):
    candidate_background: str

class CoverLetterResponse(BaseModel):
    cover_letter: str
