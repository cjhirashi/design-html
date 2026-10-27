// RF-004 · componente Markdown reutilizable: cada construcción del fixture produce su
// HTML. RF-015 · bloque de código sin lenguaje queda monoespaciado, sin spans de color.
// RF-014 · ninguna <img> del output carece de alt no vacío.
// RF-011 · Mermaid se resuelve a <svg> inline en build/servidor: sin <script> ni URL
// externa (self-hosted, P5) en el HTML renderizado.
import { describe, expect, it } from "vitest";
import { read } from "./source";

// Contrato: el módulo expone una función de render async que resuelve el fixture
// completo a HTML (Shiki/Mermaid se resuelven en build/servidor, nunca en cliente).
// No se impone de más: no se asume Server Component ni firma de props de <Markdown>,
// solo que exista un render async de Markdown -> HTML para poder aserción de contrato.
import { renderMarkdownToHtml } from "@/components/markdown/markdown";

const fixture = read("tests/fixtures/markdown-showcase.md");

describe("RF-004 Markdown renderer · contrato de salida por construcción", () => {
  it("renderiza el fixture completo a HTML", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(typeof html).toBe("string");
    expect(html.length).toBeGreaterThan(0);
  });

  it.each([
    ["h1", /<h1[^>]*>Encabezado nivel 1<\/h1>/],
    ["h2", /<h2[^>]*>Encabezado nivel 2<\/h2>/],
    ["h3", /<h3[^>]*>Encabezado nivel 3<\/h3>/],
    ["h4", /<h4[^>]*>Encabezado nivel 4<\/h4>/],
    ["h5", /<h5[^>]*>Encabezado nivel 5<\/h5>/],
    ["h6", /<h6[^>]*>Encabezado nivel 6<\/h6>/],
  ])("encabezado %s produce su etiqueta", async (_name, tagRe) => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(tagRe);
  });

  it("negrita, cursiva y tachado producen <strong>/<em>/<del>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<strong>negrita<\/strong>/);
    expect(html).toMatch(/<em>cursiva<\/em>/);
    expect(html).toMatch(/<del>tachado<\/del>/);
  });

  it("lista desordenada produce <ul><li>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<ul>[\s\S]*<li>Primer elemento<\/li>[\s\S]*<\/ul>/);
  });

  it("lista ordenada produce <ol><li>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<ol>[\s\S]*<li>Paso uno<\/li>[\s\S]*<\/ol>/);
  });

  it("lista anidada produce <ul>/<ol> anidados (sub-elementos dentro de <li>)", async () => {
    const html = await renderMarkdownToHtml(fixture);
    // El <li> del elemento raíz contiene una sub-lista anidada con su propio <li>.
    expect(html).toMatch(
      /<li>Elemento raíz uno[\s\S]*?<ul>[\s\S]*?<li>Sub-elemento A<\/li>[\s\S]*?<\/ul>[\s\S]*?<\/li>/,
    );
    // Anidación de 2 niveles: sub-sub-elemento dentro de otra <ul> anidada.
    expect(html).toMatch(
      /<li>Sub-elemento C[\s\S]*?<ul>[\s\S]*?<li>Sub-sub-elemento C\.1<\/li>[\s\S]*?<\/ul>[\s\S]*?<\/li>/,
    );
  });

  it("blockquote produce <blockquote>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<blockquote>[\s\S]*cita en bloque[\s\S]*<\/blockquote>/);
  });

  it("código inline produce <code> sin envolver en <pre>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<code>const x = 1;<\/code>/);
  });

  it("tabla produce <table>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<table>[\s\S]*Columna A[\s\S]*<\/table>/);
  });

  it("enlace produce <a href=...>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<a[^>]*href="https:\/\/design-html\.local\/sistema"[^>]*>/);
  });

  it("regla horizontal produce <hr>", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<hr\s*\/?>/);
  });

  it("bloque de código CON lenguaje produce <pre><code> con resaltado (spans de token Shiki)", async () => {
    const html = await renderMarkdownToHtml(fixture);
    const match = html.match(/<pre[^>]*>[\s\S]*?saludar[\s\S]*?<\/pre>/);
    expect(match).not.toBeNull();
    const block = match![0];
    expect(block).toMatch(/<code[^>]*>/);
    // Resaltado real: al menos un span con color/estilo de token (Shiki).
    expect(block).toMatch(/<span[^>]*(style="[^"]*color|class="[^"]*\b(shiki|token)\b)/);
  });

  it("RF-015 · bloque de código SIN lenguaje produce <pre><code> monoespaciado sin spans de color", async () => {
    const html = await renderMarkdownToHtml(fixture);
    // Delta T-022: el tramo inicial excluye `</pre>` para no cruzar el bloque CON
    // lenguaje que precede a este en el fixture (el lazy original arrancaba en su
    // <pre> y se extendía hasta el cierre de ESTE bloque, arrastrando sus spans).
    const match = html.match(/<pre[^>]*>(?:(?!<\/pre>)[\s\S])*?bloque sin lenguaje[\s\S]*?<\/pre>/);
    expect(match).not.toBeNull();
    const block = match![0];
    expect(block).toMatch(/<code[^>]*>/);
    // Sin resaltado: ningún span de color/token dentro de este bloque concreto.
    expect(block).not.toMatch(/<span[^>]*(style="[^"]*color|class="[^"]*\b(shiki|token)\b)/);
  });

  it("RF-014 · ninguna <img> del output carece de alt no vacío", async () => {
    const html = await renderMarkdownToHtml(fixture);
    const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) {
      const altMatch = img.match(/\balt="([^"]*)"/);
      expect(altMatch).not.toBeNull();
      expect(altMatch![1].trim().length).toBeGreaterThan(0);
    }
    // La imagen concreta del fixture conserva su alt descriptivo.
    expect(html).toMatch(/<img[^>]*alt="Textura de vidrio esmerilado con reflejos violeta y cian"[^>]*>/);
  });

  it("RF-011 · el diagrama Mermaid se emite como <svg> inline", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).toMatch(/<svg[^>]*>[\s\S]*<\/svg>/);
  });

  it("RF-011 · el output no contiene <script>, y el SVG de Mermaid no referencia URL externa/CDN (self-hosted, P5)", async () => {
    const html = await renderMarkdownToHtml(fixture);
    expect(html).not.toMatch(/<script\b/i);
    const svgMatch = html.match(/<svg[^>]*>[\s\S]*?<\/svg>/);
    expect(svgMatch).not.toBeNull();
    // El propio SVG del diagrama no depende de red: sin http(s):// ni "cdn" dentro de él.
    // (El fixture incluye deliberadamente un <a href="https://...">, fuera del alcance de este check.)
    expect(svgMatch![0]).not.toMatch(/https?:\/\//i);
    expect(svgMatch![0]).not.toMatch(/\bcdn\b/i);
  });
});
