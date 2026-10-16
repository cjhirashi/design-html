// RNF-005 · el movimiento del fondo se MIDE: dos capturas del mismo estado separadas
// por ≥ 2 s deben diferir de forma perceptible. Así no se puede declarar "arreglado" a ojo.
import { expect, test } from "@playwright/test";

import { pixelDiff } from "./helpers";

const GAP_MS = 2000;
const MIN_MEAN = 4; // diferencia media mínima (0–255)
const MIN_PCT = 20; // % mínimo de píxeles con Δ ≥ 8/255

test.use({ viewport: { width: 1440, height: 900 } });

for (const scheme of ["light", "dark"] as const) {
  test(`aurora con movimiento perceptible en tema ${scheme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "no-preference" });
    await page.goto("/");
    await page.mouse.move(0, 899); // sin hover sobre ningún elemento
    await page.waitForTimeout(1500);
    const a = await page.screenshot();
    await page.waitForTimeout(GAP_MS);
    const b = await page.screenshot();
    const d = await pixelDiff(page, a, b);
    test.info().annotations.push({ type: "diff", description: JSON.stringify(d) });
    console.log(`[RNF-005] ${scheme}: media ${d.mean.toFixed(2)}/255 · ${d.pctChanged.toFixed(1)} % píxeles Δ≥8 · máx ${d.max}`);
    expect(d.mean, "diferencia media").toBeGreaterThanOrEqual(MIN_MEAN);
    expect(d.pctChanged, "% de píxeles que cambian").toBeGreaterThanOrEqual(MIN_PCT);
  });
}

test("control: con reduced-motion el fondo queda quieto", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/");
  await page.mouse.move(0, 899);
  await page.waitForTimeout(1500);
  const a = await page.screenshot();
  await page.waitForTimeout(GAP_MS);
  const b = await page.screenshot();
  const d = await pixelDiff(page, a, b);
  console.log(`[RNF-005] reduce: media ${d.mean.toFixed(2)}/255 · máx ${d.max}`);
  expect(d.mean).toBeLessThan(0.5);
});
