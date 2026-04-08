# 07. Ruta de construcción y avance

> Este es el **documento humano operativo principal** del proyecto.
>
> Úsalo para responder, en un solo lugar:
>
> - dónde estamos
> - qué sigue ahora
> - qué ya está hecho y qué falta
> - qué incluye cada hito
> - qué evidencia permite cerrarlo

## 1. Regla de autoridad

- Si un ítem está **[x]**, está hecho.
- Si un ítem está **[ ]**, sigue pendiente.
- Un hito solo se considera cerrado cuando su evidencia mínima ya existe.
- Este archivo reemplaza la separación anterior entre roadmap, build plan y checklist.
- El detalle cronológico de lo ejecutado vive en [`08-bitacora-de-implementacion.md`](08-bitacora-de-implementacion.md).

## 2. Estado actual

### Estado del repositorio

- existe documentación principal y técnica
- no existe todavía implementación de la app en este repositorio
- la estructura documental quedó simplificada para seguir el proyecto con dos documentos humanos

### Estado del MVP

- **hito actual**: Hito 1 — Base técnica
- **avance marcado**: 0 de 8 hitos cerrados
- **siguiente paso recomendado**: A1 — crear estructura base del monorepo y carpetas principales

## 3. Cómo usar esta ruta

Secuencia correcta:

1. confirmar en qué hito estás
2. tomar el siguiente paso no resuelto en orden
3. implementar un cambio pequeño y validable
4. comprobar la evidencia mínima del paso o del hito
5. marcar solo lo que de verdad quedó terminado

### Dependencias fuertes

- no empezar pagos sin pedidos
- no empezar pedidos sin catálogo e inventario
- no empezar dashboards reales sin datos del dominio
- no empezar Drive o correo sin documentos o eventos claros que exportar o enviar

## 4. Ruta completa por hitos

### Hito 1. Base técnica

**Objetivo**  
Dejar la base mínima del monorepo operativa para poder empezar features reales.

**Incluye**

- estructura del repo
- app web mínima
- app API mínima
- PostgreSQL local
- SQLAlchemy base y Alembic
- configuración compartida inicial

**Pasos en orden**

- [x] **A1** Crear estructura del monorepo y carpetas base.
- [x] **A2** Inicializar backend FastAPI mínimo.
- [x] **A3** Configurar PostgreSQL local y conexión.
- [ ] **A4** Configurar SQLAlchemy base y Alembic.
- [ ] **A5** Inicializar frontend Next.js mínimo.
- [ ] **A6** Definir configuración compartida y tipos base.

**Checklist verificable**

- [ ] Existe estructura base de monorepo con carpetas de apps y soporte.
- [ ] La app web inicializa y sirve una pantalla mínima.
- [ ] La app API expone al menos healthcheck o endpoint equivalente.
- [ ] PostgreSQL local está configurado y la API conecta correctamente.
- [ ] Alembic crea y aplica una migración inicial válida.

**Evidencia mínima para cerrar**  
Repositorio estructurado + web y API arrancan + conexión a DB comprobada + migración inicial aplicada sin ambigüedad.

### Hito 2. Auth y roles

**Objetivo**  
Cerrar autenticación, contexto de usuario y base de permisos por rol.

**Incluye**

- Auth0 en frontend
- validación de token en backend
- endpoint `/me`
- sincronización de usuario interno
- persistencia de roles
- persistencia de capacidades base por rol
- navegación diferenciada por rol

**Pasos en orden**

- [ ] **B1** Integrar Auth0 en frontend.
- [ ] **B2** Validar token en backend.
- [ ] **B3** Implementar `/me`.
- [ ] **B4** Implementar sync de usuario interno.
- [ ] **B5** Aplicar layouts por rol.

**Checklist verificable**

- [ ] Login con Auth0 inicia y retorna al sistema correctamente.
- [ ] Backend valida token y protege endpoints privados.
- [ ] Existe endpoint `/me` que devuelve contexto del usuario autenticado.
- [ ] El usuario autenticado se sincroniza o crea en la base interna.
- [ ] Los roles base quedan persistidos y utilizables.
- [ ] Las capacidades base por rol quedan definidas y consultables.
- [ ] La navegación o acceso cambia según rol.

**Evidencia mínima para cerrar**  
Usuario autenticado puede entrar, consultar `/me`, quedar persistido y ver acceso coherente según su rol.

### Hito 3. Catálogo e inventario

**Objetivo**  
Permitir administrar productos y controlar stock con trazabilidad básica.

**Incluye**

- categorías, productos y variantes vendibles
- modificadores simples por producto
- filtros básicos
- movimientos de inventario
- ajustes manuales con motivo
- alertas básicas de stock

