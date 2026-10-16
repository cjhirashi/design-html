"use client";

import { motion } from "motion/react";
import { useTheme } from "next-themes";

import { baseTransition } from "@/lib/motion";
import { useHydrated } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";

import { MonitorIcon, MoonIcon, SunIcon } from "./icons";
import { glass } from "./surface";

const OPTIONS = [
  { value: "light", label: "Tema claro", Icon: SunIcon },
  { value: "system", label: "Tema del sistema", Icon: MonitorIcon },
  { value: "dark", label: "Tema oscuro", Icon: MoonIcon },
] as const;

/** Cápsula de 3 botones claro/sistema/oscuro, como en la pista vanilla (RF-001, RF-002). */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  // Antes de hidratar no se conoce la elección guardada: el indicador espera.
  const active = hydrated ? (theme ?? "system") : null;
  const index = OPTIONS.findIndex((o) => o.value === active);

  return (
    <div
      role="group"
      aria-label="Tema de color"
      data-testid="theme-switch"
      className={cn(glass.control, "relative inline-flex shrink-0 items-center gap-1 rounded-full p-1", className)}
    >
      {index >= 0 && (
        <motion.span
          aria-hidden="true"
          className="absolute top-1 left-1 size-8 rounded-full bg-linear-135 from-primary to-primary-hover shadow-glow"
          initial={false}
          animate={{ x: index * 36 }}
          transition={baseTransition}
        />
      )}
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = value === active;
        return (
          <button
            key={value}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "relative z-10 flex size-8 cursor-pointer items-center justify-center rounded-full",
              "transition-colors duration-200 ease-glass motion-reduce:transition-none [&_svg]:size-4",
              selected ? "text-switch-ink" : "text-fg-2 hover:text-fg",
            )}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
