# 03. API, backend y jobs

## 1. Objetivo del backend

El backend debe comportarse como la fuente de verdad del dominio.

No es solo un CRUD. Debe:

- autenticar contexto
- autorizar acciones
- validar reglas de negocio
- persistir datos consistentes
- registrar auditoría
- orquestar integraciones
- exponer una API limpia y estable

---

## 2. Convenciones generales de API

- prefijo: `/api/v1`
- autenticación: Bearer token emitido por Auth0
- respuesta consistente
- separación entre schemas de entrada y salida
- paginación para recursos listables
- filtros por query params
- enums para estados sensibles

### Envelope recomendado

```json
{
  "data": {},
  "meta": {
    "request_id": "uuid",
    "page": 1,
    "page_size": 20,
    "total": 100
  },
  "error": null
}
```

### Envelope de error recomendado

```json
{
  "data": null,
  "meta": {
    "request_id": "uuid"
  },
  "error": {
    "code": "order_stock_insufficient",
    "message": "No hay stock suficiente para completar el pedido.",
    "details": {
      "product_variant_id": "..."
    }
  }
}
```

---

## 3. Módulos backend sugeridos

```text
app/
├─ api/            # routers
├─ core/           # config, seguridad, utilidades base
├─ db/             # engine, session, base
├─ models/         # modelos SQLAlchemy
├─ schemas/        # Pydantic / DTOs
├─ services/       # reglas de negocio
├─ repositories/   # acceso a datos
├─ integrations/   # Auth0, Stripe, Drive, Resend
├─ jobs/           # tareas diferidas / adaptadores
└─ audit/          # auditoría y logging de negocio
```

---

## 4. Inventario de endpoints

### Contexto/Auth

- `GET /api/v1/me`
- `GET /api/v1/me/permissions`
- `POST /api/v1/auth/sync`

`/me/permissions` devuelve capacidades efectivas. En el MVP sirve para consumo interno de frontend y control del backend; no implica una UI avanzada de edición manual por usuario.

### Usuarios y roles

- `GET /api/v1/users`
- `GET /api/v1/users/{id}`
- `PATCH /api/v1/users/{id}`
- `POST /api/v1/users/{id}/activate`
- `POST /api/v1/users/{id}/deactivate`
- `GET /api/v1/roles`

### Catálogo e inventario

- `GET /api/v1/products`
- `POST /api/v1/products`
- `GET /api/v1/products/{id}`
- `PATCH /api/v1/products/{id}`
- `DELETE /api/v1/products/{id}`
- `GET /api/v1/products/{id}/variants`
- `POST /api/v1/products/{id}/variants`
- `PATCH /api/v1/product-variants/{id}`
- `GET /api/v1/products/{id}/modifier-groups`
- `POST /api/v1/products/{id}/modifier-groups`
- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `GET /api/v1/inventory/movements`
- `POST /api/v1/inventory/adjustments`
- `GET /api/v1/inventory/alerts`
- `POST /api/v1/inventory/restock`

Cada movimiento de inventario expuesto por API debe devolver también `origin_type` y `origin_ref_id` para que ventas, restocks, devoluciones y ajustes manuales sigan siendo trazables sin reconstrucción implícita.

### Pedidos

- `GET /api/v1/orders`
- `POST /api/v1/orders`
- `GET /api/v1/orders/{id}`
- `PATCH /api/v1/orders/{id}/status`
- `POST /api/v1/orders/{id}/assign`
- `POST /api/v1/orders/{id}/cancel`
- `GET /api/v1/orders/{id}/history`

Campos de negocio mínimos del pedido en API:

- `channel`: `online` | `asistida`
- `assisted_context`: `presencial` | `remota` | `null`
- `assisted_by_user_id`: obligatorio cuando la venta es asistida
- `fulfillment_type`: `pickup` | `delivery`
- `delivery_address_snapshot`: obligatorio cuando `fulfillment_type = delivery`
- cada ítem usa `product_variant_id`
- cada ítem puede incluir `item_note` de hasta 255 caracteres
- cada ítem puede incluir `selected_modifier_option_ids[]` al crear el pedido
- la lectura del pedido devuelve snapshots persistidos, no datos recalculados desde catálogo vivo

## 4.1 Contratos mínimos de catálogo

### Producto con variantes y modificadores

