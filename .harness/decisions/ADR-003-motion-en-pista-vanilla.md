---
id: ADR-003
tipo: adr
estado: accepted          # aceptado por Carlos 2026-10-24 (chat con AIRA): "extiende Motion a la pista vanilla"
fecha: 2026-10-24
---

# ADR-003 · Motion disponible en la pista vanilla (vendorizada, sin build)

## Contexto y planteamiento del problema

Carlos verificó `Motion` (ex-Framer Motion, `motiondivision/motion`, 34,483★ MIT,
0 vulnerabilidades por OSV-Scanner — `source.frontend-ux-stack.md`) y ya está
adoptada en la pista React (`react/glassmorphism/package.json`, `motion: ^14.3.0`,
nombrada en ADR-001 como dependencia de build aprobada). Pidió extenderla a la
pista vanilla (los 21 estilos HTML+CSS+JS) para que los componentes del catálogo
tengan animación profesional ahí también.

La pista vanilla no tiene paso de build ni `package.json` — Art. 2/P5 de la
Constitución exige **cero dependencias de red** (nada de `<link>`/`@import` a un
host externo) y hoy se sirve tal cual, sin bundler. Un `import "motion"` normal
(resuelto por npm/un bundler) o un `<script src="https://cdn.../motion">` no
caben en ese modelo.

## Decisión

Se **vendoriza** el bundle UMD de producción de `Motion` (`dist/motion.js` del
paquete npm, sin modificar) en `js/vendor/motion.js`, en la carpeta `js/`
compartida por los 21 estilos (la misma que ya sirve `theme-manager.js` y
`nav-toggle.js` vía ruta relativa `../js/…`). Se referencia con un `<script
src="../js/vendor/motion.js">` normal — sin CDN, sin paso de build, sin
`package.json` nuevo en la pista vanilla. Expone el global `window.Motion`
(`animate`, `stagger`, `scroll`, etc., API documentada en motion.dev).

Verificado en Chromium real (Playwright, no solo que el archivo exista):
`window.Motion` y `window.Motion.animate` quedan definidos al cargar el script,
una animación de prueba (`opacity: 0 → 1`) se ejecuta y completa sin errores de
consola.

**Alcance de esta decisión:** deja la capacidad disponible en los 21 estilos (el
script vive en la carpeta compartida). **No** construye componentes animados
nuevos en el catálogo — eso es trabajo de implementación aparte, con su propio
piloto en `glassmorphism` primero, igual que hizo ADR-002 con la estructura
ampliada del catálogo, antes de replicar a los demás 20 estilos.

## Opciones consideradas

- **Vendorizar el bundle UMD localmente (elegida)** — cero red en runtime, cero
  build, coherente con P5 tal cual está escrito y con cómo ya se sirve
  `theme-manager.js`/`nav-toggle.js`. Costo: hay que actualizar el archivo a
  mano si se quiere una versión nueva de Motion (no hay `npm update`).
- **`<script src="https://cdn.jsdelivr.net/npm/motion">` (CDN)** — cero
  mantenimiento de versión, pero viola P5 directamente (dependencia de red en
  el navegador del usuario final) y añade una petición externa + riesgo de
  disponibilidad del CDN. Descartada.
- **Introducir un bundler (Vite/esbuild) a la pista vanilla** — permitiría un
  `import` normal de npm, pero convierte "HTML plano servido tal cual" en
  "HTML con paso de build", contradiciendo el principio central del Art. 2
  (estructura idéntica, cero tooling). Cambio de arquitectura mucho mayor que
  lo que pidió Carlos. Descartada para esta decisión — si en el futuro la
  pista vanilla necesita más dependencias npm, ahí sí amerita su propio ADR.

## Consecuencias

- **Buenas:** Motion disponible de inmediato en los 21 estilos sin tocar el
  modelo "sin build" de la pista vanilla; un solo archivo compartido, igual que
  el resto del JS del catálogo.
- **Coste / malas:** actualizar la versión vendorizada es manual (reemplazar
  `js/vendor/motion.js` y volver a verificar); el archivo pesa 172 KB sin
  minificar más de lo que ya viene del build de npm (aceptable para un catálogo
  de referencia, no para el frontend final de un proyecto consumidor — ahí la
  pista React con npm real sigue siendo la opción).
