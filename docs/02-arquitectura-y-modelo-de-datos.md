# 02. Arquitectura y modelo de datos

## 1. Arquitectura objetivo

El sistema se diseña como un **monorepo profesional** con frontend y backend separados lógicamente, pero coordinados dentro del mismo proyecto.

---

## 2. Stack decidido

| Capa | Tecnología | Decisión |
| --- | --- | --- |
| Frontend | Next.js + TypeScript + Bootstrap | Cerrado |
| Backend | FastAPI | Cerrado |
| ORM | SQLAlchemy | Cerrado |
| Migraciones | Alembic | Cerrado |
| Base de datos | PostgreSQL local sin Docker | Cerrado |
| Auth | Auth0 | Cerrado |
| Pagos | Stripe test mode | Cerrado |
| Documentos | HTML + PDF | Cerrado |
| Drive | Google Drive OAuth de usuario | Cerrado |
| Correo | Resend | Cerrado |

---

## 2.1 Justificación breve del stack

### Next.js + TypeScript + Bootstrap

- **Next.js** se eligió porque da una base seria para frontend web moderno, rutas, composición de UI y crecimiento posterior sin inventar estructura desde cero.
- **TypeScript** reduce ambigüedad entre frontend, backend y documentación al forzar contratos más claros.
- **Bootstrap** se eligió para avanzar rápido con una UI consistente y pragmática, sin gastar el MVP en sistema de diseño complejo.

### FastAPI

- se eligió por su velocidad de desarrollo, tipado claro y buen encaje con APIs modernas
- permite modelar un backend limpio para negocio sin la pesadez de frameworks más opinados
- es una base adecuada para crecer luego hacia validaciones, servicios e integraciones

### SQLAlchemy + Alembic

- **SQLAlchemy** se eligió para tener un ORM maduro y flexible, capaz de modelar bien un dominio con relaciones, estados y trazabilidad
- **Alembic** acompaña naturalmente a SQLAlchemy y permite versionar cambios de base de datos con disciplina
- esta combinación da más control que soluciones demasiado mágicas y encaja bien con un proyecto que quiere dejar arquitectura seria

### PostgreSQL local sin Docker

- PostgreSQL se eligió porque es una base robusta, estándar y adecuada para relaciones, historial y consistencia transaccional
- correrlo localmente sin Docker reduce fricción en este entorno concreto y acelera el arranque del MVP
- se privilegia una base profesional real antes que una solución liviana pero limitada

### Auth0

- se eligió para no gastar el MVP construyendo autenticación desde cero
- resuelve login y flujo de identidad con una herramienta probada
- permite separar correctamente autenticación externa de autorización interna por roles/capacidades

### Stripe test mode

- se eligió porque permite demostrar flujo de pago realista sin dinero real
- da webhooks y estados de pago creíbles para modelar el dominio correctamente
- evita inventar un sistema de pago falso demasiado simplificado

### HTML + PDF

- se eligió porque permite generar comprobantes y reportes reutilizando plantillas web
- reduce complejidad frente a motores documentales más pesados para este MVP

### Google Drive OAuth de usuario

- se eligió porque encaja mejor con una pyme real que opera con cuentas Google normales
- evita adelantar complejidad de service accounts o infraestructura enterprise
- permite guardar documentos del negocio en una cuenta controlada por el usuario

### Resend

- se eligió para resolver correo transaccional de forma simple y moderna
- cubre bien confirmaciones, avisos y notificaciones del MVP sin meter una plataforma de mensajería más compleja de la necesaria

### Criterio general de selección

El stack no se eligió para impresionar con tecnología exótica. Se eligió para equilibrar:

- velocidad de construcción del MVP
- claridad arquitectónica
- bajo dolor operativo en entorno local
- capacidad real de crecimiento posterior sin rehacer el núcleo

---

## 2.2 Cómo encajan las tecnologías entre sí

Este apartado explica **qué rol cumple cada tecnología** y **cómo se conectan entre sí** dentro del proyecto.

