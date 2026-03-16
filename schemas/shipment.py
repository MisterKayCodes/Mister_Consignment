from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class CustomStatusBase(BaseModel):
    name: str
    description: Optional[str] = None

class CustomStatusCreate(CustomStatusBase):
    pass

class CustomStatus(CustomStatusBase):
    id: int
    class Config:
        from_attributes = True

class ShipmentHistoryBase(BaseModel):
    status: str
    location: Optional[str] = None
    remarks: Optional[str] = None
    photo_url: Optional[str] = None

class ShipmentHistoryCreate(ShipmentHistoryBase):
    shipment_id: int

class ShipmentHistory(ShipmentHistoryBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True

class ShipmentBase(BaseModel):
    sender_name: str
    sender_address: Optional[str] = None
    receiver_name: str
    receiver_address: Optional[str] = None
    receiver_email: Optional[str] = None
    package_type: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    description: Optional[str] = None

class ShipmentCreate(ShipmentBase):
    pass

class Shipment(ShipmentBase):
    id: int
    tracking_id: str
    current_status: str
    created_at: datetime
    updated_at: datetime
    history: List[ShipmentHistory] = []
    class Config:
        from_attributes = True

class ShipmentTrack(BaseModel):
    tracking_id: str
    current_status: str
    history: List[ShipmentHistory]
    # Sensitive info masked or omitted
    receiver_name: str
    receiver_address_masked: str
