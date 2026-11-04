import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Version et copyright affichés dans l'app, lus depuis package.json au build
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_APP_AUTHOR: pkg.author,
    NEXT_PUBLIC_APP_COMMIT: (process.env.VERCEL_GIT_COMMIT_SHA ?? "").slice(0, 7),
  },
  experimental: {
    // Pages déjà visitées gardées 30 s dans le cache du navigateur : revenir sur un onglet
    // est instantané. Chaque enregistrement (revalidatePath) vide ce cache.
    staleTimes: { dynamic: 30 },
    // Import CSV : plusieurs années d'historique tiennent dans quelques Mo
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
