import { cn } from "@/lib/utils";

import { Badge } from "./badge";

const tones = {
  success: "bg-success-soft border-success-line text-success",
  warning: "bg-warning-soft border-warning-line text-warning",
  error: "bg-error-soft border-error-line text-error",
} as const;

/** Línea de telemetría con estado semántico (mockup del hero). */
export function StatusRow({
  tone,
  message,
  label,
}: {
  tone: keyof typeof tones;
  message: string;
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-glass-sm border px-3 py-2.5 font-mono text-[0.8125rem]",
        tones[tone],
      )}
    >
      <span className="min-w-0 flex-1 break-words">{message}</span>
      <Badge tone={tone}>{label}</Badge>
    </div>
  );
}
