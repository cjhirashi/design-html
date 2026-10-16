---
id: TASKS-0001
tipo: tasks
feature: 0001-glassmorphism-react
estado: implemented
actualizado: 2026-10-16
---

# TASKS-0001 · Piloto glassmorphism en React/Next.js

## Reglas
- Cada tarea: ≤ 30 min, un solo propósito, `(cubre RF-NNN)`, zona del patrón (o `[doc]`).
- Orden por dependencias. **Test antes que código.**

## Tareas
- [x] T-001 — Andamiaje Next.js (App Router, TS, Tailwind v4) + Vitest + Playwright + scripts `type-check`/`test`/`test:e2e` (cubre RF-006) [zona: infra]
- [x] T-002 — Test de tokens: familia P3 completa en `:root` y `[data-theme="dark"]` + contraste AA (cubre RNF-001) [zona: test]
- [x] T-003 — `app/tokens.css` + `app/globals.css` (`@theme inline`, variante `dark` por `data-theme`) (cubre RNF-001, RF-007) [zona: tokens]
- [x] T-004 — Tests estáticos: easing único sin bounce/spring; sin literales de color ni `style`; receta de vidrio única (cubre RF-004, RNF-003, RF-007) [zona: test]
- [x] T-005 — `lib/motion.ts`, `lib/utils.ts`, `components/glass/surface.ts` (cubre RF-004, RF-007) [zona: componentes]
- [x] T-006 — Test de aurora: rayos con tokens; sin rayos con reduced-motion (cubre RF-003, RF-005) [zona: test]
- [x] T-007 — Vendorizar MagicUI `light-rays` + `aurora-background.tsx` (cubre RF-003, RF-005) [zona: frontera]
- [x] T-008 — `providers.tsx` (next-themes + MotionConfig) + `layout.tsx` con Geist auto-hospedada (cubre RF-001, RF-002, RF-005) [zona: coordinación]
- [x] T-009 — Componentes base: button, badge, glass-card, logo, avatar, icons, reveal, theme-switch (cubre RF-004, RF-001) [zona: componentes]
- [x] T-010 — `navbar.tsx` + `sidebar.tsx` con off-canvas bajo `lg` (cubre RF-006, RF-007) [zona: componentes]
- [x] T-011 — Test de reuso: landing y dashboard importan los mismos navbar/sidebar/tarjetas (cubre RF-007) [zona: test]
- [x] T-012 — Landing `app/page.tsx` + `content/landing.ts` + galería con imágenes en `public/` (cubre RF-003, RF-006, RF-007) [zona: vista]
- [x] T-013 — Dashboard `app/dashboard/page.tsx` + stat-card, data-table, status-row, chat-panel + `content/dashboard.ts` (cubre RF-006, RF-007) [zona: vista]
- [x] T-014 — E2E tema: sin FOUC antes de hidratar, persistencia, seguir al SO (cubre RF-001, RF-002) [zona: test]
- [x] T-015 — E2E landing: aurora tras paneles con blur (cubre RF-003) [zona: test]
- [x] T-016 — E2E reduced-motion (cubre RF-005) [zona: test]
- [x] T-017 — E2E responsive 375/768/1280 (cubre RF-006) [zona: test]
- [x] T-018 — E2E sin peticiones externas (cubre RNF-002) [zona: test]
- [x] T-019 — /audit + /polish con `frontend-design-pro` y corrección de hallazgos (cubre RF-004, RF-006, RNF-001) [zona: vista]
- [x] T-020 — `react/glassmorphism/README.md` [doc]
- [x] T-021 — `AGENTS.md` sección "Pista React (ADR-001)" [doc]
- [x] T-022 — `.harness/gate/services.txt` declara `react/glassmorphism:node` [doc]
- [x] T-023 — Session-End en `memory/history.md` + reescritura de `memory/state.md` [doc]

## Ajustes tras revisión visual (2026-10-16, spec §6.1)
- [x] T-024 — E2E: galería visible sin scroll, con y sin JS (cubre RNF-004) [zona: test]
- [x] T-025 — `reveal.tsx` sin ocultar contenido (cubre RNF-004, RF-004, RF-005) [zona: componentes]
- [x] T-026 — Tokens: `--aurora-ray` más intenso (claro/oscuro); `--bg-card` y `--border-glass` en claro (cubre RF-003, RNF-001) [zona: tokens]

## Evidencia (2026-10-16, commit de cierre de la rama)
- `npm test` (Vitest): 5 archivos · **204 passed**. `npm run test:e2e` (Playwright, Chromium, tras §6.1):
  **33 passed**. `type-check`, `lint` y `build` limpios. Gate: verde.
- Revisión adversarial (agente `revisor`): **1 rebote**. Hallazgos atendidos: tabla de
  cobertura cerrada; test de reuso exige uso real en JSX; RNF-003 amplía el regex y
  escanea CSS; RF-005 añade hover de botón del dashboard con control; drift del plan corregido.

## Excepción declarada — test-first no demostrable por historia git
Los tests se escribieron antes que su código y se vieron fallar en rojo dentro de la sesión
(tokens: "falta app/tokens.css"; motion/reuse: "falta lib/motion"; aurora: "falta el
componente"; responsive: desbordes reales a 375 px detectados antes de su arreglo). Pero
toda la implementación entró en **un solo commit** (`feat(react): …`), así que la historia
de git no lo acredita. No se reescribió la historia. En futuras features: un commit
`test:` en rojo antes de cada `feat:`.

## Cobertura (el gate exige 100 %)
| RF / doc | Tareas | Test(s) | Estado |
|---|---|---|---|
| RF-001 | T-008, T-009, T-014 | e2e/theme.spec.ts | Pass |
| RF-002 | T-008, T-014 | e2e/theme.spec.ts | Pass |
| RF-003 | T-006, T-007, T-012, T-015 | tests/unit/aurora.test.tsx, e2e/landing.spec.ts | Pass |
| RF-004 | T-004, T-005, T-009 | tests/unit/motion.test.ts | Pass |
| RF-005 | T-006, T-007, T-008, T-016 | tests/unit/aurora.test.tsx, e2e/reduced-motion.spec.ts | Pass |
| RF-006 | T-001, T-010, T-012, T-013, T-017 | e2e/responsive.spec.ts | Pass |
| RF-007 | T-003, T-005, T-010, T-011 | tests/unit/reuse.test.ts | Pass |
| RNF-001 | T-002, T-003 | tests/unit/tokens.test.ts | Pass |
| RNF-002 | T-018 | e2e/network.spec.ts | Pass |
| RNF-003 | T-004 | tests/unit/literals.test.ts | Pass |
| RNF-004 | T-024, T-025 | e2e/reveal.spec.ts | Pass |
| doc: README pista React | T-020 | — | Pass |
| doc: AGENTS.md | T-021 | — | Pass |
| doc: services.txt | T-022 | — | Pass |
| doc: memoria | T-023 | — | Pass |
