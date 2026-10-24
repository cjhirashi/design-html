---
proyecto: design-html
arquitectura: componentes-visuales-compartidos
estado: greenfield-gobernado
especialista-ux-ui: True
---

# Constitution — design-html

## Art. 1 — Propósito

**Catálogo de sistemas de diseño UI/UX — referencia visual de frontend completa para los proyectos que Carlos gestiona, con gobernanza de componentes compartidos.**

Objetivo: no es solo una landing y un dashboard simples por estilo. Es la referencia de **todo** lo que un frontend real necesita (landing, blog, productos, panel admin con sus formularios/tablas/gráficos), para que cualquier proyecto (Hira, Synapse, IA Engine, etc.) pueda tomar un estilo completo — estructura + componentes + animación — en vez de reinterpretar HTML a mano. Inventario de referencia validado contra `cjhirashi-career` (2026-10-16). Detalle de alcance y estrategia de construcción: `ADR-002`.

Restricción crítica: **Todas las plantillas comparten LA MISMA estructura HTML (y la misma lógica de motion). Solo el CSS — y los tokens de tema — cambian.**

**Estrategia de construcción (ADR-002, 2026-10-16):** el catálogo ampliado se construye una sola vez en `glassmorphism` (vanilla + `react/glassmorphism`, en paridad por ADR-001) y se replica a los demás estilos solo cuando esa estructura esté cerrada. Hasta entonces, los otros 20 estilos siguen con la landing/dashboard simples de Génesis — ver `state.md` para el estado real de cada uno.

---

## Art. 2 — Arquitectura & Estilo de Componentes Visuales

### Principio Fundamental

```
Estructura HTML idéntica en 21 estilos
           ↓
    Componentes compartidos
           ↓
   Varían SOLO por CSS
           ↓
   Sincronización garantizada
```

### Estructura Física

```
design-html/
├── index.html           ← Fuente única (landing)
├── dashboard.html       ← Fuente única (dashboard)
├── css/base.css         ← Resets + clases compartidas
├── js/
│   ├── theme-manager.js ← Compartido
│   └── nav-toggle.js    ← Compartido
│
└── <estilo-1>, ..., <estilo-21>/
    ├── css/style.css          ← ÚNICO QUE CAMBIA (variables :root + [data-theme="dark"])
    ├── index.html → ../index.html (symlink)
    └── dashboard.html → ../dashboard.html (symlink)
```

> **Estado real (2026-10-16):** esto es el objetivo elegido, no el estado actual. Hoy cada
> estilo tiene **copias**, no symlinks, y `dashboard.html` no existe todavía en la raíz.
> Convertir exige unificar primero el HTML entre estilos (hoy difiere) → feature propia
> con spec, no un ajuste suelto. Detalle y backlog en `.harness/memory/state.md`.

### Decisión: Symlinks vs. Copias

**Elegido: Symlinks**

- ✅ Un cambio en `index.html` = disponible en 21 estilos al instante
- ✅ Sincronización garantizada
- ✅ No hay divergencia accidental
- ✅ Mantenimiento centralizado

### Extensión: pista React/Next.js paralela (ADR-001, propuesto 2026-10-16)

Además de la pista vanilla de arriba, que sigue siendo la **fuente de verdad visual**,
se autoriza una pista React/Next.js por estilo en `react/<estilo>/`, en paralelo y sin
reemplazarla. El principio se traduce como "mismos componentes, distintos tokens de
tema" (tokens con los nombres de la familia P3). Las reglas completas, incluido el
equivalente de P5/P6 para React, están en `decisions/ADR-001-track-react-paralelo.md`.
Piloto: `react/glassmorphism/` (spec `0001-glassmorphism-react`).

---

## Art. 3 — Servicios & Contenido

### Vistas Principales

> **Objetivo del catálogo (ADR-002, 2026-10-16) — hoy solo construido así en
> `glassmorphism`.** El resto de estilos todavía tiene solo la versión simple original
> (Landing/Dashboard de Génesis, sin las variantes de abajo). Ver `state.md` para qué
> estilo tiene qué.

1. **Landing** (`index.html`)
   - Navbar — variantes (simple, mega-menú, con buscador)
   - Hero — variantes (centrado, imagen lateral, demo/video)
   - Cards — feature, pricing, testimonio, equipo
   - Carrusel/galería
   - Footer — variantes (simple, con columnas de links)
   - Blog — listado + detalle de post
   - Productos — listado + detalle de producto
   - Formulario de contacto