### Frontend: Next.js + TypeScript + Bootstrap

- **Next.js** es el framework del frontend. Vive en `apps/web` y se encarga de renderizar páginas, manejar rutas y estructurar la aplicación web.
- **TypeScript** corre dentro del frontend para tipar datos, props, respuestas de API y contratos internos. Su función es reducir errores por forma de datos mal interpretada.
- **Bootstrap** resuelve la capa visual base: grillas, formularios, tablas, botones y layout. No gobierna la lógica; solo acelera una UI consistente.

En conjunto:

- Next.js organiza la aplicación web
- TypeScript tipa la lógica y los contratos
- Bootstrap da la base visual del MVP

### Backend: FastAPI

- **FastAPI** vive en `apps/api`.
- expone endpoints HTTP
- valida entradas y salidas
- aplica reglas de negocio desde backend
- centraliza permisos, estados y trazabilidad

Su trabajo es recibir peticiones desde Next.js, procesarlas correctamente y hablar con la base de datos y las integraciones externas.

### Base de datos: PostgreSQL

- **PostgreSQL** es la fuente principal de verdad del sistema.
- guarda usuarios internos, clientes, productos, variantes, movimientos, pedidos, pagos, tickets y reseñas.
- el backend no debe depender de memoria temporal para el negocio; el estado real vive aquí.

### ORM: SQLAlchemy

Un **ORM** (Object-Relational Mapper) es una capa que conecta el mundo del código con el mundo de la base de datos relacional.

En vez de escribir todo como SQL manual todo el tiempo, el ORM permite trabajar con:

- modelos
- relaciones
- consultas
- mapeo entre objetos Python y tablas SQL

En este proyecto:

- **SQLAlchemy** será la capa que conecte FastAPI con PostgreSQL de forma estructurada.
- FastAPI define endpoints y reglas.
- SQLAlchemy modela entidades y consultas.
- PostgreSQL persiste el estado real.

### Migraciones: Alembic

Una migración es un cambio versionado de la estructura de la base de datos.

**Alembic** trabaja sobre SQLAlchemy para:

- crear nuevas tablas
- cambiar columnas
- agregar índices o constraints
- llevar la base de datos del proyecto de una versión estructural a otra

Conexión correcta entre estas piezas:

- **SQLAlchemy** define el modelo de datos en código
- **Alembic** versiona y aplica cambios estructurales derivados de ese modelo
- **PostgreSQL** ejecuta esos cambios y almacena los datos reales

En simple:

- SQLAlchemy = cómo se modela la base en Python
- Alembic = cómo se evolucionan esos cambios sin romper orden
- PostgreSQL = dónde vive finalmente la información

### Autenticación: Auth0

**Auth0** resuelve la autenticación, no toda la seguridad del dominio.

Su rol es:

- login
- emisión/validación inicial de identidad
- redirecciones de acceso

Pero la autorización del negocio sigue dentro del sistema:

- Auth0 dice **quién eres**
- la app dice **qué puedes hacer**

Por eso el flujo correcto es:

1. el usuario inicia sesión con Auth0
2. el frontend obtiene identidad/token
3. el backend FastAPI valida ese token
4. la app carga el usuario interno, su rol y sus capacidades
5. el sistema decide permisos reales sobre pedidos, stock, tickets, etc.

### Pagos: Stripe test mode

**Stripe** entra como proveedor de pagos del MVP.

Su rol es:

- generar checkout
- simular un flujo realista de pago
- enviar webhooks/eventos

El flujo esperado es:

1. Next.js dispara el inicio del checkout
2. FastAPI crea la intención o sesión necesaria
3. Stripe procesa el pago en modo test
4. Stripe devuelve eventos al backend
5. FastAPI confirma el pago y actualiza el pedido

La fuente de verdad del pago NO es la pantalla del navegador, sino el backend validando el resultado del proveedor.

### Correo: Resend

**Resend** cubre correo transaccional.

Entra cuando el backend necesita enviar cosas como:

