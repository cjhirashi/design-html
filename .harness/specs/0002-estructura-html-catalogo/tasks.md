---
id: TASKS-0002
tipo: tasks
feature: 0002-estructura-html-catalogo
estado: draft
actualizado: 2026-10-24
---

# TASKS-0002 · Estructura HTML del catálogo ampliado (laboratorio glassmorphism)

## Reglas
- Cada tarea: ≤ 30 min, un solo propósito, `(cubre RF-NNN)`, zona del patrón (o `[doc]`).
- Orden por dependencias. **Test antes que código.** Al incluir UI, el bloque
  **frontend/maquetación precede** al bloque funcional (plan §6, method §3 Fase 3).
- Cada tarea lleva `CHECK:` (comando exacto que decide si está hecha) y `EXPECT:`.
- `CHECK:` de React desde `react/glassmorphism/`. La pista vanilla no tiene runner
  propio (plan §5): se verifica vía `paridad.test.ts` (react) + revisión visual del
  `experto-ux-ui`.
- Cada fila de `plan.md §8` (Impacto en documentación) → una tarea `[doc]`.

## Tareas

### Bloque A — Contrato primero (integración, tests en rojo)
- [x] T-001 — Fuente única del post de ejemplo `content/blog/estructura-catalogo.md` +
  fixture `tests/fixtures/markdown-showcase.md` con **todas** las construcciones de RF-004
  (h1-h6, negrita/cursiva/tachado, listas ord/desord/anidadas, blockquote, código inline y
  en bloque **con** lenguaje, **un** bloque **sin** lenguaje (RF-015), ≥1 diagrama Mermaid,
  tabla, enlace, imagen **con `alt`** (RF-014), regla horizontal) (cubre RF-004, RF-014, RF-015) [zona: frontera]
  - CHECK: `node -e "const s=require('fs').readFileSync('content/blog/estructura-catalogo.md','utf8'); process.exit(/```mermaid/.test(s)&&/!\[[^\]]+\]\(/.test(s)?0:1)"`
  - EXPECT: exit 0 (el `.md` existe y contiene ≥1 mermaid y ≥1 imagen con alt).
- [x] T-002 — `tests/unit/markdown.test.ts` (rojo): contrato de salida del renderer —
  cada construcción produce su HTML; bloque sin lenguaje → `<pre><code>` sin spans de
  color (RF-015); ninguna `<img>` sin `alt` (RF-014); Mermaid como SVG inline, sin
  `<script>`/URL externa (RF-011) (cubre RF-004, RF-011, RF-014, RF-015) [zona: test]
  - CHECK: `npx vitest run tests/unit/markdown.test.ts`
  - EXPECT: FALLA (rojo) — aún no existe `components/markdown/markdown.tsx`.
- [x] T-003 — `tests/unit/paridad.test.ts` (rojo): declara las **7 vistas** esperadas en
  ambas pistas (rutas react ↔ archivos HTML vanilla) y sus secciones; check anti-URL
  externa (`http(s)://`, `cdn`) sobre los `.html` vanilla; producto-detalle NO usa el
  renderer de Markdown (RF-006) (cubre RF-010, RNF-002) [zona: test]
  - CHECK: `npx vitest run tests/unit/paridad.test.ts`
  - EXPECT: FALLA (rojo) — faltan las vistas nuevas en ambas pistas.
- [x] T-004 — Extender `tests/unit/tokens.test.ts`: contraste AA en claro y oscuro de los
  pares de color que usan las clases/tokens nuevos de esta spec (cubre RF-009, RNF-004) [zona: test]
  - CHECK: `npx vitest run tests/unit/tokens.test.ts`
  - EXPECT: FALLA para los pares nuevos hasta declarar las clases (T-019).
  - ROJO confirmado: 29/30 tests en verde (error-text/text-muted/text-secondary nuevos
    ya cumplen con los tokens P3 existentes); falla únicamente
    "enlace de .md-content (--primary-color) cumple AA sobre --bg-card" en tema oscuro
    (3.78:1 < 4.5). Contrato para T-019: el color del enlace de `.md-content` debe ser
    un token P3 que cumpla AA sobre `--bg-card` en ambos temas (p.ej. `--primary-text`,
    no `--primary-color` crudo) — sin declarar ningún valor de color nuevo.
