import Image from "next/image";

import { GlassCard } from "./glass-card";

/**
 * Tarjeta de post para el listado de Blog (RF-003): imagen, título, extracto y fecha.
 * Presentacional puro — los datos llegan por props, sin fetch ni estado propio.
 */
export function PostCard({
  src,
  width,
  height,
  alt,
  title,
  excerpt,
  date,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  excerpt: string;
  /** Fecha ya formateada en español (p.ej. "24 de octubre de 2026"). */
  date: string;
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
        <time className="text-xs font-semibold tracking-wide text-muted uppercase">{date}</time>
        <h3 className="text-lg font-semibold text-fg">{title}</h3>
        <p className="text-sm leading-relaxed text-fg-2">{excerpt}</p>
      </div>
    </GlassCard>
  );
}
