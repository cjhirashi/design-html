"use client";

import { MotionConfig } from "motion/react";
import { ThemeProvider } from "next-themes";

/**
 * next-themes inyecta un script bloqueante que fija `data-theme` en <html> antes del
 * primer paint (RF-001) y por defecto sigue al SO (RF-002). MotionConfig con
 * reducedMotion="user" desactiva transformaciones si el SO pide menos movimiento (RF-005).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
