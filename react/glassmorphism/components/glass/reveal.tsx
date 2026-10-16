"use client";

import { animate, inView } from "motion";
import { useEffect, useRef } from "react";

import { REVEAL_SHIFT, revealTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Aparición de sección (RF-004) que nunca oculta contenido (RNF-004): se renderiza
 * visible en el servidor. Sólo si al hidratar la sección está bajo el pliegue, al entrar
 * en viewport se desplaza de `REVEAL_SHIFT` px a 0. Con reduced-motion no se anima (RF-005).
 */
export function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    animate(el, { y: REVEAL_SHIFT }, { duration: 0 });
    const stop = inView(
      el,
      () => {
        animate(el, { y: 0 }, revealTransition);
        stop();
      },
      { amount: 0.15 },
    );
    return stop;
  }, []);

  return (
    <div ref={ref} data-reveal className={cn("motion-reduce:transform-none!", className)}>
      {children}
    </div>
  );
}
