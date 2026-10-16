import type { Page } from "@playwright/test";

export const DARK_BG = "rgb(11, 16, 32)"; // --bg-primary oscuro (#0b1020)
export const LIGHT_BG = "rgb(245, 243, 255)"; // --bg-primary claro (#f5f3ff)

/** Bloquea el JS de Next: React nunca hidrata; sólo quedan el HTML y los scripts inline. */
export async function blockAppJs(page: Page) {
  await page.route(/\/_next\/static\/.*\.js(\?.*)?$/, (route) => route.abort());
}

export const themeOf = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme);

/** Muestrea `transform` de un elemento durante `ms` milisegundos, frame a frame. */
export function sampleTransforms(page: Page, selector: string, ms = 350) {
  return page.evaluate(
    ({ selector, ms }) =>
      new Promise<string[]>((resolve) => {
        const el = document.querySelector(selector)!;
        const seen: string[] = [];
        const start = performance.now();
        const tick = () => {
          seen.push(getComputedStyle(el).transform);
          if (performance.now() - start < ms) requestAnimationFrame(tick);
          else resolve(seen);
        };
        tick();
      }),
    { selector, ms },
  );
}
