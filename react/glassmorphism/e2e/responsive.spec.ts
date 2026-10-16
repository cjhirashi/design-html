// RF-006 · responsive mobile/tablet/desktop con breakpoints Tailwind estándar.
import { expect, test } from "@playwright/test";

const VIEWPORTS = { mobile: 375, tablet: 768, desktop: 1280 } as const;

for (const [name, width] of Object.entries(VIEWPORTS)) {
  for (const route of ["/", "/dashboard"]) {
    test(`${route} sin scroll horizontal en ${name} (${width}px)`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);

      // Nada en flujo se sale del viewport (descarta que un recorte esconda un desborde real).
      // Se excluyen cajones fixed y el contenido de contenedores con scroll horizontal
      // intencional (marcados con data-scroll-x: carrusel y tabla).
      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => {
            for (let a: Element | null = el; a && a !== document.body; a = a.parentElement) {
              const cs = getComputedStyle(a);
              if (cs.position === "fixed") return false;
              if (a !== el && a.hasAttribute("data-scroll-x")) return false;
            }
            const r = el.getBoundingClientRect();
            return r.width > 0 && (r.right > window.innerWidth + 0.5 || r.left < -0.5);
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 80)),
      );
      expect(offenders).toEqual([]);
    });
  }
}

test.describe("landing", () => {
  test("mobile: menú hamburguesa abre y cierra un cajón con los enlaces", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Principal", exact: true })).toBeHidden();
    const toggle = page.getByRole("button", { name: "Abrir menú" });
    await expect(toggle).toBeVisible();

    const drawer = page.locator("#menu-movil");
    await expect(drawer).not.toBeInViewport();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(drawer).toBeInViewport({ ratio: 1 });
    await expect(drawer.getByRole("link", { name: "Galería" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(drawer).not.toBeInViewport();
  });

  test("desktop: enlaces visibles y sin hamburguesa", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Principal", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeHidden();
  });
});

test.describe("dashboard", () => {
  test("mobile: ambos sidebars son off-canvas y se abren con sus botones", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/dashboard");
    const left = page.locator("#sidebar-izquierdo");
    const right = page.locator("#asistente");
    await expect(left).not.toBeInViewport();
    await expect(right).not.toBeInViewport();

    await page.getByRole("button", { name: "Abrir menú lateral" }).click();
    await expect(left).toBeInViewport({ ratio: 1 });
    await page.getByTestId("sidebar-izquierdo-scrim").click({ position: { x: 360, y: 400 } });
    await expect(left).not.toBeInViewport();

    await page.getByRole("button", { name: "Abrir asistente" }).click();
    await expect(right).toBeInViewport({ ratio: 1 });
  });

  test("tablet: el chat sigue off-canvas; la tabla scrollea dentro de su panel", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto("/dashboard");
    await expect(page.getByRole("button", { name: "Abrir asistente" })).toBeVisible();
    const region = page.getByRole("region", { name: "Estado de servicios y capas" });
    const scrolls = await region.evaluate((el) => el.scrollWidth >= el.clientWidth);
    expect(scrolls).toBe(true);
  });

  test("desktop: sidebar izquierdo y chat anclados en la rejilla", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/dashboard");
    await expect(page.locator("#sidebar-izquierdo")).toBeInViewport({ ratio: 1 });
    await expect(page.locator("#asistente")).toBeInViewport({ ratio: 1 });
    await expect(page.getByRole("button", { name: "Abrir menú lateral" })).toBeHidden();
    await expect(page.getByRole("button", { name: "Abrir asistente" })).toBeHidden();
  });
});
