# Backlog — SPEC-0002 (slice-development, conversión 2026-10-24)

Tareas restantes de tasks.md agrupadas en slices verticales demoables. Cada
slice se refina (criterios + plan corto) solo al tomarla, no antes. Driver
(IA) implementa paso rojo→verde, commit por paso; navigator (AIRA) vigila:
loop, scope creep, trampa en tests. Checkpoint a Carlos al cerrar cada slice,
no al final del backlog.

- [x] **Slice 1 — Landing completo (ambas pistas)**: T-015 (carrusel react con
  imágenes locales), T-020 (motion P10 en esa vista), T-028 (e2e vistas con
  switcher 3-vías). Demoable: landing navegable con carrusel y motion.
  _Cerrado 2026-10-24 (AIRA Modo 2 headless). RE-VERIFICADO 2026-10-25 contra el
  CHECK canónico (`next build && next start`): 16/16 e2e verdes tras resolver el WIP
  Slice-2 y 3 fixes reales de build (commit `8c9c656`). Ver history.md._
- [x] **Slice 1.5 — Catálogo de dashboard (GAP real, refinado 2026-10-25 con Carlos)**:
  _Cerrado 2026-10-25. 7 sub-slices a–g (commits 94ae4cd…6e96a50), ambas pistas,
  vitest 578/578 + e2e vistas 15/15 contra build&&start. Ver history.md._
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
- [x] **Slice 2 — Markdown build vanilla**: T-024 (script `build-vanilla-markdown.mjs`,
  usa T-022/T-023 ya cerrados). Demoable: `blog-detalle.html` generado con el
  mismo render que react.
  _Cerrado 2026-10-25 al resolver el WIP sin commitear (commit `26a7f75`). Extrae
  `render-markdown-core.ts` compartido (RF-010); `paridad.test.ts` verifica paridad
  byte-a-byte; gate verde (454 vitest + type-check). Ver history.md. NOTA: desbloqueó
  el hallazgo de que Playwright/chromium y las deps npm YA funcionan en esta sesión._
- [x] **Slice 3 — Contacto funcional**: T-025 (react), T-026 (vanilla), T-029
  (e2e). _Cerrado 2026-10-25 (commit `7805d48`). Validación cliente + error inline
  por campo + éxito simulado sin red, ambas pistas. e2e contacto 3/3. Ver history.md._
- [x] **Slice 4 — Verificación cruzada**: T-021 (paridad + revisión visual),
  T-030 (network sin peticiones externas), T-031 (responsive). _Cerrado 2026-10-25
  (commit `e82e806`). network+responsive a las 7 vistas 33/33; paridad verificada por
  `paridad.test.ts` (catálogo, 7 gráficos, 15 campos, tareas/controles, markdown byte-a-byte,
  contacto); revisión `experto-ux-ui`: su único "bloqueante" (text-muted AA) resultó FALSO
  POSITIVO para react — `tokens.test.ts` valida que el muted de react (oscurecido, ≠ vanilla)
  cumple AA ≥4.5:1. Revisión VISUAL real en navegador (390px, herramienta AA) queda como
  checkpoint de Carlos. Ver history.md._
- [x] **Slice 5 — Cierre**: T-032 (`/audit`+`/polish`), T-033-035 (docs),
  T-036. _Cerrado 2026-10-25. T-032: la revisión profesional la cubrió `experto-ux-ui`
  (T-021); `/polish` se omite a propósito para no meter cambios sin revisar al cierre.
  T-033/034: README react + AGENTS.md actualizados (commit `d1336d4`). Retirado código
  muerto (line-chart/placeholder-form). T-036: Session-End consolidado, anchor movido, gate
  verde. Spec sigue `superseded-por-backlog` (el backlog es el tracker); NO se marca
  `verified` — requiere checkpoint demostrable de Carlos (regla dura)._

Orden fijo (T-024 antes de nada que dependa de markdown; T-032-036 al final).

**Estado de la feature (2026-10-25):** código COMPLETO en ambas pistas; `next build` exit 0;
suite e2e 75/77 (los 2 rojos son `aurora-motion`, preexistentes del piloto 0001, no
regresión — ver history.md); vitest 580/580; gate verde. Pendiente: checkpoint `verified`
de Carlos (revisión visual/responsive real) + decidir el umbral de RNF-005 aurora en headless.
