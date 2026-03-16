from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vantage Logistics"
    DATABASE_URL: str = "sqlite:///./consignment.db"
    SECRET_KEY: str = "super-secret-key-change-me"
    
    # Twilio / SendGrid (Placeholder)
    TWILIO_ACCOUNT_SID: Optional[str] = None
    TWILIO_AUTH_TOKEN: Optional[str] = None
    SENDGRID_API_KEY: Optional[str] = None
    RESEND_API_KEY: Optional[str] = None
    FROM_EMAIL: str = "onboarding@resend.dev" # Change to admin@thevantagelogistic.com after verification

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
