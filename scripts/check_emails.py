from data.repository import SessionLocal
from models.base import Shipment

def check_shipments():
    db = SessionLocal()
    shipments = db.query(Shipment).all()
    print(f"{'Tracking ID':<15} | {'Receiver Name':<20} | {'Receiver Email':<30}")
    print("-" * 70)
    for s in shipments:
        print(f"{s.tracking_id:<15} | {s.receiver_name:<20} | {str(s.receiver_email):<30}")
    db.close()

if __name__ == "__main__":
    check_shipments()
