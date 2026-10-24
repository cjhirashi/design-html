// RF-012 · Blog y Productos listado muestran un estado vacío explícito (no una lista
// en blanco) cuando no hay elementos. Cubre el componente `components/glass/empty-state`
// (T-007/T-008) y, a nivel de vista, su uso en Blog/Productos listado (T-009/T-010/T-027):
// se comprueba por código fuente (como `reuse.test.ts`), sin fijar nombre/ruta de un
// componente contenedor concreto — T-009/T-010 pueden inlinear el grid en `page.tsx` o
// extraerlo con el nombre que prefieran.
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/components/glass/empty-state";
import { ownSources } from "./source";

describe("RF-012 EmptyState (componente base)", () => {
  it("muestra un mensaje de estado vacío visible, en español", () => {
    render(<EmptyState message="No hay publicaciones todavía." />);
    expect(screen.getByText("No hay publicaciones todavía.")).toBeVisible();
  });

  it("expone una estructura accesible (rol status) para el estado vacío", () => {
    render(<EmptyState message="No hay productos todavía." />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("usa un texto por defecto en español cuando no se pasa `message`", () => {
    render(<EmptyState />);
    const vacio = screen.getByRole("status");
    expect(vacio.textContent?.length).toBeGreaterThan(0);
    expect(vacio.textContent).not.toMatch(/No items|Empty|No results/i);
  });
});

// Mismo patrón laxo que `reuse.test.ts`: lee el código propio bajo `app/<ruta>/` y
// asevera el import + uso real de `EmptyState`, sin exigir un archivo o export concreto.
function routeSources(prefix: string) {
  return ownSources().filter((s) => s.file.startsWith(prefix));
}

function importsEmptyState(prefix: string): boolean {
  return routeSources(prefix).some((s) =>
    /from\s*["']@\/components\/glass\/empty-state["']/.test(s.code),
  );
}

function rendersEmptyState(prefix: string): boolean {
  return routeSources(prefix).some((s) => /<EmptyState[\s>]/.test(s.code));
}

describe("RF-012 Blog listado: lista vacía renderiza empty-state", () => {
  it("algún archivo de app/blog/ importa components/glass/empty-state", () => {
    expect(importsEmptyState("app/blog/")).toBe(true);
  });

  it("algún archivo de app/blog/ renderiza <EmptyState> (uso real, no sólo import)", () => {
    expect(rendersEmptyState("app/blog/")).toBe(true);
  });
});

describe("RF-012 Productos listado: lista vacía renderiza empty-state", () => {
  it("algún archivo de app/productos/ importa components/glass/empty-state", () => {
    expect(importsEmptyState("app/productos/")).toBe(true);
  });

  it("algún archivo de app/productos/ renderiza <EmptyState> (uso real, no sólo import)", () => {
    expect(rendersEmptyState("app/productos/")).toBe(true);
  });
});
