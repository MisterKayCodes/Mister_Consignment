import sys
import os

# Add parent directory to sys.path to allow imports like 'from models.base ...'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.repository import init_db, SessionLocal
from models.base import AdminUser
from core.auth import get_password_hash

def create_admin(username, password):
    init_db()  # Ensure tables exist
    db = SessionLocal()
    try:
        existing_user = db.query(AdminUser).filter(AdminUser.username == username).first()
        if existing_user:
            print(f"[*] User '{username}' already exists. Updating password.")
            existing_user.password_hash = get_password_hash(password)
        else:
            print(f"[*] Creating new admin user '{username}'.")
            new_user = AdminUser(
                username=username,
                password_hash=get_password_hash(password)
            )
            db.add(new_user)
        db.commit()
        print("[+] Admin user saved successfully.")
    except Exception as e:
        print(f"[!] Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python scripts/create_admin.py <username> <password>")
        sys.exit(1)
        
    user = sys.argv[1]
    pwd = sys.argv[2]
    create_admin(user, pwd)
