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
- **Comprobación manual requerida cuando se quiera validar runtime:**
  - confirmar Python:

    ```powershell
    python --version
    ```

    Si falla:

    ```powershell
    py --version
    ```

  - entrar al backend:

    ```powershell
    cd "E:\Dev\01- GitHub\Test\apps\api"
    ```

  - crear entorno virtual local del backend:

    ```powershell
    python -m venv .venv
    ```

  - activar entorno virtual en PowerShell:

    ```powershell
    .venv\Scripts\Activate.ps1
    ```

  - instalar dependencias del backend:

    ```powershell
    pip install -e .
    ```

  - levantar la API:

    ```powershell
    uvicorn app.main:app --reload
    ```

  - abrir en navegador:

    ```text
    http://localhost:8000/api/v1/health
    ```

  - respuesta esperada aproximada:

    ```json
    {
      "status": "ok",
      "service": "primeops-api",
      "environment": "local"
    }
    ```

### A3 — Configurar PostgreSQL local y conexión

- **Estado:** ejecutado y validado
- **Objetivo:** dejar preparada la configuración local de PostgreSQL y el cableado mínimo de conexión para FastAPI, sin mezclar todavía ORM ni migraciones.
- **Se hizo:**
  - ampliación de `apps/api/app/core/config.py` con variables `POSTGRES_*`, `DATABASE_URL`, `FRONTEND_URL` y armado de URL de conexión para que backend y base compartan una fuente clara de configuración
  - ajuste de `apps/api/app/core/config.py` para cargar automáticamente `apps/api/.env` al iniciar settings, dejando el cableado local de PostgreSQL y configuración realmente operativo sin exportar variables a mano en cada arranque
  - agregado de `apps/api/.env.example` con valores locales seguros y ejemplo opcional de `DATABASE_URL` para documentar cómo debe verse la configuración sin exponer secretos reales
  - agregado de `python-dotenv` en `apps/api/pyproject.toml` como dependencia mínima y convencional para resolver esa carga automática de entorno local
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
  - `apps/api/app/core/config.py` carga `apps/api/.env` automáticamente antes de leer `os.getenv(...)`
  - existe `apps/api/app/db/connection.py`
  - la ruta esperada queda definida como `GET /api/v1/health/database`
  - la conexión usa `psycopg` directo y NO introduce SQLAlchemy ni Alembic todavía
- **Comprobación manual requerida cuando se quiera validar runtime:**
  - **Paso 1. Verificar si ya tienes PostgreSQL**
    - intentar abrir **pgAdmin** o `psql`
    - comprobar si ya existe un servidor PostgreSQL local al que puedas entrar
  - **Paso 2. Si NO lo tienes, instalar PostgreSQL**

    1. abrir la página oficial:

       ```text
       https://www.postgresql.org/download/windows/
       ```

    2. entrar al instalador recomendado para Windows (EDB)
    3. descargar PostgreSQL e iniciar el instalador
    4. durante la instalación, dejar marcados al menos:
       - PostgreSQL Server
       - Command Line Tools
       - pgAdmin (recomendado)
    5. durante la instalación, anotar estos datos:
       - usuario (normalmente `postgres`)
       - contraseña
       - puerto (normalmente `5432`)
    6. terminar la instalación
    7. abrir **pgAdmin** o `psql`
    8. comprobar que puedes conectarte al servidor local
    9. crear una base para el proyecto, por ejemplo:

       ```text
       pyme_db
       ```

  - **Paso 3. Crear y completar `apps/api/.env`**
    - crear `apps/api/.env` a partir de `apps/api/.env.example`
    - editar `apps/api/.env` con tus valores reales
    - este archivo ahora forma parte del cableado local de PostgreSQL/configuración: el backend lo carga automáticamente al iniciar, así que ya no depende de exportar esas variables manualmente en la terminal

    Ejemplo:

    ```env
    APP_ENV=local
    APP_NAME=primeops-api
    API_BASE_URL=http://localhost:8000
    FRONTEND_URL=http://localhost:3000
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_DB=pyme_db
    POSTGRES_USER=pyme_user
    POSTGRES_PASSWORD=tu-password-real
    POSTGRES_CONNECT_TIMEOUT=3
    ```

  - **Paso 4. Activar entorno virtual del backend**

    desde `apps/api`, si todavía no está activo:

    ```powershell
    .venv\Scripts\Activate.ps1
    ```

  - **Paso 5. Instalar dependencias del backend si todavía no están**

    ```powershell
    pip install -e .
    ```

  - **Paso 6. Levantar la API**

    ```powershell
    uvicorn app.main:app --reload
    ```

  - **Paso 7. Probar el healthcheck de base de datos**

    abrir en navegador:

    ```text
    http://localhost:8000/api/v1/health/database
    ```

  - respuesta esperada: estado `ok` con base/host/puerto correctos

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
- **Comprobación manual requerida cuando se quiera validar runtime:**
  - este paso no necesita una comprobación runtime nueva si ya validaste A2 y A3
  - la validación humana aquí es principalmente estructural:
    - existe `app/db/base.py`
    - existe `app/db/session.py`
    - existe `alembic.ini`
    - existe `alembic/env.py`
    - `env.py` usa `app.core.config.settings`
  - A4 por sí solo todavía no genera una corrida visible útil porque aún no existen modelos ni migración inicial

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
- **Comprobación manual requerida cuando se quiera validar runtime:**
  - si todavía no validaste el entorno frontend, confirmar Node y npm:

    ```powershell
    node --version
    npm --version
    ```

  - entrar al frontend:

    ```powershell
    cd "E:\Dev\01- GitHub\Test\apps\web"
    ```

  - instalar dependencias:

    ```powershell
    npm install
    ```

  - levantar Next.js:

    ```powershell
    npm run dev
    ```

  - abrir en navegador:

    ```text
    http://localhost:3000
    ```

  - comprobar que se ve la pantalla mínima del scaffold

