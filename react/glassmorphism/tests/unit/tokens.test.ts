// RNF-001 · contrato de tokens (familia P3) y contraste WCAG AA en claro y oscuro.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(__dirname, "../../app/tokens.css"), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`falta el bloque ${selector}`);
  const body = css.slice(start, css.indexOf("}", start));
  const vars: Record<string, string> = {};
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) vars[m[1]] = m[2].trim();
  return vars;
}

// Familia estándar de la Constitución, Art. 3 / P3.
const P3 = [
  "--bg-primary", "--bg-secondary", "--bg-tertiary", "--bg-glass",
  "--text-primary", "--text-secondary", "--text-muted",
  "--border-color", "--border-focus",
  "--primary-color", "--primary-hover", "--primary-light", "--primary-text",
  "--secondary-color", "--secondary-hover", "--secondary-light", "--secondary-text",
  "--error-bg", "--error-text", "--error-border",
  "--warning-bg", "--warning-text", "--warning-border",
  "--success-bg", "--success-text", "--success-border",
  "--shadow-sm", "--shadow-md", "--shadow-lg",
  "--radius-sm", "--radius-md", "--radius-lg",
  "--transition-smooth",
];

type RGBA = [number, number, number, number];

function parseColor(value: string): RGBA {
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgba = value.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const [r, g, b, a = "1"] = rgba[1].split(",").map((s) => s.trim());
    return [Number(r), Number(g), Number(b), Number(a)];
  }
  throw new Error(`color no soportado por el test: ${value}`);
}

function over(top: RGBA, base: RGBA): RGBA {
  const a = top[3];
  return [0, 1, 2].map((i) => top[i] * a + base[i] * (1 - a)).concat(1) as RGBA;
}

function luminance([r, g, b]: RGBA): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(fg: RGBA, bg: RGBA): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const themes = {
  claro: block(":root"),
  oscuro: block('[data-theme="dark"]'),
};

describe.each(Object.entries(themes))("tema %s", (_name, vars) => {
  it("define la familia P3 completa", () => {
    const missing = P3.filter((v) => !(v in vars));
    expect(missing).toEqual([]);
  });

  const bg = () => parseColor(vars["--bg-primary"]);
  const surfaces = () => ({
    "--bg-primary": bg(),
    "--bg-card": over(parseColor(vars["--bg-card"]), bg()),
    "--bg-glass": over(parseColor(vars["--bg-glass"]), bg()),
  });

  it.each(["--text-primary", "--text-secondary", "--text-muted"])(
    "%s cumple AA (≥ 4.5:1) sobre fondo y superficies de vidrio",
    (token) => {
      const fg = parseColor(vars[token]);
      for (const [surface, color] of Object.entries(surfaces())) {
        expect(contrast(fg, color), `${token} sobre ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it.each([
    ["--success-text", "--success-bg"],
    ["--warning-text", "--warning-bg"],
    ["--error-text", "--error-bg"],
    ["--primary-text", "--primary-light"],
    ["--secondary-text", "--secondary-light"],
  ])("%s cumple AA como badge (sobre %s encima de --bg-card)", (token, tint) => {
    const badgeBg = over(parseColor(vars[tint]), surfaces()["--bg-card"]);
    expect(contrast(parseColor(vars[token]), badgeBg)).toBeGreaterThanOrEqual(4.5);
  });

  it("--on-primary cumple AA sobre --primary-solid (botones)", () => {
    expect(contrast(parseColor(vars["--on-primary"]), parseColor(vars["--primary-solid"]))).toBeGreaterThanOrEqual(4.5);
  });

  // RF-009 / RNF-004 · pares que estrenan las clases/componentes nuevos de SPEC-0002
  // (post-card, product-card, field + field-error, empty-state, .md-content*).
  // Plan §2 Zona B: esas clases reusan solo tokens P3 ya declarados — ningún valor de
  // color nuevo. Por eso este bloque NO añade tokens al diccionario P3: valida pares
  // (fg sobre bg) ya existentes bajo el uso nuevo que les dan las vistas.

  it("--error-text cumple AA como texto de error inline (RF-013) sobre --bg-card", () => {
    // Error junto al campo, no como badge: el error vive directo sobre la superficie
    // de la tarjeta/formulario (--bg-card), no sobre el tinte --error-bg.
    expect(contrast(parseColor(vars["--error-text"]), surfaces()["--bg-card"])).toBeGreaterThanOrEqual(4.5);
  });

  it("--text-muted cumple AA como texto secundario de empty-state / fecha de post / precio de producto sobre --bg-card", () => {
    // Ya cubierto en el bloque P3 de arriba para bg-primary/bg-card/bg-glass, pero se
    // deja explícito aquí como contrato de las vistas nuevas (RF-003/005/012).
    expect(contrast(parseColor(vars["--text-muted"]), surfaces()["--bg-card"])).toBeGreaterThanOrEqual(4.5);
  });

  it("código inline/bloque de .md-content (--text-secondary) cumple AA sobre --bg-tertiary", () => {
    const codeSurface = over(parseColor(vars["--bg-tertiary"]), bg());
    expect(contrast(parseColor(vars["--text-secondary"]), codeSurface)).toBeGreaterThanOrEqual(4.5);
  });

  it("blockquote de .md-content (--text-secondary) cumple AA sobre --bg-card", () => {
    expect(contrast(parseColor(vars["--text-secondary"]), surfaces()["--bg-card"])).toBeGreaterThanOrEqual(4.5);
  });

  it("enlace de .md-content (--primary-text, decidido en prose.ts T-012) cumple AA sobre --bg-card", () => {
    // Reconciliado en T-019: el enlace de `.md-content` NO usa `--primary-color`
    // (`text-primary`, falla AA en oscuro: 3.78:1 < 4.5). `components/markdown/prose.ts`
    // (T-012) aplica `text-primary-ink`, que Tailwind resuelve a `--color-primary-ink`
    // (`app/globals.css`) → `--primary-text` (`app/tokens.css`). Por eso esta aserción
    // valida el token que el enlace REALMENTE consume (`--primary-text`, 6.69:1 claro /
    // 8.68:1 oscuro sobre --bg-card), no el placeholder `--primary-color` del contrato
    // original de T-004. Sigue siendo discriminante: si `--primary-text` cambiara a un
    // valor sin AA, este test volvería a fallar.
    expect(contrast(parseColor(vars["--primary-text"]), surfaces()["--bg-card"])).toBeGreaterThanOrEqual(4.5);
  });
});
