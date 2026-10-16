// RF-004 · micro-interacciones con Motion, easing de salida suave, nunca bounce/elastic.
import { describe, expect, it } from "vitest";
import { DURATION, EASE_OUT, revealTransition } from "@/lib/motion";
import { ownSources } from "./source";

describe("RF-004 easing compartido", () => {
  it("EASE_OUT es la curva de salida suave del estilo original", () => {
    expect(EASE_OUT).toEqual([0.16, 1, 0.3, 1]);
  });

  it("las duraciones quedan entre 100 y 600 ms", () => {
    for (const seconds of Object.values(DURATION)) {
      expect(seconds).toBeGreaterThanOrEqual(0.1);
      expect(seconds).toBeLessThanOrEqual(0.6);
    }
  });

  it("la aparición de secciones usa EASE_OUT", () => {
    expect(revealTransition.ease).toBe(EASE_OUT);
  });
});

describe("RF-004 nada de rebote en el código propio", () => {
  const sources = ownSources();

  it("hay código que inspeccionar", () => {
    expect(sources.length).toBeGreaterThan(5);
  });

  it.each(sources.map((s) => [s.file, s.code]))(
    "%s no usa spring/bounce/elastic/back/anticipate",
    (_file, code) => {
      expect(code).not.toMatch(/\b(spring|bounce|elastic|backIn|backOut|backInOut|anticipate)\b/);
    },
  );

  it.each(sources.filter((s) => s.file !== "lib/motion.ts").map((s) => [s.file, s.code]))(
    "%s no define curvas propias (usa lib/motion o ease-glass)",
    (_file, code) => {
      expect(code).not.toMatch(/\bease\s*:\s*["'[]/);
      expect(code).not.toMatch(/\bease-(?!glass\b)[\w[\]-]+/);
      expect(code).not.toMatch(/cubic-bezier/);
    },
  );

  it.each(sources.map((s) => [s.file, s.code]))(
    "%s no usa transiciones CSS de más de 600 ms",
    (_file, code) => {
      for (const m of code.matchAll(/\bduration-(\d+)\b/g)) {
        expect(Number(m[1])).toBeLessThanOrEqual(600);
      }
    },
  );
});
