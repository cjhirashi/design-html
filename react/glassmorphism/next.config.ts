import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // `render-mermaid.ts` (build-time) lanza chromium con `playwright` (binarios nativos
  // que NO deben entrar al bundle) y carga el UMD de mermaid por RUTA de filesystem
  // (ver nota ahí: el specifier se construye en runtime para que Turbopack no lo reescriba
  // a un id numérico de módulo). Ninguno llega al bundle del cliente (P5): solo build/servidor.
  serverExternalPackages: ["playwright"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
