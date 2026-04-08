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
| Product | producto vendible |
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
- todo cambio de stock se registra como movimiento, no solo como número final
- todo pago relevante deja `PaymentEvent`
- toda transición sensible deja historial
- documentos generados deben tener referencia a entidad origen
- todo `Order` debe registrar `channel`
- si `channel = asistida`, el pedido debe registrar además `assisted_context` (`presencial` o `remota`) y el usuario interno que asistió la venta

### Base de autorización del modelo

La arquitectura de acceso se apoya en esta relación:

`User -> Role -> Capability`

Eso permite:

- mantener roles humanos simples en el MVP
- resolver permisos granulares en backend
- agregar nuevos roles o capacidades en el futuro sin rediseñar tablas críticas

**Límite deliberado del MVP**: no se documenta una UI avanzada de administración de permisos por usuario. La operación inicial trabaja con capacidades definidas por rol y ajustes internos controlados por configuración.

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
