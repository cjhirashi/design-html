// Vista Métricas (RF-002 §6): catálogo de los 7 tipos de gráfico, cada uno en su tarjeta.
// Todos SVG inline, sin librería, sin literales de color (ver charts.tsx).
import { GlassCard } from "@/components/glass/glass-card";

import { AreaChart, BarChart, DonutChart, GaugeChart, LineChart, PieChart, RadarChart } from "./charts";

const CHARTS = [
  { title: "Línea", caption: "Latencia de capa (7 muestras)", chart: <LineChart /> },
  { title: "Barras", caption: "Peticiones por nodo", chart: <BarChart /> },
  { title: "Área", caption: "Carga acumulada", chart: <AreaChart /> },
  { title: "Pie", caption: "Distribución de tokens", chart: <PieChart /> },
  { title: "Dona", caption: "Uso por región", chart: <DonutChart /> },
  { title: "Radar", caption: "Perfil de capacidades", chart: <RadarChart /> },
  { title: "Gauge", caption: "Disponibilidad objetivo", chart: <GaugeChart /> },
] as const;

export function ViewMetricas() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6">
      {CHARTS.map((c) => (
        <GlassCard key={c.title} as="div" className="p-6">
          <figure className="flex flex-col gap-3">
            <figcaption className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-fg">{c.title}</span>
              <span className="text-xs text-muted">{c.caption}</span>
            </figcaption>
            {c.chart}
          </figure>
        </GlassCard>
      ))}
    </div>
  );
}
