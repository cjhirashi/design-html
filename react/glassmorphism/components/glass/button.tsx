"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { ComponentProps } from "react";

import { hoverNudge } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { glass } from "./surface";

const MotionLink = motion.create(Link);

const variants = {
  primary:
    "bg-linear-135 from-primary-solid to-primary-hover text-on-primary border border-on-primary/30 shadow-glow hover:brightness-110",
  secondary: cn(glass.control, "text-fg shadow-glass hover:border-primary"),
} as const;

const sizes = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-5 text-sm",
} as const;

type Common = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
};

function classes({ variant = "primary", size = "md", className }: Omit<Common, "children">) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-glass-sm font-semibold whitespace-nowrap",
    "transition-[filter,border-color,background-color] duration-200 ease-glass motion-reduce:transition-none",
    "[&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = Common & Omit<ComponentProps<typeof motion.button>, keyof Common>;

export function Button({ variant, size, className, children, ...props }: ButtonProps) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      whileHover={reduceMotion ? undefined : hoverNudge}
      className={classes({ variant, size, className })}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type ButtonLinkProps = Common & { href: string } & Omit<ComponentProps<typeof MotionLink>, keyof Common | "href">;

export function ButtonLink({ variant, size, className, children, href, ...props }: ButtonLinkProps) {
  const reduceMotion = useReducedMotion();
  return (
    <MotionLink
      href={href}
      whileHover={reduceMotion ? undefined : hoverNudge}
      className={classes({ variant, size, className })}
      {...props}
    >
      {children}
    </MotionLink>
  );
}
