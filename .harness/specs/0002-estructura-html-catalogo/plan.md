---
id: PLAN-0002
tipo: plan
feature: 0002-estructura-html-catalogo
estado: approved
aprobaciones:
  fase_2: { por: "AIRA (autoridad delegada por Carlos, Modo 2; Carlos revisó plan.md y confirmó Art. 1-11 incl. P10 Motion)", fecha: 2026-10-24 }
actualizado: 2026-10-24
---

# PLAN-0002 · Estructura HTML del catálogo ampliado (laboratorio glassmorphism)

> El *cómo*. Traduce cada `RF-` del SPEC-0002 al patrón de la Constitución Art. 1–2
> ("componentes visuales compartidos + parametrización por estilo", con la pista React
> paralela de ADR-001), en **dos pistas en paridad estructural** (RF-010): vanilla
> (`glassmorphism/`) y React (`react/glassmorphism/`).

## 0. Gates de simplicidad
- [x] **Simplicity** — Una sola instancia de cada componente (sin variantes, SPEC §2).
  Se extiende la estructura existente de cada pista (2 vistas → 7 vistas) reusando el
  theme-manager/`next-themes` que ya funcionan; no se introduce ningún framework nuevo
  de temas ni de ruteo.
- [x] **Anti-Abstraction** — El componente Markdown es **un** módulo por pista, no un
  sistema genérico de contenido. El resaltado y Mermaid se resuelven con el mínimo
  (Shiki + Mermaid vendorizados), sin capa de abstracción de "motor de documentos".
- [x] **Integration-First** — El contrato real de esta feature es el **HTML renderizado
  del Markdown** (qué etiquetas produce cada construcción: h1-h6, `<pre><code>`, SVG de
  Mermaid, tablas…). Ese contrato se fija como *fixture* y su test antes de escribir las
  7 vistas que lo consumen. La paridad vanilla↔react (RF-010) también es contrato y se
  testea.

## 1. Cumplimiento constitucional
| Artículo | Cómo lo respeta este plan |
|---|---|
| **Art. 1–2 (patrón)** | Se mantiene la pista vanilla (`glassmorphism/`) como fuente de verdad visual y la pista React paralela (ADR-001) en paridad (RF-010). "Mismos componentes, distintos tokens": el estilo sigue viviendo solo en `glassmorphism/css/style.css` (vanilla) y `react/glassmorphism/app/tokens.css` (react); las 5 vistas nuevas no añaden valores de color propios. **No se tocan los otros 20 estilos** (SPEC §2). No se migra a symlinks (sigue siendo trabajo futuro con su propia spec, Constitución Art. 2 nota de estado). |
| **Art. 3 (vistas)** | Se completan las 7 vistas de ADR-002 con una instancia de cada componente (landing ya existe parcialmente; se le añade el carrusel/galería que falte; dashboard ya existe y se le ajusta a 1 gráfico + 1 alerta + 1 tabla + 1 detalle + 1 formulario placeholder; Blog listado, Blog detalle, Productos listado, Producto detalle y Contacto son nuevas). |
| **Art. 5 (seguridad)** | Sin backend ni estado (sitio estático de referencia). El formulario de contacto valida en cliente y simula éxito/error sin red (SPEC §3, RF-007). **Sin recursos de red externos en runtime** (RNF-002, P5): Shiki y Mermaid se ejecutan en build-time/self-hosted y nunca se cargan de un CDN (RF-011). Las imágenes de ejemplo se sirven localmente (hoy el landing vanilla usa Unsplash remoto en el carrusel → se vendoriza a local, ver RF-001). |
| **Art. 8 P3/P4 (RF-009, RNF-003/004)** | Toda sección nueva usa exclusivamente la familia P3 ya declarada en `css/style.css` / `tokens.css`; un test de contraste AA en claro y oscuro la valida en la pista react (extiende `tokens.test.ts`). Vanilla: ver §5 (declaración explícita de la brecha de tooling). **El bug de contraste AA preexistente de glassmorphism vanilla queda fuera** (SPEC §2, es `1001-*`). |
| **Art. 8 P5/P6 (equiv. ADR-001)** | Fuentes del sistema (vanilla) / `geist` vía `next/font` (react); colores solo vía variables/tokens; sin inline styles de color; sin `<link>` a CDNs. El contenido Markdown nunca referencia imágenes sin `alt` (RF-014). |
| **Art. 8 P7** | Copy en español, datos reales de dominio, sin lorem ipsum, en `content/*.ts` (react) y directamente en el HTML/fixtures (vanilla). |
| **Art. 8 P8** | Commits `feat:/test:/docs:/style: … (RF-NNN)`. |
| **Art. 11 (doc)** | Ver §8. |

