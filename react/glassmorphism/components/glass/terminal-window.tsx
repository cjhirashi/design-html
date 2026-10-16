import { cn } from "@/lib/utils";

import { GlassCard } from "./glass-card";

/** Ventana de vidrio con barra de tres puntos (mockup del hero). */
export function TerminalWindow({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <GlassCard as="div" level="panel" className={cn("p-6", className)}>
      <div className="mb-4 flex items-center gap-2 border-b border-glass-line pb-4">
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="ml-2 font-mono text-xs text-muted">{title}</span>
      </div>
      <div className="flex flex-col gap-3 rounded-glass-sm border border-glass-line bg-base p-4">{children}</div>
    </GlassCard>
  );
}
