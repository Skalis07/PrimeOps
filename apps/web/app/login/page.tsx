import Link from "next/link";
import { LoginEntry } from "@/components/auth/login-entry";

export default function LoginPage() {
  return (
    <main>
      <section className="page-shell">
        <p className="auth-eyebrow">Hito 2 · B1</p>
        <h1>Ingreso con Auth0</h1>
        <p>
          Esta ruta deja preparada la entrada al login del frontend sin avanzar
          todavía a validación backend, <code>/me</code> ni layouts protegidos.
        </p>
        <LoginEntry />
        <p className="auth-secondary-link">
          <Link href="/">Volver al scaffold principal</Link>
        </p>
      </section>
    </main>
  );
}
