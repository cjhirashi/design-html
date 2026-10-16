import Image from "next/image";

import { GlassCard } from "./glass-card";
import { glass } from "./surface";

/** Tarjeta de galería: imagen con etiqueta de vidrio + texto. */
export function MediaCard({
  src,
  width,
  height,
  alt,
  tag,
  title,
  body,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  tag: string;
  title: string;
  body: string;
}) {
  return (
    <GlassCard as="li" interactive className="w-[min(82vw,380px)] shrink-0 snap-start overflow-hidden">
      <div className="relative h-52 overflow-hidden">
        <Image
          src={src}
          width={width}
          height={height}
          alt={alt}
          sizes="(max-width: 640px) 82vw, 380px"
          className="size-full object-cover"
        />
        <span
          className={`${glass.control} absolute top-3 left-3 rounded-full px-3 py-1 font-mono text-[0.6875rem] font-semibold text-fg`}
        >
          {tag}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-lg font-semibold text-fg">{title}</h3>
        <p className="text-sm leading-relaxed text-fg-2">{body}</p>
      </div>
    </GlassCard>
  );
}
