// RF-007 · el dashboard reusa los componentes base del landing; estilos sin duplicar.
// RF-003/RF-005/RF-013 · Blog/Productos/Contacto reusan post-card/product-card/field (SPEC-0002).
import { describe, expect, it } from "vitest";
import { ownSources } from "./source";

// Una ruta = su page.tsx + sus componentes de composición privados.
// blog-detalle/producto-detalle viven bajo app/blog/[slug] y app/productos/[slug]
// respectivamente; se filtran por exclusión del listado (misma raíz de carpeta).
const ROUTES = {
  landing: (f: string) => f === "app/page.tsx" || f.startsWith("app/_landing/"),
  dashboard: (f: string) => f.startsWith("app/dashboard/"),
  blog: (f: string) =>
    (f === "app/blog/page.tsx" || f.startsWith("app/blog/_components/")),
  "blog-detalle": (f: string) => f.startsWith("app/blog/[slug]"),
  productos: (f: string) =>
    (f === "app/productos/page.tsx" || f.startsWith("app/productos/_components/")),
  "producto-detalle": (f: string) => f.startsWith("app/productos/[slug]"),
  contacto: (f: string) => f.startsWith("app/contacto/"),
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

// Módulos del renderer Markdown (@/components/markdown/<x>), usados por blog-detalle.
function markdownModules(route: keyof typeof ROUTES): Set<string> {
  const mods = routeFiles(route).flatMap((s) =>
    [...s.code.matchAll(/from\s*["']@\/components\/markdown\/([\w-]+)["']/g)].map((m) => m[1]),
  );
  return new Set(mods);
}

const stripComments = (code: string) => code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const rendered = (route: keyof typeof ROUTES) =>
  routeFiles(route)
    .map((s) => stripComments(s.code))
    .join("\n");

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

  it.each(["Navbar", "Sidebar", "GlassCard", "ThemeSwitch", "Badge"])(
    "landing y dashboard renderizan <%s> (uso real, no sólo import)",
    (name) => {
      const tag = new RegExp(`<${name}[\\s>]`);
      expect(rendered("landing")).toMatch(tag);
      expect(rendered("dashboard")).toMatch(tag);
    },
  );

  it("ninguna ruta declara su propio header/aside: los obtiene de Navbar/Sidebar", () => {
    for (const route of ["landing", "dashboard"] as const) {
      expect(rendered(route)).not.toMatch(/<(header|aside)\b[^>]*\bsticky\b|<aside\b/);
    }
  });

  it("la receta de vidrio (backdrop-blur) vive en un solo módulo", () => {
    const owners = ownSources(/\.(ts|tsx|css)$/)
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

describe("blog · reusa post-card (RF-003)", () => {
  const blog = glassModules("blog");

  it("la ruta blog importa components/glass/post-card", () => {
    expect(blog).toContain("post-card");
  });

  it("la ruta blog renderiza <PostCard> (uso real, no sólo import)", () => {
    expect(rendered("blog")).toMatch(/<PostCard[\s>]/);
  });

  it.each(["navbar", "footer"])("la ruta blog reusa components/glass/%s (sin layout propio)", (mod) => {
    expect(blog).toContain(mod);
  });
});

describe("productos · reusa product-card (RF-005)", () => {
  const productos = glassModules("productos");

  it("la ruta productos importa components/glass/product-card", () => {
    expect(productos).toContain("product-card");
  });

  it("la ruta productos renderiza <ProductCard> (uso real, no sólo import)", () => {
    expect(rendered("productos")).toMatch(/<ProductCard[\s>]/);
  });

  it.each(["navbar", "footer"])("la ruta productos reusa components/glass/%s (sin layout propio)", (mod) => {
    expect(productos).toContain(mod);
  });
});

describe("post individual · usa el componente Markdown + prose (RF-004)", () => {
  it("la ruta del post individual importa components/markdown/markdown", () => {
    expect(markdownModules("blog-detalle")).toContain("markdown");
  });

  it("la ruta del post individual renderiza <Markdown> (uso real, no sólo import)", () => {
    expect(rendered("blog-detalle")).toMatch(/<Markdown[\s>]/);
  });

  it("la ruta del post individual importa components/markdown/prose", () => {
    const mods = routeFiles("blog-detalle").flatMap((s) =>
      [...s.code.matchAll(/from\s*["']@\/components\/markdown\/prose["']/g)],
    );
    expect(mods.length).toBeGreaterThan(0);
  });
});

describe("ficha de producto · reusa layout compartido, sin Markdown (RF-006, paridad.test.ts)", () => {
  it("la ficha de producto NO importa el renderer de Markdown", () => {
    expect(markdownModules("producto-detalle").size).toBe(0);
  });

  it.each(["navbar", "footer"])("la ficha de producto reusa components/glass/%s", (mod) => {
    expect(glassModules("producto-detalle")).toContain(mod);
  });
});

describe("contacto · usa field con error inline (RF-013)", () => {
  const contacto = glassModules("contacto");

  it("la ruta contacto importa components/glass/field", () => {
    expect(contacto).toContain("field");
  });

  it("la ruta contacto renderiza <Field> (uso real, no sólo import)", () => {
    expect(rendered("contacto")).toMatch(/<Field[\s>]/);
  });

  it("field recibe soporte de error inline (prop error/mensaje bajo el input)", () => {
    expect(rendered("contacto")).toMatch(/<Field\b[^>]*\berror\b/);
  });

  it.each(["navbar", "footer"])("la ruta contacto reusa components/glass/%s (sin layout propio)", (mod) => {
    expect(contacto).toContain(mod);
  });
});

describe("RF-003/005/007/013 las 7 vistas reusan componentes compartidos base", () => {
  // Etiquetas de display deliberadamente distintas de las claves de ROUTES: evitan que
  // el nombre del test contenga "blog"/"productos" y colisione por substring con los
  // filtros `-t blog`/`-t productos` que aíslan solo los listados (ver T-009/T-010).
  const routes: [string, keyof typeof ROUTES][] = [
    ["landing", "landing"],
    ["dashboard", "dashboard"],
    ["listado de blog", "blog"],
    ["post individual", "blog-detalle"],
    ["listado de productos", "productos"],
    ["ficha de producto", "producto-detalle"],
    ["contacto", "contacto"],
  ];

  it.each(routes)("%s no declara su propio header/aside: lo obtiene de Navbar/Sidebar", (_label, route) => {
    expect(rendered(route)).not.toMatch(/<(header|aside)\b[^>]*\bsticky\b|<aside\b/);
  });

  it.each(routes)("%s no redefine superficies de vidrio propias", (_label, route) => {
    for (const s of routeFiles(route)) {
      expect(s.code).not.toMatch(/\b(shadow-glass(-\w+)?|border-glass-line|bg-card|bg-glass|backdrop-\w+)\b/);
    }
  });
});
