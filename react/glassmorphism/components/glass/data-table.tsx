import { cn } from "@/lib/utils";

import { glass } from "./surface";

export type Column<Row> = {
  key: string;
  header: string;
  cell: (row: Row) => React.ReactNode;
  className?: string;
};

/** Tabla en panel de vidrio con scroll horizontal propio (RF-006). */
export function DataTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
}: {
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
}) {
  return (
    <div className={cn(glass.panel, "rounded-glass-md")}>
      <div data-scroll-x className="overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  className="border-b border-glass-line bg-glass px-5 py-4 text-xs font-semibold tracking-wide text-fg-2 uppercase"
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="transition-colors duration-200 ease-glass hover:bg-glass motion-reduce:transition-none [&:last-child>td]:border-b-0"
              >
                {columns.map((c) => (
                  <td key={c.key} className={cn("border-b border-glass-line px-5 py-4 text-fg", c.className)}>
                    {c.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
