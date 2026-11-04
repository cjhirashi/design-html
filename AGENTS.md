---
---

# AGENTS.md — design-html

**Punto de entrada para agentes que trabajan en la galería de sistemas de diseño.**

## ¿Qué es esto?

**Design-HTML:** Galería de sistemas de diseño UI/UX con **gobernanza de componentes compartidos**. Regla de oro: todas las plantillas comparten LA MISMA estructura HTML — solo el CSS cambia.

---

## Antes de Empezar (En Orden)

1. `bash .harness/gate/check.sh` — si cierra en rojo, **DETENTE** y reporta.
2. Lee `.harness/memory/state.md` completo (correcciones y fase vigente de Carlos).
3. Lee `.harness/constitution.md` — especialmente Art. 2 (arquitectura) y Art. 8 (P1-P9).

### Estructura (objetivo del Art. 2; estado real en `state.md`)

```
design-html/
├── index.html               ← Fuente única (landing)
├── dashboard.html           ← Fuente única (dashboard) — AÚN NO EXISTE, ver state.md
├── css/base.css             ← Compartido
├── <estilo-1>, ..., <estilo-21>/
│   ├── css/style.css        ← ÚNICO QUE CAMBIA
│   ├── index.html           ← HOY es copia, no symlink (conversión pendiente, feature propia)
│   └── dashboard.html
└── react/<estilo>/          ← Pista paralela opcional (ADR-001), hoy solo glassmorphism
```

---

## Cómo Trabajas Aquí

Este repo usa **Slice Development** (piloto desde 2026-10-25, reemplaza a SDD Anchored — `.harness/method.md §0`). Todo cambio no trivial entra por `.harness/specs/NNNN-slug/backlog.md` como historias/slices chicas ("Slice N"), refinadas solo al tomarlas — nunca como spec completa planificada de punta a punta. Prefijos: `0NNN-*` para HTML/CSS/componentes compartidos (afectan los 21 estilos), `1NNN-estilo-*` para un estilo específico. Ver la matriz abajo para el patrón de tareas de cada tipo; los roles y fases exactas están en `.harness/method.md §1-4` (no se repiten aquí).

### Matriz de Cambios Típicos

| Tipo | Dónde | Qué Afecta | Tareas típicas |
|-----|-------|---|---|
| Agregar/cambiar componente compartido | `index.html`/`dashboard.html` raíz | 21 estilos | 1 HTML + 21 CSS + validación |
| Cambiar estilo existente | `<estilo>/css/style.css` | Solo ese estilo | 1-2 CSS |
| Agregar estilo nuevo | `<estilo-nuevo>/` | 1 estilo | Crear carpeta + CSS + validación + link en `index.html` |
| Pista React de un estilo | `react/<estilo>/` | Solo esa pista (ADR-001) | Ver `react/glassmorphism/README.md` |

---

## 🏛️ Agentes de Claude Code (`.claude/agents/`)

Roles y responsabilidades completos en `.harness/method.md §8` (canon único, no se repite aquí). Modelo por rol — **id explícito, nunca alias** (`method.md §7`: `sonnet` resuelve a `claude-sonnet-5`, `haiku` a `claude-haiku-4-5-20251001`, `opus` a `claude-opus-4-8`, así que un `model: sonnet` en `.claude/agents/` cuenta como defecto de configuración):

| Rol | Modelo | Por qué |
|-----|--------|---|
| `orquestador` | `claude-sonnet-5-5` | Clasifica con rúbrica escrita y sostiene las puertas; decide qué se delega, no diseña |
| `autor-de-spec` | `claude-opus-5` | Fase 1 · elicitación: la fase de mayor juicio y la más cara de deshacer (método §7) |
| `arquitecto` | `claude-opus-5` | Fase 2 · diseño y contratos — el caso que justifica Opus (método §7) |
| `implementador` | `claude-haiku-5-5` | TDD paso a paso sobre `tasks.md` ya aprobado: el plan trae el razonamiento. Si no resuelve una falla, vuelve a `arquitecto`/`autor-de-spec`; no sube de modelo por su cuenta |
| `revisor` | `claude-sonnet-5-5` | Veredicto adversarial: juzgar si la tarea está mal es razonamiento |
| `explorador` | `claude-haiku-5-5` | Búsqueda read-only acotada, salida de 5–15 líneas |
| `experto-ux-ui` (dominio, ver abajo) | `claude-sonnet-5-5` | Criterio visual contra estándar escrito (WCAG AA, consistencia), no arquitectura |

`claude-opus-5-5` todavía no se usa: devuelve HTTP 400 con el binario `claude` 2.1.197 que gana el PATH del Gateway (Opus 5.5 exige ≥ 2.1.280).