- [x] T-005 — Extender `tests/unit/literals.test.ts`: prohibir literales de color e inline
  `style` de color en los componentes/vistas nuevos (cubre RNF-003) [zona: test]
  - CHECK: `npx vitest run tests/unit/literals.test.ts`
  - EXPECT: FALLA mientras algún componente nuevo no exista / tenga literal.
  - ROJO confirmado: 72/78 en verde (escaneo global existente intacto); fallan las 6
    aserciones de existencia nuevas — `components/glass/{post-card,product-card,field,
    empty-state}.tsx` y `components/markdown/{markdown.tsx,prose.ts}` aún no existen.
- [x] T-006 — Extender `tests/unit/reuse.test.ts`: Blog/Productos usan `post-card`/
  `product-card`; Contacto usa `field` con error inline; las 7 vistas reusan los
  componentes compartidos (cubre RF-003, RF-005, RF-013) [zona: test]
  - CHECK: `npx vitest run tests/unit/reuse.test.ts`
  - EXPECT: FALLA (rojo) — los componentes nuevos aún no se importan.
  - ROJO confirmado: 33/51 en verde (landing/dashboard existentes intactos); fallan las
    18 aserciones nuevas — blog/productos aún no importan `post-card`/`product-card` ni
    reusan navbar/footer; el post individual no importa `markdown`/`prose`; la ficha de
    producto no reusa navbar/footer; contacto no importa/renderiza `field` con error inline.
  - Naming de describes/tests cuidado a propósito para que `-t blog` y `-t productos`
    (tal cual los usan T-009/T-010) seleccionen SOLO el listado correspondiente: el
    detalle se describe como "post individual · ..." y "ficha de producto · ..." (sin el
    substring "blog"/"productos" en ningún título de test, incluidas las etiquetas del
    `it.each` transversal). Verificado: `-t blog` → 6 tests (describe blog + 2 del bloque
    transversal "listado de blog"), ninguno de "post individual"; `-t productos` → 6
    tests equivalentes, ninguno de "ficha de producto".
  - Amendment #2: quitado el flag `s` (dotAll, requiere ES2018+) del regex de la
    aserción de error inline de `field` (línea ~159) — innecesario, el patrón no usa
    `.`; `[^>]*` ya cruza saltos de línea sin ese flag. Auditado el resto del archivo:
    sin otros flags `s`/`u`/`d`. `npm run type-check` limpio para `reuse.test.ts` (el
    único error restante es `markdown.test.ts` por el módulo `@/components/markdown/
    markdown` ausente, preexistente de T-002, se resuelve en T-022). Vitest sigue en
    18 failed/33 passed; `-t blog`/`-t productos` sin regresión.
- [x] T-007 — `tests/unit/empty-state.test.tsx` (rojo): Blog y Productos con lista vacía
  renderizan `empty-state` (RF-012) (cubre RF-012) [zona: test]
  - CHECK: `npx vitest run tests/unit/empty-state.test.tsx`
  - EXPECT: FALLA (rojo) — `empty-state.tsx` aún no existe.
  - ROJO confirmado: la suite falla entera al resolver `@/components/glass/empty-state`
    (`Failed to resolve import ... Does the file exist?`, vite:import-analysis) — módulo
    ausente, como T-002. Asertos definidos: (1) `EmptyState` muestra mensaje visible en
    español (prop `message` y texto por defecto) con `role="status"`; (2) Blog/Productos
    listado: patrón laxo igual a `reuse.test.ts` — vía `ownSources()`/`source.ts` se
    asevera que ALGÚN archivo bajo `app/blog/`/`app/productos/` importa
    `@/components/glass/empty-state` y renderiza `<EmptyState`, sin fijar nombre/ruta de
    componente contenedor (T-009/T-010 pueden inlinear el grid en `page.tsx` o extraerlo
    con el nombre que prefieran). Amendment #1 (revisor): se quitó el import directo de
    `BlogListing`/`ProductListing` con ruta/nombre inventados (sobre-acoplamiento) y se
    sustituyó por el patrón de código fuente. Doble causa de rojo verificada: `app/blog/`
    y `app/productos/` tampoco existen todavía (confirmado por listado de `app/`), así
    que esos dos `describe` fallarían por ausencia real de archivos aun si el import de
    `EmptyState` se resolviera.

