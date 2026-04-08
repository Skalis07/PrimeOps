import psycopg

from app.core.config import settings


def get_database_connection() -> psycopg.Connection:
    return psycopg.connect(
        conninfo=settings.driver_database_url,
        connect_timeout=settings.postgres_connect_timeout,
    )


def check_database_connection() -> tuple[bool, str | None]:
    try:
        with get_database_connection() as connection:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
    except psycopg.Error as exc:
        return False, str(exc)

    return True, None