### A6 — Definir configuración compartida y tipos base

- **Estado:** ejecutado y validado
- **Objetivo:** dejar una base mínima y compartida en `packages/` para que web y api puedan reutilizar contratos simples sin adelantar todavía lógica de dominio ni tooling extra del monorepo.
- **Se hizo:**
  - reemplazo de `packages/.gitkeep` por estructura real de paquetes compartidos
  - creación de `packages/config/` como paquete mínimo para constantes públicas, convenciones de entorno y referencias locales seguras del monorepo
  - creación de `packages/shared-types/` como paquete mínimo para tipos TypeScript compartidos entre frontend y backend
  - definición en `packages/config/src/index.ts` de apps soportadas, nombres legibles, URLs locales de referencia, prefijo API y rutas convencionales de archivos `.env`
  - definición en `packages/shared-types/src/index.ts` de ambiente base, envelope de API, error base y contrato mínimo de healthcheck
  - agregado de `README.md` en ambos paquetes para dejar claro qué cubren y qué queda fuera en esta etapa
- **No se hizo todavía:**
  - workspaces reales del monorepo
  - instalación de dependencias, lockfiles, builds o tests
  - importación efectiva desde `apps/web` o `apps/api`
  - tipos de dominio, auth, clientes API, integraciones o modelos de negocio
- **Comprobación humana simple:**
  - existen `packages/config` y `packages/shared-types`
  - ambos paquetes tienen `package.json`, `README.md` y `src/index.ts`
  - `packages/config` solo expone constantes y referencias seguras, sin secretos
  - `packages/shared-types` solo define contratos base transversales y NO modelos del dominio
  - `07-ruta-de-construccion-y-avance.md` sigue mostrando A6 como pendiente hasta validación humana
- **Comprobación manual requerida cuando se quiera validar runtime:**
  - no hace falta levantar nada visual para A6 por sí solo
  - la validación humana aquí es estructural: revisar que ambos paquetes existen, que son mínimos y que no arrastran dominio prematuro ni secretos

### B1 — Integrar Auth0 en frontend

- **Estado:** ejecutado y validado
- **Objetivo:** dejar un scaffold mínimo y revisable para iniciar integración de Auth0 en `apps/web` sin instalar dependencias, sin correr la app y sin adelantar todavía la seguridad real del backend.
- **Se hizo:**
  - agregado de `@auth0/auth0-react` en `apps/web/package.json` como dependencia declarada para el login frontend
  - creación de `apps/web/.env.local.example` con variables públicas mínimas de frontend y placeholders seguros, sin tenant ni secretos reales
  - creación de `apps/web/lib/auth0-config.ts` para centralizar lectura de variables públicas y detectar si la configuración está completa
  - creación de `apps/web/components/providers/app-auth0-provider.tsx` para envolver el App Router con `Auth0Provider` solo cuando existan variables completas
  - creación de `apps/web/components/auth/login-entry.tsx` con una entrada mínima de login: muestra estado de scaffold, desactiva el botón si faltan variables y deja listo `loginWithRedirect()` para validación manual posterior
  - creación de `apps/web/app/login/page.tsx` como ruta pública `/login` para iniciar el login desde frontend
  - creación de `apps/web/app/auth/callback/page.tsx` como retorno técnico separado del login, dejando una ruta más profesional para recibir el callback de Auth0
  - actualización de `apps/web/app/layout.tsx`, `apps/web/app/page.tsx` y `apps/web/app/globals.css` para integrar el provider y exponer una navegación mínima hacia `/login`
- **No se hizo todavía:**
  - flujo real de login/logout contra Auth0
  - validación de token en backend, endpoint `/me`, sincronización de usuario interno o layouts por rol
  - navegación protegida o autorización del dominio
- **Comprobación humana simple:**
  - existe `apps/web/.env.local.example` con placeholders públicos de Auth0
  - existe `apps/web/app/login/page.tsx` como entrada pública al login
  - existe `apps/web/app/auth/callback/page.tsx` como retorno técnico separado
  - existe un provider aislado en `apps/web/components/providers/app-auth0-provider.tsx`
  - el scaffold muestra botón deshabilitado si faltan variables y evita asumir secretos reales
