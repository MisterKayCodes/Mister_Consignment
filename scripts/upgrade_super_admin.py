import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from data.repository import init_db, SessionLocal
from models.base import AdminUser

def upgrade_super_admin(username):
    db = SessionLocal()
    try:
        user = db.query(AdminUser).filter(AdminUser.username == username).first()
        if user:
            user.is_super_admin = 1
            db.commit()
            print(f"[+] User '{username}' upgraded to Super Admin successfully.")
        else:
            print(f"[!] Error: User '{username}' not found.")
    except Exception as e:
        print(f"[!] Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python scripts/upgrade_super_admin.py <username>")
        sys.exit(1)
        
    user = sys.argv[1]
    upgrade_super_admin(user)
