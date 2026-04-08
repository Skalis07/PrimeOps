# 01. Alcance total del MVP

## 1. Qué es este proyecto

Este proyecto define una **plataforma de gestión comercial para una pyme** que vende productos físicos y necesita ordenar su operación diaria en un solo sistema.

No apunta a ser un ERP gigantesco ni un marketplace. Apunta a resolver bien el núcleo comercial y operativo con una base técnica seria, demostrable y escalable.

## 2. Qué problema resuelve

La pyme objetivo suele operar con herramientas dispersas: mensajería, Excel, correo y procesos manuales. Eso genera:

- pedidos desordenados
- cambios de stock sin trazabilidad
- postventa sin seguimiento claro
- poca visibilidad operativa
- tareas repetitivas que deberían automatizarse

El proyecto centraliza esa operación en una sola plataforma.

## 3. Objetivos del producto

| Objetivo | Resultado esperado | Prioridad |
| --- | --- | --- |
| Centralizar operación comercial | Un solo sistema para pedidos, stock, soporte, reportes y seguimiento | Alta |
| Atender distintos perfiles | Experiencias diferenciadas para admin, vendedor, cliente y soporte | Alta |
| Demostrar criterio técnico real | Frontend Next.js + backend FastAPI + auth + pagos + jobs + reporting | Alta |
| Automatizar trabajo operativo | PDF, correos, exportes y alertas sin bloquear la UX | Alta |
| Dejar base de crecimiento | Integraciones y endurecimiento posterior sin rehacer el núcleo | Media |

## 4. Qué incluye el MVP

- autenticación con Auth0
- sincronización de usuario interno
- roles base: admin, vendedor, cliente y soporte
- canales comerciales base: online y asistida
- detalle mínimo de venta asistida: presencial y remota
- catálogo con categorías, productos y stock
- movimientos de inventario auditables
- pedidos con historial y asignación
- pagos con Stripe en modo test
- comprobantes PDF internos
- tickets de soporte vinculables a pedido
- reseñas de producto
- dashboards básicos por rol
- exportes y reportes operativos
- integración con Google Drive vía OAuth de usuario
- correo transaccional
- logs técnicos y auditoría de negocio

## 5. Qué NO incluye el MVP

- facturación tributaria real
- multiempresa
- marketplace con vendedores externos o negocios separados
- operación comercial compleja con comisiones, territorios o jerarquías de ventas
- app móvil nativa
- chat en tiempo real
- wallets o pagos recurrentes
- devoluciones complejas y conciliación contable avanzada
- UI avanzada de edición de permisos por usuario

## 6. Qué significa “MVP listo”

El MVP se considera listo SOLO si se cumplen todas estas condiciones:

1. existe login con roles reales
2. existe flujo de catálogo a pedido
3. el pago de prueba confirma correctamente el pedido
4. el stock se mueve con trazabilidad
5. soporte puede operar tickets
6. el cliente puede seguir su compra y descargar comprobante
7. existen dashboards mínimos útiles
8. existen logs y auditoría en acciones sensibles
9. la documentación deja claro qué entra y qué no entra

## 7. Roles oficiales

| Rol | Propósito | Ve | Hace | No hace |
| --- | --- | --- | --- | --- |
| Admin | Control integral del negocio | Todo el panel | Usuarios, reportes, productos, métricas, moderación y configuración operativa | No debería absorber toda la operación manual |
| Vendedor | Operación comercial diaria | Pedidos, stock, inventario y contexto comercial necesario | Crear pedidos asistidos, preparar pedidos, ajustar stock, cambiar estados permitidos | No configura el sistema ni administra permisos avanzados |
| Cliente | Compra y seguimiento | Sus pedidos, tickets, comprobantes y reseñas | Navega, compra, paga, abre tickets, reseña | No ve datos ajenos ni estados internos no públicos |
| Soporte | Atención y postventa | Tickets y visibilidad parcial de pedidos asociados | Responde, reasigna, deja notas, escala casos | No administra catálogo ni usuarios |

