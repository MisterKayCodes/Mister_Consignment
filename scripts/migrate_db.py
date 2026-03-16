import sqlite3
import os

def migrate_db():
    db_path = 'consignment.db'
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        print("Checking for 'receiver_email' column in 'shipments' table...")
        cursor.execute("PRAGMA table_info(shipments)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'receiver_email' not in columns:
            print("Adding 'receiver_email' column to 'shipments' table...")
            cursor.execute("ALTER TABLE shipments ADD COLUMN receiver_email TEXT")
            conn.commit()
            print("Migration successful: added 'receiver_email' column.")
        else:
            print("Column 'receiver_email' already exists.")
            
    except Exception as e:
        print(f"Error during migration: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_db()
