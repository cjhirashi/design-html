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

// T-020 · microinteracciones de las vistas nuevas (RF-008, directiva de Carlos P10).
// El DESPLAZAMIENTO de hover se gatea con prefers-reduced-motion; el cambio de
// color/sombra de hover (glassHover) se conserva aun con reduce (sólo se vuelve
// instantáneo), por eso el movimiento se MIDE por el `transform` de la tarjeta y no
// por pixel-diff —un diff de píxeles mezclaría el cambio de color, que persiste con
// reduce, y el control "reduce → sin movimiento" dejaría de ser limpio—.
// La "reveal de entrada" reusa el mismo componente Reveal ya medido en landing
// (reduced-motion.spec.ts) y sólo anima contenido bajo el pliegue; estas vistas tienen
// una única sección superior, así que su micromovimiento verificable es el hover de
// tarjeta. La transición de éxito del formulario llega con el formulario funcional
// (Slice 3, T-025).
const HOVER_CARDS = [
  { view: "blog", path: "/blog", card: "post-card" },
  { view: "productos", path: "/productos", card: "product-card" },
] as const;

for (const reduce of [false, true]) {
  test.describe(reduce ? "T-020 motion · con prefers-reduced-motion" : "T-020 motion · sin reduce", () => {
    for (const { view, path, card } of HOVER_CARDS) {
      test(`${view}: el hover de ${card} ${reduce ? "no desplaza la tarjeta" : "la eleva"}`, async ({ page }) => {
        await page.emulateMedia({ reducedMotion: reduce ? "reduce" : "no-preference" });
        await page.goto(path);
        const cardEl = page.locator("main article").first();
        await cardEl.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await cardEl.hover();
        await page.waitForTimeout(400);
        const transform = await cardEl.evaluate((el) => getComputedStyle(el).transform);
        if (reduce) expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(transform);
        else expect(transform).toBe("matrix(1, 0, 0, 1, 0, -4)");
      });
    }
  });
}

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
