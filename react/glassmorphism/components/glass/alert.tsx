import { cn } from "@/lib/utils";

import { Badge } from "./badge";

/** Aviso crítico a todo el ancho (dashboard). */
export function Alert({
  label,
  message,
  action,
  className,
}: {
  label: string;
  message: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col gap-4 rounded-glass-md border border-error-line bg-error-soft px-6 py-4 shadow-glass sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Badge tone="error">{label}</Badge>
        <p className="text-sm text-fg">{message}</p>
      </div>
      {action}
    </div>
  );
}