## 2. Arquitectura de la feature  *(según el patrón elegido)*

El patrón de la Constitución es **"componentes visuales compartidos + parametrización por
estilo"**, con dos pistas (vanilla / React, ADR-001). No es hexagonal ni por-capas de
backend: sus "zonas" son **estructura/maquetación compartida**, **tokens de estilo** (lo
único que cambia por estilo) y **fronteras hacia recursos locales** (Markdown, resaltado,
Mermaid, imágenes). Se describen por pista.

### Zona A — Estructura/maquetación compartida (equivale a `index.html`+`base`/componentes)

**Vanilla** — `glassmorphism/` (archivos reales, no symlinks aún):
- Vistas (una por archivo HTML, cargan `../js/theme-manager.js` + `../js/nav-toggle.js`
  y `css/style.css` como ya hace `index.html`):
  - `glassmorphism/index.html` — Landing (existe; se completa).
  - `glassmorphism/dashboard.html` — Dashboard (existe; se ajusta a los 5 bloques).
  - `glassmorphism/blog.html` — Blog listado (nuevo).
  - `glassmorphism/blog-detalle.html` — Blog detalle (nuevo, consume el Markdown render).
  - `glassmorphism/productos.html` — Productos listado (nuevo).
  - `glassmorphism/producto-detalle.html` — Producto detalle, texto plano (nuevo).
  - `glassmorphism/contacto.html` — Contacto (nuevo).
- CSS: todas las clases nuevas de estas vistas se añaden a `glassmorphism/css/style.css`
  (único CSS del estilo; **no** se crea `css/base.css` en la raíz — no existe hoy y
  crearlo sería una feature de arquitectura aparte).

**React** — `react/glassmorphism/` (App Router, convención `_landing/`/`_components/` ya
usada). Rutas nuevas bajo `app/`:
- `app/page.tsx` — Landing (existe; se completa).
- `app/dashboard/page.tsx` + `app/dashboard/_components/` — Dashboard (existe; se ajusta).
- `app/blog/page.tsx` + `app/blog/_components/` — Blog listado (nuevo).
- `app/blog/[slug]/page.tsx` — Blog detalle (nuevo; consume `<Markdown>`).
- `app/productos/page.tsx` + `app/productos/_components/` — Productos listado (nuevo).
- `app/productos/[slug]/page.tsx` — Producto detalle, texto plano (nuevo).
- `app/contacto/page.tsx` + `app/contacto/_components/contact-form.tsx` — Contacto (nuevo).
- Componentes de presentación reutilizables (hermanos de los `glass/` existentes):
  `components/glass/post-card.tsx`, `product-card.tsx`, `empty-state.tsx`,
  `field.tsx` (campo de formulario con error inline, RF-013). Se reutilizan los
  existentes (`navbar`, `sidebar`, `glass-card`, `data-table`, `alert`, `metric`,
  `media-card`, `section-heading`, `theme-switch`, `reveal`, `surface.ts`).

### Zona B — Tokens de estilo (lo único que cambia por estilo)
- Vanilla: `glassmorphism/css/style.css` (`:root` + `[data-theme="dark"]`, familia P3 ya
  completa). No cambia de valores; solo se añaden **clases** nuevas que usan las variables.
- React: `app/tokens.css` (sin cambios de valores) + `app/globals.css` (`@theme inline`;
  se exponen como utilidades Tailwind los tokens que las vistas nuevas necesiten si falta
  alguno). Ningún valor de color nuevo fuera de estos dos archivos (RNF-003).

