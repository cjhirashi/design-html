// RF-005 · con prefers-reduced-motion se desactivan las animaciones no esenciales.
// Cada caso tiene su control sin reduced-motion para demostrar que la animación existe.
import { expect, test } from "@playwright/test";

import { sampleTransforms } from "./helpers";

const CARD = "#sistema li";

for (const reduce of [true, false]) {
  test.describe(reduce ? "RF-005 con reduce" : "control sin reduce", () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ reducedMotion: reduce ? "reduce" : "no-preference" });
      await page.goto("/");
    });

    test(reduce ? "la aurora no monta rayos animados" : "la aurora monta rayos", async ({ page }) => {
      const rays = page.getByTestId("aurora").locator("div.origin-top");
      if (reduce) {
        await page.waitForTimeout(500);
        await expect(rays).toHaveCount(0);
        await expect(page.getByTestId("aurora-glow")).toBeVisible();
      } else {
        await expect.poll(() => rays.count()).toBeGreaterThan(0);
      }
    });

    test(reduce ? "las secciones aparecen sin desplazamiento" : "las secciones se desplazan al aparecer", async ({ page }) => {
      await page.evaluate(() => document.querySelector("#sistema")!.scrollIntoView());
      const transforms = await sampleTransforms(page, "#sistema [data-reveal]");
      const moved = transforms.some((t) => t !== "none" && t !== "matrix(1, 0, 0, 1, 0, 0)");
      expect(moved).toBe(!reduce);
    });

    test(reduce ? "el hover de tarjeta no las traslada" : "el hover de tarjeta las eleva", async ({ page }) => {
      const card = page.locator(CARD).first();
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);
      await card.hover();
      await page.waitForTimeout(400);
      const transform = await card.evaluate((el) => getComputedStyle(el).transform);
      if (reduce) expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
      else expect(transform).toBe("matrix(1, 0, 0, 1, 0, -4)");
    });

    test(reduce ? "el hover de botón del dashboard no lo traslada" : "el hover de botón del dashboard lo eleva", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.goto("/dashboard");
      const button = page.getByRole("button", { name: "Nuevo nodo" });
      await button.hover();
      await page.waitForTimeout(400);
      const transform = await button.evaluate((el) => getComputedStyle(el).transform);
      if (reduce) expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
      else expect(transform).toBe("matrix(1, 0, 0, 1, 0, -2)");
    });
  });
}
