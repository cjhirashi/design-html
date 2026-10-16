---
ultima_actualizacion: 2026-10-16
fase: Piloto React 0001 implementado en rama (pendiente aprobación humana)
arquitectura_verificada: True
---

# State — design-html

## Correcciones & Contexto Actual

### Piloto pista React — 0001-glassmorphism-react (2026-10-16)

- Rama local **`feature/glassmorphism-react-pilot`**, sin push ni merge (main está
  desplegado en GitHub; un push a main puede disparar deploy). Nada se publica hasta que
  Carlos lo apruebe explícitamente.
- **ADR-001** (`decisions/ADR-001-track-react-paralelo.md`, estado *proposed*): pista
  React/Next.js paralela en `react/<estilo>/`, la vanilla sigue siendo fuente de verdad
  visual; P5/P6 vanilla intactos; equivalente React = `next/font` local + tokens P3 en
  `app/tokens.css`. Constitución Art. 2 enlaza el ADR.
- App `react/glassmorphism/` (spec `implemented`): landing + dashboard, Vitest 204 +
  Playwright 31 en verde. Cómo correr/portar: `react/glassmorphism/README.md`.
- **Pendiente humano:** Gate 2 (plan) no ratificado; aceptar/rechazar ADR-001; revisión
  visual; decidir si se replica a `glass-aurum/ember/borealis/neon/steel`.
- **Hallazgos colaterales (fuera de alcance, no tocados):** el `style.css` vanilla de
  glassmorphism no cumple AA en `--text-muted` (2.3:1 claro, 3.7:1 oscuro) ni en textos
  semánticos claros, y no define la familia P3 completa; su HTML tiene etiquetas en inglés
  ("Success State", "Cyan Core") contra P7.
- Entorno: Playwright 1.64 necesita libs del sistema que no están; se extrajeron sin root en
  `~/.cache/pw-libs` (ver README). Con sudo: `npx playwright install-deps chromium`.

### Skill ui-ux-pro-max Integrado de Verdad (2026-10-16)

Instalado vía `npx ui-ux-pro-max-cli@latest init --ai claude` → `.claude/skills/` (7
skills). `.claude/settings.json` lista el alcance real de cada uno. Commit propio
(`chore: install ui-ux-pro-max…`). Pendiente corregir la wiki de AIRA: `--ai openclaw` no
es valor válido del CLI v2.15.0.

### Génesis (2026-10-10)

Harness instalado; commiteado recién el 2026-10-16 (commit `chore(harness): …`).

### Decisión Arquitectónica: Symlinks — NO aplicada aún

El Art. 2 describe symlinks a `index.html`/`dashboard.html` de raíz, pero cada carpeta de
estilo tiene **copias** y no existe `dashboard.html` en raíz (verificado 2026-10-16).
Convertir a symlinks exige unificar primero los HTML (hoy difieren por estilo) → feature
propia con spec.

### Reglas Vigentes (P1-P9)

P1 gate primero · P2 sincronización vía symlinks · P3 familia `:root` estándar · P4 AA
light+dark · P5 sin red (pista React: equivalente en ADR-001) · P6 HTML agnóstico (pista
React: equivalente en ADR-001) · P7 español · P8 Conventional Commits + (RF-NNN) · P9 no
auto-aprobarse.

### Backlog

1. Aprobación humana del piloto React (Gate 2 + ADR-001 + revisión visual).
2. Si se aprueba: portar las 5 variantes `glass-*` (sólo `app/tokens.css`).
3. Corregir AA y P3 en `glassmorphism/css/style.css` vanilla (feature 1001-*).
4. Variedad estructural en los 6 Estilos de Dashboard (pendiente previo).
5. AGENTS.md > 200 líneas (aviso del gate) — consolidar.

### Notas para Carlos

- Design-HTML NO se expone vía cjhirashi-srv (infraestructura local).
- `frontend-design-pro` vive en `workspace-aira/skills/`, no en `.claude/skills/` de este
  repo; si se quiere como skill de Claude Code aquí, hay que instalarla.
