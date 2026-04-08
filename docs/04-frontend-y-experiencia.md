# 04. Frontend y experiencia

## 1. Objetivo del frontend

El frontend debe sentirse como una aplicación de operación real, no como una demo estática.

Debe permitir:

- navegar con claridad
- operar por rol
- entender estados del sistema
- ejecutar acciones con feedback claro
- filtrar, revisar y corregir información

---

## 2. Mapa de pantallas

| Rol | Ruta | Objetivo |
| --- | --- | --- |
| Público | `/` | landing y propuesta de valor |
| Público | `/login` | entrada a Auth0 |
| Todos | `/dashboard` | punto de entrada según rol |
| Cliente | `/catalogo` | catálogo con filtros |
| Cliente | `/producto/[id]` | detalle de producto con variantes y modificadores simples |
| Cliente | `/carrito` | resumen previo al pedido |
| Cliente | `/mis-pedidos` | historial propio |
| Cliente | `/mis-pedidos/[id]` | detalle de pedido, pago, ticket y comprobante |
| Cliente | `/mis-tickets` | tickets propios |
| Cliente | `/mis-resenas` | historial de reseñas |
| Vendedor/Admin | `/productos` | gestión de productos |
| Vendedor/Admin | `/productos/nuevo` | alta y edición |
| Vendedor/Admin | `/inventario` | movimientos y alertas |
| Vendedor/Admin | `/pedidos` | cola operativa |
| Vendedor/Admin | `/pedidos/[id]` | detalle, timeline y contexto comercial |
| Admin | `/usuarios` | gestión de usuarios |
| Admin | `/reportes` | KPIs y exportes |
| Soporte/Admin | `/tickets` | mesa de soporte |
| Soporte/Admin | `/tickets/[id]` | conversación y notas |
| Admin | `/jobs` | monitoreo de tareas |
| Todos | `/perfil` | perfil del usuario |

---

## 3. Componentes obligatorios del frontend

| Componente | Propósito | Obligación |
| --- | --- | --- |
| `ProtectedLayout` | proteger rutas por rol | obligatorio |
| `RoleSidebar` | navegación contextual | obligatorio |
| `DataTable` | listados operativos | obligatorio |
| `StatusBadge` | representar estados | obligatorio |
| `KpiCard` | KPIs accionables | obligatorio |
| `OrderTimeline` | historial del pedido | obligatorio |
| `TicketThread` | conversación del soporte | obligatorio |
| `EntityForm` | formularios reutilizables | obligatorio |
| `ConfirmActionModal` | confirmación de acciones sensibles | obligatorio |
| `FileDownloadAction` | descarga de PDF/reportes | obligatorio |
| `VariantSelector` | elegir variante vendible cuando aplica | obligatorio |
| `ModifierGroupSelector` | seleccionar opciones simples por producto | obligatorio |
| `ItemNoteField` | capturar nota corta por línea | obligatorio |

---

## 4. Reglas visuales y de UX

- cada pantalla debe tener estado `loading`, `empty`, `error` y `success` cuando corresponda
- los badges de estado deben ser consistentes entre módulos
- los formularios deben mostrar errores legibles, no mensajes crípticos
- la navegación por rol no debe mostrar opciones fuera de permiso
- las tablas deben soportar filtros, orden y paginación
- las acciones sensibles deben requerir confirmación cuando corresponda
- la prioridad de ticket debe mostrarse con badge simple (`low`, `normal`, `high`) y servir para ordenar la cola; NO para prometer SLA en el MVP
- los pedidos deben mostrar de forma legible el canal (`online` o `asistida`) y, si corresponde, el detalle `presencial` o `remota`
- los pedidos deben mostrar y capturar el tipo de cumplimiento (`pickup` o `delivery`) sin inventar más estados de logística en el MVP
- si un `Product` tiene variantes activas, la UI debe pedir elegir `ProductVariant` antes de agregar al carrito o pedido
- la UI debe tratar `sku` como dato operativo visible para staff, no como identidad principal de navegación
- la UI del pedido histórico debe leer snapshots guardados, no reconstruir nombres/precios desde el catálogo actual

---

## 5. Experiencia por rol

### Admin

Debe ver:

- ventas
- pagos pendientes
- stock bajo
- tickets abiertos
- jobs fallidos
- accesos rápidos a reportes

### Vendedor

Debe ver:

- pedidos asignados
- pendientes por preparar
- retrasados
- ajustes recientes
- alertas de inventario
- ventas asistidas recientes

### Cliente

Debe ver:

- último pedido
- estado de su compra
- pago
- comprobantes
- tickets
- reseñas pendientes

### Soporte

Debe ver:

- tickets abiertos por prioridad
- tickets asignados
- tickets sin respuesta
- contexto de pedido/pago asociado

---

## 6. Dashboards mínimos comprometidos

| Rol | KPI mínimo |
| --- | --- |
| Admin | ventas del día/mes, pedidos por estado, pagos pendientes, stock bajo |
| Vendedor | pedidos asignados, pendientes, retrasos, alertas y ventas asistidas |
| Cliente | pedido actual, pagos, tickets, comprobantes |
| Soporte | tickets abiertos, sin respuesta, asignados, críticos |