2. **Dashboard** (`dashboard.html`)
   - Topbar (breadcrumb, search, notificaciones, user)
   - Sidebar-left (menu, profile, links, theme-switch)
   - Main-content: gráficos (varios tipos), alertas (variantes/modos), vista de tabla,
     vista de registro/detalle, formularios con tipos de campo reales (texto, número,
     boolean/switch, select, creatable select, FK select/multi-select, fecha, archivo,
     lista JSON — inventario validado contra `cjhirashi-career`)
   - Sidebar-right (chat/asistente) — **fuera de alcance del catálogo por ahora** (ADR-002)

### Familia de Tokens de Motion (objetivo, ADR-002 — aún no existe como familia formal)

Análoga a la familia de variables CSS de abajo, pero para animación: duración, easing,
patrones de entrada/salida, y comportamiento bajo `prefers-reduced-motion`. Cada
componente de las vistas de arriba necesita su motion, no solo su estructura/estilo
estático. Precedente funcionando: `react/glassmorphism` (Reveal/aurora, RNF-004/005 de
`0001-glassmorphism-react`). Referencia de presets: skill `ui-ux-pro-max` →
`data/motion.csv` (17 presets).

### Componentes Base

Familia de variables CSS `:root` (idéntica en todos los 21 estilos, valores varían):

```css
:root {
  /* Fondos */
  --bg-primary --bg-secondary --bg-tertiary --bg-glass
  /* Texto */
  --text-primary --text-secondary --text-muted
  /* Bordes */
  --border-color --border-focus
  /* Colores de marca */
  --primary-color --primary-hover --primary-light --primary-text
  --secondary-color --secondary-hover --secondary-light --secondary-text
  /* Estados */
  --error-bg --error-text --error-border
  --warning-bg --warning-text --warning-border
  --success-bg --success-text --success-border
  /* Efectos */
  --shadow-sm --shadow-md --shadow-lg
  --radius-sm --radius-md --radius-lg
  --transition-smooth
}

[data-theme="dark"] {
  /* Redefinir TODO en modo oscuro */
}
```

### Copy & Lenguaje

- **Español siempre** — Nunca lorem ipsum
- **Datos reales** — Telemetría, despliegues, nodos
- **Dominio técnico** — No decorativo

---

## Art. 4 — Testing & Validación

### Gate de Design-HTML (Especializado) — ⚠️ OBJETIVO, NO IMPLEMENTADO

Lo de abajo es el diseño de validación que este proyecto necesita. **`gate/check.sh`
hoy es el genérico de SDD Anchored** (integridad, trazabilidad, anclaje, presupuesto de
contexto) — ninguno de estos 5 checks específicos está implementado todavía (no hay
`package.json`, ni `contrast-check`, ni `stylelint`/`html-validate` en el repo,
verificado 2026-10-16). Implementarlo es trabajo propio, no trivial (el check #3 ya
sabemos que falla hoy en `glassmorphism` — ver `state.md` Backlog) y requiere su propia
spec antes de tocar nada, igual que cualquier otro cambio no trivial de este proyecto.

```bash
# 1. Sincronización HTML (symlinks correctos en 21 estilos)
for estilo in design-html/*/; do
  [ -L "$estilo/index.html" ] || FALLA
  [ -L "$estilo/dashboard.html" ] || FALLA
done

# 2. Variables CSS: todos los 21 estilos definen familia completa
for estilo in design-html/*/css/style.css; do
  grep "^  --bg-primary:" $estilo || FALLA
  grep "^  --text-primary:" $estilo || FALLA
  [... resto de variables ...]
done

# 3. Contraste AA en light + dark (21 estilos × 2 modos = 42 validaciones)
npm run contrast-check

# 4. CSS sin errores
stylelint "design-html/*/css/style.css"

# 5. HTML válido
html-validate design-html/index.html design-html/dashboard.html
```

### Criterio de Aceptación (Fase 4)

- ✅ 21 estilos con symlinks correctos (1 check)
- ✅ 21 estilos definen todas las variables CSS (1 check)
- ✅ Contraste AA verificado en light + dark (42 validaciones)
- ✅ Stylelint sin errores (1 check)
- ✅ HTML válido (1 check)

---

## Art. 5 — Seguridad & Compliance

