# 09. Guía de implementación explicada

> Este documento complementa a `07-ruta-de-construccion-y-avance.md` y `08-bitacora-de-implementacion.md`.
>
> - `07` = checklist oficial y estado del plan.
> - `08` = detalle cronológico de lo que se ejecutó.
> - `09` = vista condensada por hito con archivos clave, propósito y valor práctico.

## Cómo usar esta guía

- Úsala para entender rápido qué piezas importantes ya existen.
- No reemplaza a `07` ni a `08`; resume lo más relevante.
- Cuando un hito avanza, `09` debe actualizarse junto con `08`.
- Si quieres entender el repo sin entrar todavía en todos los detalles finos, este es el documento correcto.

---

## Hito 1 — Base técnica

### Qué aporta este hito

Deja listo el esqueleto real del proyecto para que backend y frontend puedan crecer con orden, sin mezclar todavía lógica de negocio.

### A1 — Estructura base del monorepo

**Qué aporta**

Define el terreno del proyecto y separa claramente dónde vivirá cada parte principal.

En vez de mezclar frontend, backend y piezas compartidas en una sola carpeta, este paso deja una estructura que permite crecer con orden desde el principio.

**Archivos y carpetas clave**

- `apps/` — contenedor de las aplicaciones principales. Aquí viven las partes que se ejecutan como productos reales del sistema.
- `apps/api/` — backend del sistema. Aquí vivirá toda la lógica de FastAPI, base de datos, permisos, reglas y endpoints.
- `apps/web/` — frontend del sistema. Aquí vivirá la aplicación Next.js que usarán admin, vendedor, cliente y soporte.
- `packages/` — espacio para piezas compartidas futuras. Sirve para alojar tipos, configuración o utilidades reutilizables sin duplicarlas entre web y api.

**Qué conviene entender de este paso**

- todavía no hay lógica de negocio aquí
- todavía no hay pantallas reales ni modelos de datos
- este paso solo prepara el terreno para que el proyecto crezca sin desorden

### A2 — Backend FastAPI mínimo

**Qué aporta**

Deja un backend real y pequeño sobre el cual luego se pueden sumar conexión a datos, modelos y endpoints de dominio.

La idea no es construir ya el negocio, sino dejar una aplicación backend auténtica en lugar de una carpeta vacía.

**Archivos clave**

- `apps/api/pyproject.toml` — declara el proyecto Python y sus dependencias base. Es el punto donde se define qué necesita instalar este backend para existir.
- `apps/api/app/main.py` — crea la aplicación FastAPI. Aquí se arma la app y se conectan sus rutas principales.
- `apps/api/app/api/routes/health.py` — endpoint mínimo de salud del backend. Sirve para comprobar más adelante si la API responde.
- `apps/api/app/core/config.py` — concentra configuración mínima. Evita dejar constantes o valores sueltos repartidos por el código.

**Qué conviene entender de este paso**

- FastAPI ya existe como app real
- el backend todavía no sabe nada del negocio
- el endpoint de health sirve como prueba mínima de que la API arranca y responde

### A3 — PostgreSQL local y conexión mínima

**Qué aporta**

Prepara al backend para conectarse a PostgreSQL local sin mezclar todavía ORM ni migraciones.

Este paso cierra la parte de “cómo hablar con la base de datos” antes de introducir modelos o tablas reales.

**Archivos clave**

- `apps/api/.env.example` — ejemplo seguro de variables locales. Muestra qué valores espera el backend sin exponer secretos reales.
- `apps/api/app/core/config.py` — carga automáticamente `apps/api/.env`, arma la configuración y construye la URL de base de datos. Es el punto donde queda resuelto el cableado local entre variables, backend y PostgreSQL.
- `apps/api/pyproject.toml` — declara `python-dotenv` como dependencia mínima para que la carga automática de `apps/api/.env` sea explícita, convencional y fácil de revisar.
- `apps/api/app/db/connection.py` — conexión directa y chequeo simple a PostgreSQL. Sirve para validar conectividad sin meter todavía ORM.
- `apps/api/app/api/routes/health.py` — agrega chequeo de base de datos. Extiende el healthcheck para saber no solo si la API vive, sino si también puede hablar con PostgreSQL.

**Qué conviene entender de este paso**

