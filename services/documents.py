from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io

class DocumentService:
    @staticmethod
    def generate_invoice(shipment_data: dict) -> bytes:
        """Generates a PDF invoice for a shipment."""
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=letter)
        
        c.setFont("Helvetica-Bold", 16)
        c.drawString(100, 750, "MISTER CONSIGNMENT - INVOICE")
        
        c.setFont("Helvetica", 12)
        c.drawString(100, 720, f"Tracking ID: {shipment_data.get('tracking_id')}")
        c.drawString(100, 705, f"Date: {shipment_data.get('date')}")
        
        c.drawString(100, 670, "SENDER DETAILS")
        c.drawString(120, 655, f"Name: {shipment_data.get('sender_name')}")
        c.drawString(120, 640, f"Address: {shipment_data.get('sender_address')}")
        
        c.drawString(100, 610, "RECEIVER DETAILS")
        c.drawString(120, 595, f"Name: {shipment_data.get('receiver_name')}")
        c.drawString(120, 580, f"Address: {shipment_data.get('receiver_address')}")
        
        c.drawString(100, 550, "PACKAGE DETAILS")
        c.drawString(120, 535, f"Type: {shipment_data.get('package_type')}")
        c.drawString(120, 520, f"Weight: {shipment_data.get('weight')} kg")
        c.drawString(120, 505, f"Dimensions: {shipment_data.get('dimensions')}")
        
        c.showPage()
        c.save()
        
        pdf = buffer.getvalue()
        buffer.close()
        return pdf