### Zona C — Componente Markdown reutilizable (nuevo, RF-004) — *decisión de ubicación*
No es una feature de blog: es una **capacidad general de texto enriquecido** (SPEC §6,
cita de Carlos). Por eso vive fuera de la carpeta de la vista de blog en ambas pistas:

- **Vanilla** — `js/markdown-renderer.js` (compartido, junto a `theme-manager.js` y
  `nav-toggle.js` en la raíz) + sus estilos en una sección `/* Markdown */` de
  `glassmorphism/css/style.css` (clases `.md-content h1…`, `.md-content pre code`, etc.,
  todas basadas en variables P3). Como la pista vanilla **no tiene toolchain de build ni
  npm** (verificado: no hay `package.json`), el Markdown de ejemplo se entrega
  **pre-renderizado a HTML estático** por un script de build Node local (ver Zona D);
  `markdown-renderer.js` en runtime solo se encarga de inicializar los diagramas si se
  optara por SVG inline (no hay JS de parseo de Markdown en el navegador → P5 intacto).
- **React** — `components/markdown/markdown.tsx` (componente `<Markdown source={...}/>`),
  hermano de `components/glass/`, no dentro de `app/blog/`. Resaltado y Mermaid como
  fronteras (Zona D). Estilos vía `@tailwindcss/typography` NO (añade dependencia y color
  propio); en su lugar un módulo de clases sobre tokens P3 (`components/markdown/prose.ts`).

### Zona D — Fronteras de salida (recursos locales, nunca CDN)
| Frontera | Para qué | Implementación concreta (sin red, RF-011/RNF-002) |
|---|---|---|
| Resaltado de sintaxis | Código en bloque de Markdown (RF-004) | **Shiki**, resaltado en build/servidor. React: `shiki` en `dependencies`, invocado en un Server Component / en build → el HTML ya trae los `<span>` con color; cero JS de resaltado en el cliente. Vanilla: Shiki corre en el script de build Node local y emite el mismo HTML estático a `blog-detalle.html`. Bloques **sin lenguaje declarado se emiten en monoespaciado simple, sin resaltado** (RF-015). |
| Diagramas Mermaid | Al menos un diagrama en el Markdown (RF-004) | **Mermaid vendorizado** (paquete npm, no CDN). Pre-renderizado a **SVG estático en build-time** (`@mermaid-js/mermaid-cli`/API de Mermaid en Node) e incrustado como SVG inline en el HTML/JSX. Así ninguna de las dos pistas descarga Mermaid en runtime (RNF-002); el SVG es idéntico en ambas → ayuda a la paridad RF-010. |
| Imágenes de ejemplo | Blog, productos, galería del landing y Markdown | Servidas localmente: React `public/` + `next/image`; vanilla `glassmorphism/assets/` (nueva carpeta). **Se elimina la dependencia de Unsplash remoto** del carrusel actual del landing vanilla (hoy incumple P5). Toda imagen con `alt` obligatorio (RF-014). |
| Contenido de maqueta | Posts, productos, copy (español, RF P7) | React: `content/blog.ts`, `content/productos.ts`, `content/contacto.ts` (tipados). Vanilla: el mismo contenido materializado directo en los HTML + los fixtures de Markdown. |

### Fuente única del Markdown de ejemplo (contrato de paridad)
Para que vanilla y react rendericen **el mismo contenido** (RF-010) y no diverjan, el
cuerpo Markdown del post de ejemplo vive en un único fichero fuente:
`react/glassmorphism/content/blog/<slug>.md` (o `.ts` con la cadena). El script de build
vanilla lee ese mismo `.md` para generar `blog-detalle.html`. Una sola fuente → cero
divergencia de contenido entre pistas.

## 3. Modelo de datos
- Sin persistencia ni backend (SPEC §3). Datos de maqueta tipados en `content/*.ts`
  (react) y materializados en HTML (vanilla).