**Pasos en orden**

- [ ] **C1** Crear `Category`, `Product` y `ProductVariant`.
- [ ] **C2** Crear `InventoryMovement`.
- [ ] **C3** Construir API catálogo con variantes y modificadores simples.
- [ ] **C4** Construir tabla/vista de productos con acceso a variantes.
- [ ] **C5** Implementar ajuste manual con motivo.
- [ ] **C6** Mostrar historial y alertas de stock.

**Checklist verificable**

- [ ] Se pueden crear y listar categorías.
- [ ] Se pueden crear y listar productos con sus variantes.
- [ ] Cada variante tiene `sku` propio y `barcode` opcional.
- [ ] El catálogo permite al menos filtros básicos utilizables.
- [ ] Cada cambio de stock de variante genera un movimiento persistido con actor, tipo, referencia de origen, delta, motivo y stock resultante.
- [ ] Existen grupos/opciones de modificadores simples sin convertir el dominio en un configurador genérico.
- [ ] El ajuste manual exige motivo registrable.
- [ ] Existen alertas básicas o señal visible de stock bajo.

**Evidencia mínima para cerrar**  
Catálogo usable con variantes + stock actualizable por variante con movimientos auditables + señal de stock bajo visible.

### Hito 4. Pedidos

**Objetivo**  
Cerrar el flujo base desde carrito hasta seguimiento operativo del pedido.

**Incluye**

- carrito básico
- creación de pedido
- validación de stock
- snapshots inmutables por línea
- nota corta por ítem y modificadores simples
- historial de estados
- asignación a vendedor
- canal comercial y contexto de venta asistida
- cumplimiento mínimo `pickup` / `delivery`
- cancelación controlada

**Pasos en orden**

- [ ] **D1** Modelar `Order` y `OrderItem`.
- [ ] **D2** Crear carrito básico en frontend.
- [ ] **D3** Crear pedido en backend.
- [ ] **D4** Construir vista de pedidos por rol.
- [ ] **D5** Crear timeline e historial.
- [ ] **D6** Implementar asignación, canal comercial y cancelación controlada.

**Checklist verificable**

- [ ] El cliente puede agregar productos a un carrito básico.
- [ ] El backend crea pedidos válidos desde el carrito usando `product_variant_id`.
- [ ] La creación de pedido valida stock disponible, pero NO reserva stock en `pending_payment`.
- [ ] Cada línea del pedido puede guardar `item_note` (máximo 255 caracteres) y snapshots de modificadores/precios con ids, nombres y deltas persistidos.
- [ ] Cada pedido registra `online` o `asistida` y, si es asistida, guarda `presencial` o `remota`.
- [ ] Los pedidos `online` pueden quedar sin asignación, pero los pedidos `asistida` se autoasignan al usuario interno que los tramitó.
- [ ] Cada pedido declara `pickup` o `delivery`, y solo exige dirección cuando corresponde.
- [ ] Cada cambio de estado deja historial consultable.
- [ ] Un pedido puede asignarse a un vendedor bajo reglas válidas.

**Evidencia mínima para cerrar**  
Existe un pedido real creado desde el flujo normal o asistido, con validación de stock por variante, snapshots de línea, historial, canal comercial, cumplimiento mínimo y asignación visible.

### Hito 5. Pagos

**Objetivo**  
Conectar el pedido con un pago sandbox consistente y trazable.

**Incluye**

- `create-checkout` de Stripe test
- retorno frontend
- webhook backend
- sincronización del estado del pedido
- comprobante PDF

**Pasos en orden**

- [ ] **E1** Crear `Payment` y `PaymentEvent`.
- [ ] **E2** Integrar Stripe test `create-checkout`.
- [ ] **E3** Implementar retorno frontend.
- [ ] **E4** Implementar webhook backend.
- [ ] **E5** Sincronizar pedido tras pago.
- [ ] **E6** Generar comprobante tras pago confirmado.

**Checklist verificable**

- [ ] El sistema genera checkout de Stripe en test mode.
- [ ] El frontend muestra retorno o resultado del pago.
- [ ] El backend recibe y procesa webhook relevante.
- [ ] El estado del pedido se sincroniza con el estado del pago.
- [ ] El pago confirmado genera el descuento de stock por variante con movimiento auditable.
- [ ] Se genera comprobante PDF para un pago confirmado.

**Evidencia mínima para cerrar**  
Un pedido puede pagarse en sandbox, actualizar su estado correctamente, descontar stock solo al confirmar pago y producir comprobante descargable.

### Hito 6. Soporte y reseñas

**Objetivo**  
Cubrir postventa básica y feedback del cliente con control administrativo.

**Incluye**

