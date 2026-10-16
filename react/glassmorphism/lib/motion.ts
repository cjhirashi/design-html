// Única fuente de easing y duraciones de la app (RF-004).
// La curva es la misma `--transition-smooth` del estilo vanilla: salida suave, sin rebote.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
  micro: 0.15,
  base: 0.3,
  section: 0.45,
} as const;

export const microTransition = { duration: DURATION.micro, ease: EASE_OUT };
export const baseTransition = { duration: DURATION.base, ease: EASE_OUT };

// Aparición de secciones (RNF-004): sólo desplazamiento, nunca opacidad, para que el
// contenido sea visible sin JS y sin scroll. Con reduced-motion no se anima (RF-005).
export const REVEAL_SHIFT = 16;
export const revealTransition = { duration: DURATION.section, ease: EASE_OUT };

// Elevación de hover (se omite con reduced-motion en cada componente).
export const hoverLift = { y: -4, transition: microTransition };
export const hoverNudge = { y: -2, transition: microTransition };
