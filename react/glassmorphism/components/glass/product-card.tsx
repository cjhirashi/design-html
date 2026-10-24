import Image from "next/image";

import { GlassCard } from "./glass-card";

/**
 * Tarjeta de producto para el listado de Productos (RF-005): imagen, nombre y
 * precio. Presentacional puro — los datos llegan por props, sin fetch.
 */
export function ProductCard({
  src,
  width,
  height,
  alt,
  name,
  price,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  name: string;
  /** Precio ya formateado (p.ej. "$149.00 MXN"). */
  price: string;
}) {
  return (
    <GlassCard as="article" interactive className="flex flex-col overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          sizes="(max-width: 640px) 100vw, 380px"
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-lg font-semibold text-fg">{name}</h3>
        <p className="font-mono text-sm font-semibold text-muted">{price}</p>
      </div>
    </GlassCard>
  );
}
