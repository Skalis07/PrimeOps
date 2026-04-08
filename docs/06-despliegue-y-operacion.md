# 06. Despliegue y operación

## 1. Objetivo operativo

Documentar una estrategia profesional, pero realista para este momento del proyecto:

- backend local
- PostgreSQL local sin Docker
- frontend local durante desarrollo
- frontend alojable en Vercel para demo
- camino temporal a Railway para exponer backend cuando haga falta

---

## 2. Ambientes oficiales

| Ambiente | Objetivo | Estado esperado |
| --- | --- | --- |
| local | desarrollo diario | principal |
| demo | mostrar el producto | temporal / según necesidad |
| futuro productivo | evolución posterior | no bloquea el MVP |

---

## 3. Local-first sin Docker

### Base local oficial

- PostgreSQL instalado localmente
- backend FastAPI local
- frontend Next.js local
- archivos generados en carpeta local `storage/`
- credenciales e integraciones mediante `.env.local` y equivalentes

### Qué gana este enfoque

- menor fricción inicial
- setup más directo
- más alineado con preferencia del usuario
- persistencia real de estado mientras PostgreSQL conserve datos

### Qué no resuelve todavía

- alta disponibilidad
- worker separado formal
- despliegue productivo robusto

---

## 4. Persistencia de estado

El estado del sistema debe vivir principalmente en PostgreSQL.

Eso significa que si el backend se apaga:

- pedidos siguen guardados
- usuarios siguen guardados
- pagos sincronizados siguen guardados
- tickets siguen guardados
- reportes/documentos referenciados siguen guardados

Los archivos binarios y PDFs pueden vivir inicialmente en:

- `storage/` local
- Google Drive cuando la integración esté habilitada

---

## 5. Frontend demo en Vercel

### Uso esperado

- hosting de la app web pública para demo
- previews rápidas si luego el proyecto pasa a repo real

### Consideraciones

- variables públicas y privadas separadas
- URLs de callback correctas para Auth0
- dominio custom futuro opcional

---

## 6. Backend demo temporal

### Decisión operativa

El baseline del proyecto sigue siendo local.

Si hace falta una demo pública de backend, se documenta un camino temporal de exposición o despliegue. No se vende como “gratis permanente”, porque no sería técnicamente honesto.

### Opción documentada

- despliegue temporal en Railway cuando haga falta demo pública
- evolución posterior a un hosting Linux más robusto/pago si el sistema madura

---

## 7. Estrategia recomendada por etapa

### Etapa 1: desarrollo normal

- web local
- api local
- PostgreSQL local
- Stripe test mode
- Drive OAuth en pruebas

### Etapa 2: demo controlada

- web en Vercel
- backend local expuesto temporalmente o desplegado puntualmente
- datos semilla limpios y preparados

### Etapa 3: casi productivo

- web en Vercel
- backend en Linux hosting
- DB gestionada
- worker separado si ya compensa

---

## 8. Operación mínima de una pyme pequeña

El sistema debe poder usarse así:

1. el negocio mantiene su catálogo
2. recibe pedidos `online` y registra ventas `asistida` cuando corresponde
3. revisa pagos fake durante demo o reales en futuro
4. procesa pedidos
5. atiende incidencias
6. emite comprobantes y reportes
7. guarda documentos en Drive del negocio

Ese es el terreno que guía la documentación.

### Aclaración operativa importante

La venta asistida del MVP cubre, como mínimo:

- atención presencial
- atención remota

No se promete infraestructura especializada por canal futuro. La operación debe poder crecer luego sin rediseñar el núcleo, pero el despliegue del MVP solo necesita sostener esta taxonomía base.

---

## 9. Dominios y URLs de ejemplo

Mientras no existan dominios reales, se documenta con placeholders profesionales:

- `http://localhost:3000` → frontend local
- `http://localhost:8000` → backend local
- `https://app.tu-negocio-demo.com` → frontend público futuro
- `https://api.tu-negocio-demo.com` → backend público futuro

---

## 10. Health y operación mínima

### Debe existir

- endpoint de health de API
- logs legibles en entorno local
- script/documento claro para levantar backend y frontend
- seeds mínimas para demo
- backup/export básico de PostgreSQL cuando el proyecto avance

---

## 11. Definition of Done del despliegue demo

Se considera listo cuando:

1. el frontend responde
2. el backend responde
3. Auth0 redirige correctamente
4. Stripe test completa un flujo falso
5. PostgreSQL conserva estado tras reiniciar backend
6. la documentación permite repetir el setup sin improvisar

---

## 12. Documento siguiente

- [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md)

## 13. Relación con los documentos humanos

- Alcance total: [`01-alcance-total-del-mvp.md`](01-alcance-total-del-mvp.md)
- Ruta, orden y avance: [`07-ruta-de-construccion-y-avance.md`](07-ruta-de-construccion-y-avance.md)
