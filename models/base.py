from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String, unique=True, index=True, nullable=False)
    sender_name = Column(String, nullable=False)
    sender_address = Column(String)
    receiver_name = Column(String, nullable=False)
    receiver_address = Column(String)
    
    package_type = Column(String) # Air, Sea, Land
    weight = Column(Float)
    dimensions = Column(String)
    description = Column(Text)
    
    current_status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    history = relationship("ShipmentHistory", back_populates="shipment", cascade="all, delete-orphan")

class ShipmentHistory(Base):
    __tablename__ = "shipment_history"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    status = Column(String, nullable=False)
    location = Column(String)
    remarks = Column(Text)
    photo_url = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment", back_populates="history")

class CustomStatus(Base):
    __tablename__ = "custom_statuses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String)

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True, nullable=False)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=True)
    subject = Column(String, nullable=False)
    status = Column(String, default="Pending") # Pending, Resolving, Resolved
    created_at = Column(DateTime, default=datetime.utcnow)

    shipment = relationship("Shipment")
    messages = relationship("SupportMessage", back_populates="ticket", cascade="all, delete-orphan")

class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("support_tickets.id"), nullable=False)
    sender_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    is_admin = Column(Integer, default=0) # 0 for user, 1 for admin
    timestamp = Column(DateTime, default=datetime.utcnow)

    ticket = relationship("SupportTicket", back_populates="messages")

class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    is_super_admin = Column(Integer, default=0)
