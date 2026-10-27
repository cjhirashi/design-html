// Catálogo de 7 tipos de gráfico (RF-002 §6): línea, barras, área, pie, dona, radar y
// gauge/radial. Todos son SVG inline, SIN librería de charts (P5/RNF-002) y SIN literales
// de color (RNF-003): usan `currentColor` (fijado por una clase de texto del sistema, p.ej.
// `text-primary`) y variaciones de opacidad para distinguir series. Datasets fijos de
// maqueta. `role="img"` + `aria-label` para accesibilidad.
const LINE = [14, 18, 16, 22, 19, 15, 12];
const BARS = [8, 14, 11, 18, 13, 16, 20];
const SLICES = [40, 35, 25];
const RADAR = [0.9, 0.6, 0.75, 0.5, 0.8];
const GAUGE = 0.7;

function framePath(points: readonly number[], w: number, h: number, pad: number) {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const step = (w - pad * 2) / (points.length - 1);
  return points.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

/** Gráfico de líneas (RF-002). */
export function LineChart({ className = "text-primary" }: { className?: string }) {
  const d = framePath(LINE, 280, 96, 8).join(" ");
  return (
    <svg viewBox="0 0 280 96" role="img" aria-label="Gráfico de líneas: 7 muestras" className={`h-24 w-full ${className}`}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Gráfico de área (RF-002): misma serie que líneas, con relleno bajo la curva. */
export function AreaChart({ className = "text-primary" }: { className?: string }) {
  const pts = framePath(LINE, 280, 96, 8);
  const area = `${pts.join(" ")} L272,88 L8,88 Z`;
  return (
    <svg viewBox="0 0 280 96" role="img" aria-label="Gráfico de área: 7 muestras" className={`h-24 w-full ${className}`}>
      <path d={area} fill="currentColor" fillOpacity={0.15} stroke="none" />
      <path d={pts.join(" ")} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Gráfico de barras (RF-002): la última barra resaltada a opacidad plena. */
export function BarChart({ className = "text-primary" }: { className?: string }) {
  const max = Math.max(...BARS);
  const bw = 28;
  const gap = (280 - BARS.length * bw) / (BARS.length + 1);
  return (
    <svg viewBox="0 0 280 96" role="img" aria-label="Gráfico de barras: 7 categorías" className={`h-24 w-full ${className}`}>
      {BARS.map((v, i) => {
        const h = (v / max) * 84;
        const x = gap + i * (bw + gap);
        return (
          <rect
            key={i}
            x={x.toFixed(1)}
            y={(96 - h).toFixed(1)}
            width={bw}
            height={h.toFixed(1)}
            rx={3}
            fill="currentColor"
            fillOpacity={i === BARS.length - 1 ? 1 : 0.5}
          />
        );
      })}
    </svg>
  );
}

/** Segmentos de un anillo/círculo vía stroke-dasharray (base de pie y dona). */
function RingSegments({ r, strokeWidth }: { r: number; strokeWidth: number }) {
  const circ = 2 * Math.PI * r;
  let acc = 0;
  const opacities = [1, 0.6, 0.35];
  return (
    <g transform="rotate(-90 60 60)">
      {SLICES.map((pct, i) => {
        const len = (pct / 100) * circ;
        const seg = (
          <circle
            key={i}
            cx={60}
            cy={60}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeOpacity={opacities[i] ?? 0.5}
            strokeWidth={strokeWidth}
            strokeDasharray={`${len.toFixed(2)} ${(circ - len).toFixed(2)}`}
            strokeDashoffset={(-acc).toFixed(2)}
          />
        );
        acc += len;
        return seg;
      })}
    </g>
  );
}

/** Gráfico de pie (RF-002): disco sólido (stroke grueso = radio). */
export function PieChart({ className = "text-primary" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Gráfico de pie: 3 segmentos" className={`h-28 w-full ${className}`}>
      <RingSegments r={28} strokeWidth={56} />
    </svg>
  );
}

/** Gráfico de dona (RF-002): anillo con hueco central. */
export function DonutChart({ className = "text-primary" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Gráfico de dona: 3 segmentos" className={`h-28 w-full ${className}`}>
      <RingSegments r={42} strokeWidth={16} />
    </svg>
  );
}

/** Gráfico de radar (RF-002): polígono de 5 ejes sobre una rejilla pentagonal. */
export function RadarChart({ className = "text-primary" }: { className?: string }) {
  const R = 48;
  const angle = (i: number) => (-90 + i * 72) * (Math.PI / 180);
  const point = (i: number, factor: number) =>
    `${(60 + Math.cos(angle(i)) * R * factor).toFixed(1)},${(60 + Math.sin(angle(i)) * R * factor).toFixed(1)}`;
  const grid = RADAR.map((_, i) => point(i, 1)).join(" ");
  const data = RADAR.map((f, i) => point(i, f)).join(" ");
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="Gráfico de radar: 5 ejes" className={`h-28 w-full ${className}`}>
      <polygon points={grid} fill="none" stroke="currentColor" strokeOpacity={0.25} strokeWidth={1} />
      <polygon points={data} fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

/** Gauge/radial (RF-002): semicírculo con pista y arco de valor (70%). */
export function GaugeChart({ className = "text-primary" }: { className?: string }) {
  const R = 48;
  const end = Math.PI - GAUGE * Math.PI; // ángulo final del arco de valor
  const x = (60 + Math.cos(end) * R).toFixed(1);
  const y = (60 - Math.sin(end) * R).toFixed(1);
  return (
    <svg viewBox="0 0 120 74" role="img" aria-label={`Gauge radial: ${Math.round(GAUGE * 100)}%`} className={`h-24 w-full ${className}`}>
      <path d="M12,60 A48,48 0 0 1 108,60" fill="none" stroke="currentColor" strokeOpacity={0.2} strokeWidth={10} strokeLinecap="round" />
      <path d={`M12,60 A48,48 0 0 1 ${x},${y}`} fill="none" stroke="currentColor" strokeWidth={10} strokeLinecap="round" />
      <text x="60" y="58" textAnchor="middle" className="fill-fg font-mono text-[18px] font-bold">
        {Math.round(GAUGE * 100)}%
      </text>
    </svg>
  );
}
