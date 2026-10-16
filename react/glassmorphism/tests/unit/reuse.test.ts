// RF-007 · el dashboard reusa los componentes base del landing; estilos sin duplicar.
import { describe, expect, it } from "vitest";
import { ownSources } from "./source";

// Una ruta = su page.tsx + sus componentes de composición privados.
const ROUTES = {
  landing: (f: string) => f === "app/page.tsx" || f.startsWith("app/_landing/"),
  dashboard: (f: string) => f.startsWith("app/dashboard/"),
};

function routeFiles(route: keyof typeof ROUTES) {
  return ownSources().filter((s) => ROUTES[route](s.file));
}

function glassModules(route: keyof typeof ROUTES): Set<string> {
  const mods = routeFiles(route).flatMap((s) =>
    [...s.code.matchAll(/from\s*["']@\/components\/glass\/([\w-]+)["']/g)].map((m) => m[1]),
  );
  return new Set(mods);
}

describe("RF-007 mismos componentes, distinta composición", () => {
  const landing = glassModules("landing");
  const dashboard = glassModules("dashboard");

  it.each(["navbar", "sidebar", "glass-card", "badge", "button", "theme-switch", "logo"])(
    "landing y dashboard usan components/glass/%s",
    (mod) => {
      expect(landing).toContain(mod);
      expect(dashboard).toContain(mod);
    },
  );

  it("la receta de vidrio (backdrop-blur) vive en un solo módulo", () => {
    const owners = ownSources()
      .filter((s) => /backdrop-(blur|filter|saturate)/.test(s.code))
      .map((s) => s.file);
    expect(owners).toEqual(["components/glass/surface.ts"]);
  });

  it.each([...routeFiles("landing"), ...routeFiles("dashboard")].map((s) => [s.file, s.code]))(
    "%s no redefine superficies de vidrio",
    (_file, code) => {
      expect(code).not.toMatch(/\b(shadow-glass(-\w+)?|border-glass-line|bg-card|bg-glass|backdrop-\w+)\b/);
    },
  );
});
