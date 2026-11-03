import type { MetadataRoute } from "next";

/** Installation sur l'écran d'accueil : nom, couleurs (bg-grouped, finances) et icône de l'app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pecunia",
    short_name: "Pecunia",
    description: "Chaque euro à sa place - budget, comptes et prévisionnel.",
    lang: "fr",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f7",
    theme_color: "#f2f2f7",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
