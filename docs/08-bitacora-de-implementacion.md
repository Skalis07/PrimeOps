# 08. Bitácora de implementación

> Este documento complementa a `07-ruta-de-construccion-y-avance.md`.
>
> - `07` = checklist oficial y estado del plan.
> - `08` = detalle breve, cronológico y verificable de lo que se ejecutó.
> - `09` = versión condensada por hito con archivos clave y propósito.

## Regla de uso

- Solo se registra aquí lo que ya fue ejecutado.
- Un paso puede quedar como **pendiente de validación humana** hasta recibir visto bueno.
- Cuando un paso quede aprobado, `07` se marca y `08` conserva el detalle histórico.
- Cuando un paso agregue piezas importantes del proyecto, `09` también debe actualizarse.

---

## Entradas

### A1 — Crear estructura base del monorepo y carpetas principales

- **Estado:** ejecutado y validado
- **Objetivo:** crear solo la estructura contenedora del monorepo sin interferir con los futuros scaffolds de Next.js y FastAPI.
- **Se hizo:**
  - creación de `apps/` para contener las aplicaciones principales del monorepo
  - creación de `apps/web/` para alojar el frontend Next.js
  - creación de `apps/api/` para alojar el backend FastAPI
  - creación de `packages/` para compartir configuración, tipos o utilidades comunes en el futuro
  - agregado de `.gitkeep` para persistir carpetas vacías en Git hasta que tengan contenido real
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
  - creación de `apps/api/pyproject.toml` para declarar el proyecto Python y sus dependencias mínimas (`fastapi`, `uvicorn`)
  - creación del paquete `apps/api/app/` como raíz del código del backend
  - creación de `apps/api/app/main.py` como entrypoint de FastAPI y punto donde se arma la aplicación
  - creación de `apps/api/app/core/config.py` para centralizar configuración mínima basada en variables de entorno
  - creación de `apps/api/app/api/routes/health.py` para exponer `GET /api/v1/health` como endpoint mínimo de verificación
  - agregado de `__init__.py` mínimos para que Python trate estas carpetas como paquetes convencionales
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
  - ampliación de `apps/api/app/core/config.py` con variables `POSTGRES_*`, `DATABASE_URL`, `FRONTEND_URL` y armado de URL de conexión para que backend y base compartan una fuente clara de configuración
  - agregado de `apps/api/.env.example` con valores locales seguros y ejemplo opcional de `DATABASE_URL` para documentar cómo debe verse la configuración sin exponer secretos reales
  - agregado de la dependencia `psycopg[binary]` en `apps/api/pyproject.toml` para permitir conexión directa a PostgreSQL sin incorporar aún SQLAlchemy
  - creación de `apps/api/app/db/connection.py` para encapsular apertura de conexión y chequeo mínimo `SELECT 1`
  - creación de `apps/api/app/db/__init__.py` para exponer el módulo de conexión de forma convencional desde `app.db`
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

### A4 — Configurar SQLAlchemy base y Alembic

- **Estado:** ejecutado y validado
- **Objetivo:** dejar el andamiaje mínimo y convencional de ORM y migraciones dentro de `apps/api` para que los próximos hitos puedan crear modelos y revisiones sin improvisar estructura.
- **Se hizo:**
  - agregado de dependencias mínimas `sqlalchemy` y `alembic` en `apps/api/pyproject.toml` para preparar ORM y sistema de migraciones
  - creación de `apps/api/app/db/base.py` con `DeclarativeBase` y `MetaData` con naming convention para centralizar la base de todos los modelos futuros
  - creación de `apps/api/app/db/session.py` con `engine`, `SessionLocal` y dependencia `get_db_session()` preparada para entregar sesiones a FastAPI
  - ampliación de `apps/api/app/db/__init__.py` para exponer `Base`, `engine`, `SessionLocal` y `get_db_session` desde un punto único
  - creación de `apps/api/app/models/__init__.py` como punto de importación de modelos futuros para que Alembic descubra la metadata del proyecto
  - creación de `apps/api/alembic.ini` como configuración principal de Alembic
  - creación de `apps/api/alembic/env.py` como puente entre Alembic, settings del proyecto y metadata de SQLAlchemy
  - creación de `apps/api/alembic/script.py.mako` como plantilla que usará Alembic al generar migraciones nuevas
  - creación de `apps/api/alembic/versions/.gitkeep` para conservar la carpeta donde vivirán las migraciones reales
  - ajuste de comentario en `apps/api/.env.example` para dejar explícito que `DATABASE_URL` sirve también para SQLAlchemy y Alembic
- **No se hizo todavía:**
  - ningún modelo de dominio (`User`, `Product`, `Order`, etc.)
  - ninguna tabla de negocio
  - ninguna revisión o migración inicial generada
  - ejecución de comandos de Alembic, instalaciones, builds o tests
  - cambios fuera de `apps/api` y esta bitácora
- **Comprobación humana simple:**
  - existen `apps/api/app/db/base.py` y `apps/api/app/db/session.py`
  - existe `apps/api/app/models/__init__.py` como placeholder de metadata
  - existen `apps/api/alembic.ini` y la carpeta `apps/api/alembic/` con `env.py`, `script.py.mako` y `versions/`
  - `apps/api/alembic/env.py` toma la URL desde `app.core.config.settings`
  - no aparece todavía ningún modelo de negocio ni migración aplicada

### A5 — Inicializar frontend Next.js mínimo

- **Estado:** ejecutado y validado
- **Objetivo:** dejar un scaffold mínimo y convencional de Next.js con TypeScript dentro de `apps/web` sin instalar paquetes, sin ejecutar builds y sin avanzar todavía a features del frontend.
- **Se hizo:**
  - reemplazo de `apps/web/.gitkeep` por una estructura real de app web mínima
  - creación de `apps/web/package.json` para declarar el proyecto frontend y sus dependencias base (`next`, `react`, `react-dom`, TypeScript)
  - creación de `apps/web/tsconfig.json` para configurar TypeScript en el frontend
  - creación de `apps/web/next.config.ts` para dejar la configuración base de Next.js
  - creación de `apps/web/next-env.d.ts` para que TypeScript reconozca correctamente el entorno de Next.js
  - creación de `apps/web/app/layout.tsx` como layout raíz del App Router
  - creación de `apps/web/app/page.tsx` como página inicial mínima en `/`
  - creación de `apps/web/app/globals.css` para estilos globales base del frontend
  - definición de una pantalla mínima en `/` con texto de arranque fácil de validar por una persona
- **No se hizo todavía:**
  - instalación de dependencias o generación de lockfile
  - ejecución de `next dev`, builds, tests o validaciones automáticas
  - integración de Auth0, layouts protegidos, sidebars, Bootstrap o componentes de dominio
  - clientes API, variables de entorno reales, secretos o configuración avanzada
  - rutas privadas, dashboard, catálogo o cualquier trabajo del Hito 2 en adelante
- **Comprobación humana simple:**
  - existen `apps/web/package.json`, `apps/web/tsconfig.json` y `apps/web/next.config.ts`
  - existe `apps/web/app/` con `layout.tsx`, `page.tsx` y `globals.css`
  - la página raíz declara un contenido mínimo y NO introduce todavía auth ni features de negocio
  - no se agregaron cambios en backend ni se marcó A5 como validado en `07-ruta-de-construccion-y-avance.md`
