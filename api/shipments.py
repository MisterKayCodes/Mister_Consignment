from fastapi import APIRouter, Depends, HTTPException, Response
from data.repository import get_db, ShipmentRepository, Session
from schemas.shipment import ShipmentCreate, Shipment as ShipmentSchema, ShipmentTrack
from models.base import Shipment as DBShipment
from core.tracking import TrackingLogic
from core.auth import get_current_admin, get_current_super_admin
from models.base import AdminUser
from services.documents import DocumentService
from typing import List, Optional

router = APIRouter()

@router.post("/", response_model=ShipmentSchema)
def create_shipment(shipment: ShipmentCreate, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = ShipmentRepository(db)
    return repo.create_shipment(shipment.dict())

@router.get("/{tracking_id}", response_model=ShipmentTrack)
def track_shipment(tracking_id: str, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    shipment = repo.get_shipment_by_tracking_id(tracking_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    return {
        "tracking_id": shipment.tracking_id,
        "current_status": shipment.current_status,
        "history": shipment.history,
        "receiver_name": shipment.receiver_name,
        "receiver_address_masked": TrackingLogic.mask_address(shipment.receiver_address)
    }

@router.get("/{tracking_id}/invoice")
def get_invoice(tracking_id: str, db: Session = Depends(get_db)):
    repo = ShipmentRepository(db)
    shipment = repo.get_shipment_by_tracking_id(tracking_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    
    shipment_data = {
        "tracking_id": shipment.tracking_id,
        "date": shipment.created_at.strftime("%Y-%m-%d"),
        "sender_name": shipment.sender_name,
        "sender_address": shipment.sender_address,
        "receiver_name": shipment.receiver_name,
        "receiver_address": shipment.receiver_address,
        "package_type": shipment.package_type,
        "weight": shipment.weight,
        "dimensions": shipment.dimensions
    }
    
    pdf_content = DocumentService.generate_invoice(shipment_data)
    return Response(content=pdf_content, media_type="application/pdf", 
                    headers={"Content-Disposition": f"attachment; filename=invoice_{tracking_id}.pdf"})

@router.post("/{shipment_id}/history")
def add_history(shipment_id: int, status: str, remarks: Optional[str] = None, location: Optional[str] = None, photo_url: Optional[str] = None, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = ShipmentRepository(db)
    return repo.add_history(shipment_id, status, remarks, location, photo_url)

@router.delete("/{shipment_id}")
def delete_shipment(shipment_id: int, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_super_admin)):
    repo = ShipmentRepository(db)
    if not repo.delete_shipment(shipment_id):
        raise HTTPException(status_code=404, detail="Shipment not found")
    return {"message": "Shipment deleted successfully"}

@router.put("/history/{history_id}")
def update_history(history_id: int, status: Optional[str] = None, remarks: Optional[str] = None, location: Optional[str] = None, photo_url: Optional[str] = None, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = ShipmentRepository(db)
    history = repo.update_history(history_id, status, remarks, location, photo_url)
    if not history:
        raise HTTPException(status_code=404, detail="History entry not found")
    return history

@router.delete("/history/{history_id}")
def delete_history(history_id: int, db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = ShipmentRepository(db)
    if not repo.delete_history(history_id):
        raise HTTPException(status_code=404, detail="History entry not found")
    return {"message": "History entry deleted"}

@router.get("/", response_model=List[ShipmentSchema])
def list_shipments(db: Session = Depends(get_db), admin: AdminUser = Depends(get_current_admin)):
    repo = ShipmentRepository(db)
    return repo.db.query(DBShipment).all()
