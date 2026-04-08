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

---

## 2. Inventario y stock

### Reglas cerradas

- el stock no se controla solo por `Product.stock`
- todo cambio significativo genera `InventoryMovement`
- el movimiento debe guardar actor, delta, motivo y stock resultante
- los ajustes negativos manuales exigen `reason`
- el histórico debe ser visible en panel interno

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

---

## 3. Soporte y postventa

### Reglas mínimas

- todo ticket tiene autor y timestamps
- puede o no vincularse a un pedido, pero si es postventa debe poder hacerlo
- existen mensajes públicos e internos
- el historial no se borra
- soporte ve solo el contexto necesario del pedido asociado

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
- vendedor opera catálogo, inventario y ventas asistidas bajo permisos válidos
- soporte se enfoca en tickets y contexto parcial de pedidos
- cliente opera solo sobre sus propios recursos

No entra en alcance una UI avanzada para editar permisos por usuario. Si luego hiciera falta, se agrega sobre la misma base de capacidades.

---

## 4. Reseñas

| Regla | Decisión |
| --- | --- |
| Quién reseña | cliente autenticado |
| Qué publica | rating + comentario |
| Moderación | admin puede ocultar/moderar |
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
