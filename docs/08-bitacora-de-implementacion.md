# 08. Bitácora de implementación

> Este documento complementa a `07-ruta-de-construccion-y-avance.md`.
>
> - `07` = checklist oficial y estado del plan.
> - `08` = detalle breve, cronológico y verificable de lo que se ejecutó.

## Regla de uso

- Solo se registra aquí lo que ya fue ejecutado.
- Un paso puede quedar como **pendiente de validación humana** hasta recibir visto bueno.
- Cuando un paso quede aprobado, `07` se marca y `08` conserva el detalle histórico.

---

## Entradas

### A1 — Crear estructura base del monorepo y carpetas principales

- **Estado:** ejecutado y validado
- **Objetivo:** crear solo la estructura contenedora del monorepo sin interferir con los futuros scaffolds de Next.js y FastAPI.
- **Se hizo:**
  - creación de `apps/`
  - creación de `apps/web/`
  - creación de `apps/api/`
  - creación de `packages/`
  - agregado de `.gitkeep` para persistir carpetas vacías en Git
- **No se hizo todavía:**
  - scaffold de Next.js
  - scaffold de FastAPI
  - configuración de base de datos
  - archivos de configuración internos de apps
- **Comprobación humana simple:**
  - existen `apps/web`, `apps/api` y `packages`
  - no hay estructura interna prematura que choque con Next.js o FastAPI

### A2 — Inicializar backend FastAPI mínimo

- **Estado:** ejecutado y validado
- **Objetivo:** dejar un esqueleto real de FastAPI dentro de `apps/api` sin acoplar todavía base de datos, ORM ni migraciones.
- **Se hizo:**
  - creación de `apps/api/pyproject.toml` con dependencias mínimas de `fastapi` y `uvicorn`
  - creación del paquete `apps/api/app/` con entrypoint `main.py`
  - creación de `apps/api/app/core/config.py` con configuración mínima basada en variables de entorno
  - creación de `apps/api/app/api/routes/health.py` con endpoint `GET /api/v1/health`
  - agregado de `__init__.py` mínimos para que la estructura sea un paquete Python convencional
- **No se hizo todavía:**
  - configuración de PostgreSQL
  - conexión a base de datos
  - SQLAlchemy base
  - Alembic
  - autenticación, autorización o endpoints de dominio
  - scaffold del frontend
- **Comprobación humana simple:**
  - existe `apps/api/pyproject.toml`
  - existe `apps/api/app/main.py`
  - existe `apps/api/app/api/routes/health.py`
  - la ruta esperada queda definida como `GET /api/v1/health`
  - no hay código de base de datos ni migraciones todavía

### A3 — Configurar PostgreSQL local y conexión

- **Estado:** ejecutado y validado
- **Objetivo:** dejar preparada la configuración local de PostgreSQL y el cableado mínimo de conexión para FastAPI, sin mezclar todavía ORM ni migraciones.
- **Se hizo:**
  - ampliación de `apps/api/app/core/config.py` con variables `POSTGRES_*`, `DATABASE_URL`, `FRONTEND_URL` y armado de URL de conexión
  - agregado de `apps/api/.env.example` con valores locales seguros y ejemplo opcional de `DATABASE_URL`
  - agregado de la dependencia `psycopg[binary]` en `apps/api/pyproject.toml` para conexión PostgreSQL sin incorporar aún SQLAlchemy
  - creación de `apps/api/app/db/connection.py` con apertura de conexión y chequeo mínimo `SELECT 1`
  - creación de `apps/api/app/db/__init__.py` para exponer el módulo de conexión de forma convencional
  - ampliación de `apps/api/app/api/routes/health.py` con `GET /api/v1/health/database` para validación humana de conectividad local
- **No se hizo todavía:**
  - modelos SQLAlchemy
  - `Base` declarativa
  - manejo de sesiones ORM
  - configuración de Alembic
  - migraciones iniciales
  - cambios de frontend
- **Comprobación humana simple:**
  - existe `apps/api/.env.example` con `POSTGRES_*` y ejemplo comentado de `DATABASE_URL`
  - existe `apps/api/app/db/connection.py`
  - la ruta esperada queda definida como `GET /api/v1/health/database`
  - la conexión usa `psycopg` directo y NO introduce SQLAlchemy ni Alembic todavía
