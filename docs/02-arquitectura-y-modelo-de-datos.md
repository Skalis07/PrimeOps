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
