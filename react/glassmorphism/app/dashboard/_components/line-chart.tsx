// Gráfico de líneas placeholder (RF-002): SVG estático inline, sin librería de
// charts (el catálogo real de tipos de gráfico es spec posterior 0010). Dataset
// fijo recibido por props; el trazo usa `currentColor` vía clase de texto, nunca
// un literal de color (RNF-003).
const WIDTH = 280;
const HEIGHT = 96;
const PADDING = 8;

function buildPath(points: readonly number[]) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = (WIDTH - PADDING * 2) / (points.length - 1);

  return points
    .map((value, index) => {
      const x = PADDING + index * step;
      const y = HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export function LineChart({
  title,
  unit,
  points,
}: {
  title: string;
  unit: string;
  points: readonly number[];
}) {
  const path = buildPath(points);
  const last = points[points.length - 1];

  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="text-sm font-medium text-fg-2">{title}</span>
        <span className="font-mono text-lg font-semibold text-fg tabular-nums">
          {last} {unit}
        </span>
      </figcaption>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`${title}: serie de ${points.length} muestras en ${unit}`}
        className="h-24 w-full text-primary"
      >
        <path d={path} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </figure>
  );
}
