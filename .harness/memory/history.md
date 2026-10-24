# History — design-html

## [2026-10-24] SPEC-0002 · Slice 1 (Landing completo) CERRADO — slice-development, AIRA Modo 2 headless
- **Demoable:** landing con carrusel/galería (imágenes locales vía `next/image`) + motion de vistas nuevas verificados por e2e; las 5 vistas nuevas montan el conmutador 3-vías y el dashboard sus 5 bloques. T-015 (`eedfe8b`), T-020 (`2f7838e`), T-028 (`7d1c6a8`) — un commit por paso verde.
- **Cómo probar (2-3 líneas):** el bloqueo previo de Playwright (`libatk`) YA NO existe en esta sesión (Chromium arranca). Pero `next build` falla al prerenderizar `/blog/[slug]` por un `Date.now()` del **WIP Slice-2 (T-024) sin commitear** (render Markdown Shiki/Mermaid) → el `webServer` canónico (`build && start`) no abre. Verifiqué los 16 e2e con un harness local `next dev` (`playwright.dev.config.ts`, NO committeado, ya borrado): `npx playwright test --config playwright.dev.config.ts e2e/landing.spec.ts e2e/vistas.spec.ts` → 16/16. Al cerrar Slice 2, re-correr los CHECK canónicos (`npx playwright test e2e/landing.spec.ts` y `e2e/vistas.spec.ts [-g motion]`) contra build de producción.
- **Para AIRA (navigator):** revisar antes de Slice 2. NO merge/push hasta que el build de producción pase (bloqueado por WIP Slice-2, no por Slice 1). El working tree conserva ese WIP Slice-2 intacto (no lo toqué: no se pudo `git stash` —aprobación—; trabajé quirúrgico, staging solo los 2 archivos e2e). Desvío registrado en T-020: motion medido por `transform` frame-a-frame, no pixel-diff (glassHover conserva color con reduce). Observación no-slice: `/productos/[slug]` emite warning Next 16 "params fuera de `<Suspense>`" (perf, no error) — pre-existente, no tocado.

## [2026-10-24] SPEC-0002 (estructura HTML del catálogo) — Fase 4 avanzada: 19/36 tareas cerradas; bloqueo de entorno (Playwright + npm install) impide cerrar
- **Claim:** Fase 4 (implementación TDD) **iniciada y avanzada**. **19/36 tareas cerradas, verificadas por `revisor` adversarial y committeadas una a una** (commit-por-tarea, corrigiendo la corrida anterior): T-001…T-014 y T-016…T-019 y T-027. El spec **sigue `approved`, NO `implemented`**: la feature no está completa — 17 tareas quedan bloqueadas por dos límites de entorno (Playwright no arranca + `npm install` no concedible). Gate global **no verde** (reds por diseño de TDD + los dos bloqueos). Esta corrida retomó desde `6dc26bd` (la sesión headless anterior murió sin ejecutar nada); el entorno de ESTA sesión sí permitió `npx vitest`/`npx tsc`/`node`/`git`, por eso sí se ejecutó y comiteó.
- **Evidencia:**
  - `git log --oneline 6dc26bd..HEAD` → 19 commits (`5a23c51` T-001 … `e03c8d0` T-027), cada uno `feat/test(...): T-0NN — … (RF-NNN)`, con su tarea `[x]` en el mismo commit.
  - CHECKs verificables corridos en verde por tarea (ejemplos): `npx vitest run tests/unit/empty-state.test.tsx` → 7/7; `tokens.test.ts` → 30/30 (AA del enlace reconciliado); `reuse.test.ts -t blog`/`-t productos` → 6/6; `paridad.test.ts -t vanilla` → 56/… con solo el rojo react-markdown (T-022); grep anti-URL de `index.html`/vistas vanilla → vacío (exit 1).
  - **Bloqueo Playwright (sondeo en T-014):** `chrome-headless-shell: error while loading shared libraries: libatk-1.0.so.0: cannot open shared object file`. Además `next build` falla en `tsc` por el import de `markdown.test.ts` hasta T-022. ⇒ ningún e2e corre.
  - **Bloqueo npm (sondeo en T-022):** `npm install` y hasta `npm --version` → `This command requires approval` (no concedible en sesión no interactiva). `npx`/`node`/`git`/`vitest`/`tsc` sí corren.
