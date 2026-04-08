# Plataforma de Gestión Comercial para Pyme

Guía de entrada a la documentación del proyecto.

> Este repositorio HOY contiene documentación de producto y de implementación. La aplicación descrita TODAVÍA está planificada; no existe código de la app en este repo al momento de esta versión documental.

---

## 1. Ruta humana de lectura

Lee en este orden:

1. **`README.md`**  
   Punto de entrada. Explica cómo se organiza la documentación.
2. **[`docs/01-alcance-total-del-mvp.md`](docs/01-alcance-total-del-mvp.md)**  
   Documento humano de **alcance total**: qué es el proyecto, qué resuelve, qué entra, qué no entra y qué significa “MVP listo”.
3. **[`docs/07-ruta-de-construccion-y-avance.md`](docs/07-ruta-de-construccion-y-avance.md)**  
   Documento humano de **ruta + progreso**: dónde estamos, qué sigue, qué incluye cada hito y con qué evidencia se cierra.
4. **[`docs/08-bitacora-de-implementacion.md`](docs/08-bitacora-de-implementacion.md)**  
   Bitácora cronológica breve: qué ya se ejecutó, qué quedó validado y qué se hizo en cada paso.
5. **[`docs/09-guia-de-implementacion-explicada.md`](docs/09-guia-de-implementacion-explicada.md)**  
   Vista condensada por hito: archivos clave, propósito y por qué importan dentro del proyecto.
6. **`docs/02` a `docs/06`**  
   Documentos técnicos de apoyo para implementar áreas concretas sin improvisar.

## 2. Qué controla cada documento

| Documento | Autoridad |
| --- | --- |
| `README.md` | Punto de entrada y mapa humano de lectura |
| `docs/01-alcance-total-del-mvp.md` | Alcance total del producto y definición del MVP |
| `docs/07-ruta-de-construccion-y-avance.md` | Ruta operativa única, orden, avance y cierre por hitos |
| `docs/08-bitacora-de-implementacion.md` | Registro cronológico breve de lo ejecutado y validado |
| `docs/09-guia-de-implementacion-explicada.md` | Resumen por hito de archivos clave, propósito y valor práctico |
| `docs/02` a `docs/06` | Soporte técnico por área |
| `docs/anexos/01`, `02` y `03` | Apoyo puntual de configuración, permisos y glosario |

### Regla simple

- `01` explica **qué producto se construye**
- `07` explica **cómo se construye y cómo se marca el avance**
- `08` explica **qué se ejecutó realmente en cada paso ya trabajado**
- `09` explica **qué archivos importantes existen y para qué sirven dentro de cada hito**
- `02` a `06` explican **cómo implementar cada área técnica**

---

## 3. Estado actual del repositorio vs implementación planificada

### Estado documental actual

- existe la estructura de documentación principal
- están definidas alcance, arquitectura, módulos, reglas y plan de construcción
- el repositorio está preparado para handoff de implementación

### Estado de implementación planificada

La aplicación objetivo es una plataforma web full-stack para una pyme con:

- catálogo con `Product` como entidad comercial y `ProductVariant` como unidad vendible/stockeable
- inventario con movimientos auditables
- pedidos con historial y asignación
- pagos online en modo de prueba
- soporte por tickets
- reseñas de productos
- reportes y documentos PDF
- integraciones externas
- dashboards por rol
- operación comercial por canales `online` y `asistida`

IMPORTANTE: esa lista describe el **objetivo de implementación**, no el estado actual del código del repositorio.

### Cierre documental del modelo MVP

Para evitar ambigüedad entre catálogo, stock y pedidos, el MVP documentado queda cerrado así:

- `Product` = entidad comercial base que agrupa la oferta visible
- `ProductVariant` = unidad concreta que se vende, se cobra y se controla en inventario
- `sku` = código operativo del negocio, distinto del `id` técnico de base de datos
- `barcode` = dato opcional cuando la operación lo necesita
- el inventario pertenece a `ProductVariant`, nunca al `Product`
- cada `OrderItem` guarda snapshots inmutables de nombre, variante, `sku`, precio, modificadores y nota
- el MVP admite **nota corta por ítem** y **modifier groups/options simples**, sin prometer un configurador genérico gigante

## 4. Taxonomía oficial del MVP

Para evitar ambigüedades entre documentos, el MVP usa esta taxonomía cerrada:

- **roles**: `admin`, `vendedor`, `cliente`, `soporte`
- **canales comerciales**: `online`, `asistida`
- **detalle mínimo de venta asistida**: `presencial`, `remota`

La base de autorización se define por **capacidades/permisos granulares** resueltos en backend. En el MVP, esos permisos se administran por configuración y rol; **no** se incluye una UI avanzada para editar permisos por usuario.

---

## 5. Decisiones cerradas del proyecto

- **Estructura documental**: `README.md` + carpeta `docs/`
- **Arquitectura general**: monorepo profesional
- **Frontend**: Next.js + TypeScript + Bootstrap
- **Backend**: FastAPI + SQLAlchemy + Alembic
- **Base de datos local**: PostgreSQL sin Docker
- **Autenticación**: Auth0
- **Pagos del MVP**: Stripe en test mode
- **Google Drive**: OAuth de usuario
- **Modo inicial**: local-first
- **Frontend demo**: Vercel
- **Backend demo temporal**: Railway cuando haga falta exposición pública
- **Correo transaccional del MVP**: Resend
- **Jobs local-first**: compatibles con Windows sin depender de Docker

---

## 6. Mapa documental

| Archivo | Autoridad principal |
| --- | --- |
| `docs/01-alcance-total-del-mvp.md` | Qué producto se construye, qué entra en MVP y qué no |
| `docs/02-arquitectura-y-modelo-de-datos.md` | Arquitectura, stack, entidades, estructura técnica y explicación de cómo se conectan las tecnologías |
| `docs/03-api-backend-y-jobs.md` | Backend, API, contratos y estrategia de jobs |
| `docs/04-frontend-y-experiencia.md` | UI, pantallas, dashboards y experiencia por rol |
| `docs/05-reglas-de-negocio-e-integraciones.md` | Reglas del dominio e integraciones |
| `docs/06-despliegue-y-operacion.md` | Ambientes, operación y despliegue |
| `docs/07-ruta-de-construccion-y-avance.md` | Ruta operativa única, orden, avance y cierre |
| `docs/08-bitacora-de-implementacion.md` | Bitácora breve de implementación validada |
| `docs/09-guia-de-implementacion-explicada.md` | Guía condensada por hitos con archivos clave y propósito |
| `docs/anexos/01-variables-y-configuracion.md` | Variables y configuración concreta |
| `docs/anexos/02-transiciones-y-permisos.md` | Estados, permisos y transiciones |
| `docs/anexos/03-glosario.md` | Definiciones canónicas de términos y vocabulario de dominio |

---

## 7. Regla de trabajo

No avances por entusiasmo; avanza por validación.

Secuencia recomendada:

1. entender el alcance en `docs/01-alcance-total-del-mvp.md`
2. ubicar el hito y el siguiente paso en `docs/07-ruta-de-construccion-y-avance.md`
3. implementar un paso pequeño
4. registrar el detalle ejecutado en `docs/08-bitacora-de-implementacion.md`
5. actualizar `docs/09-guia-de-implementacion-explicada.md` con lo importante del hito
6. verificar evidencia mínima
7. marcar avance SOLO en `docs/07-ruta-de-construccion-y-avance.md`

---

## 8. Siguiente lectura recomendada

- [`docs/01-alcance-total-del-mvp.md`](docs/01-alcance-total-del-mvp.md)
