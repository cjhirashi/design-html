// Vista Formulario (RF-002): por ahora el formulario placeholder de 3 campos ya existente
// (T-014). El catálogo completo de 15 tipos de campo (texto, número, textarea, código,
// fecha, fecha-hora, boolean, select, multi-select, creatable, select-FK, multi-select-FK,
// lista-texto, lista-número, JSON-list) llega en la sub-slice (d); se amplía entonces.
import { GlassCard } from "@/components/glass/glass-card";
import { placeholderForm } from "@/content/dashboard";

import { PlaceholderForm } from "../placeholder-form";

export function ViewFormulario() {
  return (
    <GlassCard as="div" className="p-6">
      <PlaceholderForm {...placeholderForm} />
    </GlassCard>
  );
}