- tickets por rol
- conversación visible con mensajes públicos
- notas internas separadas
- reseñas con rating
- moderación administrativa

**Pasos en orden**

- [ ] **F1** Modelar tickets y mensajes.
- [ ] **F2** Crear mesa de tickets por rol.
- [ ] **F3** Implementar conversación y notas internas.
- [ ] **F4** Implementar estados y asignación.
- [ ] **F5** Modelar reseñas.
- [ ] **F6** Crear moderación admin.

**Checklist verificable**

- [ ] Cliente y equipo pueden operar tickets según su rol.
- [ ] El ticket soporta conversación o hilo visible.
- [ ] Cada ticket usa prioridad mínima `low` / `normal` / `high` sin inventar SLA para el MVP.
- [ ] Existen mensajes `public` y notas `internal` con visibilidad filtrada según rol.
- [ ] El cliente puede registrar reseña con rating.
- [ ] Administración puede moderar reseñas con estados `published` / `hidden` y trazabilidad mínima.

**Evidencia mínima para cerrar**  
Existe un ticket operable de punta a punta y una reseña moderable sin mezclar permisos públicos e internos.

### Hito 7. Reportes e integraciones

**Objetivo**  
Agregar salidas útiles y automatizaciones mínimas visibles para el negocio.

**Incluye**

- plantilla PDF reutilizable
- resumen de ventas y export básico
- correo transaccional
- upload a Google Drive
- jobs visibles y trazables

**Pasos en orden**

- [ ] **G1** Crear plantilla PDF reutilizable.
- [ ] **G2** Crear resumen de ventas.
- [ ] **G3** Integrar Resend.
- [ ] **G4** Integrar Google Drive OAuth.
- [ ] **G5** Registrar jobs y reintentos.

**Checklist verificable**

- [ ] Existe al menos un resumen de ventas utilizable.
- [ ] Existe al menos un export básico descargable.
- [ ] El sistema registra un correo transaccional relevante.
- [ ] El sistema puede subir un documento a Google Drive.
- [ ] Los jobs o procesos automáticos quedan registrados y visibles.

**Evidencia mínima para cerrar**  
El sistema emite al menos un reporte útil, ejecuta integraciones clave y deja rastro visible de automatizaciones.

### Hito 8. Hardening y demo

**Objetivo**  
Dejar el MVP demostrable, diagnosticable y presentable.

**Incluye**

- audit logs
- manejo coherente de errores
- dashboards mínimos por rol
- datos demo
- flujo E2E feliz
- cierre documental consistente

**Pasos en orden**

- [ ] **H1** Centralizar errores y audit logs.
- [ ] **H2** Crear dashboards mínimos por rol.
- [ ] **H3** Preparar data semilla demo.
- [ ] **H4** Preparar despliegue frontend en Vercel.
- [ ] **H5** Validar demo end-to-end.

**Checklist verificable**

- [ ] Las acciones sensibles generan audit logs consultables.
- [ ] Los errores importantes se muestran o registran de forma coherente.
- [ ] Existe dashboard mínimo útil para cada rol principal.
- [ ] Hay datos semilla o demo suficientes para demostrar valor.
- [ ] El flujo E2E feliz está probado de extremo a extremo.

**Evidencia mínima para cerrar**  
La demo puede ejecutarse con datos preparados, mostrar el flujo principal completo y permitir diagnóstico básico de fallas.

## 5. Recortes permitidos y no permitidos

### Se puede recortar si falta tiempo

- refinamiento visual profundo
- métricas avanzadas
- automatización muy sofisticada
- reportes secundarios no críticos

### No se puede recortar

- flujo pedido + pago fake
- control de stock con movimientos
- coherencia del modelo `Product` / `ProductVariant` / snapshots
- tickets
- permisos por rol
- trazabilidad y logs mínimos

## 6. Qué sigue después de este documento

- Para entender el alcance completo: [`01-alcance-total-del-mvp.md`](01-alcance-total-del-mvp.md)
- Para implementar áreas concretas: `docs/02` a `docs/06`
- Para variables, permisos y términos: anexos `01`, `02` y `03`

## 7. Aclaración documental sobre "multi-vendedor"

Había una ambigüedad vieja: "multi-vendedor" podía interpretarse como marketplace con múltiples vendedores externos o como varios vendedores internos del mismo negocio.

La definición correcta del MVP es esta:

- **sí** puede haber varios usuarios internos con rol `vendedor` dentro del mismo negocio
- **no** se modela un marketplace ni una operación multiempresa con comisiones, liquidaciones o escaparates separados

La ruta futura puede ampliar roles o estructuras comerciales, pero el MVP NO necesita rediseño para eso.
