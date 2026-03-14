import uuid
import re

class TrackingLogic:
    @staticmethod
    def generate_tracking_id() -> str:
        """Generates a unique, unguessable tracking ID."""
        return f"MC-{uuid.uuid4().hex[:8].upper()}"

    @staticmethod
    def mask_address(address: str) -> str:
        """Masks sensitive parts of an address for public view."""
        if not address: return ""
        parts = address.split()
        if len(parts) < 2: return "****"
        return f"{parts[0]} ****** {parts[-1]}"

    @staticmethod
    def validate_tracking_id(tracking_id: str) -> bool:
        """Validates the format of a tracking id."""
        return bool(re.match(r"^MC-[A-Z0-9]{8}$", tracking_id))
