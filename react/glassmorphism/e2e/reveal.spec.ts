// RNF-004 · ninguna sección queda oculta sin scroll ni sin JS (spec §6.1).
import { expect, test, type Page } from "@playwright/test";

import { blockAppJs } from "./helpers";

/** Opacidad efectiva (producto de la del elemento y sus ancestros). */
function effectiveOpacity(page: Page, selector: string) {
  return page.$$eval(selector, (els) =>
    els.map((el) => {
      let o = 1;
      for (let a: Element | null = el; a; a = a.parentElement) o *= Number(getComputedStyle(a).opacity);
      return o;
    }),
  );
}

for (const js of [true, false]) {
  test(`galería y validaciones visibles sin scroll ${js ? "(con JS)" : "(sin JS)"}`, async ({ page }) => {
    if (!js) await blockAppJs(page);
    await page.goto("/");
    await page.waitForTimeout(1500); // margen para cualquier animación de entrada
    for (const sel of ["#galeria h2", "#galeria img", "#sistema li"]) {
      const values = await effectiveOpacity(page, sel);
      expect(values.length, sel).toBeGreaterThan(0);
      for (const v of values) expect(v, sel).toBe(1);
    }
    if (js) {
      const loaded = await page.$$eval("#galeria img", (imgs) =>
        imgs.map((i) => (i as HTMLImageElement).complete && (i as HTMLImageElement).naturalWidth > 0),
      );
      // Las imágenes bajo el pliegue cargan en diferido: forzamos la carga sin hacer scroll de la página.
      if (loaded.some((l) => !l)) {
        await page.$$eval("#galeria img", (imgs) => imgs.forEach((i) => ((i as HTMLImageElement).loading = "eager")));
        await expect
          .poll(() => page.$$eval("#galeria img", (imgs) => imgs.every((i) => (i as HTMLImageElement).naturalWidth > 0)))
          .toBe(true);
      }
      expect(await page.locator("#galeria img").count()).toBe(3);
    }
  });
}
