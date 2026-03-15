import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from api.deps import get_current_admin
from models.base import AdminUser

router = APIRouter()

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/")
async def upload_file(file: UploadFile = File(...), admin: AdminUser = Depends(get_current_admin)):
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only images are allowed")
    
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    # Save file
    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    
    # Return the relative URL (will be served by FastAPI static mount)
    return {"url": f"/api/uploads/{filename}"}
