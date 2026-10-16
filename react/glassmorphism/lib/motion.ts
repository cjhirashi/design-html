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

// Aparición de secciones. Con reduced-motion, MotionConfig (reducedMotion="user")
// anula el desplazamiento y sólo queda el fundido.
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.section, ease: EASE_OUT } },
};

// Elevación de hover (se omite con reduced-motion en cada componente).
export const hoverLift = { y: -4, transition: microTransition };
export const hoverNudge = { y: -2, transition: microTransition };
