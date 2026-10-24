// RF-003 · fondo dinámico MagicUI tras los paneles de vidrio.
import { expect, test } from "@playwright/test";

test.describe("RF-003 aurora tras el vidrio", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "no-preference" });
    await page.goto("/");
  });

  test("la aurora es una capa fija detrás del contenido, con rayos animados de MagicUI", async ({ page }) => {
    const aurora = page.getByTestId("aurora");
    await expect(aurora).toHaveCSS("position", "fixed");
    await expect(aurora).toHaveCSS("z-index", "-10");
    await expect(aurora).toHaveCSS("pointer-events", "none");
    await expect.poll(() => aurora.locator("div.origin-top").count()).toBeGreaterThan(0);
    // Los rayos toman el color del token del tema (violeta), no un color propio de MagicUI:
    // se resuelve var(--light-rays-color) con un elemento sonda (el build minifica el valor).
    const rayColor = await aurora
      .locator("[style*='--light-rays-color']")
      .first()
      .evaluate((el) => {
        const probe = document.createElement("span");
        probe.style.color = "var(--light-rays-color)";
        el.appendChild(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
      });
    expect(rayColor).toBe("rgba(167, 139, 250, 0.6)");
  });

  test("los paneles sobre la aurora son vidrio translúcido con blur", async ({ page }) => {
    const panel = page.locator("#inicio").getByText("glass-telemetry.ui").locator("xpath=../..");
    const style = await panel.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { filter: cs.backdropFilter, bg: cs.backgroundColor };
    });
    expect(style.filter).toContain("blur(20px)");
    expect(style.bg).toMatch(/rgba\(.+, 0\.5\)/);
  });

  test("la aurora conserva los degradados violeta/rosa del estilo original", async ({ page }) => {
    const bg = await page
      .getByTestId("aurora-glow")
      .evaluate((el) => getComputedStyle(el).backgroundImage);
    expect(bg).toContain("radial-gradient");
    expect(bg).toContain("rgba(139, 92, 246, 0.2)");
    expect(bg).toContain("rgba(244, 114, 182, 0.18)");
  });
});

// RF-001 · el landing cierra con el carrusel/galería de glassmorphism, servido con
// imágenes LOCALES (`public/gallery/`) vía `next/image` — nunca Unsplash ni CDN (P5).
// Cubre T-015.
test.describe("RF-001 galería/carrusel con imágenes locales", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#galeria").scrollIntoViewIfNeeded();
  });

  test("el carrusel monta sus tres tarjetas de galería", async ({ page }) => {
    const carousel = page.locator("#galeria ul[data-scroll-x]");
    await expect(carousel).toBeVisible();
    await expect(carousel.locator("> li")).toHaveCount(3);
  });

  test("cada imagen se optimiza con next/image desde /gallery y se pinta de verdad", async ({ page }) => {
    const imgs = page.locator("#galeria img");
    await expect(imgs).toHaveCount(3);
    const count = await imgs.count();
    for (let i = 0; i < count; i++) {
      const img = imgs.nth(i);
      await img.scrollIntoViewIfNeeded();
      // la imagen termina de decodificar (next/image puede diferir la carga)
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
      const src = await img.evaluate((el: HTMLImageElement) => el.currentSrc || el.src);
      // pasa por el optimizador de next/image, no es un <img> crudo…
      expect(src).toContain("/_next/image");
      // …y la fuente real es un recurso local de /gallery, no remoto.
      const decoded = decodeURIComponent(new URL(src).searchParams.get("url") ?? "");
      expect(decoded.startsWith("/gallery/")).toBe(true);
    }
  });

  test("ninguna imagen del landing apunta a un host externo", async ({ page }) => {
    const externals = await page.locator("img").evaluateAll((els) =>
      els
        .map((el) => (el as HTMLImageElement).currentSrc || (el as HTMLImageElement).src)
        .filter((src) => /^https?:\/\//i.test(src) && !src.startsWith(location.origin)),
    );
    expect(externals).toEqual([]);
  });
});
