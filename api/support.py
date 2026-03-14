from fastapi import APIRouter, Depends, HTTPException
from data.repository import get_db, ShipmentRepository, Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from core.auth import get_current_admin
from models.base import AdminUser

router = APIRouter()

class MessageSchema(BaseModel):
    sender_name: str
    content: str
    is_admin: int
    timestamp: datetime

    class Config:
        from_attributes = True

class TicketSchema(BaseModel):
    ticket_id: str
    subject: str
    status: str
    created_at: datetime
    messages: List[MessageSchema]

    class Config:
        from_attributes = True

class TicketCreate(BaseModel):
    subject: str
    shipment_id: Optional[int] = None
    first_message: str
    sender_name: str = "Client"

class MessageCreate(BaseModel):
    sender_name: str
    content: str
    is_admin: int = 0

@router.post("/", response_model=TicketSchema)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    return repo.create_support_ticket(
        subject=ticket.subject,
        shipment_id=ticket.shipment_id,
        first_message=ticket.first_message,
        sender_name=ticket.sender_name
    )

@router.get("/{ticket_id}", response_model=TicketSchema)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    ticket = repo.get_ticket_by_uid(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

@router.patch("/{ticket_uid}/status")
def update_ticket_status(ticket_uid: str, status: str, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = ShipmentRepository(db)
    ticket = repo.get_ticket_by_uid(ticket_uid)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    ticket.status = status
    db.commit()
    db.refresh(ticket)
    return {"ticket_id": ticket_uid, "status": ticket.status}

@router.post("/{ticket_uid}/messages")
def add_message_v2(ticket_uid: str, msg: MessageCreate, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    ticket = repo.get_ticket_by_uid(ticket_uid)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    # Auto-transition: if admin replies, set status to Resolving
    if msg.is_admin and ticket.status in ("Pending", "Open"):
        ticket.status = "Resolving"
        db.commit()
    return repo.add_support_message(ticket.id, msg.sender_name, msg.content, msg.is_admin)

@router.get("/", response_model=List[TicketSchema])
def list_tickets(db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = ShipmentRepository(db)
    return repo.get_all_tickets()
