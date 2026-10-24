"use client";

import { useId } from "react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { glass } from "./surface";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
} & Omit<ComponentProps<"input">, "id" | "aria-invalid" | "aria-describedby" | "className">;

/**
 * Campo de formulario presentacional (RF-013): label + input + mensaje de error
 * inline bajo el input. Sin lógica de validación (la valida quien use el campo,
 * p.ej. T-025) — aquí solo se muestra el `error` que llega por prop.
 */
export function Field({ label, error, hint, className, ...inputProps }: FieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={cn(
          glass.control,
          "rounded-glass-sm px-3.5 py-2.5 text-sm text-fg outline-none placeholder:text-muted",
          "focus-visible:border-focus",
          error && "border-error-line",
        )}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-xs text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
