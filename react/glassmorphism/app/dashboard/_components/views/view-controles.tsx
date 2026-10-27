"use client";

// Vista Controles (RF-002 §6): muestrario de controles de interfaz (botones, badges,
// toggle, checkbox, radios, select, slider, segmented). Reusa Button/Badge/Field y añade
// controles nativos accesibles. Maqueta presentacional. Sin literales de vidrio en la ruta.
import { Badge, type Tone } from "@/components/glass/badge";
import { Button } from "@/components/glass/button";
import { Field } from "@/components/glass/field";
import { GlassCard } from "@/components/glass/glass-card";
import { glass } from "@/components/glass/surface";
import { cn } from "@/lib/utils";

const TONES: Tone[] = ["primary", "secondary", "success", "warning", "error"];
const SEGMENTS = ["Día", "Semana", "Mes"];

function ControlGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard as="section" aria-label={title} className="flex flex-col gap-4 p-6">
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      {children}
    </GlassCard>
  );
}

export function ViewControles() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <ControlGroup title="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button size="sm">Pequeño</Button>
        </div>
      </ControlGroup>

      <ControlGroup title="Badges">
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <Badge key={t} tone={t}>
              {t}
            </Badge>
          ))}
        </div>
      </ControlGroup>

      <ControlGroup title="Toggle">
        <label className="flex cursor-pointer items-center gap-3 text-sm text-fg">
          <input type="checkbox" defaultChecked className="peer sr-only" />
          <span
            className={cn(
              glass.control,
              "relative h-6 w-11 rounded-full transition-colors peer-checked:bg-primary-soft",
              "after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-fg after:transition-transform peer-checked:after:translate-x-5",
            )}
          />
          Capa atmosférica activa
        </label>
      </ControlGroup>

      <ControlGroup title="Checkbox y radios">
        <Field label="Activar notificaciones" name="c-check" as="boolean" defaultChecked />
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm font-medium text-fg">Densidad</legend>
          {["Compacta", "Cómoda", "Amplia"].map((d, i) => (
            <label key={d} className="flex items-center gap-2 text-sm text-fg-2">
              <input type="radio" name="c-radio" defaultChecked={i === 1} /> {d}
            </label>
          ))}
        </fieldset>
      </ControlGroup>

      <ControlGroup title="Select y slider">
        <Field
          label="Región"
          name="c-select"
          as="select"
          options={[
            { value: "mx", label: "México central" },
            { value: "us", label: "EE. UU. este" },
          ]}
        />
        <label className="flex flex-col gap-1.5 text-sm font-medium text-fg">
          Intensidad del blur
          <input type="range" min={0} max={100} defaultValue={64} className="accent-primary" />
        </label>
      </ControlGroup>

      <ControlGroup title="Segmented control">
        <div role="tablist" aria-label="Rango temporal" className={cn(glass.control, "flex w-fit gap-1 rounded-glass-md p-1")}>
          {SEGMENTS.map((s, i) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={i === 0}
              className={cn(
                "cursor-pointer rounded-glass-sm px-4 py-1.5 text-sm font-medium",
                i === 0 ? "bg-primary-soft text-primary-ink" : "text-fg-2 hover:text-fg",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </ControlGroup>
    </div>
  );
}
