// Placeholder de vista del dashboard (RF-002): la sub-slice (a) entrega el shell y el
// ruteo navegables; cada vista aún sin contenido real muestra este cartel — nunca un panel
// roto o en blanco. Las sub-slices (b)–(g) reemplazan el archivo de cada vista por su
// contenido real. Usa solo tokens del sistema (RNF-003), sin literales de color.
import { GlassCard } from "@/components/glass/glass-card";

export function ViewPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <GlassCard as="div" className="flex flex-col items-start gap-3 p-8">
      <span className="rounded-glass-sm bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary-ink">
        Próximamente
      </span>
      <h3 className="text-lg font-semibold text-fg">{title}</h3>
      <p className="max-w-[60ch] text-sm text-fg-2">{description}</p>
    </GlassCard>
  );
}
