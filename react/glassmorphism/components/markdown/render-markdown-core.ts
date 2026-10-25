// Frontera de renderizado de Markdown a HTML (RF-004/RF-011/RF-015). Todo el
// trabajo pesado ocurre en build/servidor: markdown-it parsea la estructura y
// Shiki resuelve el resaltado de sintaxis real de los bloques de código con
// lenguaje declarado. Cero JS de resaltado llega al cliente: el resultado es
// HTML ya coloreado con `style`/`class` inline (self-hosted, sin CDN, P5).
//
// El bloque de Mermaid (```mermaid) se resuelve a <svg> inline vía
// `renderMermaidToSvg` (T-023): mermaid (paquete npm vendorizado, nunca CDN)
// se carga en una página headless de Playwright para generar el SVG en
// build/servidor; el SVG resultante es autocontenido (sin <script>, sin red).
//
// Este módulo vive aparte de `markdown.tsx` (T-024) a propósito: es TypeScript SIN
// JSX, así que tanto el componente React (`markdown.tsx`, que lo re-exporta) como
// `scripts/build-vanilla-markdown.mjs` (Node plano, type-stripping nativo de Node 24,
// sin transformar sintaxis JSX) pueden importar exactamente la MISMA función — ninguna
// reimplementación paralela del parser (RF-010).
import MarkdownIt from "markdown-it";
import { codeToHtml } from "shiki";
import { renderMermaidToSvg } from "./render-mermaid";

// Tema fijo de Shiki para el resaltado de bloques de código. No es un literal
// de color del sistema de diseño (RNF-003 regula las vistas, no el output de
// una librería de terceros sobre contenido de código ajeno) ni carga nada por
// red: el tema vive empaquetado en `shiki` (ver nota P5 arriba).
const SHIKI_THEME = "github-dark";

/** Marcador interno para diferir el resaltado (async) tras el render síncrono de markdown-it. */
const FENCE_PLACEHOLDER = (index: number) => `@@MARKDOWN_FENCE_${index}@@`;

interface PendingFence {
  lang: string;
  code: string;
}

function createRenderer() {
  const md = new MarkdownIt({
    html: false,
    linkify: false,
    typographer: false,
  });

  // markdown-it emite `~~texto~~` como <s>; el contrato de RF-004 pide <del>.
  md.renderer.rules.s_open = () => "<del>";
  md.renderer.rules.s_close = () => "</del>";

  return md;
}

/**
 * Renderiza una fuente Markdown completa a HTML, resolviendo el resaltado de
 * sintaxis (Shiki) en build/servidor. Async porque Shiki carga sus gramáticas
 * de forma asíncrona; no hay ningún paso de resaltado en el cliente.
 */
export async function renderMarkdownToHtml(source: string): Promise<string> {
  const md = createRenderer();
  const pending: PendingFence[] = [];

  md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    const lang = token.info.trim();
    pending.push({ lang, code: token.content });
    return FENCE_PLACEHOLDER(pending.length - 1);
  };

  const htmlWithPlaceholders = md.render(source);

  const resolved = await Promise.all(
    pending.map(({ lang, code }) => renderCodeBlock(lang, code)),
  );

  return resolved.reduce(
    (html, block, index) => html.replace(FENCE_PLACEHOLDER(index), block),
    htmlWithPlaceholders,
  );
}

/**
 * Resuelve un único bloque de código. Mermaid (RF-011) se pre-renderiza a
 * <svg> inline en build/servidor. Con lenguaje reconocido delega en Shiki
 * (resaltado real). Sin lenguaje, o si Shiki no reconoce el lenguaje, cae a
 * `<pre><code>` monoespaciado sin ningún span de color (RF-015).
 */
async function renderCodeBlock(lang: string, code: string): Promise<string> {
  const content = code.replace(/\n$/, "");

  if (lang === "mermaid") {
    return renderMermaidToSvg(content);
  }

  if (!lang) {
    return plainCodeBlock(content);
  }

  try {
    return await codeToHtml(content, { lang, theme: SHIKI_THEME });
  } catch {
    // Lenguaje no soportado por el bundle de Shiki: sin resaltado, no se
    // interrumpe el render del resto del documento.
    return plainCodeBlock(content);
  }
}

function plainCodeBlock(content: string): string {
  const escaped = MarkdownIt().utils.escapeHtml(content);
  return `<pre><code>${escaped}\n</code></pre>`;
}
