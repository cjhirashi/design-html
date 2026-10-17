---
ultima_actualizacion: 2026-10-16
fase: Catálogo ampliado (ADR-002) — construcción pendiente, en glassmorphism primero
arquitectura_verificada: True
---

# State — design-html

## Correcciones & Contexto Actual

### Catálogo ampliado + ratificación del piloto React (2026-10-16, chat Carlos↔AIRA)

- **Gate 2 de `0001-glassmorphism-react` ratificado** y **`ADR-001` aceptado** (antes
  *proposed*/pendiente) — Carlos: "este se vuelve la base de todo lo que sigue". La
  aprobación quedó registrada en `spec.md`/`plan.md` (`aprobaciones.fase_2`) y en el
  frontmatter de `ADR-001`, con nota de que se dio en chat con AIRA, no en una sesión de
  Claude Code dentro del repo.
- **`ADR-002` (nuevo, accepted):** el catálogo se amplía mucho más allá de la landing y
  el dashboard simples de Génesis — inventario completo validado contra
  `cjhirashi-career` (navbar/hero/cards/carrusel/footer/blog/productos/contacto en
  landing; gráficos/alertas/tabla/registro/formularios con tipos de campo reales en
  admin) **más un sistema de tokens de motion** (animación es alcance explícito, no un
  añadido posterior). Estrategia: construirlo **una sola vez en `glassmorphism`**
  (vanilla + `react/glassmorphism`, en paridad) y replicarlo a los otros 20 estilos solo
  cuando esa estructura cierre — evita 21 reimplementaciones mientras el diseño es
  inestable. Detalle completo: `decisions/ADR-002-glassmorphism-laboratorio-canonico.md`.
- `constitution.md` Art. 1 y Art. 3 actualizados para reflejar este alcance real (no se
  repite aquí — un canon por hecho, `method.md §10`).
- Roadmap de specs candidatas (orden aún sin decidir por Carlos) — ver Backlog #1.
- Fuera de alcance por ahora: panel de chat/asistente (visto en `bedrock/*` de
  `cjhirashi-career`, específico de ese proyecto, no genérico).

### Reparación de harness (2026-10-16, a solicitud de Carlos — "harness al 100 operativo")

AIRA auditó y corrigió deuda de harness acumulada desde Génesis:
- `model: opus` fijado en `autor-de-spec.md`/`arquitecto.md` (faltaba, method.md §7).
- `AGENTS.md`: 311→111 líneas — quitada la duplicación de P1-P9 (ya vivían en
  `constitution.md` Art. 8, `method.md §10` prohíbe repetir el canon) y la tabla de roles
  obsoleta (`especialista-diseño`/`revisor-contraste`, que nunca existieron como agentes
  reales) corregida a los 7 roles reales de `.claude/agents/`.
- `constitution.md`: mismos nombres de rol obsoletos corregidos en Art. 8/10; frontmatter
  ya no duplica la fase (vivía también aquí, en `state.md` y en el footer — un solo canon
  ahora); Art. 2 y el footer ahora marcan explícitamente "symlinks es el objetivo, hoy son
  copias" en vez de darlo por hecho.
- **Hallazgo nuevo:** el "Gate de Design-HTML (Especializado)" del Art. 4 (symlinks,
  familia CSS P3, contraste AA P4, stylelint, html-validate) **nunca se implementó** —
  no hay `package.json` ni `contrast-check` ni `stylelint`/`html-validate` en el repo. El
  `gate/check.sh` real es el genérico de SDD Anchored; no valida nada de lo que el Art. 4
  describe. Queda como Backlog #6 (abajo) — es trabajo propio no trivial, no un ajuste
  suelto, y requiere su propia spec antes de tocar nada (igual que cualquier otro cambio
  de este proyecto).
- `frontend-design-pro`: la nota de abajo ("si se quiere, hay que instalarla") estaba
  **desactualizada** — ya estaba copiado completo en `.claude/skills/frontend-design-pro/`
  (idéntico a `workspace-aira/skills/frontend-design-pro/`), solo sin commitear. Commiteado.
- Gate verificado en verde tras los cambios (ver próxima entrada de `history.md`).
- **Lo que NO se tocó (requiere tu decisión, no son fixes de harness):** ratificación de
  Gate 2 del piloto React, aceptación/rechazo de ADR-001, revisión visual, réplica a
  `glass-*`, corrección AA/P3 de `glassmorphism` vanilla, variedad estructural de
  dashboards, e implementar el gate especializado del Art. 4.

### Piloto pista React — 0001-glassmorphism-react (2026-10-16)

- Rama local **`feature/glassmorphism-react-pilot`**, sin push ni merge (main está
  desplegado en GitHub; un push a main puede disparar deploy). Nada se publica hasta que
  Carlos lo apruebe explícitamente.
- **ADR-001** (`decisions/ADR-001-track-react-paralelo.md`, estado **accepted** desde
  2026-10-16): pista React/Next.js paralela en `react/<estilo>/`, la vanilla sigue siendo
  fuente de verdad visual; P5/P6 vanilla intactos; equivalente React = `next/font` local
  y tokens P3 en `app/tokens.css`. Constitución Art. 2 enlaza el ADR.
- App `react/glassmorphism/` (spec `implemented`, Gate 2 **ratificado**): landing +
  dashboard, Vitest 204 + Playwright 31 en verde. Cómo correr/portar:
  `react/glassmorphism/README.md`.
- **Pendiente humano:** revisión visual (nadie la hizo todavía); réplica a
  `glass-aurum/ember/borealis/neon/steel` queda pospuesta hasta cerrar el catálogo
  ampliado en glassmorphism (ADR-002) — ya no es "solo cambiar tokens", portaría una
  estructura todavía incompleta.
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

1. **Roadmap del catálogo ampliado (ADR-002), orden pendiente de que Carlos decida** —
   candidatas (todas con alcance "solo glassmorphism, vanilla + react en paridad", no 21
   estilos): sistema de tokens de motion (fundacional, análogo a P3) · navbar variants ·
   hero variants · card variants · carrusel/galería · footer variants · blog (listado +
   detalle) · productos (listado + detalle) · formulario de contacto · chart types ·
   alert variants · table view · record view · form field types (texto/número/boolean/
   select/creatable-select/FK-select/FK-multi-select/fecha/archivo/json-list). Cada una
   es su propia spec (`0NNN-*`), por P1 (no hay vía libre sin spec).
2. Revisión visual del piloto React (pendiente, nadie la hizo todavía).
3. Corregir AA y P3 en `glassmorphism/css/style.css` vanilla (feature `1001-*`) — se
   puede hacer antes o junto con el catálogo ampliado, es independiente.
4. Cuando el catálogo cierre en glassmorphism: replicar a los otros 20 estilos
   (symlinks + retoque de tokens de color/motion por estilo) y resolver ahí la variedad
   estructural de los 6 Estilos de Dashboard.
5. Implementar el gate especializado del Art. 4 (symlinks, familia CSS P3, contraste AA
   P4, stylelint, html-validate) — hoy es solo aspiración documentada, no código. Requiere
   spec propia; el check de AA ya sabemos que fallaría en `glassmorphism` (ver arriba).

### Notas para Carlos

- Design-HTML NO se expone vía cjhirashi-srv (infraestructura local).
- `frontend-design-pro` ya está instalado en `.claude/skills/` de este repo (commiteado
  2026-10-16) — disponible para Claude Code vía `/audit`, `/polish`, etc.
