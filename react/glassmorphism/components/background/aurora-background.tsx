"use client";

import { useReducedMotion } from "motion/react";

import { LightRays } from "@/components/magicui/light-rays";
import { cn } from "@/lib/utils";

/**
 * Aurora translúcida tras los paneles de vidrio (RF-003): los dos degradados
 * radiales del body vanilla + rayos de luz de MagicUI, todo teñido por tokens.
 * Con prefers-reduced-motion no se montan los rayos (RF-005).
 */
export function AuroraBackground({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      data-testid="aurora"
      aria-hidden="true"
      className={cn("aurora-rays pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        data-testid="aurora-glow"
        className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,var(--aurora-a)_0%,transparent_45%),radial-gradient(circle_at_90%_80%,var(--aurora-b)_0%,transparent_45%)]"
      />
      <LightRays
        count={reduceMotion ? 0 : 7}
        color="var(--aurora-ray)"
        blur={44}
        speed={16}
        length="85vh"
      />
    </div>
  );
}