### Bloque B — Frontend / maquetación primero (ambas pistas, datos simulados, sin lógica)
- [x] T-008 — React, presentacionales nuevos (datos simulados): `components/glass/
  post-card.tsx`, `product-card.tsx`, `empty-state.tsx`, `field.tsx` (error inline)
  (cubre RF-003, RF-005, RF-012, RF-013) [zona: frontend]
  - CHECK: `npm run type-check`
  - EXPECT: type-check limpio; los 4 componentes existen y exportan.
  - Hecho: 4 componentes creados sin lógica de negocio (presentacional puro, datos vía
    props). `type-check` limpio salvo el rojo preexistente de `tests/unit/markdown.test.ts`
    (T-002, se resuelve en T-022) — confirmado por grep sin coincidencias de
    post-card/product-card/empty-state/field. `empty-state.test.tsx` primer describe (3
    tests, componente base) en verde; `literals.test.ts` las 4 aserciones de existencia +
    sin-literales de los componentes nuevos en verde (solo quedan rojas
    markdown.tsx/prose.ts, T-022). Fallas restantes en reuse/tokens son de tareas
    posteriores (rutas app/blog, app/productos, app/contacto aún no existen; rojo de
    --primary-color documentado para T-019) — no las toca esta tarea.
- [ ] T-009 — React Blog listado: `app/blog/page.tsx` + `app/blog/_components/` +
  `content/blog.ts` (grid de `post-card`, imagen/título/extracto/fecha) (cubre RF-003) [zona: frontend]
  - CHECK: `npx vitest run tests/unit/reuse.test.ts -t blog`
  - EXPECT: la parte de Blog pasa (usa `post-card`).
- [ ] T-010 — React Productos listado: `app/productos/page.tsx` +
  `app/productos/_components/` + `content/productos.ts` (grid `product-card`) (cubre RF-005) [zona: frontend]
  - CHECK: `npx vitest run tests/unit/reuse.test.ts -t productos`
  - EXPECT: la parte de Productos pasa (usa `product-card`).
- [ ] T-011 — React Producto detalle **texto plano**: `app/productos/[slug]/page.tsx`
  (descripción como string, **sin** `<Markdown>`) (cubre RF-006) [zona: frontend]
  - CHECK: `npx vitest run tests/unit/paridad.test.ts -t "producto-detalle sin markdown"`
  - EXPECT: pasa (producto-detalle no referencia el renderer).
- [ ] T-012 — React Blog detalle (maqueta): `app/blog/[slug]/page.tsx` +
  `components/markdown/prose.ts` (clases sobre tokens P3; placeholder del cuerpo hasta
  T-023) (cubre RF-004) [zona: frontend]
  - CHECK: `npm run type-check`
  - EXPECT: type-check limpio; la ruta `[slug]` existe.
- [ ] T-013 — React Contacto (maqueta): `app/contacto/page.tsx` +
  `_components/contact-form.tsx` con campos `field` (sin lógica de validación aún)
  (cubre RF-007, RF-013) [zona: frontend]
  - CHECK: `npm run type-check`
  - EXPECT: type-check limpio; el form renderiza campos con `field`.
- [ ] T-014 — React Dashboard a 5 bloques: 1 gráfico de líneas (SVG estático inline, sin
  librería de charts), 1 alerta, 1 tabla (dataset fijo), 1 vista de registro/detalle, 1
  formulario placeholder (texto+select+boolean) con `field` (cubre RF-002) [zona: frontend]
  - CHECK: `npx playwright test e2e/vistas.spec.ts -g dashboard`
  - EXPECT: el dashboard muestra los 5 bloques (tras T-029 escribir el spec).