- **Comprobación manual requerida para validar B1 de verdad:**
  - **Paso 1. Confirmar si ya tienes cuenta de Auth0**
    - si ya tienes cuenta, sigue al paso 2
    - si no la tienes, entra a:

      ```text
      https://auth0.com/
      ```

    - regístrate y entra al panel
  - **Paso 2. Entender qué es el tenant**
    - el **tenant** es tu espacio de Auth0 para este proyecto
    - piensa en él como la cuenta/entorno principal donde vivirán tu aplicación y tu API
    - de ahí sale el `domain`, por ejemplo:

      ```text
      primeops-dev.us.auth0.com
      ```

  - **Paso 3. Crear la aplicación frontend en Auth0**
    - en el panel de Auth0 ir a `Applications`
    - crear una nueva aplicación
    - elegir tipo **Single Page Application (SPA)**
    - guardar el `Domain` y el `Client ID`
    - NO usar el `Client Secret` en el frontend
    - esta app SPA es la que entrega el `Client ID` que irá a `NEXT_PUBLIC_AUTH0_CLIENT_ID`
  - **Paso 4. Crear la API en Auth0 (para la audience)**
    - en el panel de Auth0 ir a `Applications` → `APIs`
    - crear una API nueva
    - usar un nombre claro, por ejemplo `PrimeOps API`
    - definir un `Identifier`, por ejemplo:

      ```text
      https://primeops-api
      ```

    - ese `Identifier` será la `NEXT_PUBLIC_AUTH0_AUDIENCE`
    - para esta etapa, dejar:
      - **JWT Profile** → `Auth0`
      - **Signing Algorithm** → `RS256`
      - **User access** → `Allow via client-grant`
      - **Client access** → `Deny`
    - NO usar `...auth0.com/api/v2/`, porque esa es la Management API de Auth0 y no la API de PrimeOps
  - **Paso 4.1. Autorizar la aplicación SPA a usar la API**
    - ir a `Applications`
    - abrir tu aplicación **SPA** (la del frontend de PrimeOps, no la test application de la API)
    - abrir la pestaña `APIs`
    - buscar `PrimeOps API`
    - pulsar `Edit`
    - en **User Access Authorization** elegir:
      - `All` para esta etapa, por simplicidad
      - o `Authorized` si luego quieres scopes concretos
    - en **Client Credential Access Authorization** dejar `Unauthorized`, porque `Client access` quedó en `Deny`
  - **Paso 5. Configurar URLs permitidas en la aplicación de Auth0**
    - en la app frontend de Auth0 configurar al menos:
      - **Allowed Callback URLs** → `http://localhost:3000/auth/callback`
      - **Allowed Logout URLs** → `http://localhost:3000`
      - **Allowed Web Origins** → `http://localhost:3000`
  - **Paso 6. Entrar al frontend local**

    ```powershell
    cd "E:\Dev\01- GitHub\Test\apps\web"
    ```

  - **Paso 7. Instalar dependencias:**

    ```powershell
    npm install
    ```

  - **Paso 8. Crear archivo local real de variables:**

    ```powershell
    Copy-Item .env.local.example .env.local
    ```

  - **Paso 9. Editar `.env.local` con valores reales de Auth0**

    Ejemplo:

    ```env
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    NEXT_PUBLIC_API_URL=http://localhost:8000
    NEXT_PUBLIC_AUTH0_DOMAIN=tu-tenant.us.auth0.com
    NEXT_PUBLIC_AUTH0_CLIENT_ID=tu-client-id-publico
    NEXT_PUBLIC_AUTH0_AUDIENCE=https://primeops-api
    ```

    Dónde sale cada valor:
    - `NEXT_PUBLIC_APP_URL` → lo defines tú, en local `http://localhost:3000`
    - `NEXT_PUBLIC_API_URL` → lo defines tú, en local `http://localhost:8000`
    - `NEXT_PUBLIC_AUTH0_DOMAIN` → sale del tenant de Auth0
    - `NEXT_PUBLIC_AUTH0_CLIENT_ID` → sale de la aplicación **SPA** en Auth0
    - `NEXT_PUBLIC_AUTH0_AUDIENCE` → sale del `Identifier` de la **API de PrimeOps** que creaste en Auth0

  - **Paso 10. Levantar el frontend:**

    ```powershell
    npm run dev
    ```

  - **Paso 11. Abrir en navegador:**

    ```text
    http://localhost:3000/login
    ```

  - **Paso 12. Validar visualmente el resultado:**
    - comprobar que aparece la pantalla de ingreso
    - comprobar que el botón deja de estar deshabilitado cuando las variables están completas
    - probar login y verificar que Auth0 redirige primero a `http://localhost:3000/auth/callback`

- **Nota importante sobre usuarios de prueba creados en B1:**
  - si durante esta validación creas un usuario como `test@test.test`, ese usuario queda guardado en el **tenant de Auth0**
  - todavía NO queda persistido en la base local de PrimeOps
  - la sincronización del usuario autenticado hacia la base interna recién se cierra en pasos posteriores (`B3` y `B4`)