- la app ya sabe cómo conectarse a PostgreSQL y ahora también carga `apps/api/.env` automáticamente como parte del wiring local de configuración
- todavía no existen modelos ni tablas del dominio
- se validó primero la conectividad básica antes de meter complejidad ORM

### A4 — SQLAlchemy base y Alembic

**Qué aporta**

Deja preparada la base del ORM y del sistema de migraciones para que luego aparezcan modelos y revisiones reales sin improvisar estructura.

Este paso no crea todavía el negocio, pero sí deja listas las herramientas que lo van a sostener.

**Archivos clave**

- `apps/api/app/db/base.py` — base declarativa común de SQLAlchemy. Todos los modelos futuros heredarán de esta base.
- `apps/api/app/db/session.py` — crea `engine`, `SessionLocal` y la dependencia de sesión. Es la pieza que más adelante permitirá a FastAPI trabajar con sesiones de base de datos ordenadas.
- `apps/api/app/models/__init__.py` — punto de entrada para futuros modelos. Alembic lo necesita para descubrir metadata cuando existan entidades reales.
- `apps/api/alembic.ini` — configuración principal de Alembic. Define cómo se ejecutará la herramienta de migraciones.
- `apps/api/alembic/env.py` — conecta Alembic con settings y metadata. Es el puente entre la configuración del proyecto y las migraciones.
- `apps/api/alembic/script.py.mako` — plantilla para migraciones nuevas. Sirve como molde cuando se generen revisiones.
- `apps/api/alembic/versions/` — carpeta donde vivirán las migraciones reales. Por ahora está vacía porque todavía no hay modelos de negocio.

**Qué conviene entender de este paso**

- SQLAlchemy todavía no modela usuarios, productos o pedidos
- Alembic todavía no tiene migraciones reales
- pero la estructura ya está lista para que esos pasos nazcan bien ordenados

### A5 — Frontend Next.js mínimo

**Qué aporta**

Deja una app web real y mínima, lista para crecer luego con auth, layouts y pantallas del negocio.

Igual que en el backend, este paso no busca construir ya la experiencia completa, sino dejar una base auténtica desde la cual crecer.

**Archivos clave**

- `apps/web/package.json` — declara la app frontend y sus dependencias base. Es el punto donde más adelante se instalará y ejecutará Next.js.
- `apps/web/tsconfig.json` — configura TypeScript. Define cómo se tipará el frontend y cómo se interpreta el código `.ts` y `.tsx`.
- `apps/web/next.config.ts` — configuración base de Next.js. Permite crecer luego sin improvisar configuración global.
- `apps/web/next-env.d.ts` — integra tipos del entorno Next.js. Ayuda a que TypeScript entienda el framework correctamente.
- `apps/web/app/layout.tsx` — layout raíz del App Router. Envuelve la aplicación y más adelante podrá alojar navbar, providers o layouts globales.
- `apps/web/app/page.tsx` — página inicial mínima. Corresponde a la ruta principal `/` y sirve como primer contenido visible de la app.
- `apps/web/app/globals.css` — estilos globales base. Es el punto inicial para reglas visuales comunes.

**Qué conviene entender de este paso**

- ya existe una app web real, aunque sea mínima
- todavía no hay auth, dashboard ni catálogo
- `layout.tsx` y `page.tsx` ya marcan la forma base de trabajo del frontend con App Router

### A6 — Configuración compartida y tipos base

**Qué aporta**

Deja una base mínima en `packages/` para compartir contratos simples entre web y api sin inventar todavía dominio ni tooling avanzado del monorepo.

La idea correcta AQUÍ era preparar cimientos, no adelantarse a Hito 2. Por eso se agregan solo piezas transversales y seguras: configuración pública de referencia y tipos TypeScript base.

**Archivos clave**

- `packages/config/src/index.ts` — concentra constantes compartidas seguras del monorepo. Define apps conocidas, URLs locales de referencia, prefijo API y convención de archivos de entorno.
- `packages/config/README.md` — deja documentado el alcance real del paquete y aclara que todavía no maneja secretos ni integraciones reales.
- `packages/shared-types/src/index.ts` — define tipos transversales mínimos. Incluye ambiente base, envelope de API, error común y contrato simple de healthcheck.
- `packages/shared-types/README.md` — explica que este paquete evita duplicación temprana de contratos sin meterse todavía en modelos de negocio.

