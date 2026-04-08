# 05. Reglas de negocio e integraciones

## 1. Reglas críticas de negocio

| Regla | Razón |
| --- | --- |
| No vender stock inexistente | evita sobreventa |
| No permitir ajuste manual sin motivo | evita cambios invisibles o arbitrarios |
| No marcar pago como exitoso desde la UI | evita inconsistencia financiera |
| No mostrar datos ajenos al cliente | protege seguridad y privacidad |
| No borrar historial de ticket al cerrar | preserva postventa |
| No eliminar reseña moderada del histórico interno | preserva auditoría |
| No exponer acciones sensibles sin permiso | protege operación |
| No tratar `presencial` o `remota` como canales independientes | evita confundir detalle operativo con canal comercial |
| No confundir `sku` con `id` técnico | evita mezclar identidad de base de datos con código operativo |
| No reconstruir pedidos históricos desde catálogo vivo | preserva verdad comercial y auditabilidad |

---

## 2. Inventario y stock

### Reglas cerradas

- el stock pertenece a `ProductVariant`, no a `Product`
- `Product` puede existir sin ser unidad vendible directa
- todo cambio significativo genera `InventoryMovement`
- `InventoryMovement` referencia `product_variant_id`
- el movimiento debe guardar `actor_type`, `actor_user_id?`, `type`, `origin_type`, `origin_ref_id?`, `delta_quantity`, `reason` y `stock_after`
- los ajustes negativos manuales exigen `reason`
- el histórico debe ser visible en panel interno
- `InventoryMovement` es append-only: los errores se corrigen con un nuevo movimiento, no editando el anterior
- `origin_type` + `origin_ref_id` deben permitir rastrear la referencia concreta del movimiento, por ejemplo un `Order`, un ajuste manual o un restock registrado

### Regla de operación comercial

- todo pedido nace con `channel = online` o `channel = asistida`
- si el canal es `asistida`, debe registrarse `assisted_context = presencial | remota`
- la venta asistida debe dejar trazabilidad del usuario interno que la operó
- el canal se usa para reporting y auditoría, no solo como etiqueta visual

### Ejemplos reales

- merma
- rotura
- pérdida
- corrección por conteo físico
- restock manual

### Regla de catálogo mínimo

- `Product` es el contenedor comercial visible
- `ProductVariant` es la unidad vendible y cobrable
- `sku` vive en la variante como código operativo único
- `barcode` es opcional
- `cost` es dato interno y no tiene por qué exponerse al cliente

### Modificadores y notas de pedido

- los modificadores del MVP son grupos/opciones simples asociados a `Product`
- las selecciones de modificadores se copian al `OrderItem` como snapshot simple con ids estables, nombres visibles y `price_delta`
- los modificadores pueden sumar precio a la línea
- los modificadores NO descuentan stock ni activan reglas complejas en el MVP
- `item_note` es texto corto libre por línea de pedido con máximo de 255 caracteres

---

## 2.1 Pedidos, snapshots y trazabilidad comercial

- `OrderItem` debe conservar `product_variant_id` para trazabilidad técnica
- `OrderItem` debe conservar snapshots inmutables de nombre de producto, nombre de variante, `sku`, precio unitario, modificadores y nota
- el snapshot de modificadores debe guardar como mínimo `modifier_group_id`, `modifier_group_name`, `modifier_option_id`, `modifier_option_name` y `price_delta`
- si luego cambia el catálogo, el histórico del pedido sigue mostrando lo vendido originalmente
- el cálculo del total del pedido se hace al confirmar la orden y queda persistido; no se recalcula en cada lectura histórica
- crear un pedido valida stock disponible, pero NO reserva stock en el MVP
- el descuento de stock ocurre cuando el pago queda confirmado (`paid`)
- si el pedido se cancela o falla antes de `paid`, no se libera stock porque todavía no había salida efectiva
- un pedido `online` puede quedar sin asignación operativa formal
- un pedido `asistida` se autoasigna al `admin` o `vendedor` que tramitó la venta
- `Order` debe declarar `fulfillment_type = pickup | delivery`
- si `fulfillment_type = delivery`, el pedido debe persistir `delivery_address_snapshot`
- `ready_for_pickup` solo aplica a pedidos `pickup`
- `shipped` solo aplica a pedidos `delivery`
- el MVP no modela tracking, carrier ni promesa de entrega detallada

---

## 3. Soporte y postventa

### Reglas mínimas

- todo ticket tiene autor y timestamps
- puede o no vincularse a un pedido, pero si es postventa debe poder hacerlo
- existen mensajes públicos (`public`) e internos (`internal`)
- el historial no se borra
- soporte ve solo el contexto necesario del pedido asociado
- un mensaje `public` puede verlo el cliente y el staff autorizado
- una nota `internal` solo puede verla el staff autorizado
- el cliente nunca crea ni lee mensajes `internal`
- todo ticket declara `priority = low | normal | high`
- si no se informa prioridad al crear un ticket, el backend debe usar `normal`
- la prioridad ordena trabajo y visibilidad operativa, pero NO habilita SLA ni automatizaciones extra en el MVP

