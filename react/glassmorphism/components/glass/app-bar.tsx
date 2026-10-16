import { cn } from "@/lib/utils";

import { Identity } from "./avatar";
import { BellIcon, SearchIcon } from "./icons";
import { glass } from "./surface";

/** Piezas de la barra del dashboard: ruta, búsqueda, notificaciones, perfil. */
export function Breadcrumb({ root, current }: { root: string; current: string }) {
  return (
    <nav aria-label="Ruta" className="min-w-0 shrink-0">
      <ol className="flex items-center gap-1.5 text-[0.8125rem] whitespace-nowrap text-fg-2">
        <li className="hidden sm:block">{root}</li>
        <li aria-hidden="true" className="hidden sm:block">
          /
        </li>
        <li aria-current="page" className="truncate font-semibold text-fg">
          {current}
        </li>
      </ol>
    </nav>
  );
}

export function SearchField({ placeholder, className }: { placeholder: string; className?: string }) {
  return (
    <label
      className={cn(
        glass.control,
        "flex h-9 w-full min-w-0 max-w-sm flex-1 items-center gap-2 rounded-glass-sm px-3 text-[0.8125rem] text-muted",
        "focus-within:border-primary [&_svg]:size-3.5 [&_svg]:shrink-0",
        className,
      )}
    >
      <SearchIcon />
      <span className="sr-only">Buscar</span>
      <input
        type="search"
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-fg placeholder:text-muted focus:outline-none"
      />
    </label>
  );
}

export function NotificationBell({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-fg-2 transition-colors duration-200 ease-glass hover:bg-primary-soft hover:text-primary-ink motion-reduce:transition-none [&_svg]:size-4"
    >
      <BellIcon />
      <span aria-hidden="true" className="absolute top-2 right-2.5 size-2 rounded-full border-2 border-base bg-error" />
    </button>
  );
}

export function ProfileChip(props: { initials: string; name: string; role: string }) {
  return (
    <div className={cn(glass.control, "rounded-glass-sm p-3")}>
      <Identity {...props} />
    </div>
  );
}
