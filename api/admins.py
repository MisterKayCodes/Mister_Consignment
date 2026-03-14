from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from typing import List
from data.repository import get_db, Session
from core.auth import get_current_super_admin, get_password_hash
from models.base import AdminUser

router = APIRouter()

class AdminResponse(BaseModel):
    id: int
    username: str
    is_super_admin: bool

    class Config:
        from_attributes = True

class AdminCreate(BaseModel):
    username: str
    password: str
    is_super_admin: bool = False

class PasswordUpdate(BaseModel):
    password: str = Field(..., min_length=4)

@router.get("/", response_model=List[AdminResponse])
def list_admins(db: Session = Depends(get_db), super_admin: AdminUser = Depends(get_current_super_admin)):
    return db.query(AdminUser).all()

@router.post("/", response_model=AdminResponse)
def create_admin(admin_data: AdminCreate, db: Session = Depends(get_db), super_admin: AdminUser = Depends(get_current_super_admin)):
    existing_user = db.query(AdminUser).filter(AdminUser.username == admin_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    new_admin = AdminUser(
        username=admin_data.username,
        password_hash=get_password_hash(admin_data.password),
        is_super_admin=1 if admin_data.is_super_admin else 0
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.delete("/{admin_id}")
def delete_admin(admin_id: int, db: Session = Depends(get_db), super_admin: AdminUser = Depends(get_current_super_admin)):
    admin_to_delete = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin_to_delete:
        raise HTTPException(status_code=404, detail="Admin not found")
    if admin_to_delete.id == super_admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    db.delete(admin_to_delete)
    db.commit()
    return {"message": "Admin deleted successfully"}

@router.patch("/{admin_id}/role")
def update_admin_role(
    admin_id: int, 
    is_super_admin: bool, 
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_super_admin)
):
    if admin_id == current_admin.id:
        raise HTTPException(status_code=400, detail="You cannot change your own role")
        
    admin = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
        
    admin.is_super_admin = int(is_super_admin)
    db.commit()
    return {"message": "Role updated"}

@router.patch("/{admin_id}/password")
def reset_admin_password(
    admin_id: int,
    data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_super_admin)
):
    admin = db.query(AdminUser).filter(AdminUser.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
        
    admin.password_hash = get_password_hash(data.password)
    db.commit()
    return {"message": "Password updated successfully"}
