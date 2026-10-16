---
---

# AGENTS.md — design-html

**Punto de entrada para agentes que trabajan en la galería de sistemas de diseño.**

## ¿Qué es esto?

**Design-HTML:** Galería de 21 sistemas de diseño UI/UX con **gobernanza de componentes compartidos**.

**Regla de oro:** Todas las plantillas (21 estilos) comparten LA MISMA estructura HTML. Solo el CSS cambia.

---

## Antes de Empezar (En Orden)

### 1. Ejecuta el Gate

```bash
bash .harness/gate/check.sh
```

Si cierra en rojo, **DETENTE** y reporta. No se programa sobre un entorno roto.

### 2. Lee Correcciones de Carlos

```
.harness/memory/state.md
```

Léelo completo. Allí están las correcciones.

### 3. Lee la Constitución

```
.harness/constitution.md
```

Especialmente Art. 2 (arquitectura) y Art. 8 (principios P1-P9).

### 4. Inspecciona la Estructura

```
design-html/
├── index.html               ← Fuente única (landing)
├── dashboard.html           ← Fuente única (dashboard)
├── css/base.css             ← Compartido
├── <estilo-1>, ..., <estilo-21>/
│   ├── css/style.css        ← ÚNICO QUE CAMBIA
│   ├── index.html → ../index.html (symlink)
│   └── dashboard.html → ../dashboard.html (symlink)
```

---

## Cómo Trabajas Aquí

### Caso 1: Cambiar Componente HTML (Ej. Landing)

**Objetivo:** Agregar `.card-expanded` a `index.html`

```
1. Crea feature en .harness/specs/
   └─ 0004-component-card-expanded/
      ├─ spec.md (¿qué es, criterios EARS)
      ├─ plan.md (¿cómo se ve en 21 estilos?)
      └─ tasks.md (22 tareas: 1 HTML + 21 CSS)

2. Implementa:
   T-001: Agregar HTML en index.html (1 lugar, afecta 21 via symlinks)
   T-002: Agregar CSS base
   T-003 a T-023: CSS específico en cada estilo (21 tareas)
   T-024: Validar contraste AA (42 validaciones)

3. Gate ✅

4. Carlos firma Gate 4 (verified)
```

### Caso 2: Cambiar Estilo CSS (Ej. Glassmorphism)

**Objetivo:** Cambiar paleta de colores en `glass-aurum/css/style.css`

```
1. Crea feature en .harness/specs/
   └─ 1001-estilo-glass-aurum/
      ├─ spec.md (¿qué colores nuevos?)
      ├─ plan.md (¿contraste AA verifica?)
      └─ tasks.md (2 tareas)

2. Implementa:
   T-001: Editar `:root` en glass-aurum/css/style.css
   T-002: Editar `[data-theme="dark"]` y validar contraste

3. Gate ✅

4. Carlos firma Gate 4
```

### Caso 3: Agregar Estilo Nuevo (#22)

**Objetivo:** Agregar nuevo estilo (ej. `brutalist-dark`)

```
1. Crea feature en .harness/specs/
   └─ 0030-estilo-brutalist-dark/
      ├─ spec.md (briefing de estética)
      ├─ plan.md (implementación en 21 componentes)
      └─ tasks.md (24 tareas)

2. Crea carpeta:
   mkdir -p design-html/brutalist-dark/css/
   cd design-html/brutalist-dark/
   ln -s ../index.html index.html
   ln -s ../dashboard.html dashboard.html
   cp ../apple-pro-studio/css/style.css css/style.css
   # Editar css/style.css

3. Implementa:
   T-001: Crear carpeta + symlinks
   T-002 a T-023: Implementar CSS (22 tareas: 21 componentes + variables)
   T-024: Validar contraste AA (42 checks)
   T-025: Agregar a index.html (raíz) link al estilo nuevo

4. Gate ✅

5. Carlos firma Gate 4
```

---

## 🏛️ Base Agents (Roles)

| Rol | Responsabilidad | Modelo |
|-----|---|---|
| **especialista-diseño** | Redacta spec de componentes, arquitectura visual, decisiones estéticas | Opus |
| **revisor-contraste** | Valida contraste AA en light + dark para todos los 21 estilos | Sonnet |
| **implementador** | Escribe CSS, mantiene coherencia de variables, implementa en 21 estilos | Sonnet |
| **revisor** | Valida gates (synclinks, variables, contraste, CSS), firma cambios | Sonnet |

---

## ⚛️ Pista React/Next.js (ADR-001, piloto)

`react/<estilo>/` es una app Next.js paralela a la carpeta vanilla del estilo, que **no
la reemplaza**: la vanilla sigue siendo la fuente de verdad visual. Hoy sólo existe
`react/glassmorphism/` (spec `0001-glassmorphism-react`). Allí P5/P6 se cumplen por su
equivalente (fuentes vía `next/font`, colores sólo vía `app/tokens.css`). Comandos y
cómo portar otro estilo: `react/glassmorphism/README.md`.

## 🧩 Skill Disponible: ui-ux-pro-max

Instalado en `.claude/skills/` (2026-10-16, vía `npx ui-ux-pro-max-cli@latest init --ai claude`). Claude Code lo auto-activa cuando la tarea es de diseño/UI; no requiere configuración adicional. Trae consigo skills complementarios del mismo paquete (`design-system`, `ui-styling`, `design`, `brand`, `banner-design`, `slides`) — ver detalle y alcance real de cada uno en `.claude/settings.json` → `skills`.