### Casos de uso contemplados

- pedido no confirmado
- problema con despacho
- producto dañado
- acceso al comprobante
- dudas generales de postventa

---

## 3.1 Roles, capacidades y alcance del MVP

La operación humana usa cuatro roles oficiales: `admin`, `vendedor`, `cliente`, `soporte`.

Sin embargo, la base de autorización no se congela en esos nombres. La arquitectura trabaja con **capacidades granulares** para poder crecer sin rediseñar reglas centrales.

En el MVP:

- admin concentra capacidades amplias
- vendedor opera catálogo, inventario y ventas asistidas bajo capacidades explícitas de catálogo, stock y pedidos
- soporte se enfoca en tickets y en lectura del contexto operativo mínimo del pedido asociado, sin gestionar catálogo ni estados de pedido
- cliente opera solo sobre sus propios recursos

No entra en alcance una UI avanzada para editar permisos por usuario. Si luego hiciera falta, se agrega sobre la misma base de capacidades.

---

## 4. Reseñas

| Regla | Decisión |
| --- | --- |
| Quién reseña | cliente autenticado |
| Qué publica | rating + comentario |
| Estado mínimo | `published` / `hidden` |
| Alta inicial | nace en `published` si pasa validaciones |
| Moderación | admin puede alternar `published` / `hidden` con nota interna opcional |
| Visibilidad pública | solo se listan reseñas `published` |
| Histórico | la moderación no borra trazabilidad |
| Futuro | condicionar reseña a compra confirmada |

---

## 5. PDFs y documentos

### Documentos comprometidos

- comprobante de pedido
- resumen de ventas
- resumen mensual
- orden operativa interna

### Datos mínimos por documento

| Documento | Debe incluir |
| --- | --- |
| Comprobante de pedido | pedido, fecha, cliente, ítems, total, estado de pago |
| Resumen de ventas | rango, totales, cantidad de pedidos, fecha de generación |
| Resumen mensual | KPIs clave del mes |
| Orden operativa | productos, cantidades, notas internas |

---

## 6. Integraciones oficiales del MVP

### Stripe

- uso: pagos fake/test
- objetivo: demostrar checkout y confirmación realista
- regla: la verdad del pago viene del backend, no del frontend
- `Payment` representa el intento/transacción del pedido
- `PaymentEvent` conserva el evento del proveedor para auditoría y diagnóstico

### Google Drive con OAuth de usuario

#### Perfil de negocio pensado

Una pyme pequeña o negocio puede operar con una cuenta Google normal, no necesariamente enterprise.

#### Decisión cerrada

Se integrará Drive mediante **OAuth de usuario**.

#### Qué resuelve

- subir comprobantes o reportes
- dejar archivos accesibles desde cuenta del negocio
- evitar complejidad de service accounts para este contexto

#### Regla de implementación

- el usuario admin autoriza el acceso
- la aplicación obtiene token/refresh token según flujo seguro
- los archivos se suben a una carpeta del negocio definida en configuración

### Correo transaccional

#### Decisión cerrada

Proveedor del MVP: **Resend**.

#### Casos de uso

- confirmación de pedido
- aviso de ticket resuelto
- envío de reporte bajo demanda
- alertas internas definidas

---

## 7. Extensibilidad documentada sin sobreprometer

El diseño deja abierta la posibilidad de sumar más roles, canales u orígenes operativos en el futuro.

Eso NO significa prometer desde ahora integraciones o canales específicos. La regla correcta es:

- el núcleo modela categorías extensibles
- el MVP cierra solo lo necesario para `online` y `asistida`
- el catálogo puede crecer a más variantes, reglas o tipos de producto SI una necesidad futura lo justifica
- los modificadores pueden evolucionar después, pero hoy quedan en grupos/opciones simples
- cualquier expansión futura debe justificarse por necesidad real, no por ansiedad de arquitectura

---

## 8. Auditoría y logging

### Eventos de negocio mínimos a registrar

- creación de pedido
- cambio de estado de pedido
- ajuste de stock
- creación/reasignación de ticket
- moderación de reseña
- cambio de estado de pago
- generación o fallo de job
- export/sync externo
- creación de pedido asistido con su contexto

### Tipos de logs

- logs de aplicación
- audit logs de negocio
- logs de integraciones
- logs de jobs

---

## 9. Regla documental para integraciones

Una integración no se considera terminada porque “responde”.

Se considera terminada cuando:

1. tiene configuración clara
2. deja trazabilidad
3. su error se entiende
4. su resultado impacta el flujo de negocio correcto

---

## 10. Documento siguiente

- [`06-despliegue-y-operacion.md`](06-despliegue-y-operacion.md)

## 11. Relación con los documentos humanos

- Alcance total: [`01-alcance-total-del-mvp.md`](01-alcance-total-del-mvp.md)
- Ruta, orden y avance: [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md)
- Bitácora de implementación: [`08-bitacora-de-implementacion.md`](08-bitacora-de-implementacion.md)