- El "modelo" relevante es el **contrato de salida del renderer de Markdown**: para cada
  construcción de RF-004 (h1-h6, énfasis/negrita/cursiva/tachado, listas ord/desord/
  anidadas, blockquote, código inline y en bloque con resaltado, diagrama Mermaid, tablas,
  enlaces, imágenes con `alt`, regla horizontal) se fija qué HTML debe producir. Ese
  contrato es el fixture `tests/fixtures/markdown-showcase.md` + su HTML esperado.

## 4. Contratos
| Archivo en `contracts/` | Frontera | Gate(s) de CI |
|---|---|---|
| — (no hay API/MCP/eventos) | — | No aplica contrato REST (SPEC §3; gate `3·Anclaje` ya reporta "sin openapi.yaml committeado"). |
| `react/glassmorphism/tests/fixtures/markdown-showcase.md` + `tests/unit/markdown.test.ts` | Salida del componente Markdown (RF-004/011/014/015) | Vitest (`react/glassmorphism:node` del gate corre `type-check` + Vitest). |
| Paridad vanilla↔react | RF-010 | Test de paridad (ver §5, zona Sistema): lista de vistas y de secciones comparada entre ambas pistas. |

## 5. Estrategia de pruebas (por zona del patrón)

### Pista React — con el tooling ya configurado (Vitest + Playwright, PLAN-0001 §5)
| Zona | Qué se prueba | Herramienta |
|---|---|---|
| Tokens | Familia P3 completa en ambos temas + contraste AA de las clases/tokens nuevos (RF-009, RNF-003/004) | Vitest — extiende `tests/unit/tokens.test.ts` |
| Markdown (frontera) | El showcase produce cada construcción de RF-004; bloque sin lenguaje → sin resaltado (RF-015); toda `<img>` del contenido tiene `alt` (RF-014); Mermaid se emite como SVG inline (no `<script>` a CDN, RF-011) | Vitest — `tests/unit/markdown.test.ts` |
| Componentes base (reuso/paridad) | Las 7 vistas reusan los componentes compartidos; no literales de color ni `style`; Blog/Productos usan `post-card`/`product-card`; Contacto usa `field` con error inline (RF-013) | Vitest — extiende `tests/unit/reuse.test.ts` y `literals.test.ts` |
| Estados vacíos | Blog y Productos listado con lista vacía muestran `empty-state` (RF-012) | Vitest + Testing Library — `tests/unit/empty-state.test.tsx` |
| Formulario | Validación en cliente: envío válido → éxito simulado sin red (RF-007); inválido → error junto al campo (RF-013) | Playwright — `e2e/contacto.spec.ts` |
| Sistema | Tema de 3 vías presente en las 5 vistas nuevas + responsive 900px (RF-008); sin peticiones externas en ninguna vista nueva incl. Shiki/Mermaid (RF-011/RNF-002) | Playwright — `e2e/vistas.spec.ts`, extiende `e2e/network.spec.ts` y `e2e/responsive.spec.ts` |
| Paridad (RF-010) | Vanilla y react declaran las mismas 7 vistas y las mismas secciones por vista; mismo contenido de post | Vitest — `tests/unit/paridad.test.ts` (lee el árbol vanilla y la lista de rutas react) |

### Pista Vanilla — brecha de tooling declarada explícitamente
**La pista vanilla NO tiene `package.json`, ni `html-validate`, ni `stylelint`, ni
ningún runner** (verificado 2026-10-24; el gate genérico de SDD Anchored no valida HTML/
CSS vanilla — su bloque `5·Bloques por perfil` solo cubre `react/glassmorphism:node`).
Montar ese tooling es trabajo no trivial con su propia spec (Constitución Art. 4 lo marca
como OBJETIVO, no implementado). Por tanto, **esta feature no introduce un runner de tests
para vanilla**. La verificación de la pista vanilla en esta spec es:
- **Manual, por el `experto-ux-ui`** (P9): revisa las 7 vistas vanilla en claro/oscuro y a
  900px contra sus equivalentes react, y confirma RF-009/012/013/014/015 visualmente.