- **No hay backend** — HTML + CSS + JS mínimo compartido
- **Sin dependencias de red externas** — Tipografía del sistema, sin @import a Google Fonts
- **Tipografía del sistema** — `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'` + monoespaciado `ui-monospace`
- **No hay estado** — Stateless (solo visuals)

---

## Art. 6 — Redes & Infraestructura

**Design-HTML no se expone como servicio:**
- NO en `caddy.json`
- NO registrado en `cjhirashi-srv`
- NO en Docker Compose

**Pero proyectos que lo USAN sí tienen:**
- Harness (para desarrollo del proyecto)
- `caddy.json` (para exponerse)
- Docker network aislada

---

## Art. 7 — Nombres & Convenciones

### Prefijos de Feature

```
0001-html-landing        ← Cambios en landing.html compartido
0002-html-dashboard      ← Cambios en dashboard.html compartido
0003-css-variables       ← Cambios en familia :root
0004-component-navbar    ← Nuevos componentes
0005-component-table     ← Nuevos componentes
...
1001-estilo-01           ← Cambios en estilo #1 específico
```

### Commits

Conventional Commits + sufijo `(RF-NNN)`:

```
feat: add stat-card-expanded component (RF-001)
fix: contrast AA on --text-secondary dark mode (RF-002)
style: update glassmorphism accent colors (RF-001-glass-variants)
```

### Nombres de Estilos (Minúsculas, guiones)

```
apple-pro-studio
bento
brutalismo
canvas-workspace
enterprise-grid
glass-aurum / glass-ember / glass-borealis / glass-neon / glass-steel
glassmorphism
industrial
linear
minimalista
nordic-functional
material-flow
pulse-analytics
ledger-dark
storefront
stripe-enterprise
vercel
```

---

## Art. 8 — Reglas Innegociables (Principios P1-P9)

**P1: Gate siempre primero**
```bash
bash .harness/gate/check.sh
```
Antes de cualquier cambio.

**P2: Sincronización es sagrada**
- Cambios en `index.html` o `dashboard.html` = deben reflejarse en 21 estilos via symlinks
- NO duplicar HTML en cada carpeta de estilo
- NO editar symlinks manualmente

**P3: Variables CSS familia estándar**
- Todos los 21 estilos DEBEN definir la familia completa
- Nombre de variables NUNCA cambia, solo valores
- `[data-theme="dark"]` SIEMPRE presente y completo

**P4: Contraste AA obligatorio**
- Light mode: WCAG AA mínimo
- Dark mode: WCAG AA mínimo
- Especial atención en `--text-secondary` / `--text-muted`

**P5: Sin dependencias de red**
- No @import de Google Fonts
- No <link> a CDNs
- Tipografía del sistema únicamente
- Librerías de terceros (p. ej. `Motion`, ver `ADR-003`): se vendorizan en
  `js/vendor/` y se sirven desde el propio origen — nunca `<script src="https://…">`
  a un CDN, aunque sea un host "de confianza"

**P6: HTML agnóstico de estilo**
- NO hardcodear colores en HTML (data-theme en <html>)
- NO inline styles
- Todos los estilos via CSS variables

> P5 y P6 aplican tal cual a la pista vanilla (21 estilos). Su equivalente para la
> pista React (fuentes vía `next/font`, tokens vía CSS variables/Tailwind) está en ADR-001.

**P7: Copy siempre en español**
- Datos reales, dominio técnico
- Nunca lorem ipsum
- Jamás inglés

**P8: Convenciones de commits**
- Conventional Commits + (RF-NNN)
- Tags claros: feat/fix/style/docs/chore

**P9: No auto-aprobarse**
- `autor-de-spec` redacta, `arquitecto` planea, `experto-ux-ui` revisa la UI implementada
- `revisor` valida gates adversarialmente antes de merge
- Carlos firma Gate 4 (verified)

---

## Art. 9 — Hazards & Mitigaciones

### Problema 1: Divergencia de HTML en estilos

**Riesgo:** Alguien edita `index.html` en una carpeta de estilo manualmente.

**Mitigación:** 
- Symlinks + gate valida que son symlinks (no copias)
- CLAUDE.md lo explica bien

### Problema 2: Variables CSS faltantes en un estilo

**Riesgo:** Estilo nuevo no define todas las variables.

**Mitigación:**
- Gate valida familia completa en 21 estilos
- No pasa a merged si falta variable

