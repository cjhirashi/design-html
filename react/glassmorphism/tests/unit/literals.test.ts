// RNF-003 · equivalente P6 (ADR-001): sin colores literales ni `style` en código propio.
import { describe, expect, it } from "vitest";
import { ownSources } from "./source";

const TAILWIND_PALETTE =
  /\b(?:bg|text|border|from|to|via|fill|stroke|ring|shadow|outline|decoration|divide|placeholder|caret|accent)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|white|black)\b/;

describe("RNF-003 sin literales de diseño", () => {
  const sources = ownSources();

  it.each(sources.map((s) => [s.file, s.code]))("%s no contiene colores literales", (_f, code) => {
    expect(code).not.toMatch(/#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})\b/i);
    expect(code).not.toMatch(/\b(?:rgba?|hsla?|oklch|oklab)\(/);
    expect(code).not.toMatch(TAILWIND_PALETTE);
  });

  it.each(sources.filter((s) => s.file.endsWith(".tsx")).map((s) => [s.file, s.code]))(
    "%s no usa el atributo style",
    (_f, code) => {
      expect(code).not.toMatch(/\bstyle=\{/);
    },
  );
});
