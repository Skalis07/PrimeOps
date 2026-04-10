"use client";

import { useAuth0 } from "@auth0/auth0-react";
import {
  auth0FrontendConfig,
  isAuth0FrontendConfigured,
} from "@/lib/auth0-config";

function ActiveLoginButton() {
  const { isAuthenticated, isLoading, loginWithRedirect, user } = useAuth0();

  if (isAuthenticated) {
    return (
      <div className="auth-card auth-card--success">
        <p className="auth-eyebrow">Estado del scaffold</p>
        <h2>Sesión detectada en frontend</h2>
        <p>
          Auth0 ya devolvió identidad al frontend. La navegación protegida, el
          endpoint <code>/me</code> y los layouts por rol siguen fuera de B1.
        </p>
        <p className="auth-meta">
          Usuario: {user?.name ?? user?.email ?? "identidad recibida"}
        </p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <p className="auth-eyebrow">Entrada mínima a Auth0</p>
      <h2>Login frontend preparado</h2>
      <p>
        Este botón dispara <code>loginWithRedirect()</code> cuando el proyecto
        tenga dependencias instaladas y variables reales cargadas localmente.
      </p>
      <button
        className="primary-button"
        disabled={isLoading}
        onClick={() => void loginWithRedirect()}
        type="button"
      >
        {isLoading ? "Preparando Auth0..." : "Continuar con Auth0"}
      </button>
    </div>
  );
}

export function LoginEntry() {
  if (!isAuth0FrontendConfigured) {
    return (
      <div className="auth-card auth-card--warning">
        <p className="auth-eyebrow">Scaffold pendiente de configuración local</p>
        <h2>Faltan variables públicas de Auth0</h2>
        <p>
          Copia <code>.env.local.example</code> a <code>.env.local</code> y
          reemplaza los placeholders antes de probar el login real.
        </p>
        <ul className="auth-checklist">
          <li>NEXT_PUBLIC_APP_URL = {auth0FrontendConfig.appUrl || "pendiente"}</li>
          <li>NEXT_PUBLIC_API_URL = {auth0FrontendConfig.apiUrl || "pendiente"}</li>
          <li>
            NEXT_PUBLIC_AUTH0_DOMAIN = {auth0FrontendConfig.domain || "pendiente"}
          </li>
          <li>
            NEXT_PUBLIC_AUTH0_CLIENT_ID =
            {auth0FrontendConfig.clientId ? " cargado" : " pendiente"}
          </li>
          <li>
            NEXT_PUBLIC_AUTH0_AUDIENCE =
            {auth0FrontendConfig.audience || "pendiente"}
          </li>
        </ul>
        <button className="primary-button" disabled type="button">
          Continuar con Auth0
        </button>
      </div>
    );
  }

  return <ActiveLoginButton />;
}
