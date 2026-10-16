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

export type PixelDiff = { mean: number; pctChanged: number; max: number };

/**
 * Compara dos PNG píxel a píxel en un canvas del propio navegador (sin dependencias).
 * `pctChanged`: % de píxeles cuyo canal más distinto cambia ≥ `threshold`/255.
 */
export async function pixelDiff(page: Page, a: Buffer, b: Buffer, threshold = 8): Promise<PixelDiff> {
  return page.evaluate(
    async ([a, b, threshold]) => {
      const load = (src: string) =>
        new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = src;
        });
      const [ia, ib] = await Promise.all([load(a as string), load(b as string)]);
      const canvas = new OffscreenCanvas(ia.width, ia.height);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(ia, 0, 0);
      const da = ctx.getImageData(0, 0, ia.width, ia.height).data;
      ctx.drawImage(ib, 0, 0);
      const db = ctx.getImageData(0, 0, ia.width, ia.height).data;
      let sum = 0;
      let changed = 0;
      let max = 0;
      for (let i = 0; i < da.length; i += 4) {
        const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
        sum += d;
        max = Math.max(max, d);
        if (d >= (threshold as number)) changed++;
      }
      const n = da.length / 4;
      return { mean: sum / n, pctChanged: (100 * changed) / n, max };
    },
    [`data:image/png;base64,${a.toString("base64")}`, `data:image/png;base64,${b.toString("base64")}`, threshold] as const,
  );
}