**Qué conviene entender de este paso**

- `packages/config` NO es un gestor mágico de configuración; solo centraliza referencias seguras y convenciones compartidas
- `packages/shared-types` NO modela usuarios, productos, pedidos ni auth; solo deja contratos base reutilizables
- se evitó a propósito conectar estos paquetes a builds, workspaces o imports reales para mantener A6 pequeño, aislado y revisable

### Qué quedó intencionalmente fuera todavía

- modelos de negocio
- migración inicial real
- instalación y ejecución de dependencias
- autenticación
- pantallas de dominio
- integración frontend-backend

Esto es importante porque evita pensar que el Hito 1 “ya hizo el producto”.

Lo que hizo este hito fue dejar la **infraestructura base del proyecto**. El dominio real empieza a aparecer en los siguientes hitos.

### Por qué importa este hito

Sin esta base, los siguientes hitos quedarían desordenados o forzarían decisiones técnicas improvisadas. Aquí se fija el terreno donde luego vivirán auth, catálogo, pedidos, pagos y soporte.

---

## Hito 2 — Auth y roles

### Qué aporta este hito

Empieza a convertir el scaffold técnico en una aplicación con identidad real. Primero se resuelve entrada de usuario; después vendrán validación backend, contexto interno y permisos de negocio.

### B1 — Integrar Auth0 en frontend

**Qué aporta**

Deja el frontend preparado para iniciar sesión con Auth0 desde una ruta pública y con un provider compatible con Next.js App Router, pero SIN fingir todavía que la seguridad completa ya existe.

Este paso importa porque separa bien los conceptos: aquí solo se prepara la puerta de entrada del login. La validación del token, `/me`, el usuario interno y los roles viven en pasos posteriores.

**Archivos clave**

- `apps/web/package.json` — declara `@auth0/auth0-react` como dependencia del scaffold frontend. No instala nada por sí mismo, pero documenta qué librería usará esta etapa.
- `apps/web/.env.local.example` — documenta las variables públicas mínimas que el frontend necesita para Auth0 y API, siempre con placeholders seguros.
- `apps/web/lib/auth0-config.ts` — centraliza lectura de variables y permite saber si el scaffold está listo para intentar login o debe quedarse en modo seguro.
- `apps/web/components/providers/app-auth0-provider.tsx` — envuelve el App Router con `Auth0Provider` solo cuando la configuración pública está completa.
- `apps/web/components/auth/login-entry.tsx` — concentra la UI mínima del login: botón placeholder si faltan variables y llamada a `loginWithRedirect()` cuando exista configuración real.
- `apps/web/app/login/page.tsx` — crea la ruta pública `/login`, usada como entrada humana al login.
- `apps/web/app/auth/callback/page.tsx` — crea la ruta técnica `/auth/callback`, usada para recibir el retorno de Auth0 sin mezclarlo con la pantalla de acceso.
- `apps/web/app/layout.tsx` — conecta el provider a nivel raíz sin introducir todavía layouts protegidos.

**Qué conviene entender de este paso**

- Auth0 en frontend NO significa que la autorización del sistema ya exista
- este scaffold está hecho para revisión humana y configuración manual posterior, no para cerrar aún el hito completo
- el login real seguirá necesitando crear tenant/app/API en Auth0, cargar variables reales y probar callbacks en navegador antes de marcar B1 como validado
- la app **SPA** entrega `Domain` y `Client ID`; la **API de PrimeOps** entrega la `Audience`
- en esta configuración inicial se dejó la API con política más estricta para **user access** (`Allow via client-grant`) y **client access** deshabilitado (`Deny`)
- si durante la prueba se crea un usuario en Auth0, ese usuario vive primero en Auth0; la base interna de PrimeOps recién lo conocerá cuando se implementen `/me` y la sincronización de usuario

---

## Regla de mantenimiento de este documento

Desde este punto:

- cada nuevo paso validado debe actualizar `08` con el detalle fino
- y también `09` con la versión condensada de lo realmente importante
- `08` debe responder “qué se hizo exactamente”
- `09` debe responder “qué partes importantes aparecieron y para qué sirven"
