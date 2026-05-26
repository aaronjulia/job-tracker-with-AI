from fastapi import APIRouter, Depends, HTTPException, status
from pytest import Session
from pytest import Session
from sqlalchemy import select
import uuid

from fastapi import HTTPException
from app.services import ai
from app.schemas import CoverLetterRequest, CoverLetterResponse, ExtractedRequirements

from app.database import get_db
from app.models import Contact, Interaction, User, Application
from app.dependencies import get_current_user, get_user_application
from app.schemas import ApplicationOut, ApplicationCreate, ApplicationUpdate, ContactCreate, ContactOut, ContactUpdate, InteractionCreate, InteractionOut, InteractionUpdate, ParseJDRequest

router = APIRouter(prefix="/applications", tags=["applications"])

# Application management endpoints


@router.get("", response_model=list[ApplicationOut], status_code=status.HTTP_200_OK)
def get_applications(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # Implementation for fetching applications
    db_applications = db.execute(
        select(Application).where(Application.user_id == current_user.id)).scalars().all()
    return db_applications


@router.get("/{application_id}", response_model=ApplicationOut, status_code=status.HTTP_200_OK)
def get_application(
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for fetching a specific application
    return application


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    application_data: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Implementation for creating a new application
    db_application = Application(
        user_id=current_user.id,
        company=application_data.company,
        role=application_data.role, 
        status=application_data.status,
        source=application_data.source,
        job_url=application_data.job_url,
        salary_min=application_data.salary_min,
        salary_max=application_data.salary_max,
        applied_at=application_data.applied_at
    )   

    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application


@router.put("/{application_id}", response_model=ApplicationOut, status_code=status.HTTP_200_OK)
def update_application(
    application_data: ApplicationUpdate,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for updating an existing application
    update_fields = application_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)
    return application


@router.delete("/{application_id}", response_model=dict, status_code=status.HTTP_200_OK)
def delete_application(
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for deleting an application

    db.delete(application)
    db.commit()
    return {"detail": "Application deleted successfully"}


# Contact management endpoints for applications


@router.get("/{application_id}/contacts", response_model=list[ContactOut], status_code=status.HTTP_200_OK)
def get_application_contacts(
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for fetching contacts related to an application
    contacts = application.contacts  
    return contacts

@router.get("/{application_id}/contacts/{contact_id}", response_model=ContactOut, status_code=status.HTTP_200_OK)
def get_application_contact(
    contact_id: uuid.UUID,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):  
    # Implementation for fetching a specific contact related to an application
    contact = db.get(Contact, contact_id)
    if not contact or contact.application_id != application.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return contact

@router.post("/{application_id}/contacts", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def add_application_contact(
    contact_data: ContactCreate,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for adding a contact to an application

    new_contact = Contact(
        application_id=application.id,
        name=contact_data.name,
        title=contact_data.title,
        email=contact_data.email,
        linkedin_url=contact_data.linkedin_url
        )

    db.add(new_contact)
    db.commit()
    db.refresh(new_contact)
    return new_contact


@router.delete("/{application_id}/contacts/{contact_id}", response_model=dict, status_code=status.HTTP_200_OK)
def delete_application_contact(
    contact_id: uuid.UUID,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for deleting a contact from an application
    contact = db.get(Contact, contact_id)
    if not contact or contact.application_id != application.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )  
    db.delete(contact)
    db.commit()
    return {"detail": "Contact deleted successfully"}


@router.put("/{application_id}/contacts/{contact_id}", response_model=ContactOut, status_code=status.HTTP_200_OK)
def update_application_contact(
    contact_id: uuid.UUID,
    contact_data: ContactUpdate,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for updating a contact related to an application
    contact = db.get(Contact, contact_id)
    if not contact or contact.application_id != application.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    update_fields = contact_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(contact, field, value)

    db.commit()
    db.refresh(contact)
    return contact


# Interaction management endpoints for applications


@router.get("/{application_id}/interactions", response_model=list[InteractionOut], status_code=status.HTTP_200_OK)
def get_application_interactions(
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_interactions = application.interactions

    return db_interactions

@router.get("/{application_id}/interactions/{interaction_id}", response_model=InteractionOut, status_code=status.HTTP_200_OK)
def get_application_interaction( 
    interaction_id: uuid.UUID,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for fetching a specific interaction related to an application
    interaction = db.get(Interaction, interaction_id)
    if not interaction or interaction.application_id != application.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interaction not found"
        )
    return interaction


@router.post("/{application_id}/interactions", response_model=dict, status_code=status.HTTP_201_CREATED)
def add_application_interaction(
    interaction_data: InteractionCreate,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for adding an interaction to an application
    new_interaction = Interaction(
        application_id=application.id,
        type=interaction_data.type,
        notes=interaction_data.notes
    )
    db.add(new_interaction)
    db.commit()
    db.refresh(new_interaction)
    return {"detail": "Interaction added successfully"}


@router.delete("/{application_id}/interactions/{interaction_id}", response_model=dict, status_code=status.HTTP_200_OK)
def delete_application_interaction(
    interaction_id: uuid.UUID,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for deleting an interaction from an application
    interaction = db.get(Interaction, interaction_id)
    if not interaction or interaction.application_id != application.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interaction not found"
        )
    db.delete(interaction)
    db.commit()
    return {"detail": "Interaction deleted successfully"}


@router.put("/{application_id}/interactions/{interaction_id}", response_model=dict, status_code=status.HTTP_200_OK)
def update_application_interaction(
    interaction_data: InteractionUpdate,
    interaction_id: uuid.UUID,
    application: Application = Depends(get_user_application),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Implementation for updating an interaction related to an application
    interaction = db.get(Interaction, interaction_id)
    if not interaction or interaction.application_id != application.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interaction not found"
        ) 
    update_fields = interaction_data.model_dump(exclude_unset=True)
    for field, value in update_fields.items():
        setattr(interaction, field, value)
    db.commit()
    db.refresh(interaction)
    return {"detail": "Interaction updated successfully"}

@router.post("/{application_id}/parse-jd", response_model=ExtractedRequirements)
def parse_jd(
    body: ParseJDRequest,
    application: Application = Depends(get_user_application),
    db: Session = Depends(get_db),
):
    try:
        requirements = ai.parse_job_description(body.job_description)
    except ai.AIError:
        raise HTTPException(status_code=502, detail="Could not parse job description")

    application.job_description = body.job_description
    application.extracted_requirements = requirements.model_dump()
    db.commit()
    db.refresh(application)
    return requirements


@router.post("/{application_id}/cover-letter", response_model=CoverLetterResponse)
def cover_letter(
    body: CoverLetterRequest,
    application: Application = Depends(get_user_application),
    db: Session = Depends(get_db),
):
    try:
        letter = ai.generate_cover_letter(
            company=application.company,
            role=application.role,
            requirements=application.extracted_requirements,
            candidate_background=body.candidate_background,
        )
    except ai.AIError:
        raise HTTPException(status_code=502, detail="Could not generate cover letter")

    application.generated_cover_letter = letter
    db.commit()
    db.refresh(application)
    return CoverLetterResponse(cover_letter=letter)
