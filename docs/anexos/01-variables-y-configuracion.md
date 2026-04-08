# Anexo 01. Variables y configuración

## 1. Convención general

- `apps/web/.env.local` para desarrollo frontend
- `apps/api/.env` o equivalente local para backend
- secretos reales fuera de versionado
- variables por ambiente documentadas aunque todavía no se usen todas

---

## 2. Frontend (`apps/web/.env.local`)

| Variable | Obligatoria | Propósito | Ejemplo |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Sí | URL pública/local del frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Sí | URL del backend | `http://localhost:8000` |
| `NEXT_PUBLIC_AUTH0_DOMAIN` | Sí | dominio Auth0 | `tu-tenant.us.auth0.com` |
| `NEXT_PUBLIC_AUTH0_CLIENT_ID` | Sí | client id frontend | `...` |
| `NEXT_PUBLIC_AUTH0_AUDIENCE` | Sí | audience para API | `https://api.tu-negocio-demo.com` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Sí | clave pública Stripe test | `pk_test_...` |

---

## 3. Backend (`apps/api/.env`)

| Variable | Obligatoria | Propósito | Ejemplo |
| --- | --- | --- | --- |
| `APP_ENV` | Sí | ambiente | `local` |
| `APP_NAME` | Sí | nombre del servicio | `pyme-api` |
| `API_BASE_URL` | Sí | URL base backend | `http://localhost:8000` |
| `FRONTEND_URL` | Sí | URL frontend para callbacks | `http://localhost:3000` |
| `DATABASE_URL` | Sí | conexión PostgreSQL | `postgresql+psycopg://usuario:clave@localhost:5432/pyme_db` |
| `AUTH0_DOMAIN` | Sí | tenant Auth0 | `tu-tenant.us.auth0.com` |
| `AUTH0_AUDIENCE` | Sí | audience de API | `https://api.tu-negocio-demo.com` |
| `AUTH0_CLIENT_ID` | Sí | client id backend si aplica | `...` |
| `AUTH0_CLIENT_SECRET` | Según flujo | secreto Auth0 | `...` |
| `STRIPE_SECRET_KEY` | Sí | clave Stripe test | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Sí | firma webhook Stripe | `whsec_...` |
| `PDF_STORAGE_DIR` | Sí | carpeta local para PDFs | `storage/pdfs` |
| `GOOGLE_OAUTH_CLIENT_ID` | Sí | OAuth Drive | `...` |
| `GOOGLE_OAUTH_CLIENT_SECRET` | Sí | secreto OAuth Drive | `...` |
| `GOOGLE_OAUTH_REDIRECT_URI` | Sí | callback OAuth | `http://localhost:8000/api/v1/integrations/google/callback` |
| `GOOGLE_DRIVE_FOLDER_ID` | Sí | carpeta destino | `...` |
| `RESEND_API_KEY` | Sí | correo transaccional | `re_...` |
| `EMAIL_FROM` | Sí | remitente del sistema | `noreply@tu-dominio.com` |
| `LOG_LEVEL` | Sí | nivel de logs | `INFO` |

---

## 4. Configuración mínima de PostgreSQL local

- servidor local instalado
- base: `pyme_db`
- usuario dedicado recomendado para desarrollo
- codificación UTF-8
- conexión mediante `DATABASE_URL`

---

## 5. Configuración mínima de Auth0

### Aplicaciones esperadas

- aplicación SPA/web para frontend
- API registrada para audience del backend

### URLs mínimas

- callback local frontend
- logout URL local frontend
- callback pública futura del frontend

---

## 6. Configuración mínima de Stripe test mode

- cuenta Stripe en test mode
- publishable key test
- secret key test
- webhook secret test
- product/price o flujo documentado según implementación elegida

---

## 7. Configuración mínima de Google Drive OAuth

- proyecto Google Cloud
- credenciales OAuth 2.0
- pantalla de consentimiento configurada
- redirect URI registrada
- carpeta de Drive definida para documentos

---

## 8. Configuración mínima de Resend

- cuenta creada
- API key
- remitente validado
- estrategia de correo transaccional definida

---

## 9. Regla de documentación

Ninguna integración se considera “lista” si depende de variables no documentadas aquí.
