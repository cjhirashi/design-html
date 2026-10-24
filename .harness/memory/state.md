---
ultima_actualizacion: 2026-10-24
fase: SPEC-0002 — Fase 4 EN CURSO · 19/36 tareas cerradas y committeadas (T-001…T-014, T-016…T-019, T-027) · 17 bloqueadas por entorno (Playwright + npm install) · spec sigue `approved`, NO `implemented`
arquitectura_verificada: True
---

# State — design-html

## Correcciones & Contexto Actual

### SPEC-0002 · Estructura HTML del catálogo — Fase 4 avanzada 19/36, bloqueo de entorno para el resto (2026-10-24, AIRA Modo 2 headless)

- **Rama/worktree:** worktree `.claude/worktrees/0002-estructura-html-catalogo`, rama
  **`0002-estructura-html-catalogo-impl`**, HEAD **`e03c8d0`**. El prompt esperaba `feature/catalogo-estructura-html`
  (rama hermana del worktree principal, partía de `6dc26bd`). **No se cambió de rama. Aclarar con Carlos cuál es
  la de integración antes de cualquier merge.** Nunca push/merge/PR.
- **Qué quedó HECHO y verificado (19 tareas, commit por tarea, cada una aprobada por `revisor` adversarial):**
  - Bloque A (contrato/tests en rojo): T-001 (fixture + post fuente única Markdown), T-002 (markdown.test.ts),
    T-003 (paridad.test.ts), T-004 (tokens AA pares nuevos), T-005 (literals componentes nuevos),
    T-006 (reuse post-card/product-card/field), T-007 (empty-state.test.tsx).
  - Bloque B (frontend/maqueta): T-008 (presentacionales post-card/product-card/empty-state/field),
    T-009 (blog listado react), T-010 (productos listado react + nav de catálogo compartida sin duplicar),
    T-011 (producto-detalle texto plano react), T-012 (blog-detalle maqueta + prose.ts),
    T-013 (contacto maqueta), T-014 (dashboard a 5 bloques), T-016 (carrusel vanilla con imágenes locales),
    T-017 (4 vistas vanilla nuevas), T-018 (blog-detalle.html maqueta), T-019 (clases vanilla P3 + reconciliar
    AA del enlace .md-content en tokens.test.ts).
  - Bloque C (parcial): T-027 (toggle de estado vacío Blog/Productos, ambas pistas).
  - Rebotes del revisor (todos resueltos): T-006 ×2, T-007 ×1, T-010 ×1, T-013 ×1. Ningún ABANDON por calidad.
- **BLOQUEOS DE ENTORNO (impiden cerrar las 17 restantes — NO son decisión de producto ni defecto del plan):**
  1. **Playwright no arranca:** `chrome-headless-shell: libatk-1.0.so.0: cannot open shared object file`
     (libs de sistema ausentes; `~/.cache/pw-libs` fuera del sandbox). Además `next build` falla en `tsc` por
     `markdown.test.ts` hasta T-022. ⇒ ningún e2e corre. Afecta T-015, T-020, T-025, T-028, T-029, T-030, T-031
     y la revisión visual de T-021.
  2. **`npm install` no concedible:** hasta `npm --version` pide aprobación no otorgable en sesión no interactiva.
     `npx`/`node`/`git`/`vitest`/`tsc` SÍ corren (por eso se cerraron 19 tareas). Afecta T-022, T-023, T-024
     (núcleo Markdown: necesita instalar shiki + parser markdown + mermaid).
- **En cascada quedan rojos POR DISEÑO (se resuelven al desbloquear):** `markdown.test.ts` (módulo
  `components/markdown/markdown.tsx` ausente = T-022), `type-check`/`next build` (mismo TS2307), `reuse` "post
  individual", `paridad` markdown, el gate global. No tocar: son el contrato TDD a verde en T-022/T-024.
- **Tareas pendientes (gaps, ver history.md para razón de cada ABANDON):** T-015, T-020, T-021, T-022, T-023,
  T-024, T-025, T-026, T-028, T-029, T-030, T-031, T-032, T-033, T-034, T-035, T-036.
