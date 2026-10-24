# Backlog — SPEC-0002 (slice-development, conversión 2026-10-24)

Tareas restantes de tasks.md agrupadas en slices verticales demoables. Cada
slice se refina (criterios + plan corto) solo al tomarla, no antes. Driver
(IA) implementa paso rojo→verde, commit por paso; navigator (AIRA) vigila:
loop, scope creep, trampa en tests. Checkpoint a Carlos al cerrar cada slice,
no al final del backlog.

- [ ] **Slice 1 — Landing completo (ambas pistas)**: T-015 (carrusel react con
  imágenes locales), T-020 (motion P10 en esa vista), T-028 (e2e vistas con
  switcher 3-vías). Demoable: landing navegable con carrusel y motion.
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