- confirmación de pedido
- aviso de ticket resuelto
- notificaciones operativas simples

No gobierna el negocio; solo transporta mensajes salientes.

### Archivos y documentos: HTML + PDF + Google Drive

- el sistema genera documentos desde plantillas HTML/PDF
- esos documentos pueden guardarse localmente al inicio
- luego pueden subirse a Google Drive

**Google Drive OAuth de usuario** entra como integración de almacenamiento del negocio.

Su rol es:

- recibir autorización del usuario admin
- permitir subir/reportar archivos en la cuenta del negocio

No reemplaza la base de datos: la base guarda referencias y trazabilidad; Drive guarda archivos.

### Cómo se conecta todo el sistema

Flujo resumido:

1. **Next.js** muestra la interfaz
2. **TypeScript** asegura contratos y formas de datos en frontend
3. **Bootstrap** da estructura visual rápida
4. **Auth0** autentica al usuario
5. **FastAPI** recibe peticiones y aplica reglas del dominio
6. **SQLAlchemy** modela y consulta datos
7. **Alembic** mantiene la evolución estructural de la base
8. **PostgreSQL** persiste el estado real
9. **Stripe** resuelve pagos test
10. **Resend** envía correos
11. **Google Drive** guarda documentos cuando corresponda

### Resumen mental correcto

- **Next.js** = interfaz
- **TypeScript** = contratos del frontend
- **Bootstrap** = base visual
- **FastAPI** = reglas y API
- **SQLAlchemy** = puente entre código Python y base relacional
- **Alembic** = versionado de cambios de base de datos
- **PostgreSQL** = persistencia real
- **Auth0** = identidad/login
- **Stripe** = pagos
- **Resend** = correo
- **Google Drive** = almacenamiento documental externo

---

## 3. Estructura recomendada del monorepo

```text
/
├─ README.md
├─ docs/
├─ apps/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ config/
│  ├─ shared-types/
│  └─ ui/               # opcional si luego se consolida
├─ scripts/
├─ storage/             # documentos locales en desarrollo
└─ .env*                # solo ejemplos; secretos reales fuera de repo
```

### Detalle por app

```text
apps/web/
├─ src/
│  ├─ app/
│  ├─ components/
│  ├─ features/
│  ├─ lib/
│  ├─ hooks/
│  ├─ types/
│  └─ styles/

apps/api/
├─ app/
│  ├─ api/
│  ├─ core/
│  ├─ db/
│  ├─ models/
│  ├─ schemas/
│  ├─ services/
│  ├─ repositories/
│  ├─ integrations/
│  ├─ jobs/
│  └─ audit/
├─ alembic/
└─ tests/
```

---

## 4. Principios de arquitectura no negociables

- **La UI no decide permisos**: el backend autoriza.
- **Auth0 autentica; la app autoriza**.
- **Cada módulo de negocio tiene límites claros**.
- **Las acciones sensibles dejan trazabilidad**.
- **Los cambios de estado se validan en backend**.
- **El proyecto se construye por incrementos verticales**.
- **La documentación manda sobre la improvisación**.

---

## 5. Flujo lógico del sistema

```text
Cliente/Vendedor/Admin/Soporte
        │
        ▼
      Frontend
        │
        ▼
   API FastAPI
        │
 ┌──────┼───────────┬──────────────┬─────────────┐
 ▼      ▼           ▼              ▼             ▼
Auth  Dominio     PostgreSQL   Integraciones   Auditoría
0     negocio                  externas        y logs
```

---

## 6. Decisión importante sobre jobs en entorno local

### Realidad técnica del entorno actual

El usuario trabaja en Windows y no quiere Docker. En ese escenario, la estrategia de jobs no debe depender como baseline de una cola Linux-only desde el día 1.

### Decisión documental

- **Modo local-first**: jobs simples mediante capa de servicios + tareas diferidas compatibles con desarrollo local
- **Modo hosted posterior**: worker separado y cola dedicada en entorno Linux cuando el proyecto suba de nivel