**Subagentes ad-hoc:** toda llamada `Task`/Agent que **no** invoque uno de estos roles **debe** declarar `model` explícito — sin la clave hereda el modelo de la sesión padre, y el heredado casi nunca es el que la tarea pide. Defaults por forma de tarea en `.harness/method.md §7`; investigación read-only y reporte mecánico van a `claude-haiku-5-5`. Si la tarea cabe en un rol de la tabla, usa el rol: `explorador` cubre toda la investigación read-only. Precedente medido 2026-10-30: la revisión UX/UI de este proyecto corrió en Opus ($64.36 de valoración a precio de lista) cuando la tabla ya decía Sonnet.

---

## ⚛️ Pista React/Next.js (ADR-001, piloto)

`react/<estilo>/` es una app Next.js paralela a la carpeta vanilla del estilo, que **no la reemplaza**: la vanilla sigue siendo la fuente de verdad visual. Hoy solo existe `react/glassmorphism/` (specs `0001-glassmorphism-react` y `0002-estructura-html-catalogo`: las 7 vistas del catálogo —landing, dashboard de 7 vistas conmutables, blog listado/detalle con Markdown real, productos listado/detalle, contacto funcional— en ambas pistas). Allí P5/P6 se cumplen por su equivalente (fuentes vía `next/font`, colores solo vía `app/tokens.css`). Reglas completas en `decisions/ADR-001-track-react-paralelo.md`. Comandos y cómo portar otro estilo: `react/glassmorphism/README.md`.

## 🧩 Skills Disponibles (`.claude/skills/`)

- **`ui-ux-pro-max`** (+ 6 complementarios del mismo paquete: `design-system`, `ui-styling`, `design`, `brand`, `banner-design`, `slides`) — instalado 2026-10-16 vía `npx ui-ux-pro-max-cli@latest init --ai claude`. Apoyo para P3/P4: consultar paletas y guías UX antes de proponer valores. Alcance real de cada uno en `.claude/settings.json` → `skills`.
- **`frontend-design-pro`** — criterio de diseño (tipografía/color/motion) vía `/audit`, `/polish`, etc. Su regla "evitar degradados violeta" puede chocar con la identidad de un estilo; en ese caso prevalece el brief del estilo (precedente: piloto React de glassmorphism).

Ninguno sustituye el criterio del `experto-ux-ui` ni las reglas P1-P9; sus outputs se verifican igual contra el gate.

## 🎨 Especialista de Dominio: `experto-ux-ui`

Criterio de **diseñador senior de firma top**: composición tipográfica precisa, jerarquía visual clara, espaciado consistente, microinteracciones cuidadas, cero relleno genérico. Restricciones del proyecto: sin backend, sin dependencias de red (tipografía del sistema), datos reales (nunca lorem ipsum), copy siempre en español y de dominio técnico.

---

## 🔒 Reglas P1-P10

Viven en `.harness/constitution.md` Art. 8 — **canon único, no se repiten aquí** (`method.md §10`). Resumen de una línea para orientarte: P1 gate primero · P2 sincronización de HTML compartido · P3 familia de variables CSS estándar · P4 contraste AA · P5 sin red · P6 HTML agnóstico de estilo · P7 copy en español · P8 Conventional Commits + RF-NNN · P9 no auto-aprobarse (Carlos firma Gate 4) · P10 Motion es el estándar de animación (vendorizado en vanilla, npm en React).

---

## 🔗 Referencias Críticas

1. `.harness/constitution.md` — decisiones arquitectónicas y P1-P9
2. `.harness/method.md` — método SDD (fases, gates, roles, EARS)
3. `.harness/specs/` — features actuales
4. `.harness/memory/state.md` — fase vigente y correcciones de Carlos
5. `CLAUDE.md` — protocolo de arranque

---

## ✅ Checklist Antes de Comenzar

- [ ] `bash .harness/gate/check.sh` en verde
- [ ] Leí `.harness/memory/state.md` (fase y correcciones vigentes)
- [ ] Leí `.harness/constitution.md` Art. 2 y 8
- [ ] Hay una historia/slice en `backlog.md` que cubre mi cambio (o la voy a agregar — no hay vía libre sin ella)

---

**Proyecto:** design-html — Galería de Sistemas de Diseño
**Método:** Slice Development (piloto desde 2026-10-25)
**Fase vigente:** ver `.harness/memory/state.md` (no se repite aquí para evitar que quede obsoleto)

## Documentación

- 🔴 **Docs en el mismo commit:** todo cambio de código actualiza los README/docs que deja obsoletos
  (mapa de documentación) o declara `Docs actualizadas: ninguna — <motivo>`. El gate lo exige.
