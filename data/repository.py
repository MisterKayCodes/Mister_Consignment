from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from models.base import Base, Shipment, ShipmentHistory, CustomStatus, SupportTicket, SupportMessage
from config import settings
import uuid
from datetime import datetime

engine = create_engine(settings.DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ShipmentRepository:
    def __init__(self, db: Session):
        self.db = db

    def generate_tracking_id(self):
        # Generate a unique, unguessable tracking ID (Mister style)
        return f"VL-{uuid.uuid4().hex[:8].upper()}"

    def create_shipment(self, shipment_data):
        tracking_id = self.generate_tracking_id()
        db_shipment = Shipment(**shipment_data, tracking_id=tracking_id)
        self.db.add(db_shipment)
        self.db.commit()
        self.db.refresh(db_shipment)
        
        # Initial history entry
        self.add_history(db_shipment.id, "Pending", "Shipment Registered")
        return db_shipment

    def delete_shipment(self, shipment_id: int):
        shipment = self.db.query(Shipment).filter(Shipment.id == shipment_id).first()
        if not shipment: return False
        
        # Cascade is handled by SQLAlchemy relationship if set, but we define explicitly here for safety
        self.db.query(ShipmentHistory).filter(ShipmentHistory.shipment_id == shipment_id).delete()
        self.db.delete(shipment)
        self.db.commit()
        return True

    def add_history(self, shipment_id: int, status: str, remarks: str = None, location: str = None, photo_url: str = None):
        history = ShipmentHistory(
            shipment_id=shipment_id,
            status=status,
            remarks=remarks,
            location=location,
            photo_url=photo_url
        )
        self.db.add(history)
        
        # Update current status on shipment
        shipment = self.db.query(Shipment).filter(Shipment.id == shipment_id).first()
        if shipment:
            shipment.current_status = status
            
        self.db.commit()
        return history

    def update_history(self, history_id: int, status: str = None, remarks: str = None, location: str = None, photo_url: str = None):
        history = self.db.query(ShipmentHistory).filter(ShipmentHistory.id == history_id).first()
        if not history: return None
        
        if status: history.status = status
        if remarks: history.remarks = remarks
        if location: history.location = location
        if photo_url is not None: history.photo_url = photo_url
        
        # If this was the latest entry, update the shipment's current_status
        latest = self.db.query(ShipmentHistory).filter(ShipmentHistory.shipment_id == history.shipment_id).order_by(ShipmentHistory.timestamp.desc()).first()
        if latest and latest.id == history.id:
            shipment = self.db.query(Shipment).filter(Shipment.id == history.shipment_id).first()
            if shipment: shipment.current_status = history.status
            
        self.db.commit()
        return history

    def delete_history(self, history_id: int):
        history = self.db.query(ShipmentHistory).filter(ShipmentHistory.id == history_id).first()
        if not history: return False
        
        shipment_id = history.shipment_id
        self.db.delete(history)
        self.db.commit()
        
        # After deletion, update current_status to the next latest history
        latest = self.db.query(ShipmentHistory).filter(ShipmentHistory.shipment_id == shipment_id).order_by(ShipmentHistory.timestamp.desc()).first()
        shipment = self.db.query(Shipment).filter(Shipment.id == shipment_id).first()
        if shipment:
            shipment.current_status = latest.status if latest else "Pending"
            self.db.commit()
            
        return True

    def get_all_custom_statuses(self):
        return self.db.query(CustomStatus).all()

    # --- Support System ---
    def generate_ticket_id(self):
        return f"TKT-{uuid.uuid4().hex[:6].upper()}"

    def create_support_ticket(self, subject: str, shipment_id: int = None, first_message: str = None, sender_name: str = "Client"):
        ticket_id = self.generate_ticket_id()
        ticket = SupportTicket(ticket_id=ticket_id, shipment_id=shipment_id, subject=subject)
        self.db.add(ticket)
        self.db.commit()
        self.db.refresh(ticket)
        
        if first_message:
            self.add_support_message(ticket.id, sender_name, first_message, is_admin=0)
            
        return ticket

    def add_support_message(self, ticket_internal_id: int, sender_name: str, content: str, is_admin: int = 0):
        message = SupportMessage(ticket_id=ticket_internal_id, sender_name=sender_name, content=content, is_admin=is_admin)
        self.db.add(message)
        
        # Update ticket timestamp or status if needed
        ticket = self.db.query(SupportTicket).filter(SupportTicket.id == ticket_internal_id).first()
        if ticket and is_admin:
            ticket.status = "Resolved" # Simple auto-status update logic
            
        self.db.commit()
        return message

    def get_ticket_by_uid(self, ticket_id: str):
        return self.db.query(SupportTicket).filter(SupportTicket.ticket_id == ticket_id).first()

    def get_all_tickets(self):
        return self.db.query(SupportTicket).order_by(SupportTicket.created_at.desc()).all()

    def create_custom_status(self, name: str, description: str = None):
        status = CustomStatus(name=name, description=description)
        self.db.add(status)
        self.db.commit()
        self.db.refresh(status)
        return status
