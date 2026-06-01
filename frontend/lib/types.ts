export type ExtractedRequirements = {
    required_skills: string[]
    preferred_skills: string[]
    years_experience: string | null
    education: string | null
    responsibilities: string[]
    keywords: string[]
}

export type ApplicationDraft = {
  company: string | null;
  role: string | null;
  status: ApplicationStatus | null;
  source: string | null;
  job_url: string | null;
  salary_min: number | null;
  salary_max: number | null;
  extracted_requirements: ExtractedRequirements | null;
};

export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interviewing"
  | "offer"
  | "accepted"
  | "rejected"
  | "withdrawn";

export type Application = {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  source: string | null;
  job_url: string | null;
  salary_min: number | null;
  salary_max: number | null;
  applied_at: string | null;
  created_at: string;
  updated_at: string;
  job_description: string | null;
  extracted_requirements: ExtractedRequirements | null;
  generated_cover_letter: string | null;
};

{/* Contact type based on the ContactOut Pydantic model in the backend
class ContactOut(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr | None = None
    linkedin_url: str | None = None
    title: str | None = None

    model_config = ConfigDict(from_attributes=True)
    */
}

export type Contact = {
  id: string;
  name: string;
  email: string | null;
  linkedin_url: string | null;
  title: string | null;
}

{/*
  class InteractionOut(BaseModel):
    id: uuid.UUID
    type: str
    date: datetime
    notes: str | None = None
    occurred_at: datetime | None = None
    model_config = ConfigDict(from_attributes=True)
    */
}

export type Interaction = {
  id: string;
  type: string;
  date: Date;
  notes: string | null;
  occurred_at: string | null;
}