Esto deja el diseño profesional y evita forzar una experiencia local incómoda o frágil.

---

## 7. Entidades del dominio

| Entidad | Propósito |
| --- | --- |
| User | usuario autenticado dentro del dominio |
| Role | rol funcional oficial (`admin`, `vendedor`, `cliente`, `soporte`) |
| Capability | permiso granular atómico resuelto por backend |
| RoleCapability | mapeo entre rol y capacidad |
| CustomerProfile | datos ampliados del cliente |
| InternalUserProfile | datos ampliados del usuario interno (`admin`, `vendedor`, `soporte`) |
| Category | categoría de productos |
| Product | producto comercial padre |
| ProductVariant | unidad vendible y stockeable |
| ModifierGroup | grupo simple de opciones elegibles para un producto |
| ModifierOption | opción simple dentro de un grupo |
| InventoryMovement | movimiento de stock |
| Order | pedido principal |
| OrderItem | línea de pedido |
| OrderStatusHistory | historial de estados del pedido |
| SalesChannel | catálogo lógico de canales comerciales |
| AssistedSaleContext | detalle del canal asistido |
| Payment | transacción o intento de pago |
| PaymentEvent | evento recibido del proveedor |
| SupportTicket | ticket de soporte |
| SupportMessage | mensajes del ticket |
| ProductReview | reseña de producto |
| PdfDocument | documento generado |
| BackgroundJob | ejecución de tarea o proceso diferido |
| AuditLog | auditoría de negocio |
| IntegrationSyncLog | sincronización con terceros |
| NotificationLog | correo/aviso enviado |

---

## 8. Reglas mínimas de modelado

- todas las tablas críticas llevan `created_at` y `updated_at`
- tablas sensibles podrán llevar `is_active` o baja lógica
- todo cambio de stock de `ProductVariant` se registra como movimiento, no solo como número final
- todo pago relevante deja `PaymentEvent`
- toda transición sensible deja historial
- documentos generados deben tener referencia a entidad origen
- todo `Order` debe registrar `channel`
- si `channel = asistida`, el pedido debe registrar además `assisted_context` (`presencial` o `remota`) y el usuario interno que asistió la venta
- `sku` es código operativo del negocio; JAMÁS sustituye al `id` técnico
- `barcode` es opcional y no bloquea la existencia de una variante
- `OrderItem` debe leer histórico comercial desde snapshots persistidos, no desde catálogo vivo

### Base de autorización del modelo

La arquitectura de acceso se apoya en esta relación:

`User -> Role -> Capability`

Eso permite:

- mantener roles humanos simples en el MVP
- resolver permisos granulares en backend
- agregar nuevos roles o capacidades en el futuro sin rediseñar tablas críticas

**Límite deliberado del MVP**: no se documenta una UI avanzada de administración de permisos por usuario. La operación inicial trabaja con capacidades definidas por rol y ajustes internos controlados por configuración.

---

## 8.1 Modelo comercial cerrado del MVP

El dominio comercial mínimo queda así:

```text
Category
   └─ Product
        ├─ ProductVariant
        │    └─ InventoryMovement
        └─ ModifierGroup
             └─ ModifierOption

Order
   └─ OrderItem
        ├─ product_variant_id
        ├─ item_note?
        └─ selected_modifiers_snapshot[]
```

### Regla de ownership

- `Product` organiza la oferta comercial y la descripción visible
- `ProductVariant` concentra `sku`, `barcode?`, precio, costo y stock
- `InventoryMovement` siempre referencia `product_variant_id`
- crear un `Order` en `pending_payment` valida stock, pero NO reserva stock en el MVP
- el descuento de stock ocurre cuando el pago se confirma y debe dejar `InventoryMovement` auditable de tipo `sale`
- si el pedido se cancela o falla antes de `paid`, no se genera movimiento compensatorio porque todavía no hubo descuento
- los modificadores pertenecen al `Product` y se copian como snapshot simple al `OrderItem`
- los modificadores pueden alterar el precio de la línea, pero NO son un subsistema genérico de configurador avanzado

