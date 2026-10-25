"use client";

import { useId } from "react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

import { glass } from "./surface";

type FieldBaseProps = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

type TextFieldProps = FieldBaseProps &
  Omit<ComponentProps<"input">, "id" | "aria-invalid" | "aria-describedby" | "className"> & {
    as?: "input";
  };

type SelectFieldProps = FieldBaseProps &
  Omit<ComponentProps<"select">, "id" | "aria-invalid" | "aria-describedby" | "className"> & {
    as: "select";
    options: { value: string; label: string }[];
  };

type BooleanFieldProps = FieldBaseProps &
  Omit<ComponentProps<"input">, "id" | "aria-invalid" | "aria-describedby" | "className" | "type"> & {
    as: "boolean";
  };

type TextareaFieldProps = FieldBaseProps &
  Omit<ComponentProps<"textarea">, "id" | "aria-invalid" | "aria-describedby" | "className"> & {
    as: "textarea";
    /** `true` → fuente monoespaciada (tipo de campo "código", RF-002). */
    mono?: boolean;
  };

type FieldProps = TextFieldProps | SelectFieldProps | BooleanFieldProps | TextareaFieldProps;

const FIELD_OWN_KEYS = ["label", "error", "hint", "className", "as", "mono"] as const;

/** Quita las props propias de `Field` (presentacionales) para pasar el resto al control nativo. */
function omitFieldProps<T extends Record<string, unknown>>(props: T) {
  const rest = { ...props };
  for (const key of FIELD_OWN_KEYS) delete rest[key as keyof T];
  return rest;
}

/**
 * Campo de formulario presentacional (RF-013): label + control + mensaje de error
 * inline bajo el control. Sin lógica de validación (la valida quien use el campo,
 * p.ej. T-025) — aquí solo se muestra el `error` que llega por prop.
 *
 * `as` elige el tipo de control (RF-002 formulario placeholder: texto/select/boolean):
 * - `"input"` (default): `<input>` de texto/email/etc, igual que antes.
 * - `"select"`: `<select>` con `options`.
 * - `"boolean"`: casilla `<input type="checkbox">` con el label al lado.
 */
export function Field(props: FieldProps) {
  const { label, error, hint, className } = props;
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  if (props.as === "select") {
    const { options, ...rest } = props;
    const selectProps = omitFieldProps(rest);
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {label}
        </label>
        <select
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            glass.control,
            "rounded-glass-sm px-3.5 py-2.5 text-sm text-fg outline-none",
            "focus-visible:border-focus",
            error && "border-error-line",
          )}
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FieldMessage error={error} hint={hint} errorId={errorId} hintId={hintId} />
      </div>
    );
  }

  if (props.as === "textarea") {
    const { mono } = props;
    const textareaProps = omitFieldProps(props);
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={inputId} className="text-sm font-medium text-fg">
          {label}
        </label>
        <textarea
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            glass.control,
            "rounded-glass-sm px-3.5 py-2.5 text-sm text-fg outline-none placeholder:text-muted",
            "focus-visible:border-focus",
            mono && "font-mono",
            error && "border-error-line",
          )}
          rows={4}
          {...textareaProps}
        />
        <FieldMessage error={error} hint={hint} errorId={errorId} hintId={hintId} />
      </div>
    );
  }

  if (props.as === "boolean") {
    const checkboxProps = omitFieldProps(props);
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={inputId} className="flex items-center gap-2.5 text-sm font-medium text-fg">
          <input
            id={inputId}
            type="checkbox"
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              "size-4 rounded-glass-sm border border-glass-line bg-card outline-none",
              "focus-visible:border-focus",
              error && "border-error-line",
            )}
            {...checkboxProps}
          />
          {label}
        </label>
        <FieldMessage error={error} hint={hint} errorId={errorId} hintId={hintId} />
      </div>
    );
  }

  const inputProps = omitFieldProps(props);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-fg">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          glass.control,
          "rounded-glass-sm px-3.5 py-2.5 text-sm text-fg outline-none placeholder:text-muted",
          "focus-visible:border-focus",
          error && "border-error-line",
        )}
        {...inputProps}
      />
      <FieldMessage error={error} hint={hint} errorId={errorId} hintId={hintId} />
    </div>
  );
}

function FieldMessage({
  error,
  hint,
  errorId,
  hintId,
}: {
  error?: string;
  hint?: string;
  errorId: string;
  hintId: string;
}) {
  if (error) {
    return (
      <p id={errorId} role="alert" className="text-xs text-error">
        {error}
      </p>
    );
  }
  if (hint) {
    return (
      <p id={hintId} className="text-xs text-muted">
        {hint}
      </p>
    );
  }
  return null;
}
