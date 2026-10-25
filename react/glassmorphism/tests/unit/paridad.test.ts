// RF-010 · paridad estructural vanilla <-> react: las mismas 7 vistas, con las mismas
// secciones, existen en ambas pistas. RNF-002 · ninguna vista vanilla carga un recurso
// de red externo (http(s)://, cdn) — P5. RF-006 · producto-detalle es texto plano: NO
// debe referenciar el renderer de Markdown en ninguna pista.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ownSources, ROOT as REACT_ROOT } from "./source";

// La pista vanilla vive en la raíz del repo bajo `glassmorphism/`, NO dentro de
// `react/glassmorphism/`. REACT_ROOT = .../react/glassmorphism -> subimos 2 niveles.
const VANILLA_ROOT = join(REACT_ROOT, "../../glassmorphism");

function vanillaFile(name: string): string {
  return join(VANILLA_ROOT, name);
}

function readVanilla(name: string): string {
  return readFileSync(vanillaFile(name), "utf8");
}

// Las 7 vistas del catálogo (plan.md §2 / §9) y su ubicación en cada pista.
type Vista = {
  nombre: string;
  vanilla: string;
  // Predicado sobre la ruta relativa (a partir de ROOT) de archivos react propios.
  react: (file: string) => boolean;
  // Secciones esperadas: cada una se verifica por separado en ambas pistas.
  secciones: { nombre: string; vanillaRe: RegExp; reactRe: RegExp }[];
};

