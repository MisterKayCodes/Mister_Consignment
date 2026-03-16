import resend
from config import settings
from typing import Dict, Any
from models.base import EmailTemplate
from sqlalchemy.orm import Session
import re

class EmailService:
    def __init__(self):
        resend.api_key = settings.RESEND_API_KEY

    def _interpolate(self, content: str, data: Dict[str, Any]) -> str:
        """Replace {{variable}} with data values."""
        def replace(match):
            key = match.group(1).strip()
            return str(data.get(key, match.group(0)))
        
        return re.sub(r"\{\{(.*?)\}\}", replace, content)

    def send_templated_email(self, db: Session, to_email: str, template_name: str, data: Dict[str, Any]):
        template = db.query(EmailTemplate).filter(EmailTemplate.name == template_name).first()
        if not template:
            print(f"Template {template_name} not found")
            return None

        subject = self._interpolate(template.subject, data)
        html_content = self._interpolate(template.content, data)

        try:
            params = {
                "from": settings.FROM_EMAIL,
                "to": to_email,
                "subject": subject,
                "html": html_content,
            }
            r = resend.Emails.send(params)
            return r
        except Exception as e:
            print(f"Error sending email: {e}")
            return None

email_service = EmailService()
