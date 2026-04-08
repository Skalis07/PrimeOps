from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.db import check_database_connection

router = APIRouter(tags=["health"])


@router.get("/health")
def healthcheck() -> dict[str, str]:
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.app_env,
    }


@router.get("/health/database")
def database_healthcheck() -> dict[str, str | int]:
    is_connected, error = check_database_connection()

    if not is_connected:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "service": settings.app_name,
                "environment": settings.app_env,
                "database": settings.postgres_db,
                "host": settings.postgres_host,
                "port": settings.postgres_port,
                "error": error,
            },
        )

    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.app_env,
        "database": settings.postgres_db,
        "host": settings.postgres_host,
        "port": settings.postgres_port,
        "url_source": settings.database_url_source,
    }
