import Link from "next/link";

import { cn } from "@/lib/utils";

import { LayersIcon } from "./icons";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-linear-135 from-primary to-secondary text-logo-ink shadow-glow [&_svg]:size-[18px]",
        className,
      )}
    >
      <LayersIcon />
    </span>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 rounded-glass-sm text-base font-bold tracking-tight text-fg", className)}
    >
      <LogoMark />
      CJH GLASS
      <span className="hidden font-mono text-xs font-normal text-muted sm:inline">[v3.0]</span>
    </Link>
  );
}
