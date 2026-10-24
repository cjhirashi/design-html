// RF-008 · las vistas nuevas del catálogo montan el conmutador de tema de 3 vías
// (claro/sistema/oscuro) y renderizan sin error. RF-002 · el dashboard expone sus
// 5 bloques. Cubre T-028 del plan.
import { expect, test, type Page } from "@playwright/test";

// Vistas nuevas de SPEC-0002 (el piloto 0001 ya traía landing y dashboard).
// blog-detalle usa un post SIN bloque Mermaid a propósito: el render real del
// Markdown (resaltado Shiki + Mermaid) es la frontera de Slice 2 (T-022/T-024) y
// tiene su propia cobertura (markdown.test.ts, network.spec.ts). Aquí sólo se
// verifica el cascarón de la vista: navegación, conmutador y ausencia de error.
const VISTAS = [
  { name: "blog (listado)", path: "/blog" },
  { name: "productos (listado)", path: "/productos" },
  { name: "producto-detalle", path: "/productos/panel-vidrio-esmerilado" },
  { name: "contacto", path: "/contacto" },
  { name: "blog-detalle", path: "/blog/tokens-de-vidrio" },
];

/** Registra excepciones de página (JS no capturado) durante la navegación. */
function trackPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`${e.name}: ${e.message}`));
  return errors;
}

/** Afirma que el conmutador claro/sistema/oscuro está montado y accesible. */
async function expectThemeSwitch(page: Page) {
  const group = page.getByTestId("theme-switch");
  await expect(group).toBeVisible();
  await expect(group).toHaveAttribute("aria-label", "Tema de color");
  await expect(group.getByRole("button", { name: "Tema claro" })).toBeVisible();
  await expect(group.getByRole("button", { name: "Tema del sistema" })).toBeVisible();
  await expect(group.getByRole("button", { name: "Tema oscuro" })).toBeVisible();
}

test.describe("RF-008 · vistas nuevas con conmutador de tema de 3 vías", () => {
  for (const vista of VISTAS) {
    test(`${vista.name}: monta el conmutador claro/sistema/oscuro y no lanza errores`, async ({ page }) => {
      const errors = trackPageErrors(page);
      const response = await page.goto(vista.path);
      expect(response?.ok(), `HTTP de ${vista.path}`).toBe(true);
      await expectThemeSwitch(page);
      expect(errors, errors.join("\n")).toEqual([]);
    });
  }
});

test.describe("RF-002 · el dashboard expone sus 5 bloques", () => {
  const BLOQUES = ["grafico", "alerta", "tabla", "registro", "formulario"] as const;

  test("los 5 bloques están presentes, con conmutador y sin errores", async ({ page }) => {
    const errors = trackPageErrors(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    const response = await page.goto("/dashboard");
    expect(response?.ok(), "HTTP de /dashboard").toBe(true);
    for (const bloque of BLOQUES) {
      await expect(page.locator(`[data-block="${bloque}"]`)).toBeVisible();
    }
    await expectThemeSwitch(page);
    expect(errors, errors.join("\n")).toEqual([]);
  });
});
