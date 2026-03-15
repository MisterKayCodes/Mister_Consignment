import jwt
from jwt import PyJWTError as JWTError
from fastapi import Depends, HTTPException, status
from data.repository import get_db, Session
from models.base import AdminUser
from core.auth import SECRET_KEY, ALGORITHM, oauth2_scheme

def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    admin_user = db.query(AdminUser).filter(AdminUser.username == username).first()
    if admin_user is None:
        raise credentials_exception
        
    return admin_user

def get_current_super_admin(admin_user: AdminUser = Depends(get_current_admin)):
    if not admin_user.is_super_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operation not permitted",
        )
    return admin_user
