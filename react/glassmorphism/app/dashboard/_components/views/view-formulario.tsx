"use client";

// Vista Formulario (RF-002 §6): catálogo de los 15 tipos de campo. Los nativos usan el
// componente `Field`; los compuestos (multi-select, creatable, FK, JSON-list) se muestran
// como maquetas presentacionales fieles — esta spec es de estructura/apariencia, sin
// backend (§2). Cada campo va rotulado con su tipo para que el catálogo sea legible.
import { Badge } from "@/components/glass/badge";
import { Button } from "@/components/glass/button";
import { Field } from "@/components/glass/field";
import { CloseIcon, PlusIcon } from "@/components/glass/icons";
import { glass } from "@/components/glass/surface";
import { cn } from "@/lib/utils";
import { formCatalog } from "@/content/dashboard";

/** Caja presentacional estilo control (chips + affordance), para multi-select/creatable/FK. */
function ChipBox({ chips, placeholder, creatable }: { chips: string[]; placeholder: string; creatable?: boolean }) {
  return (
    <div className={cn(glass.control, "flex min-h-[2.75rem] flex-wrap items-center gap-2 rounded-glass-sm px-2.5 py-2")}>
      {chips.map((c) => (
        <span
          key={c}
          className="inline-flex items-center gap-1 rounded-glass-sm bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary-ink"
        >
          {c}
          <CloseIcon className="size-3 opacity-70" aria-hidden />
        </span>
      ))}
      <span className="text-xs text-muted">{creatable ? `${placeholder} (escribe y Enter)` : placeholder}</span>
    </div>
  );
}

/** Etiqueta + control arbitrario, para los campos compuestos que no usan `Field`. */
function Composite({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-fg">{label}</span>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function ViewFormulario() {
  const fk = formCatalog.fkNodos;
  return (
    <form aria-label="Catálogo de tipos de campo" className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-5 sm:grid-cols-2">
        {/* 1-8: tipos nativos vía Field */}
        <Field label="Texto" name="f-texto" type="text" placeholder="p. ej. nodo-08" defaultValue="Motor Glassmorphism" />
        <Field label="Número" name="f-numero" type="number" defaultValue={12} />
        <Field label="Textarea" name="f-textarea" as="textarea" defaultValue="Descripción larga del nodo…" />
        <Field label="Código" name="f-codigo" as="textarea" mono defaultValue={"transition: transform 0.3s ease;"} />
        <Field label="Fecha" name="f-fecha" type="date" defaultValue="2026-10-25" />
        <Field label="Fecha y hora" name="f-fechahora" type="datetime-local" defaultValue="2026-10-25T09:30" />
        <Field label="Boolean / toggle" name="f-bool" as="boolean" defaultChecked />
        <Composite label="Estado (select pintado con badge)">
          <Field
            label=""
            name="f-estado"
            as="select"
            options={formCatalog.estadoOptions.map((o) => ({ value: o.value, label: o.label }))}
            defaultValue="operativo"
            aria-label="Estado"
          />
          <div className="mt-1 flex flex-wrap gap-2">
            {formCatalog.estadoOptions.map((o) => (
              <Badge key={o.value} tone={o.tone}>
                {o.label}
              </Badge>
            ))}
          </div>
        </Composite>
      </div>

      {/* 9-12: multi-select / creatable / FK */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Composite label="Multi-select (opciones fijas)" hint={`Opciones: ${formCatalog.etiquetasFijas.join(", ")}`}>
          <ChipBox chips={formCatalog.etiquetasSeleccionadas} placeholder="Añadir etiqueta…" />
        </Composite>
        <Composite label="Creatable-select">
          <ChipBox chips={formCatalog.creatableSeleccionadas} placeholder="Crear o elegir" creatable />
        </Composite>
        <Field
          label="Select-FK (dataset de ejemplo)"
          name="f-fk"
          as="select"
          options={fk}
          defaultValue="nodo-07"
          hint="Referencia a otro registro — sin backend real"
        />
        <Composite label="Multi-select-FK" hint="Varias referencias al dataset de ejemplo">
          <ChipBox chips={formCatalog.fkSeleccionados.map((v) => fk.find((o) => o.value === v)?.label ?? v)} placeholder="Añadir referencia…" />
        </Composite>
      </div>

      {/* 13-14: listas a array */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Lista-texto (una por línea)" name="f-lista-texto" as="textarea" mono defaultValue={formCatalog.listaTexto} hint="Cada línea es un elemento del array" />
        <Field label="Lista-número (separados por coma)" name="f-lista-num" type="text" defaultValue={formCatalog.listaNumero} hint="Se divide por coma en un array de números" />
      </div>

      {/* 15: JSON-list en 3 variantes */}
      <Composite label="JSON-list · clave-valor">
        <div className="flex flex-col gap-2">
          {formCatalog.jsonClaveValor.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-2">
              <input className={cn(glass.control, "rounded-glass-sm px-3 py-2 font-mono text-sm text-fg")} defaultValue={row.k} aria-label={`clave ${i + 1}`} />
              <input className={cn(glass.control, "rounded-glass-sm px-3 py-2 font-mono text-sm text-fg")} defaultValue={row.v} aria-label={`valor ${i + 1}`} />
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" className="self-start">
            <PlusIcon /> Añadir par
          </Button>
        </div>
      </Composite>

      <div className="grid gap-5 sm:grid-cols-2">
        <Composite label="JSON-list · lista de strings">
          <div className="flex flex-col gap-2">
            {formCatalog.jsonStrings.map((s, i) => (
              <input key={i} className={cn(glass.control, "rounded-glass-sm px-3 py-2 font-mono text-sm text-fg")} defaultValue={s} aria-label={`cadena ${i + 1}`} />
            ))}
          </div>
        </Composite>
        <Field label="JSON-list · lista de objetos" name="f-json-obj" as="textarea" mono rows={5} defaultValue={formCatalog.jsonObjetos} />
      </div>

      <Button type="submit" className="self-start">
        Guardar
      </Button>
    </form>
  );
}
