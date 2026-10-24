"use client";

// Formulario placeholder (RF-002): 3 tipos de campo (texto + select + boolean)
// vía `Field`. Sin lógica de validación — `onSubmit` solo evita el comportamiento
// por defecto, igual que `ContactForm` (T-013).
import { Button } from "@/components/glass/button";
import { Field } from "@/components/glass/field";

export function PlaceholderForm({
  caption,
  nameLabel,
  namePlaceholder,
  regionLabel,
  regionOptions,
  activeLabel,
  submitLabel,
}: {
  caption: string;
  nameLabel: string;
  namePlaceholder: string;
  regionLabel: string;
  regionOptions: { value: string; label: string }[];
  activeLabel: string;
  submitLabel: string;
}) {
  return (
    <form
      aria-label={caption}
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <h3 className="text-sm font-semibold text-fg-2">{caption}</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={nameLabel} name="nombre-nodo" type="text" placeholder={namePlaceholder} />
        <Field label={regionLabel} name="region" as="select" options={regionOptions} />
      </div>
      <Field label={activeLabel} name="activo" as="boolean" />
      <Button type="submit" className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
