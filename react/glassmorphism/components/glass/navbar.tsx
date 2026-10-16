import Link from "next/link";
import { cn } from "@/lib/utils";

import { glass } from "./surface";

/**
 * Barra superior de vidrio (RF-007). El landing la compone con logo + enlaces; el
 * dashboard, con breadcrumb + búsqueda + usuario.
 */
export function Navbar({
  variant = "site",
  className,
  children,
}: {
  variant?: "site" | "app";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <header className={cn(glass.chrome, "sticky top-0 z-30 shrink-0 border-b", className)}>
      <div
        className={cn(
          "flex items-center gap-3 sm:gap-4",
          variant === "site" ? "mx-auto h-16 max-w-[1280px] px-4 sm:px-6 lg:px-10" : "h-14 px-3 sm:px-6",
        )}
      >
        {children}
      </div>
    </header>
  );
}

export function NavLink({
  href,
  active,
  children,
  className,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-md text-sm font-medium transition-colors duration-200 ease-glass motion-reduce:transition-none",
        active ? "text-primary-ink" : "text-fg-2 hover:text-primary-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Botón cuadrado de la barra (hamburguesa, toggles de sidebars). */
export function BarButton({
  label,
  expanded,
  controls,
  onClick,
  className,
  children,
}: {
  label: string;
  expanded?: boolean;
  controls?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
      className={cn(
        "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-glass-sm border border-glass-line text-fg-2",
        "transition-colors duration-200 ease-glass hover:text-fg motion-reduce:transition-none [&_svg]:size-[18px]",
        className,
      )}
    >
      {children}
    </button>
  );
}
