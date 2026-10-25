# Backlog — SPEC-0002 (slice-development, conversión 2026-10-24)

Tareas restantes de tasks.md agrupadas en slices verticales demoables. Cada
slice se refina (criterios + plan corto) solo al tomarla, no antes. Driver
(IA) implementa paso rojo→verde, commit por paso; navigator (AIRA) vigila:
loop, scope creep, trampa en tests. Checkpoint a Carlos al cerrar cada slice,
no al final del backlog.

- [x] **Slice 1 — Landing completo (ambas pistas)**: T-015 (carrusel react con
  imágenes locales), T-020 (motion P10 en esa vista), T-028 (e2e vistas con
  switcher 3-vías). Demoable: landing navegable con carrusel y motion.
  _Cerrado 2026-10-24 (AIRA Modo 2 headless). e2e verdes (16/16) contra `next dev`;
  el CHECK canónico (webServer = `next build && next start`) sigue bloqueado por el
  WIP Slice-2 (T-024) sin commitear → re-correr al cerrar Slice 2. Ver history.md._
- [ ] **Slice 1.5 — Catálogo de dashboard (GAP real, refinado 2026-10-25 con Carlos)**:
  la enmienda de RF-002 (2026-10-24, 15 tipos de campo + 7 tipos de gráfico,
  ambas pistas) quedó en `spec.md` pero **nunca se desglosó en tasks.md** —
  T-014 solo cubre 1 gráfico de líneas placeholder en react. Refinamiento de
  Carlos (2026-10-25): el sidebar del dashboard activa secciones, cada una
  muestra una vista distinta en el panel principal:
  1. **Vista Tabla** — con sub-pestañas Tabla / Vista / Editar (listado,
     detalle de un registro, formulario de edición del mismo registro).
  2. **Vista Métricas** — gráficos (los 7 tipos: línea, barras, área, pie,
     dona, radar, gauge/radial).
  3. **Vista Markdown** — para documentación (reusa el componente Markdown
     de Slice 2 si ya existe).
  4. **Vista Tareas** — lista de tareas tipo to-do/kanban simple.
  5. **Vista Formulario** — formulario standalone con los 15 tipos de campo.
  6. **Vista Controles** — catálogo de controles UI (toggles, selects, etc.).
  7. Extensible — "y más" (Carlos dejó la lista abierta, no cerrada en 6).
  Orden de implementación sugerido (sub-slices dentro de este slice, cada uno
  commit propio): (a) shell del sidebar + ruteo de vistas (una vista vacía
  placeholder cada una, navegable) → demoable de inmediato; (b) Vista Tabla
  con los 15 tipos de campo; (c) Vista Métricas con los 7 gráficos; (d) Vista
  Formulario; (e) Vista Tareas; (f) Vista Controles; (g) Vista Markdown.
  Ambas pistas (vanilla + react) en paridad, mismo dataset de ejemplo.
  Demoable tras (a): navegar el sidebar y ver cada vista (aunque esté vacía).
  Demoable completo: las 7 vistas con contenido real.
- [ ] **Slice 2 — Markdown build vanilla**: T-024 (script `build-vanilla-markdown.mjs`,
  usa T-022/T-023 ya cerrados). Demoable: `blog-detalle.html` generado con el
  mismo render que react.
- [ ] **Slice 3 — Contacto funcional**: T-025 (react), T-026 (vanilla), T-029
  (e2e). Demoable: formulario de contacto valida y muestra error/éxito en
  ambas pistas.
- [ ] **Slice 4 — Verificación cruzada**: T-021 (paridad + revisión visual),
  T-030 (network sin peticiones externas), T-031 (responsive). Demoable:
  evidencia de paridad vanilla/react y sin fugas de red.
- [ ] **Slice 5 — Cierre**: T-032 (`/audit`+`/polish`), T-033-035 (docs),
  T-036 (Session-End, mover anchor, gate verde, spec `implemented`).

Orden fijo (T-024 antes de nada que dependa de markdown; T-032-036 al final).
