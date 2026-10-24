// Frontera Mermaid (RF-004/RF-011, T-023): convierte un bloque de código
// ```mermaid a <svg> inline, pre-renderizado en build/servidor.
//
// Mecanismo: el paquete npm `mermaid` (vendorizado, nunca CDN) necesita un
// DOM real para calcular el layout del diagrama (usa `document`/`SVGElement`
// internamente). Se carga el build UMD de `mermaid` (archivo local en
// `node_modules`, jamás una URL) dentro de una página headless de Playwright
// (paquete npm `playwright`, ya vendorizado para e2e) y se extrae el SVG
// resultante vía `mermaid.render(...)`. Todo esto ocurre en build/servidor:
// ningún JS de Mermaid ni de Playwright llega al cliente (P5/RNF-002); el
// HTML final solo contiene el `<svg>` ya resuelto, sin <script>.
import path from "node:path";
import { chromium, type Browser } from "playwright";

// Build UMD de mermaid: archivo local empaquetado por npm, se carga como
// <script> de la página headless vía ruta de filesystem (sin red, sin CDN).
const MERMAID_UMD_PATH = require.resolve("mermaid/dist/mermaid.js");

let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium.launch({ headless: true });
  }
  return browserPromise;
}

let renderCounter = 0;

/**
 * Renderiza una fuente Mermaid a un fragmento `<svg>` autocontenido (sin
 * <script>, sin referencias a http(s):// ni a "cdn" dentro del propio SVG).
 */
export async function renderMermaidToSvg(source: string): Promise<string> {
  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    await page.setContent("<!DOCTYPE html><html><body></body></html>");
    await page.addScriptTag({ path: MERMAID_UMD_PATH });

    const id = `mermaid-diagram-${++renderCounter}`;
    const rawSvg = await page.evaluate(
      async ({ id, source }) => {
        const mermaidGlobal = (
          window as unknown as {
            mermaid: {
              initialize: (config: Record<string, unknown>) => void;
              render: (id: string, text: string) => Promise<{ svg: string }>;
            };
          }
        ).mermaid;
        mermaidGlobal.initialize({ startOnLoad: false, securityLevel: "strict" });
        const { svg } = await mermaidGlobal.render(id, source);
        return svg;
      },
      { id, source },
    );

    return sanitizeMermaidSvg(rawSvg);
  } finally {
    await page.close();
  }
}

/**
 * Neutraliza los namespaces XML del SVG generado por Mermaid
 * (`xmlns="http://www.w3.org/..."`), que no son recursos de red sino
 * declaraciones de namespace, pero contienen el literal `http://` que el
 * contrato RF-011 prohíbe dentro del `<svg>`. El SVG sigue siendo válido en
 * HTML: el namespace SVG es implícito al insertarse en el árbol del
 * documento (mismo tratamiento que los `<svg>` inline vanilla de T-016).
 */
function sanitizeMermaidSvg(svg: string): string {
  return svg
    .replace(/\s+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, "")
    .replace(/\s+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, "")
    .replace(/\s+xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, "");
}
