from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "sajidtech Backend API"
    ENVIRONMENT: str = "development"
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    
    SECRET_KEY: str = "default_development_secret_key_change_in_production_39481"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "sajidtech2026!"
    
    DATABASE_URL: str = "sqlite+aiosqlite:///./sajidtech.db"
    
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    EMAIL_ENABLED: bool = True
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SMTP_USERNAME: str = "inamdarsajid46@gmail.com"
    SMTP_PASSWORD: str = "ikbbioruejuyqrnp"
    EMAIL_FROM: str = "inamdarsajid46@gmail.com"
    ADMIN_NOTIFICATION_EMAIL: str = "inamdarsajid46@gmail.com"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