## 8.2 Campos mínimos por entidad clave

### Category

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `name` | string | sí | nombre visible |
| `slug` | string | sí | identificador legible para URL/filtros |
| `parent_id` | FK nullable | no | jerarquía simple opcional |
| `status` | enum | sí | `active` / `inactive` |

### Product

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `category_id` | FK | sí | categoría principal |
| `name` | string | sí | nombre comercial base |
| `description` | text | no | detalle extendido |
| `status` | enum | sí | `draft`, `active`, `inactive` |

`Product` NO es la unidad stockeable. No guarda `sku`, `barcode`, precio ni stock como autoridad del MVP.

### ProductVariant

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `product_id` | FK | sí | producto padre |
| `sku` | string | sí | código operativo único del negocio |
| `name` | string | sí | nombre visible de la variante |
| `barcode` | string | no | opcional |
| `price` | decimal | sí | precio de venta |
| `cost` | decimal | no | costo interno cuando aplique |
| `stock_on_hand` | integer | sí | stock actual controlado |
| `stock_tracking_enabled` | boolean | sí | permite distinguir variantes sin control estricto |
| `status` | enum | sí | `active`, `inactive` |

### ModifierGroup

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `product_id` | FK | sí | producto al que aplica |
| `name` | string | sí | ej. tamaño, extras |
| `min_select` | integer | sí | mínimo permitido |
| `max_select` | integer | sí | máximo permitido |
| `status` | enum | sí | `active`, `inactive` |

### ModifierOption

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `group_id` | FK | sí | grupo padre |
| `name` | string | sí | nombre visible |
| `price_delta` | decimal | sí | impacto sobre el precio, puede ser `0` |
| `status` | enum | sí | `active`, `inactive` |

### CustomerProfile

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `user_id` | FK | sí | usuario autenticado asociado |
| `full_name` | string | sí | nombre para operación y comprobantes |
| `phone` | string | no | contacto operativo |
| `default_address` | text | no | dirección resumida reutilizable |
| `status` | enum | sí | `active`, `inactive` |

### InventoryMovement

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `product_variant_id` | FK | sí | variante afectada |
| `actor_type` | enum | sí | `user` / `system` |
| `actor_user_id` | FK nullable | no | usuario responsable cuando aplica |
| `type` | enum | sí | `adjustment`, `sale`, `restock`, `return` |
| `origin_type` | enum/string | sí | origen operativo: `order`, `manual_adjustment`, `manual_restock`, `return`, `system` |
| `origin_ref_id` | UUID/string nullable | no | id o referencia del registro origen cuando exista |
| `delta_quantity` | integer signed | sí | delta del movimiento |
| `reason` | string | sí | motivo legible |
| `stock_after` | integer | sí | stock resultante luego del movimiento |
| `occurred_at` | datetime | sí | momento del evento |

`InventoryMovement` es un registro **append-only de auditoría operativa**. No se edita para “corregir” el pasado: si hubo un error, se registra un nuevo movimiento compensatorio con su actor, motivo y referencia de origen. `type` explica la naturaleza del movimiento; `origin_type` + `origin_ref_id` permiten rastrear qué entidad o acción concreta lo disparó.

### Order

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `customer_profile_id` | FK | sí | cliente del pedido |
| `channel` | enum | sí | `online` / `asistida` |
| `assisted_context` | enum nullable | no | `presencial` / `remota` cuando aplica |
| `assisted_by_user_id` | FK nullable | no | obligatorio si `channel = asistida` |
| `assigned_to_user_id` | FK nullable | no | responsable operativo cuando exista; en `asistida` se autoasigna al usuario que la tramita |
| `fulfillment_type` | enum | sí | `pickup` / `delivery` |
| `delivery_address_snapshot` | text nullable | no | obligatorio cuando `fulfillment_type = delivery` |
| `status` | enum | sí | ciclo del pedido |
| `currency` | string | sí | moneda operativa |
| `subtotal_amount` | decimal | sí | suma de líneas |
| `discount_amount` | decimal | sí | puede ser `0` |
| `total_amount` | decimal | sí | total final |
| `placed_at` | datetime | no | fecha efectiva de confirmación |