- **Línea base:** `anchor_commit` **NO** movido (spec sigue `approved`; el ancla se mueve en el cierre verde, T-036, no alcanzado). Drift: 19 commits nuevos; `covers` no re-fijados (0002 es `advisory`). Rebotes del verificador (todos resueltos y cerrados): **T-006** ×2 (colisión de filtro `-t blog`↔`blog-detalle`; flag regex `/s` → TS1501 con target ES2017), **T-007** ×1 (sobre-acoplamiento a nombres `BlogListing`/`ProductListing` inventados), **T-010** ×1 (duplicación byte-a-byte de `site-nav.tsx`), **T-013** ×1 (error falso permanentemente visible en el form). HEAD = `e03c8d0`, rama `0002-estructura-html-catalogo-impl`.
- **Gaps:** (razón nunca vacía)
  - `ABANDON: T-015` (landing carrusel react) — único CHECK es `e2e/landing.spec.ts`; Playwright no arranca (libatk).
  - `ABANDON: T-020` (motion ambas pistas) — CHECK es frame-diff Playwright; no arranca.
  - `ABANDON: T-021` (paridad + revisión visual) — `paridad.test.ts` completo depende del render markdown (T-022); la revisión visual del `experto-ux-ui` necesita render en navegador (Playwright).
  - `ABANDON: T-022 / T-023 / T-024` (núcleo Markdown: Shiki + Mermaid + build vanilla) — requieren `npm install` (shiki, parser markdown, mermaid), no concedible en esta sesión. Es el pivote que mantiene rojos `markdown.test.ts`, `type-check`, `next build`, `paridad` markdown y `reuse` "post individual".
  - `ABANDON: T-025` (contacto funcional react) — CHECK `e2e/contacto.spec.ts` (Playwright).
  - `ABANDON: T-026` (contacto funcional vanilla) — el grep anti-red es verificable, pero "validación + error inline presentes" exige verificación visual del `experto-ux-ui`; no se escribió para no dejar lógica sin verificar (P9).
  - `ABANDON: T-028 / T-029 / T-030 / T-031` (specs e2e) — se pueden escribir pero NO ejecutar (Playwright).
  - `ABANDON: T-032` (`/audit`+`/polish`) — la skill está presente, pero el audit real necesita render.
  - `ABANDON: T-033 / T-034 / T-035` (docs README/CLAUDE.md/AGENTS.md+gallery) — describen la feature COMPLETA (7 vistas + Markdown + Shiki/Mermaid); prematuros y potencialmente inexactos mientras el núcleo Markdown y los e2e no cierren.
  - `ABANDON: T-036` (cierre: mover anchor, gate verde, spec `implemented`) — el gate no puede ir verde con los dos bloqueos; esta entrada es el Session-End parcial que lo sustituye.
- **Riesgo residual:** (1) `type-check`/`next build` siguen rojos por `markdown.test.ts` (TS2307) hasta que T-022 cree `components/markdown/markdown.tsx` — rojo POR DISEÑO de TDD, no defecto; toda verificación de build/e2e lo arrastra. (2) `blog-detalle` (react `[slug]` y vanilla `blog-detalle.html`) muestra PLACEHOLDER hasta que T-022/T-024 generen el render real. (3) El enlace `.md-content a` vanilla usa `--text-secondary` (AA 7.24/6.61) + subrayado en vez de un acento, por falta de token de acento AA-safe en vanilla; el `experto-ux-ui` debe validar la affordance en T-021. (4) Discrepancia de rama sin aclarar: el prompt esperaba `feature/catalogo-estructura-html` pero el worktree está en su hermana `-impl` (ambas partían de `6dc26bd`); aclarar con Carlos antes de cualquier merge. (5) `state.md`/`history.md` traían una entrada "ABANDON 0/36" de la sesión muerta (sin commitear, ya falsa) — reconciliada en este cierre.
- **Próximo paso:** relanzar la sesión de cierre con DOS permisos pre-concedidos: (a) **`npm install`** (allow-list) para añadir shiki + parser markdown + mermaid y ejecutar T-022→T-024; (b) **libs de Playwright** (`npx playwright install-deps chromium` con sudo, o `LD_LIBRARY_PATH` a `~/.cache/pw-libs`) para T-015/020/025/028-031 y el visual de T-021. Orden: T-022→T-024 (desbloquea markdown.test.ts, type-check, next build, paridad markdown) → T-015/020/025/026 → T-028–031 (e2e) → T-021 (paridad+visual) → T-032 → T-033–035 (docs) → T-036 (mover `anchor_commit` al commit de cierre, gate verde, spec `implemented`). No hay decisiones de producto pendientes (enmiendas + plan aprobado resuelven el alcance).
- **Disposición del worktree:** **KEEP** (conservar). Feature incompleta, Converge no cerró. **NO** merge, **NO** push, **NO** PR (instrucción de Carlos/AIRA). 19 commits sanos en `0002-estructura-html-catalogo-impl`, HEAD `e03c8d0`.