```json
{
  "id": "prod_001",
  "category_id": "cat_remeras",
  "name": "Remera básica",
  "description": "Algodón peinado.",
  "status": "active",
  "variants": [
    {
      "id": "var_001",
      "product_id": "prod_001",
      "sku": "REM-NEG-M",
      "name": "Negra / M",
      "barcode": null,
      "price": 19990,
      "cost": 9000,
      "stock_on_hand": 12,
      "stock_tracking_enabled": true,
      "status": "active"
    }
  ],
  "modifier_groups": [
    {
      "id": "mg_packaging",
      "name": "Presentación",
      "min_select": 0,
      "max_select": 1,
      "options": [
        {
          "id": "mo_gift_wrap",
          "name": "Envoltorio regalo",
          "price_delta": 1500,
          "status": "active"
        }
      ]
    }
  ]
}
```

Reglas del contrato:

- `sku` es código operativo y nunca sustituye al `id`
- `barcode` puede ser `null`
- stock, precio y costo pertenecen a `ProductVariant`
- los modificadores son simples y cuelgan de `Product`

## 4.2 Crear pedido con variante, nota y modificadores

### Request

```json
{
  "customer_profile_id": "cp_001",
  "channel": "asistida",
  "assisted_context": "presencial",
  "assisted_by_user_id": "usr_vendedor_01",
  "fulfillment_type": "pickup",
  "items": [
    {
      "product_variant_id": "var_001",
      "quantity": 1,
      "item_note": "Preparar para regalo",
      "selected_modifier_option_ids": ["mo_gift_wrap"]
    }
  ]
}
```

### Response resumida

```json
{
  "data": {
    "id": "ord_001",
    "status": "pending_payment",
    "channel": "asistida",
    "assisted_context": "presencial",
    "assigned_to_user_id": "usr_vendedor_01",
    "fulfillment_type": "pickup",
    "items": [
      {
        "id": "oi_001",
        "product_variant_id": "var_001",
        "quantity": 1,
        "unit_price_snapshot": 19990,
        "modifier_total_snapshot": 1500,
        "line_total_snapshot": 21490,
        "product_name_snapshot": "Remera básica",
        "variant_name_snapshot": "Negra / M",
        "sku_snapshot": "REM-NEG-M",
        "item_note": "Preparar para regalo",
        "selected_modifiers_snapshot": [
          {
            "modifier_group_id": "mg_packaging",
            "modifier_group_name": "Presentación",
            "modifier_option_id": "mo_gift_wrap",
            "modifier_option_name": "Envoltorio regalo",
            "price_delta": 1500
          }
        ]
      }
    ]
  },
  "meta": {
    "request_id": "req_001"
  },
  "error": null
}
```

### Regla crítica de lectura histórica

`GET /api/v1/orders/{id}` debe devolver estos snapshots aunque luego cambien el nombre, precio o estado de la variante original.

`selected_modifiers_snapshot` conserva ids estables para trazabilidad técnica y nombres/deltas para lectura histórica humana. `item_note` debe validarse con máximo de 255 caracteres antes de persistir.

### Regla mínima de stock del MVP

- `POST /api/v1/orders` valida disponibilidad por `product_variant_id`, pero NO reserva stock
- el pedido puede quedar en `pending_payment` sin haber descontado inventario todavía
- cuando el pago pasa a `paid`, el backend debe registrar el descuento de stock con `InventoryMovement.type = sale`
- si el pedido se cancela o el pago falla antes de `paid`, no hay liberación de stock porque nunca hubo reserva previa

### Regla mínima de asignación del MVP

- un pedido `online` puede quedar sin `assigned_to_user_id`
- un pedido `asistida` se autoasigna al `admin` o `vendedor` autenticado que la tramitó
- esa autoasignación no implica que todos los pedidos deban tener asignación formal en el MVP

### Regla mínima de cumplimiento

- si `fulfillment_type = pickup`, el flujo operativo apunta a `ready_for_pickup`
- si `fulfillment_type = delivery`, el pedido debe guardar `delivery_address_snapshot` y el flujo operativo apunta a `shipped`
- el MVP NO agrega tracking carrier, ventanas de entrega ni subestados logísticos extra

### Pagos

- `POST /api/v1/payments/create-checkout`
- `GET /api/v1/payments/{id}`
- `POST /api/v1/payments/webhook`
- `GET /api/v1/orders/{id}/payment-status`

### Soporte y reseñas

