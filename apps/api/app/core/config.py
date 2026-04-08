from dataclasses import dataclass, field
import os
from urllib.parse import quote_plus


@dataclass(frozen=True)
class Settings:
    app_name: str = field(default_factory=lambda: os.getenv("APP_NAME", "pyme-api"))
    app_env: str = field(default_factory=lambda: os.getenv("APP_ENV", "local"))
    api_base_url: str = field(default_factory=lambda: os.getenv("API_BASE_URL", "http://localhost:8000"))
    frontend_url: str = field(default_factory=lambda: os.getenv("FRONTEND_URL", "http://localhost:3000"))
    raw_database_url: str = field(default_factory=lambda: os.getenv("DATABASE_URL", "").strip())
    postgres_host: str = field(default_factory=lambda: os.getenv("POSTGRES_HOST", "localhost"))
    postgres_port: int = field(default_factory=lambda: int(os.getenv("POSTGRES_PORT", "5432")))
    postgres_db: str = field(default_factory=lambda: os.getenv("POSTGRES_DB", "pyme_db"))
    postgres_user: str = field(default_factory=lambda: os.getenv("POSTGRES_USER", "pyme_user"))
    postgres_password: str = field(default_factory=lambda: os.getenv("POSTGRES_PASSWORD", "change-me"))
    postgres_connect_timeout: int = field(default_factory=lambda: int(os.getenv("POSTGRES_CONNECT_TIMEOUT", "3")))

    @property
    def database_url(self) -> str:
        if self.raw_database_url:
            return self.raw_database_url

        user = quote_plus(self.postgres_user)
        password = quote_plus(self.postgres_password)
        return (
            f"postgresql+psycopg://{user}:{password}@{self.postgres_host}:"
            f"{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def driver_database_url(self) -> str:
        return self.database_url.replace("postgresql+psycopg://", "postgresql://", 1)

    @property
    def database_url_source(self) -> str:
        if self.raw_database_url:
            return "DATABASE_URL"
        return "POSTGRES_*"


settings = Settings()