const VISTAS: Vista[] = [
  {
    nombre: "Landing",
    vanilla: "index.html",
    react: (f) => f === "app/page.tsx" || f.startsWith("app/_landing/"),
    secciones: [
      { nombre: "navbar", vanillaRe: /<nav\b/i, reactRe: /from\s*["']@\/components\/glass\/navbar["']/ },
      { nombre: "hero", vanillaRe: /class="[^"]*hero/i, reactRe: /hero/i },
      { nombre: "footer", vanillaRe: /<footer\b/i, reactRe: /<footer\b|as=["']footer["']|from\s*["']@\/components\/glass\/footer["']/i },
    ],
  },
  {
    nombre: "Dashboard",
    vanilla: "dashboard.html",
    react: (f) => f.startsWith("app/dashboard/"),
    secciones: [
      { nombre: "sidebar", vanillaRe: /<aside\b/i, reactRe: /from\s*["']@\/components\/glass\/sidebar["']/ },
      { nombre: "topbar", vanillaRe: /class="[^"]*topbar/i, reactRe: /from\s*["']@\/components\/glass\/app-bar["']/ },
    ],
  },
  {
    nombre: "Blog listado",
    vanilla: "blog.html",
    react: (f) => f.startsWith("app/blog/") && !f.startsWith("app/blog/[slug]/"),
    secciones: [
      { nombre: "grid de posts", vanillaRe: /class="[^"]*blog-grid/i, reactRe: /from\s*["']@\/components\/glass\/post-card["']/ },
    ],
  },
  {
    nombre: "Blog detalle",
    vanilla: "blog-detalle.html",
    react: (f) => f.startsWith("app/blog/[slug]/"),
    secciones: [
      { nombre: "contenido markdown", vanillaRe: /class="[^"]*md-content/i, reactRe: /from\s*["']@\/components\/markdown\/markdown["']/ },
    ],
  },
  {
    nombre: "Productos listado",
    vanilla: "productos.html",
    react: (f) => f.startsWith("app/productos/") && !f.startsWith("app/productos/[slug]/"),
    secciones: [
      { nombre: "grid de productos", vanillaRe: /class="[^"]*product-grid/i, reactRe: /from\s*["']@\/components\/glass\/product-card["']/ },
    ],
  },
  {
    nombre: "Producto detalle",
    vanilla: "producto-detalle.html",
    react: (f) => f.startsWith("app/productos/[slug]/"),
    secciones: [
      // RF-006: descripción en texto plano, sin marcador de contenido Markdown.
      { nombre: "descripción texto plano", vanillaRe: /class="[^"]*product-detail/i, reactRe: /descripcion|description/i },
    ],
  },
  {
    nombre: "Contacto",
    vanilla: "contacto.html",
    react: (f) => f.startsWith("app/contacto/"),
    secciones: [
      { nombre: "formulario", vanillaRe: /<form\b/i, reactRe: /from\s*["']@\/components\/glass\/field["']|<form\b/ },
    ],
  },
];

describe("RF-010 paridad vanilla <-> react · conjunto de 7 vistas", () => {
  it.each(VISTAS.map((v) => [v.nombre, v] as const))(
    "%s existe en la pista vanilla (glassmorphism/%s)",
    (_nombre, v) => {
      expect(existsSync(vanillaFile(v.vanilla))).toBe(true);
    },
  );

  it.each(VISTAS.map((v) => [v.nombre, v] as const))(
    "%s existe en la pista react (app/…)",
    (_nombre, v) => {
      const archivos = ownSources().filter((s) => v.react(s.file));
      expect(archivos.length).toBeGreaterThan(0);
    },
  );
});

describe("RF-010 paridad vanilla <-> react · secciones por vista", () => {
  for (const v of VISTAS) {
    describe(v.nombre, () => {
      it.each(v.secciones.map((s) => [s.nombre, s] as const))(
        "sección %s presente en vanilla",
        (_nombre, s) => {
          expect(existsSync(vanillaFile(v.vanilla))).toBe(true);
          const html = readVanilla(v.vanilla);
          expect(html).toMatch(s.vanillaRe);
        },
      );

      it.each(v.secciones.map((s) => [s.nombre, s] as const))(
        "sección %s presente en react",
        (_nombre, s) => {
          const archivos = ownSources().filter((a) => v.react(a.file));
          const codigo = archivos.map((a) => a.code).join("\n");
          expect(codigo).toMatch(s.reactRe);
        },
      );
    });
  }
});

describe("RNF-002 vanilla · vistas -t vanilla · sin recursos de red externos", () => {
  // Namespace de SVG (xmlns="http://www.w3.org/2000/svg") NO es un recurso cargado por
  // red: se excluye explícitamente para no generar falsos positivos.
  // Delta T-024: un `<a href>` editorial es navegación (el usuario puede clicarlo), no
  // un recurso CARGADO por build/runtime — consistente con markdown.test.ts, que ya
  // permite `<a href="https://...">` en contenido editorial. El check sigue cazando
  // cualquier carga real: `src=` (script/img/source/iframe/...), `href` de `<link>`
  // (hojas de estilo/iconos/preload), `url()` de CSS y el literal `cdn`.
  const CARGA_EXTERNA =
    /\bsrc\s*=\s*"https?:\/\/(?!www\.w3\.org\/)[^"]*"|<link\b[^>]*\bhref\s*=\s*"https?:\/\/(?!www\.w3\.org\/)[^"]*"|url\(\s*https?:\/\/(?!www\.w3\.org\/)[^)]*\)|\bcdn\b/i;

  it.each(VISTAS.map((v) => [v.nombre, v.vanilla] as const))(
    "%s (glassmorphism/%s) no carga recursos de http(s):// ni cdn",
    (_nombre, archivo) => {
      expect(existsSync(vanillaFile(archivo))).toBe(true);
      const html = readVanilla(archivo);
      expect(html).not.toMatch(CARGA_EXTERNA);
    },
  );
});

describe("RF-006 producto-detalle sin markdown", () => {
  it("producto-detalle sin markdown · react no referencia el renderer de Markdown", () => {
    const archivos = ownSources().filter((s) => s.file.startsWith("app/productos/[slug]/"));
    expect(archivos.length).toBeGreaterThan(0);
    const codigo = archivos.map((a) => a.code).join("\n");
    expect(codigo).not.toMatch(/components\/markdown\/markdown/);
  });

  it("producto-detalle sin markdown · vanilla no carga markdown-renderer.js", () => {
    expect(existsSync(vanillaFile("producto-detalle.html"))).toBe(true);
    const html = readVanilla("producto-detalle.html");
    expect(html).not.toMatch(/markdown-renderer\.js/);
  });
});

// RF-002 (enmienda 2026-10-25): el dashboard expone un catálogo de 7 vistas conmutables.
// Paridad: cada `id` de vista existe en AMBAS pistas — en vanilla como panel `data-view` y
// como botón `data-view-target`; en react en el registro `dashboardViews` (content) y
// conmutado por el shell (`data-view={view}`). El inventario no cierra en 6 ("y más").
describe("RF-002 · catálogo de vistas del dashboard (paridad vanilla ↔ react)", () => {
  const VIEW_IDS = ["tabla", "metricas", "markdown", "tareas", "formulario", "controles"] as const;
  const dashboardHtml = readVanilla("dashboard.html");
  const content = ownSources().find((s) => s.file === "content/dashboard.ts")?.code ?? "";
  const shell = ownSources().find((s) => s.file === "app/dashboard/_components/dashboard-shell.tsx")?.code ?? "";

  it.each(VIEW_IDS)("vanilla · la vista %s tiene panel data-view y botón data-view-target", (id) => {
    expect(dashboardHtml).toContain(`data-view="${id}"`);
    expect(dashboardHtml).toContain(`data-view-target="${id}"`);
  });

  it.each(VIEW_IDS)("react · la vista %s está en el registro dashboardViews", (id) => {
    expect(content).toMatch(new RegExp(`id:\\s*["']${id}["']`));
  });

  it("react · el shell conmuta la vista activa en un panel con data-view", () => {
    expect(shell).toMatch(/data-view=\{view\}/);
    for (const id of VIEW_IDS) {
      expect(shell).toContain(`view === "${id}"`);
    }
  });

  it("vanilla · carga el conmutador de vistas (dashboard-views.js)", () => {
    expect(dashboardHtml).toMatch(/dashboard-views\.js/);
  });

  // RF-002 §6: la Vista Tabla muestra un registro de 3 formas (listado/detalle/edición).
  const SUBTABS = ["tabla", "vista", "editar"] as const;
  const viewTabla = ownSources().find((s) => s.file === "app/dashboard/_components/views/view-tabla.tsx")?.code ?? "";

  it.each(SUBTABS)("vanilla · la sub-pestaña %s de la Vista Tabla existe", (id) => {
    expect(dashboardHtml).toContain(`data-subtab="${id}"`);
    expect(dashboardHtml).toContain(`data-subtab-target="${id}"`);
  });

  it("react · la Vista Tabla declara las 3 sub-pestañas y las conmuta", () => {
    expect(viewTabla).toMatch(/data-subtab-target=\{t\.id\}/);
    expect(viewTabla).toMatch(/data-subtab=\{tab\}/);
    for (const id of SUBTABS) {
      expect(viewTabla).toMatch(new RegExp(`id:\\s*["']${id}["']`));
    }
  });
});

// Seleccionable con `-t vanilla` (T-017): las 4 vistas vanilla nuevas + su switcher de
// tema de 3 vías (#themeSwitcher), igual que ya existe en index.html/dashboard.html.
describe("vanilla vistas nuevas · estructura mínima", () => {
  const NUEVAS = ["blog.html", "blog-detalle.html", "productos.html", "producto-detalle.html", "contacto.html"];

  it.each(NUEVAS)("vanilla %s existe", (archivo) => {
    expect(existsSync(vanillaFile(archivo))).toBe(true);
  });

  it.each(NUEVAS)("vanilla %s incluye el switcher de tema (#themeSwitcher)", (archivo) => {
    expect(existsSync(vanillaFile(archivo))).toBe(true);
    const html = readVanilla(archivo);
    expect(html).toMatch(/id="themeSwitcher"/);
  });

  it.each(NUEVAS)("vanilla %s carga theme-manager.js y nav-toggle.js", (archivo) => {
    expect(existsSync(vanillaFile(archivo))).toBe(true);
    const html = readVanilla(archivo);
    expect(html).toMatch(/theme-manager\.js/);
    expect(html).toMatch(/nav-toggle\.js/);
  });
});

// Seleccionable con `-t markdown` (T-024): el bloque Markdown de blog-detalle.html debe
// coincidir con el output del componente react (misma fuente .md, Zona D del plan).
// Pendiente/rojo hasta T-024 (script de build vanilla) — esperado en esta fase.
describe("markdown · paridad del bloque renderizado blog-detalle <-> componente", () => {
  // Import dinámico por ruta absoluta (no alias "@/") a propósito: así Vite no intenta
  // resolver/transformar el módulo en build-time cuando aún no existe (T-022) y el
  // fallo queda como aserción en rojo de ESTE test, sin tumbar el resto de la suite.
  const MARKDOWN_MODULE = join(REACT_ROOT, "components/markdown/markdown.tsx");

  it("blog-detalle.html contiene el mismo HTML de md-content que renderMarkdownToHtml(post)", async () => {
    expect(
      existsSync(MARKDOWN_MODULE),
      "components/markdown/markdown.tsx aún no existe (T-022) — pendiente/rojo esperado",
    ).toBe(true);
    expect(existsSync(vanillaFile("blog-detalle.html"))).toBe(true);
    const html = readVanilla("blog-detalle.html");
    const mdBlockMatch = html.match(/<div class="md-content"[^>]*>([\s\S]*?)<\/div>\s*<!--\s*\/md-content\s*-->/);
    expect(mdBlockMatch, "blog-detalle.html debe envolver el markdown en <div class=\"md-content\">…<!-- /md-content -->").toBeTruthy();

    const { renderMarkdownToHtml } = await import(MARKDOWN_MODULE);
    const postPath = join(REACT_ROOT, "content/blog/estructura-catalogo.md");
    expect(existsSync(postPath)).toBe(true);
    const fuente = readFileSync(postPath, "utf8");
    const esperado = await renderMarkdownToHtml(fuente);

    expect(mdBlockMatch![1].trim()).toBe(esperado.trim());
  });
});

// Saneamiento del propio helper vanilla_root: evita que un typo silencioso apunte a un
// directorio inexistente y todos los `existsSync` anteriores den falsos negativos iguales.
describe("saneamiento de rutas del test de paridad", () => {
  it("VANILLA_ROOT resuelve a glassmorphism/ en la raíz del repo (no react/glassmorphism/glassmorphism)", () => {
    expect(statSync(VANILLA_ROOT).isDirectory()).toBe(true);
    expect(readdirSync(VANILLA_ROOT)).toContain("index.html");
    expect(readdirSync(VANILLA_ROOT)).toContain("css");
  });
});
