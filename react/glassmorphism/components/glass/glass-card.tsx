"use client";

import { motion, useReducedMotion } from "motion/react";

import { hoverLift } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { glass, glassHover } from "./surface";

/**
 * Tarjeta de vidrio base (RF-007): la usan las features y la galería del landing y
 * las métricas del dashboard. `interactive` añade la elevación de hover (RF-004).
 */
export function GlassCard({
  as = "article",
  interactive = false,
  level = "card",
  className,
  children,
  ...aria
}: {
  as?: "article" | "div" | "section" | "li";
  interactive?: boolean;
  level?: "card" | "panel";
  className?: string;
  children: React.ReactNode;
  /** Nombre accesible opcional (p. ej. columnas de un tablero o grupos de controles). */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      whileHover={interactive && !reduceMotion ? hoverLift : undefined}
      className={cn(glass[level], interactive && glassHover, className)}
      {...aria}
    >
      {children}
    </Component>
  );
}
