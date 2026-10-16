import { cn } from "@/lib/utils";

import { Badge, type Tone } from "./badge";
import { TrendDownIcon, TrendUpIcon } from "./icons";

/** Contenido de una tarjeta de métrica. Va dentro de una `GlassCard`. */
export function Metric({
  label,
  value,
  trend,
  status,
}: {
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; value: string; label: string };
  status: { tone: Tone; label: string };
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.6875rem] font-semibold tracking-wider text-muted uppercase">{label}</span>
        {trend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-bold [&_svg]:size-3",
              trend.direction === "up" ? "text-success" : "text-error",
            )}
          >
            {trend.direction === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
            <span className="sr-only">{trend.label}</span>
            {trend.value}
          </span>
        )}
      </div>
      <p className="font-mono text-3xl font-bold tracking-tight text-fg tabular-nums">{value}</p>
      <Badge tone={status.tone}>{status.label}</Badge>
    </div>
  );
}
