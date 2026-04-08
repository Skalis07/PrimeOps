# 08. Bitácora de implementación

> Este documento complementa a `07-ruta-de-construccion-y-avance.md`.
>
> - `07` = checklist oficial y estado del plan.
> - `08` = detalle breve, cronológico y verificable de lo que se ejecutó.

## Regla de uso

- Solo se registra aquí lo que ya fue ejecutado.
- Un paso puede quedar como **pendiente de validación humana** hasta recibir visto bueno.
- Cuando un paso quede aprobado, `07` se marca y `08` conserva el detalle histórico.

---

## Entradas

### A1 — Crear estructura base del monorepo y carpetas principales

- **Estado:** ejecutado y validado
- **Objetivo:** crear solo la estructura contenedora del monorepo sin interferir con los futuros scaffolds de Next.js y FastAPI.
- **Se hizo:**
  - creación de `apps/`
  - creación de `apps/web/`
  - creación de `apps/api/`
  - creación de `packages/`
  - agregado de `.gitkeep` para persistir carpetas vacías en Git
- **No se hizo todavía:**
  - scaffold de Next.js
  - scaffold de FastAPI
  - configuración de base de datos
  - archivos de configuración internos de apps
- **Comprobación humana simple:**
  - existen `apps/web`, `apps/api` y `packages`
  - no hay estructura interna prematura que choque con Next.js o FastAPI
