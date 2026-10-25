// T-029 · Contacto funcional (RF-007/RF-013): valida en cliente, muestra error inline por
// campo y, al enviar válido, un estado de éxito SIMULADO sin ninguna petición de red (P5).
import { expect, test } from "@playwright/test";

test.describe("RF-007/RF-013 · formulario de contacto funcional", () => {
  test("envío vacío muestra un error inline por campo", async ({ page }) => {
    await page.goto("/contacto");
    const form = page.getByRole("form", { name: "Formulario de contacto" });
    await form.getByRole("button", { name: "Enviar mensaje" }).click();
    // Un error por campo (3), acotados al formulario (el route-announcer de Next no cuenta).
    await expect(form.getByRole("alert")).toHaveCount(3);
    await expect(form.getByText("Ingresa tu nombre.")).toBeVisible();
    await expect(form.getByText("Ingresa tu correo electrónico.")).toBeVisible();
    await expect(form.getByText("Escribe un mensaje.")).toBeVisible();
  });

  test("correo con formato inválido muestra su error; el resto se limpia al corregir", async ({ page }) => {
    await page.goto("/contacto");
    const form = page.getByRole("form", { name: "Formulario de contacto" });
    await page.getByLabel("Nombre").fill("Carlos");
    await page.getByLabel("Correo electrónico").fill("no-es-correo");
    await page.getByLabel("Mensaje").fill("Hola");
    await form.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(form.getByText("Ese correo no tiene un formato válido.")).toBeVisible();
    await expect(form.getByRole("alert")).toHaveCount(1);
  });

  test("envío válido muestra éxito sin ninguna petición de red externa", async ({ page }) => {
    const external: string[] = [];
    page.on("request", (r) => {
      const url = r.url();
      if (!url.startsWith("http://localhost") && !url.startsWith("data:")) external.push(url);
    });

    await page.goto("/contacto");
    await page.getByLabel("Nombre").fill("Carlos");
    await page.getByLabel("Correo electrónico").fill("carlos@ejemplo.com");
    await page.getByLabel("Mensaje").fill("Me interesa el catálogo glassmorphism.");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();

    await expect(page.getByRole("status")).toBeVisible();
    await expect(page.getByText("Mensaje enviado")).toBeVisible();
    expect(external, external.join("\n")).toEqual([]);
  });
});
