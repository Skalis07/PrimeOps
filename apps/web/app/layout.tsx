import type { Metadata } from "next";
import { AppAuth0Provider } from "@/components/providers/app-auth0-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrimeOps",
  description: "Scaffold mínimo de Next.js para PrimeOps.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <AppAuth0Provider>{children}</AppAuth0Provider>
      </body>
    </html>
  );
}
