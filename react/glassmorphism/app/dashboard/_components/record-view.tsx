// Vista de registro/detalle (RF-002): pares clave-valor de un único registro,
// sin acciones ni edición (placeholder).
export function RecordView({
  caption,
  fields,
}: {
  caption: string;
  fields: readonly { label: string; value: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-fg-2">{caption}</h3>
      <dl className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-x-6 gap-y-4">
        {fields.map((field) => (
          <div key={field.label} className="flex flex-col gap-1">
            <dt className="text-xs font-medium text-muted uppercase">{field.label}</dt>
            <dd className="text-sm text-fg">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
