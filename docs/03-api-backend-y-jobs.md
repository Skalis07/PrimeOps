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
      "product_id": "..."
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
- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `GET /api/v1/inventory/movements`
- `POST /api/v1/inventory/adjustments`
- `GET /api/v1/inventory/alerts`
- `POST /api/v1/inventory/restock`

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
2. backend valida stock
3. backend crea `Order` en `pending_payment` con canal `online` o `asistida` según origen
4. backend crea checkout con Stripe
5. frontend redirige al checkout
6. Stripe devuelve al frontend y envía webhook al backend
7. backend valida webhook y actualiza `Payment` / `PaymentEvent`
8. backend sincroniza `Order` a `paid`
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
5. ticket puede pasar a `in_review`, `waiting_customer`, `resolved`, `closed`
6. toda transición queda auditada

### Flujo de reseñas

1. cliente autenticado crea reseña
2. reseña queda visible o moderable según regla final
3. admin puede ocultar/moderar
4. la reseña moderada no se borra del histórico interno

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
5. la autorización de acciones posteriores se resuelve por capacidades, no por texto fijo del rol

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
