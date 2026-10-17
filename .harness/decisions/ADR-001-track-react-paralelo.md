---
id: ADR-001
tipo: adr
estado: accepted          # aceptado por Carlos 2026-10-16 (chat con AIRA): "este se vuelve la base de todo lo que sigue"
fecha: 2026-10-16
---

# ADR-001 · Segunda pista React/Next.js en paralelo a la pista vanilla

## Contexto y planteamiento del problema

La Constitución (Art. 1–2) fija que los 21 estilos son HTML+CSS+JS vanilla con una sola
estructura HTML compartida y que sólo cambia `css/style.css`. Los proyectos que consumen
la galería (Hira, Synapse y futuros) son siempre Next.js/React: hoy un estilo elegido se
copia a mano y se reinterpreta, no se reutiliza como código. Carlos pidió (2026-10-16)
que los diseños "se puedan replicar en react/next" y aprobó un piloto con `glassmorphism`
(brief `DESIGN-HTML-BRIEF-REACT-PORT-PILOTO.md` en el workspace de AIRA). Ese piloto no
cabe en el Art. 2 tal como está redactado.

Nota de estado real (verificado 2026-10-16): el Art. 2 describe la pista vanilla con
symlinks a un `index.html`/`dashboard.html` de raíz, pero hoy cada carpeta de estilo aún
tiene **copias**, no symlinks (ver `memory/state.md` → "Próximo paso inmediato"). Este
ADR no cambia nada de eso; habla de la pista vanilla tal como la define el Art. 2.

## Decisión

Se autoriza una **segunda pista React/Next.js en paralelo** a la pista vanilla, **sin
reemplazarla**:

1. **La pista vanilla sigue siendo la fuente de verdad visual.** La pista React es una
   representación equivalente. Cualquier divergencia de diseño entre ambas se resuelve a
   favor de la vanilla, salvo que lo impida una regla de la Constitución (p. ej. P4
   contraste AA o P7 copy en español), y en ese caso la divergencia se registra en el
   `spec.md` de la feature.
2. **Ubicación:** `react/<estilo>/`, una app Next.js (App Router) autocontenida por
   estilo. La carpeta vanilla `<estilo>/` no se toca.
3. **Principio heredado:** "misma estructura, distinto estilo" se traduce como **"mismos
   componentes, distintos tokens de tema"**. Los componentes no conocen la paleta; el
   estilo vive en un archivo de tokens (CSS custom properties con los **mismos nombres
   de la familia P3**) expuesto a Tailwind. Portar otro estilo = cambiar tokens, no
   componentes.
4. **Alcance del piloto:** sólo `react/glassmorphism/`. Replicarlo a otros estilos es
   una decisión aparte, posterior a la revisión del piloto.

### Art. 8 — P5 y P6 en cada pista

- **Pista vanilla (los 21 estilos existentes):** P5 (sin dependencias de red) y P6 (HTML
  agnóstico de estilo) siguen vigentes **tal cual**, sin ningún cambio.
- **Pista React — equivalente de P5:** cero recursos cargados de un host externo en el
  navegador del usuario final. Las fuentes se auto-hospedan con `next/font` (nunca
  Google Fonts por CDN ni `<link>` externo). Imágenes y otros recursos se sirven desde el
  propio build. Las dependencias npm de build (Next.js, React, Tailwind, next-themes,
  Motion, componentes de MagicUI) **no** son "dependencias de red en runtime" en el
  sentido de P5: quedan empaquetadas en el bundle y no se cargan de un CDN.
- **Pista React — equivalente de P6:** ningún color ni valor de diseño hardcodeado en
  componentes ni páginas. Todo pasa por tokens (CSS variables → `@theme` de Tailwind).
  No se usan estilos inline con valores literales. Única tolerancia: los componentes
  vendorizados de MagicUI pueden usar `style` para fijar **CSS custom properties**, y
  sólo si su valor es una referencia a un token (`var(--…)`). El tema activo se expresa
  como `data-theme` en `<html>`, igual que en la pista vanilla (aquí lo gestiona
  `next-themes` en lugar de `theme-manager.js`).

## Opciones consideradas

- **A · Pista React paralela por estilo, tokens con la familia P3** — reutiliza el
  contrato de variables existente y no rompe nada de la vanilla. **Elegida.**
- **B · Reemplazar la pista vanilla por React** — la galería dejaría de abrirse como
  archivos estáticos y P5 vanilla perdería sentido. Descartada: el brief pide explícitamente
  no reemplazar.
- **C · Generar React desde el HTML vanilla (conversión automática)** — el resultado
  serían componentes sin abstracción y estilos duplicados, que no cumplen "mismos
  componentes, distintos tokens". Descartada.
- **D · Un monorepo React único con los 21 estilos como temas** — es la meta probable si
  el piloto funciona, pero es prematura antes de validar el patrón con un estilo.
  Descartada por ahora; se reevaluará tras el piloto.

## Consecuencias

- **Buenas:** los proyectos Next.js pueden copiar componentes reales en vez de
  reinterpretar HTML. Las 5 variantes `glass-*` quedan casi listas: comparten mecanismo y
  sólo cambian tokens.
- **Coste / malas:** hay dos representaciones de un mismo estilo que pueden divergir (se
  mitiga con la regla 1 y con el spec de cada feature React). La pista React necesita
  `npm install` y su propio toolchain de tests. El gate debe declarar cada app React en
  `gate/services.txt` para que corra su type-check y sus tests.

## Enlaces

- Afecta a: Constitución Art. 2 (extensión) y Art. 8 (P5/P6 por pista);
  `specs/0001-glassmorphism-react` (RF-001…RF-007).
- Relacionado: brief `DESIGN-HTML-BRIEF-REACT-PORT-PILOTO.md` (workspace AIRA).

## Actualización (2026-10-16, tras aceptación)

Carlos aceptó este ADR y, en la misma conversación, amplió su alcance: `glassmorphism`
(ambas pistas) deja de ser "solo el piloto React" y pasa a ser **la base de todo el
catálogo de componentes** — landing y admin se construyen primero ahí, completos, y
recién después se replican a los otros 20 estilos. El detalle de esa decisión (más
amplia que el alcance original de este ADR) vive en `ADR-002-glassmorphism-laboratorio-canonico.md`.
