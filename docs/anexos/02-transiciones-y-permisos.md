# Anexo 02. Transiciones y permisos

## 1. Pedido — transiciones permitidas

| Desde | Hacia | Quién puede | Condición |
| --- | --- | --- | --- |
| `draft` | `pending_payment` | cliente / admin / vendedor | pedido válido, stock disponible y canal registrado; NO reserva stock |
| `pending_payment` | `paid` | sistema | webhook o validación proveedor correcta; descuenta stock de variantes |
| `pending_payment` | `cancelled` | cliente / admin / vendedor autorizado | aún no pagado o política válida; no requiere liberar stock porque no hubo reserva |
| `paid` | `preparing` | vendedor / admin | pedido confirmado, stock descontado y asignable |
| `preparing` | `ready_for_pickup` | vendedor / admin | `fulfillment_type = pickup` |
| `preparing` | `shipped` | vendedor / admin | `fulfillment_type = delivery` y dirección registrada |
| `ready_for_pickup` | `completed` | vendedor / admin | entrega finalizada |
| `shipped` | `completed` | vendedor / admin | entrega confirmada |
| cualquier estado operativo | `cancelled` | solo admin o regla explícita | debe quedar auditado |

### Regla crítica

Nadie debe poder pasar un pedido a `paid` manualmente desde UI normal.

---

## 2. Ticket — transiciones permitidas

| Desde | Hacia | Quién puede | Condición |
| --- | --- | --- | --- |
| `open` | `in_review` | soporte / admin | ticket asignado o tomado |
| `in_review` | `waiting_customer` | soporte / admin | se requiere respuesta del cliente |
| `waiting_customer` | `in_review` | soporte / admin | el cliente respondió |
| `in_review` | `resolved` | soporte / admin | caso resuelto |
| `resolved` | `closed` | soporte / admin | cierre administrativo |
| `closed` | `in_review` | soporte / admin | reapertura justificada |

---

## 3. Pago — transiciones permitidas

| Desde | Hacia | Quién puede | Condición |
| --- | --- | --- | --- |
| `pending` | `authorized` | sistema/proveedor | evento válido |
| `pending` | `paid` | sistema/proveedor | confirmación final válida |
| `pending` | `failed` | sistema/proveedor | fallo del proceso |
| `pending` | `cancelled` | sistema/proveedor/cliente según flujo | cancelación válida |
| `authorized` | `paid` | sistema/proveedor | confirmación definitiva |
| `paid` | `refunded` | futuro | fuera de MVP |

---

## 4. Job — transiciones permitidas

| Desde | Hacia | Quién puede | Condición |
| --- | --- | --- | --- |
| `pending` | `started` | sistema | ejecución iniciada |
| `started` | `success` | sistema | tarea completada |
| `started` | `failure` | sistema | tarea falló |
| `failure` | `retrying` | admin / sistema | reintento válido |
| `retrying` | `started` | sistema | nuevo intento lanzado |

---

## 5. Permisos explícitos por acción

| Acción | Admin | Vendedor | Cliente | Soporte |
| --- | --- | --- | --- | --- |
| Ver dashboard admin | Sí | No | No | No |
| Ver dashboard vendedor | Sí | Sí | No | No |
| Ver dashboard cliente propio | No | No | Sí | No |
| Ver dashboard soporte | Sí | No | No | Sí |
| Crear producto | Sí | Sí, si tiene `catalog.manage` | No | No |
| Ajustar stock | Sí | Sí | No | No |
| Crear pedido propio | Sí | Sí | Sí | No |
| Crear pedido asistido | Sí | Sí | No | No |
| Definir canal y contexto asistido del pedido | Sí | Sí | No | No |
| Cambiar estado de pedido | Sí | Sí, si tiene `orders.change_status` | No | No |
| Crear ticket | Sí | Sí, en nombre de un cliente o para postventa asociada | Sí, en sus propios casos | Sí |
| Responder ticket público | Sí | Sí, solo en tickets asignados o vinculados a la venta que operó | Sí, en su propio ticket | Sí |
| Crear nota interna de ticket | Sí | No | No | Sí |
| Moderar reseña | Sí | No | No | No |
| Exportar reportes comerciales | Sí | Sí, si tiene `reports.export` | No | No |
| Exportar reportes operativos de soporte | Sí | No | No | Sí, si tiene `reports.export` |
| Reintentar job | Sí | No | No | No |

---

## 6. Capacidades base que estructuran la autorización

Estas capacidades sirven como base arquitectónica del MVP:

- `catalog.manage`
- `inventory.adjust`
- `orders.assign`
- `orders.create_assisted`
- `orders.change_status`
- `orders.view_internal`
- `tickets.create`
- `tickets.respond`
- `tickets.create_internal_note`
- `tickets.view_order_context`
- `tickets.assign`
- `reviews.moderate`
- `reports.export`
- `jobs.retry`
- `users.manage`

### Nota de alcance

El MVP usa estas capacidades como base de backend y frontend, pero NO incluye una UI avanzada para editar permisos por usuario.

---

## 7. Auditoría obligatoria por transición

Debe auditarse sí o sí:

- cambio de estado de pedido
- ajuste de stock
- cambio de estado de pago
- reasignación de ticket
- cierre/reapertura de ticket
- moderación de reseña
- reintento de job
- cambio de canal o contexto asistido del pedido
