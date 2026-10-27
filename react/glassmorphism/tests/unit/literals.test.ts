// RNF-003 · equivalente P6 (ADR-001): sin colores literales ni `style` en código propio.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ownSources, ROOT } from "./source";

const TAILWIND_PALETTE =
  /\b(?:bg|text|border|from|to|via|fill|stroke|ring|shadow|outline|decoration|divide|placeholder|caret|accent)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b/;

const NAMED_IN_ARBITRARY = /\[(?:color:)?(?:red|blue|green|black|white|gray|grey|purple|violet|pink|orange|yellow|cyan|magenta|navy|teal|silver|gold|transparent)\]/i;

describe("RNF-003 sin literales de diseño", () => {
  const sources = ownSources();

  it.each(sources.map((s) => [s.file, s.code]))("%s no contiene colores literales", (_f, code) => {
    expect(code).not.toMatch(/#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b/i);
    expect(code).not.toMatch(/\b(?:rgba?|hsla?|oklch|oklab)\(/);
    expect(code).not.toMatch(TAILWIND_PALETTE);
    expect(code).not.toMatch(NAMED_IN_ARBITRARY);
    expect(code).not.toMatch(/color-mix\(/);
  });

  it.each(
    ownSources(/\.css$/)
      .filter((s) => s.file !== "app/tokens.css")
      .map((s) => [s.file, s.code]),
  )("%s (CSS propio fuera de tokens.css) no define colores", (_f, code) => {
    expect(code).not.toMatch(/#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b/i);
    expect(code).not.toMatch(/\b(?:rgba?|hsla?|oklch|oklab)\(/);
  });

  it.each(sources.filter((s) => s.file.endsWith(".tsx")).map((s) => [s.file, s.code]))(
    "%s no usa el atributo style",
    (_f, code) => {
      expect(code).not.toMatch(/\bstyle=[{"']/);
    },
  );
});

// RNF-003 · componentes/vistas nuevos de SPEC-0002 (plan §2 Zona A/C, §9): deben existir
// y, al existir, no contener literales de color ni `style=` de color. Discriminante: un
// archivo ausente falla ("no existe todavía"); un archivo presente con un literal falla
// (reusa exactamente las mismas regex del bloque anterior, sin criterios más laxos).
describe("RNF-003 componentes nuevos de SPEC-0002 (existencia + sin literales)", () => {
  const NUEVOS = [
    "components/glass/post-card.tsx",
    "components/glass/product-card.tsx",
    "components/glass/field.tsx",
    "components/glass/empty-state.tsx",
    "components/markdown/markdown.tsx",
    "components/markdown/prose.ts",
  ];

  it.each(NUEVOS)("%s existe", (file) => {
    expect(existsSync(join(ROOT, file))).toBe(true);
  });

  it.each(NUEVOS)("%s (si existe) no contiene colores literales", (file) => {
    const full = join(ROOT, file);
    if (!existsSync(full)) {
      // La aserción de existencia ya falla arriba; aquí no se duplica el fallo.
      return;
    }
    const code = readFileSync(full, "utf8");
    expect(code).not.toMatch(/#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b/i);
    expect(code).not.toMatch(/\b(?:rgba?|hsla?|oklch|oklab)\(/);
    expect(code).not.toMatch(TAILWIND_PALETTE);
    expect(code).not.toMatch(NAMED_IN_ARBITRARY);
    expect(code).not.toMatch(/color-mix\(/);
  });

  it.each(NUEVOS.filter((f) => f.endsWith(".tsx")))(
    "%s (si existe) no usa el atributo style",
    (file) => {
      const full = join(ROOT, file);
      if (!existsSync(full)) return;
      const code = readFileSync(full, "utf8");
      expect(code).not.toMatch(/\bstyle=[{"']/);
    },
  );
});
