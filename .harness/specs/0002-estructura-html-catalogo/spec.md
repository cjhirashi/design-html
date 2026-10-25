---
id: SPEC-0002
tipo: spec
feature: 0002-estructura-html-catalogo
estado: approved
# --- anclaje (fusionado; ver method.md §9) ---
anchor_commit: 8731efb
anchor_mode: advisory
covers:
  # --- pista vanilla (glassmorphism/) ---
  - glassmorphism/index.html
  - glassmorphism/dashboard.html
  - glassmorphism/blog.html
  - glassmorphism/blog-detalle.html
  - glassmorphism/productos.html
  - glassmorphism/producto-detalle.html
  - glassmorphism/contacto.html
  - glassmorphism/css/style.css
  - glassmorphism/assets/**
  - js/markdown-renderer.js
  - js/theme-manager.js
  - js/nav-toggle.js
  # --- pista react (react/glassmorphism/) ---
  - react/glassmorphism/app/**
  - react/glassmorphism/components/glass/**
  - react/glassmorphism/components/markdown/**
  - react/glassmorphism/content/**
  - react/glassmorphism/public/**
  - react/glassmorphism/tests/**
  - react/glassmorphism/e2e/**
  # --- documentación (Art. 11) ---
  - react/glassmorphism/README.md
  - .harness/specs/0002-estructura-html-catalogo/plan.md
# --- aprobaciones humanas ---
aprobaciones:
  fase_1: { por: "Carlos (chat con AIRA, 'así es')", fecha: 2026-10-16 }
  fase_2: { por: "AIRA (autoridad delegada por Carlos, Modo 2)", fecha: 2026-10-24 }
actualizado: 2026-10-24
---

# SPEC-0002 · Estructura HTML del catálogo ampliado (laboratorio glassmorphism)

> Producida en Fase 1 por elicitación interactiva con Carlos (`method.md §3`), en chat
> con AIRA (no en una sesión de Claude Code dentro del repo). Confirmada con "así es"
> el 2026-10-16. Implementa el alcance de `ADR-002` — primera spec del roadmap de
> catálogo, antes de cualquier spec de variantes (navbar/hero/cards/…) o del sistema de
> tokens de motion.

## 1. Contexto del dominio

Design-html pasó de ser una landing + dashboard simples por estilo a ser el catálogo de
referencia de frontend completo de Carlos (`ADR-002`). Antes de construir variantes de
componentes hay que fijar **la estructura de página** (qué vistas existen, qué secciones
tiene cada una, con una sola instancia de cada componente) en un solo estilo —
`glassmorphism`, ya elegido como piloto por `ADR-001` — para no reconstruir 21 veces algo
todavía inestable. Esta spec no toca ningún otro estilo.

## 2. Alcance

### En alcance
- Las 7 vistas de `ADR-002`, cada una con **una sola instancia** de sus componentes (sin
  variantes): Landing, Dashboard, Blog listado, Blog detalle, Productos listado,
  Producto detalle, Contacto.
- **Ambas pistas en paralelo**, en paridad estructural: vanilla (`glassmorphism/`) y
  `react/glassmorphism/` (decisión explícita de Carlos — no la recomendación inicial de
  AIRA de ir vanilla-primero).
- Componente Markdown **reutilizable** (no específico de blog) para contenido de texto
  enriquecido; en el alcance de esta spec su único consumidor es Blog Detalle.
- Verificar/extender a las 7 vistas el control de tema claro/sistema/oscuro que **ya
  existe** en ambas pistas (vanilla: `theme-manager.js` + switcher de 3 botones en
  `index.html`; react: `next-themes` + `theme-switch.tsx`) — no se reinventa, se replica.
- Responsive a los 900px ya establecidos (patrón hamburguesa + off-canvas).

### Fuera de alcance
- Variantes de componentes (navbar/hero/cards/footer con más de una opción) — specs
  posteriores del roadmap.
- Sistema formal de tokens de motion — spec posterior, por decisión explícita de Carlos
  en esta misma elicitación.
- ~~Los 9 tipos de campo de formulario completos~~ **ABSORBIDO 2026-10-24** (ver §6) —
  ya no hay `0014-form-field-types` aparte, el catálogo completo de 15 tipos vive en RF-002.
- ~~Catálogo completo de tipos de gráfico~~ **ABSORBIDO 2026-10-24** (ver §6) — ya no
  hay `0010-chart-types` aparte, los 7 tipos de gráfico viven en RF-002.
- Réplica a los otros 20 estilos — fase posterior, cuando esta estructura cierre.
- Corrección del bug de contraste AA ya existente en `glassmorphism` vanilla (es
  `1001-*`, feature aparte, no se mezcla aquí).
- Backend real: el formulario de contacto no envía datos a ningún servidor.

## 3. Modelo de datos y contratos de E/S

No aplica un backend real (sitio estático de referencia). Única "frontera": el
formulario de contacto, que valida en cliente y simula éxito/error sin red (P5) — no hay
contrato HTTP que documentar.

## 4. Criterios de aceptación (EARS)

- **RF-001** — El sistema DEBE tener una Landing (vanilla + react) con navbar, hero,
  cards de feature, carrusel/galería y footer — una instancia de cada uno.
- **RF-002** — El sistema DEBE tener un Dashboard (vanilla + react) con topbar y
  sidebar-left que activa 7 vistas en el main-content (enmienda 2026-10-25, ver §6):
  1. **Vista Tabla** — sub-pestañas Tabla / Vista / Editar (listado con dataset fijo,
     detalle de un registro, formulario de edición del mismo registro).
  2. **Vista Métricas** — catálogo de 7 tipos de gráfico: línea, barras, área, pie,
     dona, radar, gauge/radial.
  3. **Vista Markdown** — documentación, reusa el componente Markdown de RF-004.
  4. **Vista Tareas** — lista de tareas tipo to-do/kanban simple.
  5. **Vista Formulario** — formulario standalone con el catálogo de 15 tipos de
     campo: texto, número, textarea, código (monoespaciado), fecha, fecha-hora,
     boolean/toggle, select de opciones fijas, multi-select de opciones fijas,
     creatable-select, select-FK (dataset de ejemplo separado, sin backend real),
     multi-select-FK, lista-texto (líneas→array), lista-número (coma→array), y
     JSON-list en 3 variantes (clave-valor / lista-de-strings / lista-de-objetos).
     "Estado" no es un tipo aparte: es el select pintado con badge de color.
  6. **Vista Controles** — catálogo de controles UI (toggles, selects, etc.).
  7. Extensible — el inventario de vistas no cierra en 6 (decisión de Carlos).
  La Vista Tabla y la Vista Formulario comparten el MISMO dataset de ejemplo (un
  registro visto de varias formas). Alerta de RF original (1 alerta) se conserva
  como elemento de la Vista Tabla o del overview general.
- **RF-003** — El sistema DEBE tener una vista de Blog listado (vanilla + react): grid de
  posts con imagen, título, extracto y fecha.
- **RF-004** — El sistema DEBE tener una vista de Blog detalle (vanilla + react) que
  renderiza el contenido del post vía el componente Markdown reutilizable, demostrando al
  menos: encabezados h1-h6, énfasis (negrita/cursiva/tachado), listas (ordenadas,
  desordenadas, anidadas), blockquote, código inline y en bloque **con resaltado de
  sintaxis**, al menos un **diagrama Mermaid** renderizado, tablas, enlaces, imágenes y
  regla horizontal.
- **RF-005** — El sistema DEBE tener una vista de Productos listado (vanilla + react):
  grid de productos con preview (imagen, nombre, precio/dato corto).
- **RF-006** — El sistema DEBE tener una vista de Producto detalle (vanilla + react) con
  su descripción en **texto plano** (no Markdown — decisión explícita de Carlos).
- **RF-007** — El sistema DEBE tener una vista de Contacto (vanilla + react) con
  formulario validado en cliente; CUANDO el envío es válido, el sistema DEBE mostrar un
  estado de éxito simulado sin llamada de red real.
- **RF-008** — DONDE una vista sea nueva de esta spec, el sistema DEBE incluir el control
  de tema de 3 vías (claro/sistema/oscuro) ya existente en ambas pistas, y DEBE ser
  responsive al breakpoint de 900px ya establecido.
- **RF-009** — El sistema DEBE cumplir, en toda sección nueva de esta spec, la familia de
  variables CSS P3 completa y contraste AA (P4) en claro y oscuro.
- **RF-010** — El sistema DEBE mantener paridad estructural entre vanilla y
  `react/glassmorphism`: mismos componentes y mismo contenido en las 7 vistas; solo
  cambia el mecanismo de tema (CSS custom properties vs. tokens de Tailwind/next-themes).
- **RF-011** — SI el resaltado de sintaxis o el renderizado de Mermaid requieren una
  librería, ENTONCES el sistema DEBE empaquetarla localmente (build-time o self-hosted) y
  NUNCA cargarla de un CDN (P5).

## 5. Casos límite y manejo de errores

- **RF-012** — SI el listado de Blog o Productos no tiene elementos ENTONCES el sistema
  DEBE mostrar un estado vacío explícito (no una lista en blanco).
- **RF-013** — SI el formulario de Contacto tiene campos inválidos al enviar ENTONCES el
  sistema DEBE mostrar el error junto al campo (no solo un mensaje genérico).
- **RF-014** — SI una imagen dentro de contenido Markdown no tiene texto alternativo
  ENTONCES el contenido de referencia NO DEBE usarla (alt es obligatorio, no opcional, en
  todo el contenido de ejemplo que esta spec produce).
- **RF-015** — SI un bloque de código en Markdown no declara lenguaje ENTONCES el sistema
  DEBE mostrarlo sin resaltado (monoespaciado simple) en vez de fallar.

## 6. Registro de decisiones y descartes

| Decisión | Justificación | Alternativa descartada | ADR |
|---|---|---|---|
| Ambas pistas (vanilla + react) en paralelo en esta spec | Decisión explícita de Carlos | Vanilla primero, portar después (recomendación inicial de AIRA: menor riesgo de rehacer el port) | ADR-001 |
| Las 7 vistas completas en una sola spec | Decisión explícita de Carlos; evita dejar el catálogo incompleto otra vez | Landing+Dashboard ahora, Blog/Productos/Contacto en specs separadas | — |
| Motion fuera de esta spec | Estructura estática primero; motion sobre algo que puede cambiar es trabajo desechable | Incluir tokens de motion mínimos ya | ADR-002 |
| ~~Un solo placeholder de formulario/gráfico~~ **REVERTIDO 2026-10-24**: RF-002 absorbe el catálogo COMPLETO de 15 tipos de campo + 7 tipos de gráfico | Carlos confirmó explícitamente vía elicitación con AIRA, 2026-10-24; cierra `0014-form-field-types` y `0010-chart-types` como specs aparte (ya no hacen falta) | Dejar el catálogo incompleto para specs posteriores | — |
| RF-002 se entrega como sidebar de 7 vistas conmutables (Tabla+pestañas/Métricas/Markdown/Tareas/Formulario/Controles/extensible), no como un overview estático de 5 bloques simultáneos | Carlos, 2026-10-25, tras revisar el despliegue: "deberías activar las secciones para que cada uno muestre las diferentes vistas que pedí" | Overview de 5 bloques fijos en una sola pantalla (redacción original de RF-002) | — |
| Verificación móvil real (Playwright, medición de overflow/posición, no solo guías de ui-ux-pro-max) es parte del criterio de cierre de CADA slice, no solo de la Fase de verificación final | Carlos, 2026-10-25: Slice 1 se cerró "demoable" sin probarse en 390px; 3 bugs reales de overflow aparecieron después (h1/h2 sin clamp, topbar del dashboard, overflow-x del body) | Verificación responsive solo al final (Slice 4) | — |
| Markdown reutilizable, no específico de blog; único consumidor en esta spec es Blog Detalle | Carlos: "donde usamos Markdown es donde ocupemos texto enriquecido… etc." — es una capacidad general, no una feature de blog | Componente de Markdown acoplado a la página de blog | — |
| Producto detalle en texto plano | Decisión explícita de Carlos | Reusar Markdown también en producto detalle | — |
| Código con resaltado de sintaxis real + Mermaid | Decisión explícita de Carlos, revirtiendo la recomendación inicial de AIRA (solo monoespaciado) | Bloques de código sin resaltado | — |
| Control de tema claro/sistema/oscuro: replicar lo existente, no reinventar | Verificado 2026-10-16: vanilla (`theme-manager.js` + switcher de 3 botones) y react (`next-themes`) ya lo soportan | Construir un mecanismo de tema nuevo | — |

## 7. Requisitos no funcionales (RNF)

- **RNF-001** — `gate/check.sh` DEBE pasar en verde en ambas pistas (react/glassmorphism
  ya declarado en `gate/services.txt`).
- **RNF-002** — Ninguna vista nueva DEBE cargar recursos de un CDN o host externo (P5),
  incluidas las librerías de resaltado de sintaxis y Mermaid.
- **RNF-003** — Ninguna vista nueva DEBE hardcodear colores; todo vía la familia de
  variables P3 / tokens (P6).
- **RNF-004** — Contraste AA (P4) verificado en claro y oscuro en todo lo nuevo.

## Marcadores abiertos

Ninguno — `[NEEDS CLARIFICATION] = 0`. Confirmado por Carlos con "así es" el 2026-10-16.
