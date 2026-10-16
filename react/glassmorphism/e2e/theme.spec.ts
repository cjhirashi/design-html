// RF-001 (sin FOUC) · RF-002 (seguir al SO mientras no haya elección).
import { expect, test } from "@playwright/test";

import { blockAppJs, DARK_BG, LIGHT_BG, themeOf } from "./helpers";

test.describe("RF-001 tema sin parpadeo en la primera carga", () => {
  for (const [saved, os, bg] of [
    ["dark", "light", DARK_BG],
    ["light", "dark", LIGHT_BG],
  ] as const) {
    test(`elección guardada "${saved}" con SO "${os}" se aplica antes de hidratar`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: os });
      await page.addInitScript((t) => localStorage.setItem("theme", t), saved);
      await blockAppJs(page);
      await page.goto("/");
      expect(await themeOf(page)).toBe(saved);
      await expect(page.locator("body")).toHaveCSS("background-color", bg);
    });
  }

  test("al elegir oscuro con el switch, se aplica y persiste tras recargar (sin hidratar)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByRole("button", { name: "Tema oscuro" }).first().click();
    expect(await themeOf(page)).toBe("dark");
    await expect(page.getByRole("button", { name: "Tema oscuro" }).first()).toHaveAttribute("aria-pressed", "true");

    await blockAppJs(page);
    await page.reload();
    expect(await themeOf(page)).toBe("dark");
    await expect(page.locator("body")).toHaveCSS("background-color", DARK_BG);
  });

  test("el dashboard también arranca con el tema guardado antes de hidratar", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await blockAppJs(page);
    await page.goto("/dashboard");
    expect(await themeOf(page)).toBe("dark");
  });
});

test.describe("RF-002 sin elección, se sigue prefers-color-scheme", () => {
  test("SO oscuro → oscuro desde el HTML inicial", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await blockAppJs(page);
    await page.goto("/");
    expect(await themeOf(page)).toBe("dark");
  });

  test("SO claro → claro, y sigue el cambio del SO en caliente", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    expect(await themeOf(page)).toBe("light");
    await expect(page.getByRole("button", { name: "Tema del sistema" }).first()).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.emulateMedia({ colorScheme: "dark" });
    await expect.poll(() => themeOf(page)).toBe("dark");
    await expect(page.locator("body")).toHaveCSS("background-color", DARK_BG);
  });

  test("con una elección explícita, el cambio del SO ya no manda", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    await page.getByRole("button", { name: "Tema claro" }).first().click();
    await page.emulateMedia({ colorScheme: "dark" });
    await page.waitForTimeout(200);
    expect(await themeOf(page)).toBe("light");
  });
});
