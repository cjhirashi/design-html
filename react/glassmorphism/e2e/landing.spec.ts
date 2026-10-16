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
