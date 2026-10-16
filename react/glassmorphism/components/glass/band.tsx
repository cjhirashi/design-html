import { cn } from "@/lib/utils";

import { glass } from "./surface";

/** Franja de vidrio a todo el ancho (secciones alternas y footer). */
export function Band({
  as: Component = "section",
  className,
  children,
  ...props
}: {
  as?: "section" | "footer" | "div";
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Component className={cn(glass.band, className)} {...props}>
      {children}
    </Component>
  );
}
