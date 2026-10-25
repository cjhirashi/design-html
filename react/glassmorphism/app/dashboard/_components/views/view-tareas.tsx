// Vista Tareas (RF-002): placeholder hasta la sub-slice (e), que entrega el tablero de
// tareas estilo to-do/kanban simple.
import { ViewPlaceholder } from "./view-placeholder";

export function ViewTareas() {
  return (
    <ViewPlaceholder
      title="Tablero de tareas"
      description="Una lista de tareas estilo to-do / kanban simple con columnas de estado. El contenido real de esta vista llega en la sub-slice (e) de este catálogo."
    />
  );
}
