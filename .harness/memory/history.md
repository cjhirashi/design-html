# History — design-html

## [2026-10-16] 0001-glassmorphism-react — ajustes tras revisión visual (spec §6.1)
- **Fase alcanzada:** implement
- **Rebotes del verificador:** 0 (sin nueva ronda del revisor; se recomienda una antes de aprobar)
- **Directiva de Pausa:** no (cambio pedido por Carlos; valores registrados en spec §6.1 antes de tocar código; RNF-004 nuevo)
- **Drift / re-anchor:** no
- **Anclas movidas:** 0001-glassmorphism-react → commit de cierre de estos ajustes
- **Gate:** verde
- **Docs actualizadas:** spec §6.1 + RNF-004, plan (Implementación de RNF-004), tasks T-024..T-026
- **Decisiones de diseño / límites de integración:** Reveal ya no oculta: visible en SSR/sin JS; sólo desplaza y 16→0 si hidrata bajo el pliegue (nunca opacidad). --aurora-ray 0.6 oscuro / violeta 0.5 claro. Claro: --bg-card 0.35, --border-glass violeta 0.16. Etiquetas de galería en bg-glass (regresión de contraste detectada en captura y corregida).
- **Próximo paso:** Carlos revisa visualmente en el dev server; si la aurora en oscuro sigue siendo sutil, el siguiente ajuste es de componente (menos blur/más rayos), no de tokens.

## [2026-10-16] 0001-glassmorphism-react (piloto pista React) — implementado en rama, pendiente de aprobación humana
- **Fase alcanzada:** implement
- **Rebotes del verificador:** 1 (revisor: tabla de cobertura sin cerrar + test-first no demostrable por git; menores en tests de RF-007/RNF-003/RF-005 y drift del plan — todo atendido; test-first queda como excepción declarada en tasks.md)
- **Directiva de Pausa:** no (los desvíos encontrados en Fase 4 se resolvieron dentro del alcance y quedan registrados en spec §6/plan §7: MotionConfig no anula `y` de variantes → CSS motion-reduce; cajón fixed generaba scroll → overflow-x-clip + test de desborde real)
- **Drift / re-anchor:** no
- **Anclas movidas:** 0001-glassmorphism-react → commit de cierre de la rama feature/glassmorphism-react-pilot
- **Gate:** verde (18 ok · 1 warn preexistente: AGENTS.md > 200 líneas)
- **Docs actualizadas:** constitution.md (Art. 2 extensión + nota P5/P6), ADR-001 (nuevo, proposed), AGENTS.md, react/glassmorphism/README.md, gate/services.txt, memory/state.md
- **Decisiones de diseño / límites de integración:** paleta = tokens reales del vanilla (#0b1020/#f5f3ff + violeta/rosa), no #071018 (es de las variantes glass-*); aurora = MagicUI light-rays (no existe "Aurora background"; warp-background no evoca aurora); textos muted/semánticos oscurecidos para AA (P4 > fidelidad).
- **Próximo paso:** Carlos revisa la rama (sin push), ratifica Gate 2 del plan y acepta/rechaza ADR-001; luego AIRA decide si se replica a glass-* (sólo cambiar app/tokens.css).

**Resumen para Carlos (piloto React):**
- *Hecho:* commits separados de Génesis del arnés (nunca commiteada) y de ui-ux-pro-max; rama `feature/glassmorphism-react-pilot`; ADR-001; spec/plan/tasks 0001; app `react/glassmorphism/` (Next 16 App Router, Tailwind v4, next-themes, Motion, MagicUI light-rays, Geist auto-hospedada) con landing + dashboard responsive, tema claro/oscuro/sistema sin FOUC y reduced-motion; Vitest 204 + Playwright 31 en verde.
- *Falta / pendiente humano:* aprobación de Fase 2 (plan) y de ADR-001; revisión visual de Carlos; PR/merge (no se hizo, por instrucción). `frontend-design-pro` no está instalada para Claude Code (vive en workspace-aira/skills); /audit y /polish se aplicaron leyendo su SKILL.md. Su regla "evitar degradados violeta" choca con la identidad del estilo: prevaleció el brief.
- *Probar:* `cd react/glassmorphism && npm install && npm run dev` → http://localhost:3000 y /dashboard. Tests: `npm test`, `npm run test:e2e` (ver README si Chromium no arranca por libs del sistema).

## Session 2026-10-10 (Génesis)

**Evento:** Génesis de harness SDD Anchored para design-html

- **Fase alcanzada:** Génesis completada
- **Qué se hizo:**
  - Copiar harness/reference/ → design-html/.harness/
  - Redactar constitution.md especializada (arquitectura de componentes compartidos + symlinks)
  - Redactar AGENTS.md con roles (especialista-diseño, revisor-contraste)
  - Rellenar memory/state.md
  - Verificar symlinks en 21 estilos (ya existían como copias)

- **Decisiones cristalizadas:**
  - P1-P9 de Constitution
  - Arquitectura: HTML compartido (raíz) + CSS por estilo
  - 21 estilos (15 generales + 6 dashboard + 5 glassmorphism)
  - Variables CSS familia estándar (39 variables, no negociable)
  - Gate especializado: valida synclinks, variables, contraste AA

- **Rebotes del verificador:** 0
- **Status del gate:** Pendiente de ejecutar (requiere npm install + scripts de contraste)
- **Documentación:** 
  - constitution.md ✅
  - AGENTS.md ✅
  - memory/state.md ✅
  - DESIGN-SYSTEM-GALLERY.md en wiki ✅

- **Próximo paso:** 
  1. Ejecutar `bash .harness/gate/check.sh` (requiere npm + html-validate + stylelint)
  2. Crear primer feature (ej. 0001-html-landing o 0004-component-card-expanded)
  3. Especificar cambio en spec.md con criterios EARS
  4. Avanzar a Specify

**Notas:**
- Design-HTML es infraestructura de referencia visual, NO se expone en cjhirashi-srv
- Harness especializado porque requiere validación de sincronización + contraste AA
- Los 21 estilos actualmente tienen copias de index.html/dashboard.html (no symlinks reales)
  → Próximo paso: evaluar si convertir a symlinks o mantener copias (decision para Specify)

---

**Documento:** history.md — Bitácora de Sessions  
**Proyecto:** design-html  
**Creado:** 2026-10-10  
**Estado:** Génesis completada
