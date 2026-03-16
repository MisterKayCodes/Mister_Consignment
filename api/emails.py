from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from data.repository import get_db, EmailTemplateRepository
from api.deps import get_current_admin
from models.base import AdminUser, EmailTemplate
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class EmailTemplateSchema(BaseModel):
    name: str
    subject: str
    content: str

    class Config:
        from_attributes = True

@router.get("/templates", response_model=List[EmailTemplateSchema])
def list_templates(db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = EmailTemplateRepository(db)
    return repo.get_all_templates()

@router.post("/templates", response_model=EmailTemplateSchema)
def create_template(template: EmailTemplateSchema, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = EmailTemplateRepository(db)
    return repo.create_template(template.dict())

@router.get("/templates/{name}", response_model=EmailTemplateSchema)
def get_template(name: str, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = EmailTemplateRepository(db)
    template = repo.get_template_by_name(name)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.delete("/templates/{name}")
def delete_template(name: str, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = EmailTemplateRepository(db)
    if not repo.delete_template(name):
        raise HTTPException(status_code=404, detail="Template not found")
    return {"message": "Template deleted"}
