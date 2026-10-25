// Vista Tareas (RF-002 §6): tablero estilo to-do/kanban simple, 3 columnas de estado con
// tarjetas. Maqueta presentacional (sin arrastrar). Sin literales de vidrio en la ruta:
// las tarjetas usan la receta `glass.control` (RF-007).
import { Badge } from "@/components/glass/badge";
import { GlassCard } from "@/components/glass/glass-card";
import { glass } from "@/components/glass/surface";
import { cn } from "@/lib/utils";
import { taskBoard } from "@/content/dashboard";

export function ViewTareas() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {taskBoard.columns.map((col) => (
        <GlassCard key={col.id} as="section" aria-label={col.label} className="flex flex-col gap-3 p-5">
          <header className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-fg">{col.label}</h3>
            <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-ink">
              {col.tasks.length}
            </span>
          </header>
          <ul className="flex flex-col gap-3">
            {col.tasks.map((task) => (
              <li key={task.id} className={cn(glass.control, "flex flex-col gap-2 rounded-glass-sm p-3")}>
                <p className="text-sm text-fg">{task.title}</p>
                <Badge tone={task.tone}>{task.tag}</Badge>
              </li>
            ))}
          </ul>
        </GlassCard>
      ))}
    </div>
  );
}
