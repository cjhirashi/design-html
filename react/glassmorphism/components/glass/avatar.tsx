import { cn } from "@/lib/utils";

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-linear-135 from-primary-solid to-secondary text-[0.6875rem] font-bold text-on-primary shadow-glow",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function Identity({
  initials,
  name,
  role,
  className,
  hideTextBelow,
}: {
  initials: string;
  name: string;
  role: string;
  className?: string;
  /** Oculta nombre/rol en pantallas pequeñas (sólo queda el avatar). */
  hideTextBelow?: "md";
}) {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <Avatar initials={initials} />
      <span className={cn("min-w-0 leading-tight", hideTextBelow === "md" && "hidden md:block")}>
        <span className="block truncate text-[0.8125rem] font-semibold text-fg">{name}</span>
        <span className="block truncate text-xs text-muted">{role}</span>
      </span>
    </span>
  );
}
