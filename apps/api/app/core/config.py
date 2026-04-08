from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "pyme-api")
    app_env: str = os.getenv("APP_ENV", "local")
    api_base_url: str = os.getenv("API_BASE_URL", "http://localhost:8000")


settings = Settings()
