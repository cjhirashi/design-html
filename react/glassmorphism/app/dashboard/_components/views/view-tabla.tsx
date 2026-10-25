// Vista Tabla (RF-002): por ahora el listado con dataset fijo + la alerta crítica que la
// redacción original de RF-002 conservaba como elemento de esta vista. Las sub-pestañas
// Tabla / Vista / Editar (listado · detalle de un registro · edición del mismo) llegan en
// la sub-slice (b); este archivo se amplía entonces.
import { Alert } from "@/components/glass/alert";
import { Badge } from "@/components/glass/badge";
import { Button } from "@/components/glass/button";
import { DataTable, type Column } from "@/components/glass/data-table";
import { alert, services, tableCaption, type ServiceRow } from "@/content/dashboard";

const columns: Column<ServiceRow>[] = [
  { key: "name", header: "Servicio / capa", cell: (r) => <strong className="font-semibold">{r.name}</strong> },
  { key: "status", header: "Estado actual", cell: (r) => <Badge tone={r.status.tone}>{r.status.label}</Badge> },
  { key: "token", header: "Token asignado", cell: (r) => <Badge tone={r.token.tone}>{r.token.label}</Badge> },
  { key: "checked", header: "Última verificación", cell: (r) => r.checkedAt, className: "font-mono text-muted" },
];

export function ViewTabla() {
  return (
    <div className="flex flex-col gap-8">
      <Alert label={alert.label} message={alert.message} action={<Button size="sm">{alert.action}</Button>} />
      <DataTable caption={tableCaption} columns={columns} rows={services} rowKey={(r) => r.id} />
    </div>
  );
}
