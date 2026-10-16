// RF-003 · fondo dinámico MagicUI teñido con tokens · RF-005 · sin animación con reduced-motion.
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reduced.value,
}));

import { AuroraBackground } from "@/components/background/aurora-background";

const rays = (root: HTMLElement) => root.querySelectorAll("div.origin-top");

afterEach(() => {
  reduced.value = false;
});

describe("RF-003 AuroraBackground", () => {
  it("monta los rayos de MagicUI teñidos con el token --aurora-ray", () => {
    render(<AuroraBackground />);
    const aurora = screen.getByTestId("aurora");
    expect(aurora).toHaveAttribute("aria-hidden", "true");
    expect(aurora.className).toMatch(/\baurora-rays\b/);
    expect(aurora.className).toMatch(/-z-10/);
    const lightRays = aurora.querySelector<HTMLElement>("[style*='--light-rays-color']");
    expect(lightRays?.style.getPropertyValue("--light-rays-color")).toBe("var(--aurora-ray)");
    expect(rays(aurora).length).toBeGreaterThan(0);
  });

  it("incluye los degradados radiales violeta/rosa del estilo original vía tokens", () => {
    render(<AuroraBackground />);
    const glow = screen.getByTestId("aurora-glow");
    expect(glow.className).toContain("var(--aurora-a)");
    expect(glow.className).toContain("var(--aurora-b)");
  });
});

describe("RF-005 AuroraBackground con prefers-reduced-motion", () => {
  it("no monta rayos animados pero conserva el resplandor estático", () => {
    reduced.value = true;
    render(<AuroraBackground />);
    const aurora = screen.getByTestId("aurora");
    expect(rays(aurora).length).toBe(0);
    expect(screen.getByTestId("aurora-glow")).toBeInTheDocument();
  });
});