### OrderItem

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `order_id` | FK | sí | pedido padre |
| `product_variant_id` | FK | sí | trazabilidad a variante original |
| `quantity` | integer | sí | cantidad vendida |
| `unit_price_snapshot` | decimal | sí | precio base congelado |
| `modifier_total_snapshot` | decimal | sí | suma de modificadores, puede ser `0` |
| `line_total_snapshot` | decimal | sí | total final de la línea |
| `product_name_snapshot` | string | sí | nombre histórico del producto |
| `variant_name_snapshot` | string | sí | nombre histórico de la variante |
| `sku_snapshot` | string | sí | código operativo histórico |
| `selected_modifiers_snapshot` | JSON/list | sí | lista inmutable con `modifier_group_id`, `modifier_group_name`, `modifier_option_id`, `modifier_option_name` y `price_delta` |
| `item_note` | string(255) | no | nota libre por línea, máximo 255 caracteres |

### Payment

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `order_id` | FK | sí | pedido asociado |
| `provider` | enum/string | sí | en MVP: `stripe` |
| `provider_payment_id` | string | no | referencia externa |
| `status` | enum | sí | `pending`, `authorized`, `paid`, `failed`, `cancelled` |
| `amount` | decimal | sí | monto esperado/cobrado |
| `currency` | string | sí | moneda |
| `created_at` | datetime | sí | traza temporal |

### PaymentEvent

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `payment_id` | FK | sí | pago relacionado |
| `provider_event_id` | string | no | id externo si existe |
| `event_type` | string | sí | tipo del webhook/evento |
| `payload_snapshot` | JSON | sí | payload recibido para auditoría |
| `processed_at` | datetime | sí | momento de procesamiento |
| `status` | enum | sí | `accepted`, `ignored`, `failed` |

### SupportTicket

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `customer_profile_id` | FK | sí | cliente dueño del ticket |
| `order_id` | FK nullable | no | vínculo opcional a pedido |
| `subject` | string | sí | resumen visible del caso |
| `status` | enum | sí | `open`, `in_review`, `waiting_customer`, `resolved`, `closed` |
| `priority` | enum | sí | `low`, `normal`, `high`; default recomendado `normal` |
| `assigned_to_user_id` | FK nullable | no | soporte/admin responsable cuando exista |
| `created_at` | datetime | sí | alta del caso |

`SupportTicket.priority` existe para ordenar y destacar trabajo operativo en UI/API. En el MVP NO dispara SLA, timers ni automatizaciones especiales.

### SupportMessage

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `ticket_id` | FK | sí | ticket padre |
| `author_user_id` | FK | sí | autor autenticado |
| `visibility` | enum | sí | `public` / `internal` |
| `message` | text | sí | cuerpo del mensaje |
| `created_at` | datetime | sí | momento de publicación |

`SupportMessage.visibility = public` significa visible para cliente y equipo interno dentro del ticket. `internal` significa nota privada solo para staff autorizado; el cliente JAMÁS la recibe ni la lista.

### ProductReview

| Campo | Tipo conceptual | Obligatorio | Nota |
| --- | --- | --- | --- |
| `id` | UUID/int | sí | identidad técnica |
| `product_id` | FK | sí | producto reseñado |
| `customer_profile_id` | FK | sí | cliente autor |
| `order_id` | FK nullable | no | referencia opcional al pedido relacionado |
| `rating` | integer | sí | escala entera simple de `1` a `5` |
| `comment` | text | sí | comentario visible |
| `status` | enum | sí | `published` / `hidden` |
| `moderated_by_user_id` | FK nullable | no | admin que ocultó o republicó cuando aplique |
| `moderated_at` | datetime nullable | no | momento de moderación |
| `moderation_note` | string nullable | no | motivo corto interno de la moderación |
| `created_at` | datetime | sí | alta de la reseña |

