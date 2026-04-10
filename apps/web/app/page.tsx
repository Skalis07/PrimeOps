import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="page-shell">
        <p className="auth-eyebrow">Scaffold actual</p>
        <h1>Frontend base con entrada mínima a Auth0</h1>
        <p>
          Este frontend sigue siendo deliberadamente pequeño. B1 solo deja el
          provider y la ruta pública de login listos para validación humana.
        </p>
        <p className="auth-secondary-link">
          <Link href="/login">Ir a /login</Link>
        </p>
      </section>
    </main>
  );
}