### Problema 3: Contraste AA en modo oscuro

**Riesgo:** `--text-secondary` + `--bg-secondary` en dark mode falla AA.

**Mitigación:**
- `npm run contrast-check` valida 42 combinaciones (21 × 2 modos)
- Gate falla si alguna no pasa AA

### Problema 4: Componente nuevo olvidado en estilo

**Riesgo:** Se agrega `.card-expanded` en HTML pero un estilo no define su CSS.

**Mitigación:**
- Task matrix en tasks.md explícito: "T-003 a T-023: implementar CSS en 21 estilos"
- Revisor valida que las 21 tareas se cerraron

---

## Art. 10 — Documentación del Proyecto

### Ubicación de Artefactos

| Qué | Dónde |
|-----|-------|
| Guía UX/UI senior | CLAUDE.md (este repo) |
| Roles + especialistas | AGENTS.md |
| Método SDD | `.harness/method.md` |
| Especificaciones por feature | `.harness/specs/NNNN-*/spec.md` |
| Decisiones de diseño | `.harness/decisions/ADR-*.md` |
| Correcciones de Carlos | `.harness/memory/state.md` |
| Bitácora de sesiones | `.harness/memory/history.md` |
| Galería de estilos | `index.html` (raíz) |
| Referencia visual | `/home/cjhirashi/.openclaw/workspace-aira/DESIGN-SYSTEM-GALLERY.md` |

### Sincronización

- CLAUDE.md ← especificaciones de componentes
- AGENTS.md ← roles cuando se agregan nuevos (ver `.claude/agents/`)
- constitution.md ← cambios en decisiones P1-P9
- `.harness/specs/` ← cada cambio importante

---

## Art. 11 — Mapa de Servicios (Para cjhirashi-srv)

**Design-HTML NO se expone como servicio HTTP:**

```
NO caddy.json
NO en servicios-externos/proyectos.json
NO en cjhirashi-srv
```

**Es infraestructura de referencia local, copiable a otros proyectos.**

Cuando un proyecto USA diseño de design-html:

```bash
# Copiar estilo a proyecto
cp -r design-html/<estilo>/{index.html,dashboard.html,css/} \
  mi-proyecto/frontend/

# Cargar scripts compartidos
<script src="../../design-html/js/theme-manager.js"></script>
<script src="../../design-html/js/nav-toggle.js"></script>
```

---

## 🎯 Fases & Tareas Tipo

### Feature: "Agregar componente `.card-expanded`"

**Fase 1 (Specify):**
```
Spec: Tarjeta expandible con 4 slots (header, body, footer, actions)
Criterios: Debe funcionar en los 21 estilos manteniendo coherencia visual
```

**Fase 2 (Plan):**
```
Plan: 
- Agregar HTML en index.html + dashboard.html (1 lugar)
- Agregar clase base .card-expanded en base.css
- Cada estilo implementa .card-expanded + estados hover/active/focus
- Validar contraste AA en light + dark para 21 estilos
```

**Fase 3 (Tasks):**
```
T-001: Agregar .card-expanded HTML (1 tarea, afecta 21 estilos via symlinks)
T-002: Agregar CSS base
T-003 a T-023: Implementar .card-expanded en cada uno de 21 estilos (21 tareas)
T-024: Validar contraste AA (42 checks)
T-025: Documentar en CLAUDE.md
```

**Fase 4 (Implement):**
```
- Código + tests
- Revisor valida gates
```

---

## ✅ Rasgos Estructurales (fijos desde Génesis, no cambian con la fase)

- **Arquitectura:** Componentes visuales compartidos, symlinks como objetivo (ver Art. 2)
- **Estilos:** 21 (15 generales + 6 dashboard especializados + 5 glassmorphism variants)
- **HTML:** Compartido (landing + dashboard)
- **CSS:** Parametrizado (21 × `:root` + `[data-theme="dark"]`)
- **Variables:** Familia estándar (39 variables)
- **Componentes Base:** Navbar, hero, stats, table, footer
- **Responsive:** 900px (hamburguesa + off-canvas)

---

**Documento:** constitution.md — Design-HTML
**Proyecto:** design-html
**Fecha de Génesis:** 2026-10-10
**Responsable:** AIRA (especialista de diseño visual)
**Fase vigente:** ver `.harness/memory/state.md` (no se repite aquí para evitar que quede obsoleto)
