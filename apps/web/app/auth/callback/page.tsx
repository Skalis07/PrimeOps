import Link from "next/link";

export default function AuthCallbackPage() {
  return (
    <main>
      <section className="page-shell">
        <p className="auth-eyebrow">Hito 2 · B1</p>
        <h1>Retorno de Auth0</h1>
        <p>
          Esta ruta recibe el retorno técnico del login. Después, el sistema
          podrá redirigir al usuario a la pantalla final que corresponda.
        </p>
        <p className="auth-secondary-link">
          <Link href="/login">Volver al acceso</Link>
        </p>
      </section>
    </main>
  );
}