- **Fase alcanzada:** specify
- **Rebotes del verificador:** 0 (elicitación directa con Carlos, sin revisor adversarial en esta fase)
- **Directiva de Pausa:** no
- **Drift / re-anchor:** no (spec nueva)
- **Anclas movidas:** 0002-estructura-html-catalogo → ancla inicial en `8731efb`
- **Gate:** verde (19 ok · 0 warn · 0 error)
- **Docs actualizadas:** `specs/0002-estructura-html-catalogo/spec.md` (nuevo), `state.md`
- **Decisiones de diseño / límites de integración:** Fase 1 completa por elicitación interactiva (method.md §3) en chat con Carlos, no en sesión de Claude Code. 7 vistas de ADR-002, una instancia de cada componente, ambas pistas en paralelo (decisión de Carlos). Markdown reutilizable con resaltado de sintaxis + Mermaid self-hosted (P5), único consumidor Blog Detalle; Producto Detalle en texto plano. Control de tema claro/sistema/oscuro: replicar el mecanismo ya existente (vanilla `theme-manager.js`, react `next-themes`), no reinventar. [NEEDS CLARIFICATION] = 0, confirmado "así es".
- **Próximo paso:** Fase 2 (Plan) — `arquitecto` redacta `plan.md`: cómo se construyen ambas pistas en paralelo sin diverger, fronteras del componente Markdown, y secuenciación test-first por RF.

