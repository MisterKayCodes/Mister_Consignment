from data.repository import SessionLocal, EmailTemplateRepository, init_db
from models.base import EmailTemplate
import sys

def seed_templates():
    print("Starting template seeding...")
    try:
        # Ensure tables exist
        init_db()
        
        db = SessionLocal()
        repo = EmailTemplateRepository(db)
        
        # Default Shipping Update Template
        shipping_update = {
            "name": "shipping_update",
            "subject": "Update on your Shipment #{{tracking_id}}",
            "content": """
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                <h2 style="color: #6366f1;">Vantage Logistics Update</h2>
                <p>Hello <strong>{{receiver_name}}</strong>,</p>
                <p>Your shipment with Tracking ID <strong>{{tracking_id}}</strong> has a new update:</p>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Status:</strong> {{status}}</p>
                    <p><strong>Location:</strong> {{location}}</p>
                    <p><strong>Remarks:</strong> {{remarks}}</p>
                </div>
                <p>You can track your live journey here: <a href="https://thevantagelogistic.com/track?id={{tracking_id}}" style="color: #6366f1; font-weight: bold;">Track Shipment</a></p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #6b7280;">This is an automated notification from Vantage Logistics. If you have questions, please contact support.</p>
            </div>
            """
        }
        
        repo.create_template(shipping_update)
        print("Templates seeded successfully!")
        db.close()
    except Exception as e:
        print(f"Error seeding templates: {e}")
        sys.exit(1)

if __name__ == "__main__":
    seed_templates()
