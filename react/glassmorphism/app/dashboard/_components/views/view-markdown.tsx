// Vista Markdown (RF-002): documentación con texto enriquecido, reusa el componente
// Markdown (RF-004). Como el shell del dashboard es un client component y `Markdown` es un
// Server Component async (resaltado Shiki + Mermaid en build/servidor, `"use cache"`), el
// contenido ya renderizado se inyecta desde el `page.tsx` server vía la prop `slot` — este
// componente solo lo posiciona. La sub-slice (g) conecta el `slot` real; hasta entonces
// (sub-slice a) muestra el placeholder.
import { ViewPlaceholder } from "./view-placeholder";

export function ViewMarkdown({ slot }: { slot?: React.ReactNode }) {
  if (slot) {
    return <>{slot}</>;
  }
  return (
    <ViewPlaceholder
      title="Documentación Markdown"
      description="Esta vista reusa el componente Markdown reutilizable (resaltado de sintaxis real + Mermaid) para renderizar documentación. El contenido real llega en la sub-slice (g) de este catálogo."
    />
  );
}