- [ ] T-015 — React Landing: completar carrusel/galería con imágenes locales en
  `public/gallery/` vía `next/image` (cubre RF-001) [zona: frontend]
  - CHECK: `npx playwright test e2e/landing.spec.ts`
  - EXPECT: landing con galería; sin regresiones del spec existente.
- [ ] T-016 — Vanilla imágenes locales: `glassmorphism/assets/` + migrar el carrusel del
  landing de **Unsplash remoto → local** en `glassmorphism/index.html` (cierra P5)
  (cubre RF-001, RNF-002) [zona: frontend]
  - CHECK: `grep -RIl -E "https?://|unsplash|cdn" glassmorphism/index.html`
  - EXPECT: sin coincidencias (grep devuelve vacío / exit 1).
- [ ] T-017 — Vanilla vistas nuevas HTML: `blog.html`, `productos.html`,
  `producto-detalle.html`, `contacto.html` con bloque `#themeSwitcher` de 3 botones,
  carga de `../js/theme-manager.js` + `../js/nav-toggle.js`, datos materializados en
  español (cubre RF-003, RF-005, RF-006, RF-007, RF-008) [zona: frontend]
  - CHECK: `npx vitest run tests/unit/paridad.test.ts -t vanilla`
  - EXPECT: las 4 vistas vanilla existen con sus secciones y el switcher.
- [ ] T-018 — Vanilla `blog-detalle.html` (maqueta) con placeholder del Markdown (se
  regenera en T-025) + `#themeSwitcher` (cubre RF-004) [zona: frontend]
  - CHECK: `test -f glassmorphism/blog-detalle.html && grep -q md-content glassmorphism/blog-detalle.html`
  - EXPECT: exit 0.
- [ ] T-019 — Clases nuevas en `glassmorphism/css/style.css` (`.blog-grid`/`.post-card`/
  `.product-grid`/`.product-card`/`.md-content *`/`.field`/`.field-error`/`.empty-state`),
  **solo variables P3** (sin valores de color nuevos) (cubre RF-009, RNF-003) [zona: tokens]
  - CHECK: `npx vitest run tests/unit/tokens.test.ts tests/unit/literals.test.ts`
  - EXPECT: AA de los pares nuevos pasa; sin literales de color.
- [ ] T-020 — Motion (P10, directiva de Carlos — sin RF nuevo): microinteracciones de las
  vistas nuevas (reveal de entrada, hover de `post-card`/`product-card`, transición del
  estado de éxito del form) reusando el easing existente; **ambas pistas** (react
  `MotionConfig`/`motion`, vanilla Motion vendorizado ADR-003); **respeta
  `prefers-reduced-motion`** (cubre RF-008) [zona: frontend]
  - CHECK: `npx playwright test e2e/vistas.spec.ts -g motion` (frame-diff en 2 capturas ≥1s; con reduce → sin diferencia, method §5)
  - EXPECT: movimiento perceptible por diff de píxeles; con `prefers-reduced-motion` el diff ≈ 0.
- [ ] T-021 — Correr `paridad.test.ts` tras el bloque frontend + **revisión visual del
  `experto-ux-ui`** de las 7 vistas en claro/oscuro y a 900px, ambas pistas (plan §5)
  (cubre RF-010) [zona: frontend]
  - CHECK: `npx vitest run tests/unit/paridad.test.ts` + informe del `experto-ux-ui`
  - EXPECT: paridad verde; informe visual sin hallazgos Critical/High.

### Bloque C — Implementación funcional (nunca antes del frontend)
- [ ] T-022 — React componente Markdown `components/markdown/markdown.tsx` + frontera
  **Shiki** (resaltado en build/servidor; cero JS de resaltado en cliente); bloque sin
  lenguaje → monoespaciado sin resaltado (RF-015) (cubre RF-004, RF-011, RF-015) [zona: frontera]
  - CHECK: `npx vitest run tests/unit/markdown.test.ts`
  - EXPECT: pasa salvo la parte de Mermaid (T-023).