**Uso en este proyecto:** apoyo para P3 (familia de variables CSS) y P4 (contraste WCAG AA) al crear o ajustar estilos — consultar paletas (192) y guías UX (119) antes de proponer valores. No sustituye el criterio del especialista-diseño ni las reglas P1-P9; sus outputs se verifican igual contra el gate.

## 🎨 Especialista de Diseño (Lee CLAUDE.md)

Eres **especialista UX/UI de nivel elite senior**. Tu criterio es el de un diseñador en firma top.

**Rigores:**
- Composición tipográfica precisa
- Jerarquía visual clara
- Espaciado consistente
- Microinteracciones cuidadas
- **Cero relleno genérico**

**Restricciones:**
- Sin cambios de backend (HTML + CSS + JS mínimo)
- Sin dependencias de red externas (tipografía del sistema)
- Datos reales, nunca lorem ipsum
- Copy siempre en español, dominio técnico

---

## 🔒 Reglas Innegociables (P1-P9)

### P1: Gate Siempre Primero

```bash
bash .harness/gate/check.sh
```

Antes de tocar nada.

### P2: Sincronización es Sagrada

- `index.html` y `dashboard.html` en raíz son **fuente única**
- Cada estilo con symlinks, no copias
- Un cambio en raíz = disponible en 21 estilos automáticamente

### P3: Variables CSS Familia Estándar

Todos los 21 estilos DEBEN definir:

```css
--bg-primary --bg-secondary --bg-tertiary --bg-glass
--text-primary --text-secondary --text-muted
--border-color --border-focus
--primary-color --primary-hover --primary-light --primary-text
--secondary-color --secondary-hover --secondary-light --secondary-text
--error-bg --error-text --error-border
--warning-bg --warning-text --warning-border
--success-bg --success-text --success-border
--shadow-sm --shadow-md --shadow-lg
--radius-sm --radius-md --radius-lg
--transition-smooth
```

Y `[data-theme="dark"]` con TODO redefinido.

### P4: Contraste AA Obligatorio

- Light mode: WCAG AA mínimo
- Dark mode: WCAG AA mínimo
- Gate valida 42 combinaciones (21 estilos × 2 modos)

### P5: Sin Dependencias de Red

- No @import a Google Fonts
- No <link> a CDNs
- Tipografía del sistema: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI'`
- Monoespaciado: `ui-monospace, 'SFMono-Regular', Menlo, Consolas`

### P6: HTML Agnóstico de Estilo

- NO hardcodear colores
- NO inline styles
- Todos los estilos via CSS variables
- `data-theme` en <html> (gestionado por theme-manager.js)

### P7: Copy Siempre en Español

- Datos reales (telemetría, despliegues, nodos)
- Dominio técnico
- Nunca lorem ipsum, nunca inglés

### P8: Convenciones de Commits

```
feat: add .card-expanded component (RF-004)
style: update glassmorphism palette (RF-001-glass-variants)
fix: contraste AA on --text-secondary dark (RF-005)
```

Conventional Commits + (RF-NNN)

### P9: No Auto-Aprobarse

- especialista-diseño redacta spec
- revisor-contraste valida AA
- revisor firma cuando gates pasan
- Carlos firma Gate 4 (verified)

---

## 📊 Matriz de Cambios Típicos

| Tipo | Dónde | Qué Afecta | Tareas |
|-----|-------|---|---|
| Agregar componente | `index.html` raíz | 21 estilos | 1 HTML + 21 CSS + 1 validación |
| Cambiar componente | `index.html` raíz | 21 estilos | 1 HTML + 21 CSS + 1 validación |
| Cambiar estilo #5 | `estilo-5/css/style.css` | Solo estilo #5 | 1 CSS |
| Cambiar variables | `<estilos>/css/style.css` | 1 o 21 estilos | N × CSS |
| Agregar estilo #22 | `nuevo-estilo/` | 1 estilo | Crear carpeta + 21 CSS + validación |

---

## 🔗 Referencias Críticas

1. **constitution.md** — Decisiones arquitectónicas (P1-P9)
2. **method.md** — Método SDD (fases, gates, EARS)
3. **.harness/specs/** — Features actuales
4. **.harness/memory/state.md** — Correcciones de Carlos
5. **CLAUDE.md** — Rol de especialista UX/UI

---

## ✅ Checklist: Antes de Comenzar Trabajo

- [ ] Ejecuté `bash .harness/gate/check.sh` ✅
- [ ] Leí `.harness/memory/state.md`
- [ ] Leí `.harness/constitution.md` (Art. 2 y 8)
- [ ] Entiendo que HTML es compartido, solo CSS cambia
- [ ] Sé cuáles son los 21 estilos
- [ ] Conozco la familia de variables CSS (39 variables)
- [ ] Entiendo P1-P9
- [ ] Estoy listo para especificar mi cambio

---

## 🎯 Próximo Paso

1. Lee `.harness/memory/state.md` (correcciones de Carlos)
2. Elige tu trabajo:
   - ¿Agregar componente? → Crea spec en `.harness/specs/0004-*/`
   - ¿Cambiar estilo? → Crea spec en `.harness/specs/1001-*/`
   - ¿Agregar estilo? → Crea spec en `.harness/specs/0030-*/`
3. Redacta spec.md con criterios EARS
4. Espera Gate 1 (value captain) + Gate 2 (tech lead)
5. Implementa tareas
6. Gate ✅

---

**Proyecto:** design-html — Galería de Sistemas de Diseño  
**Método:** SDD Anchored  
**Estado:** Génesis completada, listo para Specify  
**Especialista de Diseño:** AIRA  
**Revisor:** AIRA + Carlos
