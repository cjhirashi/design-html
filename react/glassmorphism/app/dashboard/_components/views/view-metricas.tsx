// Vista Métricas (RF-002): por ahora el gráfico de líneas placeholder ya existente
// (T-014). El catálogo completo de 7 tipos de gráfico (línea, barras, área, pie, dona,
// radar, gauge/radial) — todos SVG inline, sin librería, sobre tokens — llega en la
// sub-slice (c); este archivo se amplía entonces.
import { GlassCard } from "@/components/glass/glass-card";
import { chartSeries } from "@/content/dashboard";

import { LineChart } from "../line-chart";

export function ViewMetricas() {
  return (
    <GlassCard as="div" className="p-6">
      <LineChart title={chartSeries.title} unit={chartSeries.unit} points={chartSeries.points} />
    </GlassCard>
  );
}
