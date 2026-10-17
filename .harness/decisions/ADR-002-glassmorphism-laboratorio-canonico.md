---
id: ADR-002
tipo: adr
estado: accepted          # Carlos, chat con AIRA, 2026-10-16
fecha: 2026-10-16
---

# ADR-002 · Glassmorphism como laboratorio de la estructura canónica del catálogo

## Contexto y planteamiento del problema

Carlos amplió el propósito de design-html (2026-10-16, chat con AIRA, inspirado en el
inventario real de componentes de `cjhirashi-career`): el catálogo no es solo una landing
y un dashboard simples por estilo — cada estilo debe mostrar, con la **misma estructura
HTML**, variantes reales de navbar, hero, cards, carrusel, footer, blog (listado+detalle),
productos (listado+detalle) y formulario de contacto en landing; y gráficos, alertas,
vista de tabla, vista de registro, y formularios con los tipos de campo reales (texto,
número, boolean, select, creatable select, FK select/multi-select, fecha, archivo, lista
JSON) en el panel admin. Carlos también pidió no descartar que el catálogo necesita
**animaciones** como parte del alcance, no como añadido posterior.

Construir ese inventario completo 21 veces en paralelo (una por estilo) sería el peor
momento para hacerlo: hoy cada estilo todavía tiene **copias** de HTML, no symlinks (ver
`state.md`), así que cada componente nuevo habría que replicarlo a mano 21 veces mientras
el diseño de la estructura todavía es inestable.

## Decisión

Se construye el catálogo completo **una sola vez**, en `glassmorphism` (ambas pistas:
vanilla y `react/glassmorphism`, que ya deben mantenerse en paridad por `ADR-001`).
Ningún otro estilo recibe componentes nuevos hasta que la estructura en glassmorphism
esté completa y Carlos la dé por buena. Solo entonces se replica (symlinks + retoque de
`css/style.css`/`tokens.css` por estilo) a los otros 20 — ese paso final es mecánico, no
de diseño, porque para entonces la estructura ya no cambia.

Esto hace a `glassmorphism` la **base de todo lo que sigue** (confirmado por Carlos):
cualquier decisión de estructura, componente o animación se toma ahí primero.

### Alcance del catálogo (qué entra)

- **Landing:** navbar (variantes), hero (variantes), cards (feature/pricing/testimonio/
  equipo), carrusel/galería, footer (variantes), blog (listado + detalle), productos
  (listado + detalle), formulario de contacto.
- **Admin:** gráficos (varios tipos), alertas (variantes y modos), vista de tabla, vista
  de registro/detalle, formularios con los tipos de campo reales listados arriba.
- **Animación, explícito en el alcance (no un añadido posterior):** cada componente de
  la lista anterior necesita su propio comportamiento de motion (entrada/salida, hover,
  estados), no solo su estructura y estilo estático. Antes de construir componentes
  sueltos, conviene fijar un sistema de tokens de motion (duración, easing, patrones de
  entrada/salida, `prefers-reduced-motion`) análogo al de variables CSS (P3) — ya hay
  precedente funcionando en `react/glassmorphism` (Reveal/aurora, RNF-004/RNF-005 de
  `0001-glassmorphism-react`) y referencia de 17 presets de motion en los datos del skill
  `ui-ux-pro-max` (`data/motion.csv`).
- **Fuera de alcance por ahora, pendiente de decisión aparte:** panel de chat/asistente
  (visto en `bedrock/*` de `cjhirashi-career`, es específico de ese proyecto).

### Orden interno de las specs del catálogo

Pendiente — Carlos decide el orden al ver el roadmap completo rescopeado a "solo
glassmorphism, vanilla + react en paridad" (ver `state.md` → Backlog).

## Opciones consideradas

- **A · Construir en glassmorphism primero, replicar después** — un solo lugar inestable
  en vez de 21; la replicación final es mecánica. **Elegida.**
- **B · Construir en los 21 estilos en paralelo desde ya** — cada componente nuevo = 21
  implementaciones mientras el diseño aún cambia; altísimo costo de retrabajo.
  Descartada.
- **C · Tratar la animación como un detalle de implementación de cada componente, sin
  sistema de tokens propio** — más rápido al inicio, pero repite la inconsistencia que
  P3 ya evita para el color; cada componente reinventaría timing/easing. Descartada.

## Consecuencias

- **Buenas:** el costo de explorar/corregir la estructura (incluida la animación) se
  paga una sola vez. Cuando se replique a los 20 estilos restantes, el trabajo de diseño
  ya está cerrado — solo queda retocar tokens de color y motion por estilo.
- **Coste / malas:** mientras no se replique, los otros 20 estilos no reflejan el
  catálogo ampliado — quien use design-html hoy para un estilo que no sea glassmorphism
  sigue viendo la landing/dashboard simples de antes. Hay que comunicar ese estado
  transitorio (ya reflejado en `state.md`).

## Enlaces

- Afecta a: Constitución Art. 1 (Propósito) y Art. 3 (Servicios & Contenido, se quedan
  cortos frente a este alcance — pendiente de reescribir); `ADR-001` (glassmorphism ya
  era la pista piloto; aquí se vuelve además el laboratorio de estructura).
- Relacionado: roadmap de ~14-18 specs de catálogo en `state.md` → Backlog.
