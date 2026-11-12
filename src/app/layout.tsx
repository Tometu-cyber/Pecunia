import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { THEME_COOKIE } from "@/lib/theme";
import { NavigationProgress } from "@/components/ui/navigation-progress";
import { PortailLinks } from "@/components/app/portail-links";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Pecunia", template: "%s · Pecunia" },
  description: "Chaque euro à sa place - budget, comptes et prévisionnel.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // fond des écrans en listes groupées (bg-grouped), clair et sombre
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = (await cookies()).get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
  return (
    <html lang="fr" data-theme={theme}>
      {/* pt-app-finances : couleur d'accent de Pecunia, aussi pour Modal et Select rendus à la racine */}
      <body className="pt-app-finances min-h-dvh">
        <PortailLinks />
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
