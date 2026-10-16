// Receta única de las superficies de vidrio (RF-007). Ningún otro módulo declara
// blur, borde o sombra de vidrio: los componentes eligen un nivel de esta tabla.
import { cn } from "@/lib/utils";

const base = "border border-glass-line backdrop-blur-[16px] backdrop-saturate-150";

export const glass = {
  /** Navbar, topbar y sidebars: el cristal más opaco, pegado a los bordes. */
  chrome: cn("bg-glass backdrop-blur-[20px] backdrop-saturate-150 border-glass-line"),
  /** Paneles grandes (mockup del hero, contenedor de tabla). */
  panel: cn(base, "bg-card rounded-glass-lg shadow-glass backdrop-blur-[20px]"),
  /** Tarjetas de contenido y métricas. */
  card: cn(base, "bg-card rounded-glass-md shadow-glass"),
  /** Controles: pills, buscador, switch de tema, perfil. */
  control: cn("border border-glass-line bg-card backdrop-blur-[8px]"),
  /** Secciones alternas a todo el ancho. */
  band: cn("bg-card backdrop-blur-[10px] border-y border-glass-line"),
} as const;

/** Cambio de color de hover compartido. El desplazamiento lo hace Motion (`hoverLift`). */
export const glassHover = cn(
  "transition-[border-color,box-shadow] duration-300 ease-glass motion-reduce:transition-none",
  "hover:border-glass-line-hover hover:shadow-glass-lg",
);
