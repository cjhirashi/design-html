---
proyecto: design-html
fase_actual: Génesis
arquitectura: componentes-visuales-compartidos
estado: greenfield-gobernado
especialista-ux-ui: True
---

# Constitution — design-html

## Art. 1 — Propósito

**Galería de 21 sistemas de diseño UI/UX con gobernanza de componentes compartidos.**

Objetivo: Proporcionar referencia visual + plantillas reutilizables para que todos los proyectos (Hira, Synapse, IA Engine, etc.) elijan estética visual coherente y consistente.

Restricción crítica: **Todas las plantillas (21 estilos) comparten LA MISMA estructura HTML. Solo el CSS cambia.**

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

### Decisión: Symlinks vs. Copias

**Elegido: Symlinks**

- ✅ Un cambio en `index.html` = disponible en 21 estilos al instante
- ✅ Sincronización garantizada
- ✅ No hay divergencia accidental
- ✅ Mantenimiento centralizado

---

## Art. 3 — Servicios & Contenido

### Vistas Principales

1. **Landing** (`index.html`)
   - Navbar (logo, nav-links, theme-switch, menu toggle)
   - Hero (título, subtítulo, CTA)
   - Sección features (badges de estado)
   - Galería/carrusel
   - Footer (crédito obligatorio)

2. **Dashboard** (`dashboard.html`)
   - Topbar (breadcrumb, search, notificaciones, user)
   - Sidebar-left (menu, profile, links, theme-switch)
   - Main-content (header, stats-grid, data-table)
   - Sidebar-right (chat/asistente)

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

### Gate de Design-HTML (Especializado)

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

**P6: HTML agnóstico de estilo**
- NO hardcodear colores en HTML (data-theme en <html>)
- NO inline styles
- Todos los estilos via CSS variables

**P7: Copy siempre en español**
- Datos reales, dominio técnico
- Nunca lorem ipsum
- Jamás inglés

**P8: Convenciones de commits**
- Conventional Commits + (RF-NNN)
- Tags claros: feat/fix/style/docs/chore

**P9: No auto-aprobarse**
- Revisor valida gates antes de merge
- especialista-diseño + revisor-contraste firman cada feature

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
- AGENTS.md ← roles cuando se agregan nuevos (revisor-contraste, especialista-diseño)
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

## ✅ Estado Inicial (Génesis)

- **Fase:** Génesis completada
- **Arquitectura:** Componentes visuales compartidos con symlinks
- **Estilos:** 21 (15 generales + 6 dashboard especializados + 5 glassmorphism variants)
- **HTML:** Compartido (landing + dashboard)
- **CSS:** Parametrizado (21 × `:root` + `[data-theme="dark"]`)
- **Variables:** Familia estándar (39 variables)
- **Componentes Base:** Navbar, hero, stats, table, footer
- **Responsive:** 900px (hamburguesa + off-canvas)
- **Gate:** Listo, requiere `npm install` + scripts de validación

---

**Documento:** constitution.md — Design-HTML  
**Proyecto:** design-html  
**Fecha:** 2026-10-10  
**Responsable:** AIRA (especialista de diseño visual)  
**Estado:** Génesis completada, listo para Specify
