import { cn } from "@/lib/utils";

import { Band } from "./band";

/**
 * Pie de página de vidrio compartido (RF-007): el landing lo compone inline con `Band`;
 * las vistas nuevas del catálogo (Blog, Productos, Contacto) lo reusan tal cual para no
 * declarar su propio layout de cierre.
 */
export function Footer({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <Band as="footer" className={cn("px-6 py-12 text-center text-sm text-fg-2", className)}>
      {children}
    </Band>
  );
}