## 8. Canales comerciales oficiales del MVP

| Canal | Propósito | Quién lo usa | Detalle mínimo |
| --- | --- | --- | --- |
| `online` | compra iniciada por el cliente en autoservicio | cliente y sistema | sin detalle adicional obligatorio |
| `asistida` | venta cargada o guiada por un usuario interno | admin o vendedor | `presencial` o `remota` |

### Regla de interpretación humana

- **`online`**: el cliente navega, arma carrito y dispara el pedido por sí mismo.
- **`asistida`**: un vendedor o admin acompaña la venta y registra el contexto de atención.
- **`presencial`** y **`remota`** NO son canales aparte; son detalles del canal `asistida`.

## 9. Base de permisos del MVP

La autorización se diseña sobre **capacidades granulares** y no solo sobre nombres de rol. Eso permite crecer después sin rediseñar el núcleo.

Para el MVP:

- cada rol agrupa un conjunto claro de capacidades
- el backend resuelve permisos efectivos
- la UI muestra u oculta acciones según ese resultado
- no se compromete una pantalla avanzada para editar permisos usuario por usuario

Esto deja una base extensible para sumar roles, canales u orígenes operativos en el futuro sin prometer integraciones concretas ni complejidad prematura.

En otras palabras: el MVP sí admite varios usuarios internos con rol `vendedor` dentro del mismo negocio, pero NO modela un marketplace ni una red de vendedores externos.

## 10. Módulos funcionales

| Módulo | Responsabilidad | Usuarios principales |
| --- | --- | --- |
| Auth / identidad | login, contexto y permisos de acceso | todos |
| Usuarios y roles | perfiles internos y control de acceso | admin |
| Catálogo | productos, categorías, disponibilidad | cliente, vendedor, admin |
| Inventario | stock y movimientos | vendedor, admin |
| Pedidos | carrito, orden, estados, historial, canal comercial y contexto asistido | cliente, vendedor, admin |
| Pagos | checkout, eventos y confirmación | cliente, admin |
| Soporte | tickets, mensajes, asignación | soporte, admin, cliente |
| Reseñas | rating y comentarios | cliente, admin |
| Reportes / PDF | exportes y documentos | admin, soporte, cliente |
| Dashboards | vistas accionables por rol | todos según rol |
| Integraciones | Stripe, Drive, email | sistema / admin |
| Auditoría | trazabilidad técnica y de negocio | admin |

## 11. Indicadores de éxito del MVP

| Indicador | Señal esperada | Evidencia |
| --- | --- | --- |
| Flujo comercial completo | Cliente recorre catálogo, crea pedido, paga en sandbox y obtiene comprobante | Flujo E2E feliz |
| Operación interna visible | Vendedor y admin operan con permisos y vistas distintas | Dashboard y rutas por rol |
| Trazabilidad real | Cambios de pedido, stock, tickets y pagos quedan registrados | Historial y audit logs |
| Postventa integrada | Tickets se crean, asignan, responden y cierran | Mesa de soporte funcional |
| Automatización útil | Al menos dos procesos no bloquean la UX | Jobs visibles con resultado |
| Valor curricular claro | El proyecto demuestra stack moderno con criterio de arquitectura | Documentación + demo |

## 12. Recortes permitidos y no permitidos

### Se puede recortar si falta tiempo

- refinamiento visual extremo
- analítica compleja
- Google Drive avanzado más allá de lo básico
- automatizaciones sofisticadas
- editor visual avanzado de permisos

### No se debe recortar

- pedidos
- pagos fake funcionando
- movimientos de stock auditables
- tickets
- Auth0 básico
- logs y auditoría
- al menos una automatización visible

## 13. Cómo se relaciona con el resto de la documentación

- Este documento define el **alcance total del MVP**.
- La ruta de construcción y el avance real viven en [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md).
- Los documentos `02` a `06` explican decisiones técnicas para implementar áreas específicas.

## 14. Documento siguiente

- [`02-arquitectura-y-modelo-de-datos.md`](02-arquitectura-y-modelo-de-datos.md)
