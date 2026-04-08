import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Test Web",
  description: "Scaffold mínimo de Next.js para el MVP.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