## [2026-10-16] Ratificación Gate 2 + ADR-001 — ADR-002 (catálogo ampliado) accepted
- **Fase alcanzada:** (prompt-directo — decisión humana + doc; no código de producto)
- **Rebotes del verificador:** 0 (decisión humana directa de Carlos, sin revisor adversarial)
- **Directiva de Pausa:** no
- **Drift / re-anchor:** no
- **Anclas movidas:** ninguna
- **Gate:** verde (17 ok · 0 warn · 0 error, sin cambio respecto a la entrada anterior)
- **Docs actualizadas:** `specs/0001-glassmorphism-react/{spec.md,plan.md}` (`aprobaciones.fase_2` ratificado), `decisions/ADR-001-...md` (proposed→accepted + nota de actualización), `decisions/ADR-002-glassmorphism-laboratorio-canonico.md` (nuevo, accepted), `constitution.md` Art. 1/3, `state.md`
- **Decisiones de diseño / límites de integración:** Carlos ratificó Gate 2 y aceptó ADR-001 en chat con AIRA (no en sesión de Claude Code dentro del repo — queda anotado así en los frontmatter correspondientes para trazabilidad). En la misma conversación amplió el alcance del catálogo (validado contra `cjhirashi-career`: navbar/hero/cards/carrusel/footer/blog/productos/contacto en landing; gráficos/alertas/tabla/registro/formularios con tipos de campo reales en admin) y pidió que la animación sea alcance explícito, no un añadido posterior → `ADR-002`. Estrategia elegida: construir una sola vez en `glassmorphism` (vanilla + react, en paridad) y replicar a los otros 20 estilos solo cuando esa estructura cierre.
- **Próximo paso:** Carlos decide el orden de las ~14 specs candidatas del roadmap (`state.md` → Backlog #1); la primera que se abra entra por `autor-de-spec` (Fase 1, elicitación interactiva), empezando probablemente por el sistema de tokens de motion si se sigue el orden fundacional sugerido.

## [2026-10-16] Reparación de harness (deuda de Génesis) — gate en verde
- **Fase alcanzada:** (prompt-directo — mantenimiento de harness, no feature de producto)
- **Rebotes del verificador:** 0 (sin revisor adversarial; es doc/config, no código de producto)
- **Directiva de Pausa:** no
- **Drift / re-anchor:** no
- **Anclas movidas:** ninguna
- **Gate:** verde (17 ok · 0 warn · 0 error, antes 16 ok · 1 warn)
- **Docs actualizadas:** AGENTS.md (311→111 líneas), constitution.md (frontmatter, Art. 2/4/8/10, footer), state.md, `.claude/agents/{autor-de-spec,arquitecto}.md`
- **Decisiones de diseño / límites de integración:** `model: opus` fijado en `autor-de-spec`/`arquitecto` (method.md §7, faltaba). Eliminada duplicación P1-P9 y tabla de roles obsoleta (`especialista-diseño`/`revisor-contraste`, nunca existieron como agentes) de AGENTS.md — canon único en constitution.md Art. 8 y method.md §8. Documentado como hallazgo (no corregido, requiere spec propia): el gate especializado del Art. 4 (symlinks/P3/AA/stylelint/html-validate) nunca se implementó, es solo aspiración. `frontend-design-pro` ya estaba copiado completo en `.claude/skills/`, solo sin commitear — commiteado.
- **Próximo paso:** pendientes humanos sin tocar (Gate 2 + ADR-001 del piloto React, revisión visual, AA/P3 de glassmorphism vanilla, variedad de dashboards, implementar gate especializado Art. 4) — todos quedaron listados en `state.md` Backlog para que Carlos decida.

## [2026-10-16] 0001-glassmorphism-react — ajustes tras revisión visual (spec §6.1)
- **Fase alcanzada:** implement
- **Rebotes del verificador:** 0 (sin nueva ronda del revisor; se recomienda una antes de aprobar)
- **Directiva de Pausa:** no (cambio pedido por Carlos; valores registrados en spec §6.1 antes de tocar código; RNF-004 nuevo)
- **Drift / re-anchor:** no
- **Anclas movidas:** 0001-glassmorphism-react → commit de cierre de estos ajustes
- **Gate:** verde
- **Docs actualizadas:** spec §6.1 + RNF-004, plan (Implementación de RNF-004), tasks T-024..T-026
- **Decisiones de diseño / límites de integración:** Reveal ya no oculta: visible en SSR/sin JS; sólo desplaza y 16→0 si hidrata bajo el pliegue (nunca opacidad). --aurora-ray 0.6 oscuro / violeta 0.5 claro. Claro: --bg-card 0.35, --border-glass violeta 0.16. Etiquetas de galería en bg-glass (regresión de contraste detectada en captura y corregida).
- **Próximo paso:** Carlos revisa visualmente en el dev server; si la aurora en oscuro sigue siendo sutil, el siguiente ajuste es de componente (menos blur/más rayos), no de tokens.

## [2026-10-16] 0001-glassmorphism-react (piloto pista React) — implementado en rama, pendiente de aprobación humana
- **Fase alcanzada:** implement
- **Rebotes del verificador:** 1 (revisor: tabla de cobertura sin cerrar + test-first no demostrable por git; menores en tests de RF-007/RNF-003/RF-005 y drift del plan — todo atendido; test-first queda como excepción declarada en tasks.md)
- **Directiva de Pausa:** no (los desvíos encontrados en Fase 4 se resolvieron dentro del alcance y quedan registrados en spec §6/plan §7: MotionConfig no anula `y` de variantes → CSS motion-reduce; cajón fixed generaba scroll → overflow-x-clip + test de desborde real)
- **Drift / re-anchor:** no
- **Anclas movidas:** 0001-glassmorphism-react → commit de cierre de la rama feature/glassmorphism-react-pilot
- **Gate:** verde (18 ok · 1 warn preexistente: AGENTS.md > 200 líneas)
- **Docs actualizadas:** constitution.md (Art. 2 extensión + nota P5/P6), ADR-001 (nuevo, proposed), AGENTS.md, react/glassmorphism/README.md, gate/services.txt, memory/state.md
- **Decisiones de diseño / límites de integración:** paleta = tokens reales del vanilla (#0b1020/#f5f3ff + violeta/rosa), no #071018 (es de las variantes glass-*); aurora = MagicUI light-rays (no existe "Aurora background"; warp-background no evoca aurora); textos muted/semánticos oscurecidos para AA (P4 > fidelidad).
- **Próximo paso:** Carlos revisa la rama (sin push), ratifica Gate 2 del plan y acepta/rechaza ADR-001; luego AIRA decide si se replica a glass-* (sólo cambiar app/tokens.css).

**Resumen para Carlos (piloto React):**
- *Hecho:* commits separados de Génesis del arnés (nunca commiteada) y de ui-ux-pro-max; rama `feature/glassmorphism-react-pilot`; ADR-001; spec/plan/tasks 0001; app `react/glassmorphism/` (Next 16 App Router, Tailwind v4, next-themes, Motion, MagicUI light-rays, Geist auto-hospedada) con landing + dashboard responsive, tema claro/oscuro/sistema sin FOUC y reduced-motion; Vitest 204 + Playwright 31 en verde.
- *Falta / pendiente humano:* aprobación de Fase 2 (plan) y de ADR-001; revisión visual de Carlos; PR/merge (no se hizo, por instrucción). `frontend-design-pro` no está instalada para Claude Code (vive en workspace-aira/skills); /audit y /polish se aplicaron leyendo su SKILL.md. Su regla "evitar degradados violeta" choca con la identidad del estilo: prevaleció el brief.
- *Probar:* `cd react/glassmorphism && npm install && npm run dev` → http://localhost:3000 y /dashboard. Tests: `npm test`, `npm run test:e2e` (ver README si Chromium no arranca por libs del sistema).

## Session 2026-10-10 (Génesis)

**Evento:** Génesis de harness SDD Anchored para design-html

- **Fase alcanzada:** Génesis completada
- **Qué se hizo:**
  - Copiar harness/reference/ → design-html/.harness/
  - Redactar constitution.md especializada (arquitectura de componentes compartidos + symlinks)
  - Redactar AGENTS.md con roles (especialista-diseño, revisor-contraste)
  - Rellenar memory/state.md
  - Verificar symlinks en 21 estilos (ya existían como copias)

- **Decisiones cristalizadas:**
  - P1-P9 de Constitution
  - Arquitectura: HTML compartido (raíz) + CSS por estilo
  - 21 estilos (15 generales + 6 dashboard + 5 glassmorphism)
  - Variables CSS familia estándar (39 variables, no negociable)
  - Gate especializado: valida synclinks, variables, contraste AA

- **Rebotes del verificador:** 0
- **Status del gate:** Pendiente de ejecutar (requiere npm install + scripts de contraste)
- **Documentación:** 
  - constitution.md ✅
  - AGENTS.md ✅
  - memory/state.md ✅
  - DESIGN-SYSTEM-GALLERY.md en wiki ✅

- **Próximo paso:** 
  1. Ejecutar `bash .harness/gate/check.sh` (requiere npm + html-validate + stylelint)
  2. Crear primer feature (ej. 0001-html-landing o 0004-component-card-expanded)
  3. Especificar cambio en spec.md con criterios EARS
  4. Avanzar a Specify

**Notas:**
- Design-HTML es infraestructura de referencia visual, NO se expone en cjhirashi-srv
- Harness especializado porque requiere validación de sincronización + contraste AA
- Los 21 estilos actualmente tienen copias de index.html/dashboard.html (no symlinks reales)
  → Próximo paso: evaluar si convertir a symlinks o mantener copias (decision para Specify)

---

**Documento:** history.md — Bitácora de Sessions  
**Proyecto:** design-html  
**Creado:** 2026-10-10  
**Estado:** Génesis completada
