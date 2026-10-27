"use client";

// Vista Tabla (RF-002, §6): un mismo registro visto de tres formas, en sub-pestañas
// Tabla / Vista / Editar — listado con dataset fijo, detalle de UN registro, y formulario
// de edición del mismo registro (prefijado con sus valores). La alerta crítica que la
// redacción original de RF-002 conservaba vive como elemento de esta vista. El registro de
// ejemplo (`record`) es el MISMO dataset que reusa la Vista Formulario (RF-002).
import { useState } from "react";

import { Alert } from "@/components/glass/alert";
import { Badge } from "@/components/glass/badge";
import { Button } from "@/components/glass/button";
import { DataTable, type Column } from "@/components/glass/data-table";
import { Field } from "@/components/glass/field";
import { GlassCard } from "@/components/glass/glass-card";
import { glass } from "@/components/glass/surface";
import { cn } from "@/lib/utils";
import { alert, record, recordEdit, services, tableCaption, type ServiceRow } from "@/content/dashboard";

import { RecordView } from "../record-view";

const columns: Column<ServiceRow>[] = [
  { key: "name", header: "Servicio / capa", cell: (r) => <strong className="font-semibold">{r.name}</strong> },
  { key: "status", header: "Estado actual", cell: (r) => <Badge tone={r.status.tone}>{r.status.label}</Badge> },
  { key: "token", header: "Token asignado", cell: (r) => <Badge tone={r.token.tone}>{r.token.label}</Badge> },
  { key: "checked", header: "Última verificación", cell: (r) => r.checkedAt, className: "font-mono text-muted" },
];

const SUBTABS = [
  { id: "tabla", label: "Tabla" },
  { id: "vista", label: "Vista" },
  { id: "editar", label: "Editar" },
] as const;

type SubTab = (typeof SUBTABS)[number]["id"];

export function ViewTabla() {
  const [tab, setTab] = useState<SubTab>("tabla");

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label="Sub-vistas de la tabla" className={cn(glass.control, "flex w-fit flex-wrap gap-1 rounded-glass-md p-1")}>
        {SUBTABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            data-subtab-target={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "cursor-pointer rounded-glass-sm px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-glass motion-reduce:transition-none",
              tab === t.id ? "bg-primary-soft text-primary-ink" : "text-fg-2 hover:text-fg",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div data-subtab={tab}>
        {tab === "tabla" && (
          <div className="flex flex-col gap-6">
            <Alert label={alert.label} message={alert.message} action={<Button size="sm">{alert.action}</Button>} />
            <DataTable caption={tableCaption} columns={columns} rows={services} rowKey={(r) => r.id} />
          </div>
        )}
        {tab === "vista" && (
          <GlassCard as="div" className="p-6">
            <RecordView caption={record.caption} fields={record.fields} />
          </GlassCard>
        )}
        {tab === "editar" && (
          <GlassCard as="div" className="p-6">
            <RecordEditForm />
          </GlassCard>
        )}
      </div>
    </div>
  );
}

/** Formulario de edición del MISMO registro (sin backend, RF-002): prefijado por `recordEdit`. */
function RecordEditForm() {
  return (
    <form aria-label="Editar registro" className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
      <h3 className="text-sm font-semibold text-fg-2">Editar {recordEdit.nombre.defaultValue}</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Identificador" name="id" type="text" defaultValue={recordEdit.id.defaultValue} readOnly />
        <Field label="Nombre" name="nombre" type="text" defaultValue={recordEdit.nombre.defaultValue} />
        <Field label="Estado" name="estado" as="select" options={recordEdit.estado.options} defaultValue={recordEdit.estado.defaultValue} />
        <Field label="Región" name="region" as="select" options={recordEdit.region.options} defaultValue={recordEdit.region.defaultValue} />
        <Field label="Responsable" name="responsable" type="text" defaultValue={recordEdit.responsable.defaultValue} />
      </div>
      <Field label="Activo" name="activo" as="boolean" defaultChecked={recordEdit.activo.defaultChecked} />
      <Button type="submit" className="self-start">
        Guardar cambios
      </Button>
    </form>
  );
}