- [ ] T-023 — Frontera **Mermaid**: pre-render a **SVG inline** en build-time (paquete
  npm, nunca CDN) e incrustación en el output (cubre RF-004, RF-011) [zona: frontera]
  - CHECK: `npx vitest run tests/unit/markdown.test.ts -t mermaid`
  - EXPECT: el output del diagrama es `<svg …>` inline, sin `<script>`/URL externa.
- [ ] T-024 — Script de build vanilla `react/glassmorphism/scripts/build-vanilla-markdown.mjs`
  que genera `glassmorphism/blog-detalle.html` desde la **misma fuente `.md`** (mismo
  HTML de Shiki + mismo SVG de Mermaid) (cubre RF-004, RF-010, RF-011) [zona: frontera]
  - CHECK: `node scripts/build-vanilla-markdown.mjs && npx vitest run tests/unit/paridad.test.ts -t markdown`
  - EXPECT: el bloque Markdown de `blog-detalle.html` coincide con el output del componente.
- [ ] T-025 — React Contacto funcional: validación en cliente en `contact-form.tsx`,
  `onSubmit` previene default, éxito simulado **sin red**, error **junto al campo**
  (RF-013) (cubre RF-007, RF-013) [zona: backend]
  - CHECK: `npx playwright test e2e/contacto.spec.ts`
  - EXPECT: válido → éxito sin petición de red; inválido → error inline.
- [ ] T-026 — Vanilla Contacto funcional: validación en cliente (script propio sin red),
  estado de éxito simulado y `.field-error` por campo (cubre RF-007, RF-013) [zona: backend]
  - CHECK: `grep -RIL -E "fetch\\(|XMLHttpRequest|https?://" glassmorphism/contacto.html`
  - EXPECT: sin llamadas de red; validación y error inline presentes (verificación visual experto-ux-ui).
- [ ] T-027 — Estados vacíos funcionales Blog/Productos (toggle según datos), ambas pistas
  (cubre RF-012) [zona: backend]
  - CHECK: `npx vitest run tests/unit/empty-state.test.tsx`
  - EXPECT: pasa (lista vacía → `empty-state`).

### Bloque D — Pruebas de sistema (e2e)
- [ ] T-028 — `e2e/vistas.spec.ts`: 5 vistas nuevas con switcher 3-vías presente;
  dashboard con los 5 bloques; render sin error (cubre RF-002, RF-008) [zona: test]
  - CHECK: `npx playwright test e2e/vistas.spec.ts`
  - EXPECT: verde.
- [ ] T-029 — `e2e/contacto.spec.ts`: envío válido → éxito; inválido → error junto al
  campo; sin peticiones de red (cubre RF-007, RF-013) [zona: test]
  - CHECK: `npx playwright test e2e/contacto.spec.ts`
  - EXPECT: verde.
- [ ] T-030 — Extender `e2e/network.spec.ts`: cargar `blog-detalle` no dispara ninguna
  petición a host externo (Shiki/Mermaid ya resueltos) (cubre RF-011, RNF-002) [zona: test]
  - CHECK: `npx playwright test e2e/network.spec.ts`
  - EXPECT: 0 peticiones externas en todas las vistas nuevas.
- [ ] T-031 — Extender `e2e/responsive.spec.ts`: vistas nuevas a 375/768/900/1280 sin
  desbordes (cubre RF-008) [zona: test]
  - CHECK: `npx playwright test e2e/responsive.spec.ts`
  - EXPECT: verde en todos los breakpoints.

### Bloque E — Audit, documentación y cierre
- [ ] T-032 — `/audit` + `/polish` (`frontend-design-pro`, verificada instalada en
  `.claude/skills/`) sobre las vistas nuevas + corregir hallazgos (cubre RF-009) [zona: frontend]
  - CHECK: `ls .claude/skills/frontend-design-pro >/dev/null && echo audit-ok`
  - EXPECT: skill presente; hallazgos del audit atendidos.
- [ ] T-033 — `[doc]` Actualizar `react/glassmorphism/README.md`: alcance 7 vistas +
  componente Markdown + fronteras Shiki/Mermaid + "cómo portar" [doc]
  - CHECK: `grep -qi "7 vistas\|markdown\|shiki" react/glassmorphism/README.md`
  - EXPECT: exit 0.
