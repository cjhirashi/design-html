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
- [ ] **Slice 1.5 — Catálogo de dashboard (GAP real, sin tarea asignada)**: la
  enmienda de RF-002 (2026-10-24, 15 tipos de campo + 7 tipos de gráfico,
  ambas pistas) quedó en `spec.md` pero **nunca se desglosó en tasks.md** —
  T-014 solo cubre 1 gráfico de líneas placeholder en react. `dashboard.html`
  vanilla sigue en 182 líneas, sin ningún tipo de campo nuevo. Pendiente:
  refinar esta historia (criterios + archivos concretos) antes de implementar.
  Demoable: tabla/registro/formulario con los 15 tipos + 7 gráficos, ambas pistas.
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