- **Automática indirecta**: `tests/unit/paridad.test.ts` (react) lee los HTML vanilla y
  verifica que las vistas y secciones existen y que el SVG de Mermaid y el HTML de Shiki
  en `blog-detalle.html` coinciden con los del fixture (misma fuente, Zona D) → detecta
  divergencia estructural sin necesitar un runner propio en vanilla.
- **P5 en vanilla**: un check de "sin URLs externas" sobre los HTML vanilla se añade al
  mismo `paridad.test.ts` (grep de `http://`/`https://`/`cdn` en los `.html`), para cerrar
  RNF-002 también del lado vanilla sin montar html-validate.

> Si Carlos quiere cobertura automática real de la pista vanilla (html-validate +
> stylelint + contrast-check), es la spec de Art. 4 "Gate de Design-HTML especializado",
> independiente de esta — se declara como fuera de alcance aquí, no se improvisa.

## 6. Secuenciación de archivos
Regla dura (method.md §147-159, decisión de Carlos 2026-10-23): **tests antes que código**
y, al incluir UI, **el bloque de frontend/maquetación va primero** (contra el sistema de
diseño de referencia, con datos simulados), y la **implementación funcional después, nunca
al revés**. Para esta feature, "funcional" = validación del formulario (RF-007/013),
resaltado real con Shiki y render de Mermaid (RF-004/011), y estados vacíos/error
(RF-012/013). Orden:

1. **Contrato primero (integración):** fixture `markdown-showcase.md` + `.md` del post de
   ejemplo (fuente única) + `tests/unit/markdown.test.ts` (rojo) + `tests/unit/paridad.test.ts`
   (rojo, declara las 7 vistas esperadas). Extender `tokens.test.ts`, `reuse.test.ts`,
   `literals.test.ts` con lo nuevo.
2. **Frontend / maquetación primero** (ambas pistas, datos simulados, sin lógica):
   estructura HTML/JSX y CSS/tokens de las 5 vistas nuevas + completar landing/dashboard.
   Vanilla: `blog.html`, `blog-detalle.html` (con placeholders del Markdown),
   `productos.html`, `producto-detalle.html`, `contacto.html` + clases en `style.css` +
   `assets/` locales. React: `app/blog/`, `app/productos/`, `app/contacto/` + `post-card`,
   `product-card`, `empty-state`, `field`, `markdown/prose.ts`. Aquí se corre el bloque
   visual del `experto-ux-ui` y se hace pasar `paridad.test.ts`.
3. **Implementación funcional después** (lo que `nunca va antes`):
   - Componente Markdown real: `components/markdown/markdown.tsx` + frontera Shiki
     (build/servidor) → hace pasar `markdown.test.ts`.
   - Frontera Mermaid: script de pre-render a SVG + incrustación → paridad del SVG.
   - Script de build vanilla que genera `blog-detalle.html` desde la misma fuente `.md`.
   - Validación del formulario de contacto + estados vacíos/error.
4. **Pruebas de sistema (e2e):** `e2e/vistas.spec.ts`, `e2e/contacto.spec.ts`, extender
   `network.spec.ts` y `responsive.spec.ts`; correr Playwright hasta verde.
5. **/audit + /polish** (`frontend-design-pro`) sobre las vistas nuevas → **documentación** (§8).

## 7. Seguimiento de complejidad  *(opcional)*
| Excepción a la simplicidad | Justificación |
|---|---|
| Dos dependencias nuevas en react (`shiki`, `mermaid`/`@mermaid-js/mermaid-cli`) | RF-004 exige resaltado real + Mermaid y RF-011/RNF-002 prohíben CDN; la única forma sin red es empaquetarlas y ejecutarlas en build/servidor. Son la opción mínima (Shiki no necesita runtime en cliente; Mermaid se usa solo en build para emitir SVG). |
| Script de build Node para la pista vanilla | La pista vanilla no tiene toolchain y P5 prohíbe parsear Markdown/resaltar en el navegador vía CDN. Un script de build local que emite HTML estático es la forma mínima de que vanilla tenga el mismo contenido sin añadirle un runtime. No es un bundler: es un generador puntual del `blog-detalle.html`. |
| Rutas dinámicas `[slug]` en react para 1 post / 1 producto | Aunque hoy hay un solo elemento, `[slug]` es la forma idiomática de App Router para "detalle" y evita rehacer el ruteo cuando lleguen más; coste cero sobre una ruta estática. |

