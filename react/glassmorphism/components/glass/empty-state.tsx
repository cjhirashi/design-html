import { cn } from "@/lib/utils";

/** Mensaje en español por defecto cuando una vista no pasa uno propio (RF-012). */
const MENSAJE_POR_DEFECTO = "No hay elementos para mostrar todavía.";

/**
 * Estado vacío explícito para listados (RF-012): Blog y Productos lo usan en vez de
 * renderizar una lista en blanco cuando no hay elementos. `role="status"` anuncia el
 * cambio a lectores de pantalla sin ser tan disruptivo como `alert`.
 */
export function EmptyState({
  message = MENSAJE_POR_DEFECTO,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <p
      role="status"
      className={cn(
        "rounded-glass-md border border-glass-line bg-card px-6 py-10 text-center text-sm text-muted",
        className,
      )}
    >
      {message}
    </p>
  );
}