---

## 7. Validaciones importantes en frontend

- el cliente no puede avanzar a pagar si el carrito es inválido
- un ajuste de stock negativo debe pedir motivo
- una reseña sin rating o sin texto válido debe bloquearse según regla definida
- las rutas privadas deben redirigir si no existe contexto de usuario
- el formulario de pedido debe pedir canal comercial y exigir detalle adicional cuando el canal sea `asistida`
- el formulario de pedido debe pedir `fulfillment_type` y exigir dirección resumida solo cuando sea `delivery`
- el usuario no puede agregar al carrito un producto con variantes sin seleccionar primero una variante válida
- si un producto permite modificadores, la UI debe respetar `min_select` y `max_select`
- `item_note` debe limitarse a texto corto y legible para operación humana, con máximo de 255 caracteres

## 8. Base de permisos en frontend

El frontend debe consumir capacidades efectivas, no inventar autorización local.

- los layouts y sidebars se basan en rol + capacidades disponibles
- las acciones finas se habilitan por capacidad
- el MVP NO incluye una pantalla compleja para editar permisos usuario por usuario

---

## 8.1 UX mínima de catálogo y pedido

### Catálogo público/cliente

- la tarjeta de `Product` comunica el concepto comercial base
- el detalle del producto muestra variantes disponibles con precio y disponibilidad
- si existe una sola variante activa, puede preseleccionarse; si hay varias, el usuario debe elegir explícitamente
- los modificadores simples se muestran como grupos planos, sin árboles ni reglas avanzadas
- la nota del ítem se captura al agregar o editar la línea y debe bloquear exceso sobre 255 caracteres

### Pedido asistido

- vendedor/admin selecciona cliente, canal y contexto asistido
- vendedor/admin selecciona también `pickup` o `delivery`
- por cada línea elige variante, cantidad, modificadores simples y nota opcional
- si elige `delivery`, captura una dirección operativa resumida antes de confirmar
- el resumen debe mostrar subtotal base, impacto de modificadores y total de línea

### Detalle histórico del pedido

- se muestran `product_name_snapshot`, `variant_name_snapshot`, `sku_snapshot`, `item_note` y modificadores elegidos usando el snapshot guardado con ids, nombres y `price_delta`
- se muestra también si el pedido fue `pickup` o `delivery`
- si el catálogo cambió, la UI puede informar “producto actualizado desde la venta”, pero NO debe recalcular el histórico

### Mesa de soporte

- `TicketThread` debe distinguir visualmente mensajes `public` de notas `internal`
- el cliente solo ve mensajes `public`
- soporte/admin puede alternar entre respuesta pública y nota interna al publicar
- las notas internas deben quedar claramente marcadas para evitar filtraciones por error
- la lista de tickets debe mostrar `priority` y permitir ordenar al menos por prioridad y fecha reciente

### Reseñas

- el formulario de reseña exige `rating` entero de `1` a `5` y comentario válido
- al crear una reseña, la UI debe asumir `status = published` salvo respuesta distinta del backend
- listados públicos del producto solo muestran reseñas `published`
- en “mis reseñas”, el cliente puede ver si una reseña sigue `published` o quedó `hidden`
- la moderación admin es mínima: alternar `published` / `hidden` con motivo interno opcional

## 8.2 Checklist manual de frontend

- abrir un producto con varias variantes y comprobar que no se agrega sin selección previa
- agregar una línea con nota corta
- agregar una línea con un modificador simple que cambie el precio
- ver el carrito o pedido y comprobar que el total refleja variante + modificadores
- crear un pedido `pickup` y otro `delivery` verificando que la dirección solo se exija en el segundo caso
- abrir un pedido viejo y comprobar que conserva snapshots aunque el catálogo haya cambiado
- entrar como cliente a un ticket con nota interna y comprobar que esa nota no aparece
- revisar la mesa de soporte y comprobar que la prioridad `low` / `normal` / `high` se entiende sin hablar de SLA
- ocultar una reseña desde admin y comprobar que desaparece de la vista pública pero sigue en administración

---

## 9. Definition of Done del frontend

Una pantalla se considera lista cuando:

1. muestra datos reales
2. maneja carga/error/vacío
3. respeta permisos
4. no depende de datos mock para operar
5. tiene una validación mínima coherente
6. su flujo principal puede probarse manualmente
7. respeta el modelo `Product`/`ProductVariant`, no pierde snapshots del pedido, no expone notas internas al cliente y no muestra reseñas `hidden` en vistas públicas

---

## 10. Documento siguiente

- [`05-reglas-de-negocio-e-integraciones.md`](05-reglas-de-negocio-e-integraciones.md)

## 11. Relación con los documentos humanos

- Alcance total: [`01-alcance-total-del-mvp.md`](01-alcance-total-del-mvp.md)
- Ruta, orden y avance: [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md)
- Bitácora de implementación: [`08-bitacora-de-implementacion.md`](08-bitacora-de-implementacion.md)
- Guía explicada por hitos: [`09-guia-de-implementacion-explicada.md`](09-guia-de-implementacion-explicada.md)