## 8. Impacto en documentación  (obligatorio — Constitución Art. 11)
| Documento del mapa | Qué cambia | Acción |
|---|---|---|
| `react/glassmorphism/README.md` | Hoy declara alcance "landing + dashboard"; pasa a 7 vistas + componente Markdown + fronteras Shiki/Mermaid | `[doc]` actualizar alcance, comandos y "cómo portar" (el README queda **parcialmente obsoleto** hasta esta edición) |
| `CLAUDE.md` (guía UX/UI, Art. 10) | No describe el componente Markdown reutilizable ni la convención de 7 vistas del catálogo | `[doc]` añadir sección breve: ubicación del Markdown por pista, lista de vistas, regla "una instancia, variantes después" |
| `AGENTS.md` | Ya menciona la pista React (ADR-001); no requiere cambio estructural | Sin cambio (se verifica, no se edita) |
| `.harness/memory/state.md` / `history.md` | Estado del laboratorio glassmorphism (2 → 7 vistas) | `[doc]` Session-End (method §10) al cerrar la feature |
| `.harness/gate/services.txt` | `react/glassmorphism:node` ya declarado | Sin cambio |
| `DESIGN-SYSTEM-GALLERY.md` (referencia visual, Art. 10) | Puede listar solo 2 vistas de glassmorphism | `[doc]` revisar y, si lista vistas, ampliarlas; si no las lista, no aplica |

No hay documentos que esta feature vuelva **completamente** obsoletos; el README de
`react/glassmorphism/` es el único que queda desalineado y se actualiza como tarea `[doc]`.

## 9. Implementación por requisito

### Implementación de RF-001 — Landing (navbar, hero, cards feature, carrusel/galería, footer)
- **Vanilla:** `glassmorphism/index.html` (existe; se completa la galería/carrusel) +
  clases en `glassmorphism/css/style.css`. Imágenes del carrusel migradas de Unsplash
  remoto a `glassmorphism/assets/` (cierra P5).
- **React:** `app/page.tsx` + `app/_landing/site-header.tsx` (existen) reusando
  `navbar.tsx`, `glass-card.tsx`, `media-card.tsx`, `section-heading.tsx`, `reveal.tsx`;
  imágenes en `public/gallery/` con `next/image`.
- **Tests:** `tests/unit/reuse.test.ts`, `e2e/landing.spec.ts` (ya existen; se extienden).

### Implementación de RF-002 — Dashboard (topbar, sidebar-left, 1 gráfico, 1 alerta, 1 tabla, 1 detalle, 1 formulario placeholder)
- **Vanilla:** `glassmorphism/dashboard.html` (existe; se ajusta a 1 gráfico de líneas
  placeholder — SVG estático inline, sin librería de charts, el catálogo de gráficos es
  `0010-*` fuera de alcance; 1 alerta, 1 tabla con dataset fijo, 1 vista de registro/
  detalle, 1 formulario placeholder texto+select+boolean) + clases en `style.css`.
- **React:** `app/dashboard/page.tsx` + `app/dashboard/_components/dashboard-shell.tsx`
  (existen) reusando `app-bar.tsx`, `sidebar.tsx`, `metric.tsx`, `alert.tsx`,
  `data-table.tsx`; el formulario placeholder usa `field.tsx` (nuevo). Gráfico de líneas:
  SVG estático (sin dependencia de charts).
- **Tests:** `e2e/vistas.spec.ts` (dashboard renderiza los 5 bloques), `reuse.test.ts`.

### Implementación de RF-003 — Blog listado (grid de posts: imagen, título, extracto, fecha)
- **Vanilla:** `glassmorphism/blog.html` (nuevo) + `.blog-grid`/`.post-card` en `style.css`.
- **React:** `app/blog/page.tsx` + `app/blog/_components/` reusando `post-card.tsx` (nuevo)
  sobre `glass-card.tsx`; datos en `content/blog.ts`.