Comportamiento mínimo del MVP para `ProductReview`:

- al crear una reseña válida, nace en `status = published`
- `published` se muestra en vistas públicas y del cliente
- `hidden` se oculta de vistas públicas, pero sigue visible para administración y auditoría interna
- la moderación es binaria (`published` / `hidden`), SIN workflow extra de aprobación previa

## 8.3 Snapshot comercial inmutable

`OrderItem` conserva el histórico que vio el cliente y que operó el negocio al momento de vender. Por eso el backend debe guardar snapshots de:

- nombre de producto
- nombre de variante
- `sku`
- precio unitario
- modificadores elegidos con ids estables, nombres visibles y delta de precio
- nota del ítem

Si después cambia el catálogo vivo, el pedido histórico NO se recompone desde `Product` o `ProductVariant`.

Forma mínima recomendada de `selected_modifiers_snapshot` por opción elegida:

```json
[
  {
    "modifier_group_id": "mg_packaging",
    "modifier_group_name": "Presentación",
    "modifier_option_id": "mo_gift_wrap",
    "modifier_option_name": "Envoltorio regalo",
    "price_delta": 1500
  }
]
```

---

## 9. Estados clave del dominio

### Pedido

| Estado | Significado |
| --- | --- |
| `draft` | armado inicial o carrito |
| `pending_payment` | creado, pendiente de pago confirmado |
| `paid` | pago confirmado |
| `preparing` | en preparación |
| `ready_for_pickup` | listo para retiro |
| `shipped` | despachado |
| `completed` | flujo comercial finalizado |
| `cancelled` | cancelado con trazabilidad |

### Regla mínima de cumplimiento

- `fulfillment_type = pickup` habilita el estado operativo `ready_for_pickup`
- `fulfillment_type = delivery` habilita el estado operativo `shipped`
- el pedido puede compartir estados previos (`draft`, `pending_payment`, `paid`, `preparing`) sin importar el tipo de cumplimiento
- un pedido `online` puede existir sin `assigned_to_user_id`
- un pedido `asistida` se autoasigna al `admin` o `vendedor` autenticado que lo tramitó
- no se documentan subflujos logísticos más finos en el MVP

### Ticket

| Estado | Significado |
| --- | --- |
| `open` | recién creado |
| `in_review` | en revisión por soporte |
| `waiting_customer` | esperando respuesta del cliente |
| `resolved` | resuelto |
| `closed` | cierre administrativo |

### Pago

| Estado | Significado |
| --- | --- |
| `pending` | creado, sin confirmación |
| `authorized` | autorizado según proveedor |
| `paid` | confirmado |
| `failed` | fallido |
| `cancelled` | cancelado |
| `refunded` | futuro |

### Job

| Estado | Significado |
| --- | --- |
| `pending` | pendiente |
| `started` | en ejecución |
| `success` | completado |
| `failure` | fallido |
| `retrying` | reintentando |

---

## 10. Dependencias críticas entre módulos

- Auth habilita acceso y contexto.
- Catálogo e inventario habilitan pedidos.
- Pedidos habilitan pagos, soporte y comprobantes.
- Pedidos dependen también de canal comercial y, cuando aplique, de contexto de venta asistida.
- Pagos habilitan comprobante, correo y parte del reporting.
- Soporte depende de usuarios y, muchas veces, de pedidos.
- Reportes dependen de calidad de datos de pedidos, inventario, pagos y logs.

---

## 11. Documento siguiente

- [`03-api-backend-y-jobs.md`](03-api-backend-y-jobs.md)

## 12. Relación con los documentos humanos

- Alcance total: [`01-alcance-total-del-mvp.md`](01-alcance-total-del-mvp.md)
- Ruta, orden y avance: [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md)
- Bitácora de implementación: [`08-bitacora-de-implementacion.md`](08-bitacora-de-implementacion.md)
