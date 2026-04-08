# Anexo 03. Glosario

| Término | Definición |
| --- | --- |
| Auth0 | proveedor externo de identidad y login |
| JWT | token firmado usado para autenticación/autorización |
| FastAPI | framework de Python orientado a APIs modernas |
| SQLAlchemy | ORM/toolkit SQL para Python |
| Alembic | sistema de migraciones para SQLAlchemy |
| Stripe test mode | entorno de pagos falsos sin dinero real |
| OAuth | protocolo para delegar acceso a una cuenta de usuario |
| Google Drive OAuth | acceso a Drive usando consentimiento del usuario |
| Audit log | registro histórico de acciones del sistema |
| Job | proceso diferido o asíncrono |
| Webhook | evento entrante enviado por un proveedor externo |
| MVP | versión mínima viable que ya entrega valor real |
| Incremento vertical | fase que deja una capacidad usable de punta a punta |
| Category | agrupador comercial del catálogo con jerarquía opcional |
| Product | entidad comercial base visible para el usuario; no es la unidad stockeable del MVP |
| ProductVariant | unidad concreta que se vende, se cobra y se controla en inventario |
| SKU | código operativo único del negocio para una variante; no reemplaza al `id` técnico |
| Barcode | código de barras opcional asociado a una variante |
| ModifierGroup | grupo simple de opciones elegibles para un producto, por ejemplo tamaño o extras |
| ModifierOption | opción individual dentro de un grupo de modificadores, con posible impacto de precio |
| Item note | nota corta libre guardada por línea de pedido, con máximo de 255 caracteres en el MVP |
| Snapshot | copia inmutable de datos comerciales guardada en el pedido para preservar histórico sin depender del catálogo vivo |
| Inventory movement origin | referencia operativa mínima que indica qué entidad o acción generó un `InventoryMovement` |
| Fulfillment type | forma mínima de cumplimiento del pedido en el MVP: `pickup` o `delivery` |
| Pickup | pedido preparado para retiro, coherente con el estado `ready_for_pickup` |
| Delivery | pedido preparado para despacho o entrega operativa, coherente con el estado `shipped` |
| Payment | intento o transacción de cobro asociada a un pedido |
| PaymentEvent | evento recibido o registrado desde el proveedor de pago para auditoría |
| SupportTicket priority | prioridad operativa mínima del ticket: `low`, `normal` o `high`; sirve para orden visual y filtros, no para SLA |
| SupportMessage visibility | visibilidad del mensaje del ticket: `public` para cliente + staff, `internal` para staff solamente |
| ProductReview status | estado mínimo de una reseña: `published` visible al público o `hidden` oculta por moderación pero conservada internamente |
