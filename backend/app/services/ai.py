import json
from openai import OpenAI, OpenAIError
from pydantic import ValidationError

from app.config import settings
from app.schemas import ApplicationDraft

client = OpenAI(api_key=settings.OPENAI_API_KEY)
MODEL = "gpt-4o-mini"


class AIError(Exception):
    """Raised when the AI call fails or returns something we can't use."""


def extract_application_draft(job_description: str) -> ApplicationDraft:
    try:
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=900,
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Extract structured data from a job posting. Return ONLY a JSON object "
                        "with these keys:\n"
                        "- company (string or null)\n"
                        "- role (string or null)\n"
                        "- salary_min (integer or null)\n"
                        "- salary_max (integer or null)\n"
                        "- requirements (object with: required_skills [string array], "
                        "preferred_skills [string array], years_experience [string or null], "
                        "education [string or null], responsibilities [string array], "
                        "keywords [string array])\n"
                        "Salaries are annual figures as plain integers (e.g. 90000), or null if "
                        "not stated. Use null or empty arrays for anything not present in the posting."
                    ),
                },
                {"role": "user", "content": job_description},
            ],
        )
        return ApplicationDraft(**json.loads(response.choices[0].message.content))
    except OpenAIError as e:
        raise AIError("OpenAI request failed") from e
    except (json.JSONDecodeError, ValidationError) as e:
        raise AIError("AI returned an unparseable response") from e
    

def generate_cover_letter(
    company: str,
    role: str,
    requirements: dict | None,
    candidate_background: str,
) -> str:
    try:
        response = client.chat.completions.create(
            model=MODEL,
            max_tokens=600,
            temperature=0.7,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You write concise, tailored cover letters. Write 3 short "
                        "paragraphs in a professional but natural voice. Connect the "
                        "candidate's background to the role's requirements. Avoid clichés "
                        "and generic filler. Do NOT invent experience the candidate didn't "
                        "mention. Return only the cover letter body, no salutation header."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Company: {company}\n"
                        f"Role: {role}\n"
                        f"Job requirements: {json.dumps(requirements) if requirements else 'N/A'}\n\n"
                        f"Candidate background:\n{candidate_background}"
                    ),
                },
            ],
        )
        content = response.choices[0].message.content
        if not content:
            raise AIError("AI returned an empty cover letter")
        return content
    except OpenAIError as e:
        raise AIError("OpenAI request failed") from e