- `GET /api/v1/tickets`
- `POST /api/v1/tickets`
- `GET /api/v1/tickets/{id}`
- `GET /api/v1/tickets/{id}/messages`
- `POST /api/v1/tickets/{id}/messages`
- `POST /api/v1/tickets/{id}/assign`
- `PATCH /api/v1/tickets/{id}/status`
- `GET /api/v1/products/{id}/reviews`
- `POST /api/v1/products/{id}/reviews`
- `PATCH /api/v1/reviews/{id}/moderate`

#### Contrato mínimo de tickets de soporte

Campos mínimos expuestos por ticket:

- `subject`
- `status`: `open` | `in_review` | `waiting_customer` | `resolved` | `closed`
- `priority`: `low` | `normal` | `high`
- `assigned_to_user_id`
- `order_id`

Reglas del contrato:

- si el cliente crea el ticket y no se informa prioridad, el backend usa `priority = normal`
- `priority` sirve para ordenar, filtrar y mostrar badges en la mesa de soporte
- el MVP NO asocia `priority` a SLA, timers ni escalaciones automáticas

#### Contrato mínimo de mensajes de soporte

### Request `POST /api/v1/tickets/{id}/messages`

```json
{
  "visibility": "public",
  "message": "Necesito confirmar si el pedido sale hoy."
}
```

```json
{
  "visibility": "internal",
  "message": "Cliente enojado, revisar prioridad con logística."
}
```

### Response resumida

```json
{
  "data": {
    "id": "msg_001",
    "ticket_id": "tic_001",
    "author_user_id": "usr_support_01",
    "visibility": "public",
    "message": "Necesito confirmar si el pedido sale hoy.",
    "created_at": "2026-04-08T10:15:00Z"
  },
  "meta": {
    "request_id": "req_002"
  },
  "error": null
}
```

Reglas del contrato:

- `visibility = public` deja el mensaje visible para cliente y staff autorizado
- `visibility = internal` crea una nota privada solo para staff
- un cliente autenticado solo puede crear mensajes `public` en sus propios tickets
- `GET /api/v1/tickets/{id}/messages` debe filtrar notas `internal` cuando el consumidor sea cliente

#### Contrato mínimo de reseñas

### Request `POST /api/v1/products/{id}/reviews`

```json
{
  "rating": 5,
  "comment": "Muy buena calidad y llegó en tiempo."
}
```

### Response resumida

```json
{
  "data": {
    "id": "rev_001",
    "product_id": "prod_001",
    "customer_profile_id": "cp_001",
    "order_id": "ord_001",
    "rating": 5,
    "comment": "Muy buena calidad y llegó en tiempo.",
    "status": "published",
    "moderated_by_user_id": null,
    "moderated_at": null,
    "created_at": "2026-04-08T11:00:00Z"
  },
  "meta": {
    "request_id": "req_003"
  },
  "error": null
}
```

### Request `PATCH /api/v1/reviews/{id}/moderate`

```json
{
  "status": "hidden",
  "moderation_note": "Lenguaje ofensivo."
}
```

Reglas del contrato:

- una reseña válida nace en `status = published`
- `GET /api/v1/products/{id}/reviews` público solo devuelve reseñas `published`
- administración puede cambiar entre `published` y `hidden`
- moderar NO borra la reseña: conserva autor, rating, comentario y trazabilidad interna

### Dashboards, reportes y observabilidad

- `GET /api/v1/dashboard/admin/summary`
- `GET /api/v1/dashboard/vendedor/summary`
- `GET /api/v1/dashboard/cliente/summary`
- `GET /api/v1/dashboard/soporte/summary`
- `GET /api/v1/reports/sales-summary`
- `GET /api/v1/reports/inventory-summary`
- `GET /api/v1/reports/orders-by-status`
- `POST /api/v1/reports/export/sales-pdf`
- `POST /api/v1/reports/export/orders-csv`
- `GET /api/v1/jobs`
- `GET /api/v1/jobs/{id}`
- `POST /api/v1/jobs/{id}/retry`
- `GET /api/v1/audit/logs`

---

## 5. Priorización real de backend

### Prioridad 1

- `/me`
- auth sync
- productos/categorías
- movimientos de inventario
- pedidos
- create-checkout
- webhook

### Prioridad 2

- tickets
- reseñas
- dashboards
- reportes
- jobs
- audit logs

La idea correcta es esta: primero flujo comercial real, después refinamiento operativo.

---

## 6. Estrategia de pagos con Stripe

