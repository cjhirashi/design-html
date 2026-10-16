"use client";

import { motion } from "motion/react";

import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Aparición de sección al entrar en viewport (RF-004). Con reduced-motion sólo queda el
 * fundido: `motion-reduce:transform-none!` anula el desplazamiento desde CSS (RF-005), sin
 * cambiar el marcado del servidor y sin desajustes de hidratación.
 */
export function Reveal({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      data-reveal
      className={cn("motion-reduce:transform-none!", className)}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
