"""Import future SQLAlchemy models here so Alembic can discover metadata."""

from app.db.base import Base

__all__ = ["Base"]