- **Tests:** `e2e/vistas.spec.ts`, `paridad.test.ts`.

### Implementación de RF-004 — Blog detalle vía componente Markdown reutilizable (showcase completo)
- **Vanilla:** `glassmorphism/blog-detalle.html` (nuevo) con el cuerpo **pre-renderizado a
  HTML estático** por el script de build Node desde la fuente única `.md`; estilos
  `.md-content*` en `style.css`; `js/markdown-renderer.js` (nuevo, compartido) solo para
  inicialización en runtime si hiciera falta (no parsea Markdown en el navegador).
- **React:** `app/blog/[slug]/page.tsx` (nuevo) renderiza `<Markdown source={post.body}/>`
  (`components/markdown/markdown.tsx`, nuevo) con estilos `components/markdown/prose.ts`.
  Fuente del contenido: `content/blog/<slug>.md` (fuente única compartida con vanilla).
- **Construcciones cubiertas:** h1-h6, negrita/cursiva/tachado, listas ord/desord/anidadas,
  blockquote, código inline y en bloque con resaltado (Shiki, RF-011), ≥1 diagrama Mermaid
  (SVG inline pre-renderizado), tablas, enlaces, imágenes con `alt` (RF-014), regla horizontal.
- **Tests:** `tests/unit/markdown.test.ts` (contrato de salida), `paridad.test.ts`
  (mismo HTML/SVG en vanilla), `e2e/vistas.spec.ts` (render visual).

### Implementación de RF-005 — Productos listado (grid: imagen, nombre, precio/dato corto)
- **Vanilla:** `glassmorphism/productos.html` (nuevo) + `.product-grid`/`.product-card`.
- **React:** `app/productos/page.tsx` + `app/productos/_components/` con `product-card.tsx`
  (nuevo); datos en `content/productos.ts`.
- **Tests:** `e2e/vistas.spec.ts`, `paridad.test.ts`.

### Implementación de RF-006 — Producto detalle (descripción en TEXTO PLANO, no Markdown)
- **Vanilla:** `glassmorphism/producto-detalle.html` (nuevo); descripción como párrafos
  HTML planos, **sin** invocar `markdown-renderer.js` (decisión explícita de Carlos, SPEC §6).
- **React:** `app/productos/[slug]/page.tsx` (nuevo); descripción como `string` en texto
  plano, **sin** `<Markdown>`.
- **Tests:** `paridad.test.ts` (verifica que producto-detalle NO usa el renderer de Markdown).

### Implementación de RF-007 — Contacto (form validado en cliente, éxito simulado sin red)
- **Vanilla:** `glassmorphism/contacto.html` (nuevo) + validación en cliente en
  `js/nav-toggle.js`-style script propio o inline-module `glassmorphism/` (sin red); estado
  de éxito simulado al enviar válido.
- **React:** `app/contacto/page.tsx` + `app/contacto/_components/contact-form.tsx` (nuevo,
  cliente): validación local, `onSubmit` previene default y muestra éxito simulado; cero fetch.
- **Tests:** `e2e/contacto.spec.ts` (envío válido → éxito; sin peticiones de red).

### Implementación de RF-008 — Tema de 3 vías + responsive 900px en toda vista nueva
- **Vanilla:** cada HTML nuevo incluye el bloque `#themeSwitcher` de 3 botones
  (`onclick="setThemeMode(...)"`) idéntico al de `index.html`, carga `../js/theme-manager.js`
  y `../js/nav-toggle.js`, y respeta el breakpoint 900px (hamburguesa + off-canvas ya en
  `nav-toggle.js`/`style.css`).
- **React:** cada ruta nueva hereda `providers.tsx` (next-themes) del `layout.tsx` y expone
  `theme-switch.tsx` en su navbar/sidebar; responsive con los breakpoints Tailwind
  existentes (off-canvas bajo `lg`, PLAN-0001 §9 RF-006).
