"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

import { baseTransition } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

import { CloseIcon } from "./icons";
import { glass } from "./surface";

const DOCK = {
  lg: { query: "(min-width: 64rem)", classes: "lg:static lg:z-auto lg:h-auto lg:w-auto lg:translate-x-0", hide: "lg:hidden" },
  xl: { query: "(min-width: 80rem)", classes: "xl:static xl:z-auto xl:h-auto xl:w-auto xl:translate-x-0", hide: "xl:hidden" },
} as const;

/**
 * Panel lateral de vidrio (RF-007, RF-006). Bajo el breakpoint `dockAt` es un cajón
 * off-canvas con scrim; desde `dockAt` queda fijo en la rejilla. Sin `dockAt` es
 * siempre cajón (menú móvil del landing).
 */
export function Sidebar({
  id,
  side,
  label,
  open,
  onClose,
  dockAt,
  className,
  children,
}: {
  id: string;
  side: "left" | "right";
  label: string;
  open: boolean;
  onClose: () => void;
  dockAt?: keyof typeof DOCK;
  className?: string;
  children: React.ReactNode;
}) {
  const docked = useMediaQuery(dockAt ? DOCK[dockAt].query : "not all");
  const hidden = !open && !docked;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <AnimatePresence>
        {open && !docked && (
          <motion.div
            data-testid={`${id}-scrim`}
            aria-hidden="true"
            className="fixed inset-0 z-40 bg-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={baseTransition}
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside
        id={id}
        aria-label={label}
        inert={hidden}
        data-open={open}
        className={cn(
          glass.chrome,
          "fixed inset-y-0 z-50 flex h-dvh w-[min(84vw,300px)] flex-col overflow-y-auto",
          "transition-transform duration-300 ease-glass motion-reduce:transition-none",
          side === "left" ? "left-0 border-r" : "right-0 border-l",
          open ? "translate-x-0" : side === "left" ? "-translate-x-full" : "translate-x-full",
          dockAt ? DOCK[dockAt].classes : "lg:hidden",
          className,
        )}
      >
        <div className={cn("flex justify-end p-3 pb-0", dockAt && DOCK[dockAt].hide)}>
          <button
            type="button"
            aria-label="Cerrar panel"
            onClick={onClose}
            className="flex size-10 cursor-pointer items-center justify-center rounded-glass-sm text-fg-2 hover:text-fg [&_svg]:size-[18px]"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </aside>
    </>
  );
}

/** Ítem de menú lateral (dashboard y menú móvil del landing). */
export function SidebarItem({
  href,
  active,
  icon,
  onNavigate,
  children,
}: {
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-glass-sm px-4 py-2.5 text-sm font-medium [&_svg]:size-4 [&_svg]:shrink-0",
        "transition-colors duration-200 ease-glass motion-reduce:transition-none",
        active ? "bg-primary-soft text-primary-ink" : "text-fg-2 hover:bg-primary-soft hover:text-primary-ink",
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

export function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-2 px-4 text-[0.6875rem] font-bold tracking-wider text-muted uppercase">{children}</span>
  );
}
