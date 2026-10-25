#!/usr/bin/env node
// Script de build vanilla (T-024, RF-004/RF-010/RF-011): genera el bloque Markdown de
// `glassmorphism/blog-detalle.html` a partir de la MISMA fuente `.md` y el MISMO
// renderer que consume la pista React (`components/markdown/render-markdown-core.ts`,
// re-exportado por `components/markdown/markdown.tsx`). Cero reimplementación del
// parser: este script importa literalmente `renderMarkdownToHtml`, la misma función
// que ejecuta `<Markdown>` en `app/blog/[slug]/page.tsx` — por construcción, el HTML
// resultante es idéntico (paridad byte-a-byte verificada por
// `tests/unit/paridad.test.ts` con el patrón `-t markdown`).
//
// Mecanismo de import (node v24.21.0, Node plano, sin bundler):
// - Node 24 soporta type-stripping nativo de `.ts` SIN JSX al importarlo directamente
//   (`--experimental-strip-types`, activo por defecto). `render-markdown-core.ts` es
//   TypeScript puro sin JSX a propósito (T-024): es el módulo que tanto el componente
//   React (`markdown.tsx`, que lo re-exporta) como este script importan.
// - Node ESM, a diferencia de TypeScript/bundlers, NO resuelve automáticamente la
//   extensión de un specifier relativo sin ella (`./render-mermaid`, tal y como está
//   escrito en el módulo compartido para que siga siendo válido bajo
//   `moduleResolution: "bundler"` de Next/tsc). Para no bifurcar ese código fuente por
//   consumidor, este script registra un loader ESM mínimo
//   (`scripts/ts-extension-loader.mjs`, ~10 líneas, sin dependencias nuevas) que añade
//   la extensión `.ts` cuando el archivo existe. Alternativa descartada: añadir
//   `tsx`/`ts-node` como dependencia nueva solo para esto — innecesario, Node ya
//   resuelve el 95% del problema nativamente.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { register } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));
const REACT_ROOT = join(SCRIPTS_DIR, "..");
const VANILLA_ROOT = join(REACT_ROOT, "../../glassmorphism");

register(pathToFileURL(join(SCRIPTS_DIR, "ts-extension-loader.mjs")).href, pathToFileURL(REACT_ROOT + "/").href);

const MD_BLOCK_RE = /(<div class="md-content"[^>]*>)([\s\S]*?)(<\/div>\s*<!--\s*\/md-content\s*-->)/;

async function main() {
  const { renderMarkdownToHtml } = await import(
    pathToFileURL(join(REACT_ROOT, "components/markdown/render-markdown-core.ts")).href
  );

  const postPath = join(REACT_ROOT, "content/blog/estructura-catalogo.md");
  const source = readFileSync(postPath, "utf8");
  const html = await renderMarkdownToHtml(source);

  const targetPath = join(VANILLA_ROOT, "blog-detalle.html");
  if (!existsSync(targetPath)) {
    throw new Error(`No existe ${targetPath} — se esperaba la maqueta de T-018.`);
  }

  const vanillaHtml = readFileSync(targetPath, "utf8");
  const match = vanillaHtml.match(MD_BLOCK_RE);
  if (!match) {
    throw new Error(
      `${targetPath} no contiene el bloque <div class="md-content">…<!-- /md-content --> esperado.`,
    );
  }

  const updatedHtml = vanillaHtml.replace(MD_BLOCK_RE, `$1\n${html.trim()}\n$3`);
  writeFileSync(targetPath, updatedHtml, "utf8");

  console.log(`OK: bloque md-content de ${targetPath} regenerado desde ${postPath}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