- **Tests:** `e2e/vistas.spec.ts` (switcher presente), `e2e/responsive.spec.ts` (extendido).

### Implementación de RF-009 — Familia P3 completa + contraste AA en claro y oscuro
- **Vanilla:** las clases nuevas en `style.css` usan solo variables P3 ya declaradas; nada
  de valores de color nuevos. Verificación: visual (experto-ux-ui) + check anti-URL/anti-
  literal en `paridad.test.ts`.
- **React:** `tokens.test.ts` extendido valida AA de los pares usados por las vistas nuevas;
  `literals.test.ts` prohíbe literales de color fuera de `tokens.css`/`globals.css`.

### Implementación de RF-010 — Paridad estructural vanilla ↔ react
- Misma lista de 7 vistas y mismas secciones por vista; mismo contenido del post (fuente
  única `.md`) y mismo SVG de Mermaid.
- **Test:** `tests/unit/paridad.test.ts` (react) — enumera rutas react y archivos HTML
  vanilla, compara el conjunto de vistas y las secciones declaradas; compara el bloque
  Markdown renderizado entre `blog-detalle.html` y el output del componente.

### Implementación de RF-011 — Resaltado + Mermaid empaquetados localmente, nunca CDN
- Shiki en `dependencies` (react) y ejecutado en build/servidor → HTML con colores ya
  resueltos, sin JS de resaltado en cliente. Mermaid vendorizado y pre-renderizado a SVG en
  build. Vanilla recibe el mismo HTML/SVG vía el script de build. Ningún `<link>`/`<script>`
  a CDN en ninguna vista.
- **Tests:** `markdown.test.ts` (sin referencias externas en el output), `e2e/network.spec.ts`
  (extendido: ninguna petición a host externo al cargar blog-detalle), check anti-URL en
  `paridad.test.ts` para el lado vanilla.

### Implementación de RF-012 — Estado vacío explícito en Blog/Productos listado
- **Vanilla:** markup de estado vacío oculto/mostrado según haya ítems (clase `.empty-state`).
- **React:** `components/glass/empty-state.tsx` (nuevo) renderizado cuando la lista es vacía.
- **Tests:** `tests/unit/empty-state.test.tsx` (lista vacía → se muestra el estado vacío).

### Implementación de RF-013 — Error junto al campo en el formulario de Contacto
- **Vanilla:** cada campo tiene su `.field-error` que se rellena al validar.
- **React:** `components/glass/field.tsx` (nuevo) muestra el mensaje de error bajo el input.
- **Tests:** `e2e/contacto.spec.ts` (envío inválido → error junto al campo, no genérico).

### Implementación de RF-014 — Toda imagen del Markdown con `alt` obligatorio
- Las imágenes del fixture/`.md` de ejemplo **siempre** llevan `alt`; el contenido de
  referencia que esta spec produce no incluye imágenes sin `alt`.
- **Test:** `markdown.test.ts` (el output no contiene ninguna `<img>` sin `alt`).

### Implementación de RF-015 — Bloque de código sin lenguaje → monoespaciado simple, sin fallar
- Shiki (y el fallback del renderer) tratan el bloque sin lenguaje como texto plano en
  `<pre><code>` monoespaciado, sin resaltado y sin error.
- **Test:** `markdown.test.ts` (bloque sin fence-lang → `<pre><code>` sin spans de color).

### Implementación de RNF-001 / RNF-002 / RNF-003 / RNF-004
- **RNF-001** (gate verde ambas pistas): `react/glassmorphism:node` ya en `services.txt`;
  el gate corre `type-check` + Vitest. Vanilla sin runner propio (ver §5), cubierto por
  `paridad.test.ts` desde react.
- **RNF-002** (sin CDN): ver RF-011; `e2e/network.spec.ts` + check anti-URL vanilla.
- **RNF-003** (sin colores hardcodeados): `literals.test.ts` (react) + check en `paridad.test.ts`
  (vanilla).
- **RNF-004** (AA claro/oscuro): `tokens.test.ts` (react) + verificación visual del
  experto-ux-ui (vanilla).