### Decisión cerrada

Se usará **Stripe en test mode**.

### Flujo de pago oficial del proyecto

1. cliente arma carrito
2. backend valida stock por `product_variant_id`
3. backend crea `Order` en `pending_payment` con canal `online` o `asistida` según origen
4. backend crea checkout con Stripe
5. frontend redirige al checkout
6. Stripe devuelve al frontend y envía webhook al backend
7. backend valida webhook y actualiza `Payment` / `PaymentEvent`
8. backend sincroniza `Order` a `paid` y descuenta stock por variante
9. se habilita comprobante y correo

### Regla no negociable

El retorno del navegador **NO** es la fuente de verdad del pago.

La fuente de verdad es:

- webhook validado
- o consulta verificada al proveedor

---

## 7. Estrategia de jobs y tareas diferidas

### Objetivo

Evitar bloquear la UX con operaciones lentas.

### Casos iniciales

- generar comprobante PDF
- enviar correo de confirmación
- exportar pedidos a Drive
- recalcular métricas resumidas
- alertar stock bajo

### Modo local-first

Como el proyecto arranca en Windows, sin Docker y con backend local, la implementación local debe ser simple y fiable.

Por eso se documenta esta estrategia:

- abstracción de job en el dominio
- ejecución simple compatible con entorno local
- registro persistente en `BackgroundJob`
- posibilidad de reintento manual

### Modo hosted posterior

Cuando el backend pase a un hosting Linux más serio, se podrá activar:

- worker separado
- cola dedicada
- scheduler formal

La arquitectura queda preparada, pero el proyecto no se atasca por imponer complejidad demasiado pronto.

---

## 8. Flujos técnicos importantes

### Flujo de soporte

1. cliente crea ticket
2. backend lo deja en `open`
3. soporte/admin asigna
4. mensajes quedan registrados
4.1 cada mensaje declara `visibility = public | internal`
5. ticket puede pasar a `in_review`, `waiting_customer`, `resolved`, `closed`
6. toda transición queda auditada

### Flujo de reseñas

1. cliente autenticado crea reseña
2. backend valida `rating` y comentario, y la crea en `status = published`
3. frontend público solo lista reseñas `published`
4. admin puede cambiar la reseña entre `published` y `hidden`
5. si queda `hidden`, desaparece de la vista pública pero conserva trazabilidad interna
6. la reseña moderada no se borra del histórico interno

### Flujo de PDF

1. backend recibe solicitud o evento
2. genera HTML
3. renderiza PDF
4. guarda referencia en `PdfDocument`
5. expone descarga o subida posterior a Drive

### Flujo de venta asistida

1. admin o vendedor inicia un pedido para un cliente
2. backend exige `channel = asistida`
3. backend exige `assisted_context = presencial | remota`
4. la orden guarda quién asistió la venta
5. cada línea exige `product_variant_id` y puede incluir nota corta/modificadores simples
6. la autorización de acciones posteriores se resuelve por capacidades, no por texto fijo del rol

## 8.1 Checklist manual de contratos usables

- crear un `Product` con al menos una `ProductVariant`
- verificar que la variante tenga `sku` propio y `barcode` opcional
- registrar o listar grupos/opciones de modificadores simples a nivel `Product`
- crear un pedido usando `product_variant_id`
- crear un pedido `pickup` y otro `delivery` comprobando las reglas mínimas de cumplimiento
- comprobar que el pedido acepta `item_note`
- comprobar que el pedido devuelve `selected_modifiers_snapshot`
- comprobar que `GET /orders/{id}` sigue mostrando snapshots aunque se edite luego el catálogo
- comprobar que un cliente no ve mensajes `internal` del ticket
- comprobar que un ticket nuevo aparece con `priority = normal` si nadie la definió
- comprobar que `GET /products/{id}/reviews` público no devuelve reseñas `hidden`

---

## 9. Criterios técnicos mínimos del backend

- separación router / schema / service / repository
- auditoría para acciones sensibles
- manejo coherente de errores
- request id trazable
- validación de permisos en backend
- migraciones con Alembic desde el inicio
- configuración por ambiente

---

## 10. Documento siguiente

- [`04-frontend-y-experiencia.md`](04-frontend-y-experiencia.md)

## 11. Relación con los documentos humanos

- Alcance total: [`01-alcance-total-del-mvp.md`](01-alcance-total-del-mvp.md)
- Ruta, orden y avance: [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md)