- **Para CERRAR la feature — relanzar sesión con DOS permisos pre-concedidos:**
  (a) `npm install` (allow-list) → T-022→T-024; (b) libs de Playwright (`npx playwright install-deps chromium`
  con sudo, o `LD_LIBRARY_PATH`→`~/.cache/pw-libs`) → e2e. Orden: T-022→T-024 → T-015/020/025/026 →
  T-028–031 → T-021 → T-032 → T-033–035 → T-036 (mover `anchor_commit`, gate verde, spec `implemented`).
  No hay decisiones de producto pendientes.
- **Cómo probar localmente lo ya hecho:** desde `react/glassmorphism/`: `npx vitest run` (verdes salvo los reds
  por-diseño de markdown/e2e); `npx vitest run tests/unit/{tokens,reuse,literals,empty-state,paridad}.test.ts`.
  Vanilla: abrir `glassmorphism/{index,blog,productos,producto-detalle,contacto,blog-detalle}.html`; anti-red con
  `grep -REIl "https?://|unsplash|cdn" glassmorphism/*.html` (vacío). El render visual real de React necesita
  `next build`/`next dev`, hoy bloqueado por el TS2307 de markdown (se abre en T-022).

### SPEC-0002 · Fase 1/2 aprobadas (2026-10-16 / 2026-10-24)

- 7 vistas de ADR-002 (Landing, Dashboard, Blog listado/detalle, Productos listado/detalle, Contacto),
  glassmorphism, ambas pistas en paralelo, una sola instancia de cada componente. `plan.md` `approved`,
  Gate 2 ratificado por AIRA (autoridad delegada) en `6dc26bd`.
- Decisiones firmes: Markdown reutilizable (resaltado real + Mermaid, self-hosted, nunca CDN; único consumidor
  Blog Detalle); Producto Detalle en texto plano; tema claro/sistema/oscuro replica el mecanismo existente
  (vanilla `theme-manager.js`, react `next-themes`). Motion = alcance explícito (P10, ADR-003). 15 tipos de campo
  + catálogo de gráficos en spec §6.

### Piloto React — 0001-glassmorphism-react (2026-10-16)

- App `react/glassmorphism/` (spec `implemented`, Gate 2 ratificado): base de SPEC-0002. Vitest + Playwright.
  Entorno: Playwright necesita libs del sistema; con sudo `npx playwright install-deps chromium`.
- Hallazgos colaterales fuera de alcance: `style.css` vanilla de glassmorphism no cumple AA en `--text-muted`
  ni define la familia P3 completa (feature `1001-*`).

### Reglas Vigentes (P1-P10)

P1 gate primero · P2 sincronización vía symlinks (hoy copias) · P3 familia `:root` estándar · P4 AA light+dark ·
P5 sin red en runtime (build deps como shiki/mermaid SÍ permitidas, su output no carga CDN) · P6 HTML agnóstico ·
P7 español · P8 Conventional Commits + (RF-NNN) · P9 no auto-aprobarse (implementador⇄revisor por tarea; el
orquestador comitea tras veredicto) · P10 Motion estándar de animación (ADR-003, vendorizado en vanilla).

### Backlog

1. **Cerrar SPEC-0002** (17 tareas, ver arriba) en sesión con npm install + Playwright libs. Prioridad.
2. Revisión visual del piloto React (pendiente desde 0001).
3. Corregir AA y P3 en `glassmorphism/css/style.css` vanilla (feature `1001-*`, independiente).
4. Al cerrar el catálogo: replicar a los otros 20 estilos (symlinks + tokens) + variedad de dashboards.
5. Implementar el gate especializado del Art. 4 (symlinks, contraste AA, stylelint, html-validate) — hoy aspiración.

### Notas para Carlos

- Design-HTML NO se expone vía cjhirashi-srv (infraestructura local).
- **Cambios de graphify** (`.claude/settings.json`, `CLAUDE.md`, `graphify-out/`, `.gitattributes`): NO tocados ni
  commiteados (no autorizados para SPEC-0002). `git status` de este worktree solo muestra memoria del arnés.
- SPEC-0002 quedó a 19/36. Lo construido es sólido y verificado; lo que falta es ejecutable tal cual en cuanto
  haya `npm install` + libs de Playwright. Ninguna decisión de producto pendiente.
