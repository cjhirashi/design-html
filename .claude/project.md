# Design-HTML — Galería de Sistemas de Diseño

**Estado:** Génesis completada (2026-10-10), listo para Specify

## Qué es

Catálogo de **21 sistemas de diseño profesionales** con **componentes reutilizables** adaptados a múltiples estilos visuales. Cada componente existe en todas las variantes (Moderno, Minimalista, Corporativo, Glassmorphism, etc.) con CSS modular y design tokens exportables.

## Objetivo

Crear una librería extensible de componentes HTML/CSS puros (navbars, footers, sidebars, botones, cards, carruseles, modals, inputs, forms, etc.) que otros proyectos (Synapse, Hira, etc.) puedan copiar y adaptar rápidamente con el estilo visual que elijan.

## Stack

- **Frontend:** HTML5 + CSS3 (variables CSS, Flexbox, Grid)
- **Temas:** 21 estilos (apple-pro-studio, bento, brutalismo, canvas-workspace, enterprise-grid, glass-aurum, glass-borealis, glass-ember, glass-neon, glass-steel, glassmorphism, industrial, linear, minimalista, nordic-functional, material-flow, pulse-analytics, ledger-dark, storefront, stripe-enterprise, vercel)
- **Tipografía:** System fonts (sin dependencias de red, P5)
- **Validación:** WCAG AA contrast (light + dark), P4
- **Arquitectura:** HTML compartido (symlinks), CSS especializado por estilo (P2, P3)

## Reglas Duras (P1-P9)

1. **P1: Gate siempre primero** — `bash .harness/gate/check.sh` antes de tocar nada
2. **P2: Sincronización via symlinks** — `index.html` y `dashboard.html` en raíz son fuente única, no copias
3. **P3: Variables CSS estándar** — Todos los 21 estilos definen 39 variables obligatorias (colores, sombras, espaciado, transiciones)
4. **P4: Contraste AA obligatorio** — Light mode + dark mode, validado por gate
5. **P5: Sin dependencias de red** — Tipografía del sistema, no Google Fonts ni CDNs
6. **P6: HTML agnóstico** — Datos via CSS variables, nunca hardcodear estilos
7. **P7: Copy en español** — Datos reales (telemetría, despliegues, nodos), dominio técnico
8. **P8: Commits semánticos** — Conventional + (RF-NNN) para rastreabilidad
9. **P9: No auto-aprobarse** — Revisor + Carlos firman, especialista redacta

## Componentes Objetivo (MVP)

| Componente | Variantes | Estado |
|-----------|-----------|--------|
| Navbar | 21 estilos × 2 temas (light/dark) | Pendiente |
| Footer | 21 × 2 | Pendiente |
| Sidebar | 21 × 2 | Pendiente |
| Card | 21 × 2 | Pendiente |
| Button | 21 × 2 | Pendiente |
| Input/Textarea | 21 × 2 | Pendiente |
| Modal | 21 × 2 | Pendiente |
| Carrusel | 21 × 2 | Pendiente |
| Form | 21 × 2 | Pendiente |
| Badge/Tag | 21 × 2 | Pendiente |

**Total:** 10 componentes × 21 estilos × 2 temas = 420 variantes verificadas.

## Flujo SDD

| Fase | Quién | Qué |
|------|-------|-----|
| Specify | Claude Code | Redacta spec para cada componente (EARS) |
| Plan | Carlos | Revisa → Aprueba o reenforza |
| Tasks | Carlos | Desagrega tareas (1 HTML + 21 CSS + validación) |
| Implement | Claude Code | Código + CSS variables + gate |
| Review | Carlos | Revisa + merge |
| Verify | Carlos | Marca verificado en state.md |

## Próximos Pasos

1. **Setup symlinks** — Si no existen, ejecutar script en state.md
2. **Gate check** — Debe pasar ✅
3. **Crear primera feature** — Ej. "Agregar componente navbar" (SPEC-0001)
4. **Redactar spec.md** — Criterios EARS (qué se ve, cómo se comporta, cuándo se usa, por qué importa)
5. **Implementar en paralelo** — 1 HTML + 21 CSS + validación contraste

## Design Tokens Export

Cada estilo genera `design-tokens/<estilo>.json`:

```json
{
  "style": "moderno-azul-naranja",
  "colors": {
    "primary": "#0066CC",
    "secondary": "#FF6600",
    "...": "..."
  },
  "typography": {
    "body": "Inter, system-ui",
    "heading": "Poppins, system-ui",
    "mono": "Menlo, ui-monospace"
  },
  "spacing": { "xs": "0.25rem", "sm": "0.5rem", "...": "..." },
  "shadows": { "sm": "...", "md": "...", "...": "..." }
}
```

Exportables para Synapse, Hira, u otros proyectos.

## Referencias

- `.harness/constitution.md` — Decisiones arquitectónicas
- `.harness/method.md` — Método SDD
- `.harness/specs/` — Features en ejecución
- `.harness/memory/state.md` — Correcciones + hazards

---

**Proyecto:** Design-HTML  
**Método:** SDD Anchored  
**Especialista:** AIRA (Claude Code)  
**Revisor:** AIRA + Carlos  
**Lanzamiento:** Inmediato (en paralelo a Synapse SPEC-0005)
