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

---

## 4. Reglas visuales y de UX

- cada pantalla debe tener estado `loading`, `empty`, `error` y `success` cuando corresponda
- los badges de estado deben ser consistentes entre módulos
- los formularios deben mostrar errores legibles, no mensajes crípticos
- la navegación por rol no debe mostrar opciones fuera de permiso
- las tablas deben soportar filtros, orden y paginación
- las acciones sensibles deben requerir confirmación cuando corresponda
- los pedidos deben mostrar de forma legible el canal (`online` o `asistida`) y, si corresponde, el detalle `presencial` o `remota`

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

## 8. Base de permisos en frontend

El frontend debe consumir capacidades efectivas, no inventar autorización local.

- los layouts y sidebars se basan en rol + capacidades disponibles
- las acciones finas se habilitan por capacidad
- el MVP NO incluye una pantalla compleja para editar permisos usuario por usuario

---

## 9. Definition of Done del frontend

Una pantalla se considera lista cuando:

1. muestra datos reales
2. maneja carga/error/vacío
3. respeta permisos
4. no depende de datos mock para operar
5. tiene una validación mínima coherente
6. su flujo principal puede probarse manualmente

---

## 10. Documento siguiente

- [`05-reglas-de-negocio-e-integraciones.md`](05-reglas-de-negocio-e-integraciones.md)

## 11. Relación con los documentos humanos

- Alcance total: [`01-alcance-total-del-mvp.md`](01-alcance-total-del-mvp.md)
- Ruta, orden y avance: [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md)