- [ ] T-034 — `[doc]` `CLAUDE.md`: sección breve — ubicación del Markdown por pista, lista
  de 7 vistas, regla "una instancia, variantes después" [doc]
  - CHECK: `grep -qi "markdown\|7 vistas\|una instancia" CLAUDE.md`
  - EXPECT: exit 0.
- [ ] T-035 — `[doc]` Verificar `AGENTS.md` (sin cambio estructural) y
  `DESIGN-SYSTEM-GALLERY.md` (ampliar si lista vistas de glassmorphism) [doc]
  - CHECK: revisión manual + `git diff --stat AGENTS.md DESIGN-SYSTEM-GALLERY.md`
  - EXPECT: AGENTS.md sin cambio; gallery ampliada solo si listaba vistas.
- [ ] T-036 — `[doc]` Session-End en `.harness/memory/history.md` (5 partes) + reescritura
  de `.harness/memory/state.md` + mover `anchor_commit` al commit de cierre [doc]
  - CHECK: `.harness/gate/check.sh`
  - EXPECT: compuerta abierta (0 errores); trazabilidad de 0002 completa.

## Cobertura (el gate exige 100 %; `Estado` lo rellena el gate)
| RF / doc | Tareas | Test(s) | Estado |
|---|---|---|---|
| RF-001 | T-015, T-016 | e2e/landing.spec.ts | Pendiente |
| RF-002 | T-014, T-028 | e2e/vistas.spec.ts | Pendiente |
| RF-003 | T-006, T-008, T-009 | tests/unit/reuse.test.ts, paridad.test.ts | Pendiente |
| RF-004 | T-001, T-002, T-012, T-018, T-022, T-023, T-024 | tests/unit/markdown.test.ts, paridad.test.ts | Pendiente |
| RF-005 | T-006, T-008, T-010 | tests/unit/reuse.test.ts, paridad.test.ts | Pendiente |
| RF-006 | T-011, T-017 | tests/unit/paridad.test.ts | Pendiente |
| RF-007 | T-013, T-025, T-026, T-029 | e2e/contacto.spec.ts | Pendiente |
| RF-008 | T-017, T-020, T-028, T-031 | e2e/vistas.spec.ts, responsive.spec.ts | Pendiente |
| RF-009 | T-004, T-019, T-032 | tests/unit/tokens.test.ts | Pendiente |
| RF-010 | T-003, T-021, T-024 | tests/unit/paridad.test.ts | Pendiente |
| RF-011 | T-002, T-022, T-023, T-024, T-030 | tests/unit/markdown.test.ts, e2e/network.spec.ts | Pendiente |
| RF-012 | T-007, T-009, T-010, T-027 | tests/unit/empty-state.test.tsx | Pendiente |
| RF-013 | T-006, T-013, T-025, T-026, T-029 | e2e/contacto.spec.ts, reuse.test.ts | Pendiente |
| RF-014 | T-001, T-002 | tests/unit/markdown.test.ts | Pendiente |
| RF-015 | T-001, T-002, T-022 | tests/unit/markdown.test.ts | Pendiente |
| RNF-001 | T-028, T-029, T-030, T-031, T-036 | gate/check.sh (node block) | Pendiente |
| RNF-002 | T-003, T-016, T-030 | e2e/network.spec.ts, paridad.test.ts (anti-URL) | Pendiente |
| RNF-003 | T-005, T-019 | tests/unit/literals.test.ts | Pendiente |
| RNF-004 | T-004 | tests/unit/tokens.test.ts | Pendiente |
| doc: README pista React | T-033 | — | Pendiente |
| doc: CLAUDE.md | T-034 | — | Pendiente |
| doc: AGENTS.md / gallery | T-035 | — | Pendiente |
| doc: memoria (state/history) | T-036 | — | Pendiente |

> Esta tabla **es** la trazabilidad de la feature. Fila sin test, en `Fail` o
> `Pendiente` → el gate no abre. T-020 (Motion, P10) es directiva de Carlos: no añade
> `RF-` nuevo (tokens de motion formales son spec posterior, SPEC §2) — se apoya en RF-008.
