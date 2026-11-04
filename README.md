# design-html

Galería de sistemas de diseño UI/UX: 21 estilos (glassmorphism, bento, brutalismo, linear,
vercel, stripe-enterprise, material-flow, nordic-functional, ledger-dark…) con la misma
estructura de página, de modo que solo cambia el estilo. Sirve de referencia visual para
los proyectos del portafolio.

- **Índice de estilos:** [`index.html`](index.html) (landing de la galería con enlace a cada estilo).
- **Despliegue:** `design-html.cjhirashi.com`, vía el contenedor de la pista React de
  `glassmorphism` (`docker-compose.yml`, puerto 3100 → 3000) detrás del proxy de `cjhirashi-srv`
  (`caddy.json`, red `net-design-html`).

## Estructura

```
design-html/
├── index.html                 # Índice de la galería
├── <estilo>/                  # 21 estilos (pista vanilla, la fuente de verdad visual)
│   ├── index.html             # Landing del estilo
│   ├── dashboard.html         # Dashboard del estilo (vistas conmutables)
│   └── css/                   # Hoja del estilo: lo único que cambia entre estilos
├── js/                        # Scripts compartidos: tema, navegación, formulario, vistas del dashboard
├── react/glassmorphism/       # Pista paralela React/Next.js del estilo glassmorphism (ADR-001)
├── docker-compose.yml         # Contenedor de la pista React
├── caddy.json                 # Contrato con cjhirashi-srv (host y puerto)
└── .harness/                  # Arnés de desarrollo (Slice Development)
```

## Pista React (`react/glassmorphism/`)

Port del estilo `glassmorphism/` a Next.js (App Router) + Tailwind v4 + next-themes + Motion + MagicUI.
Implementa las 7 vistas del catálogo (landing, dashboard de 7 vistas conmutables, blog con
detalle en Markdown real, productos, contacto). Comandos de desarrollo, build y pruebas
(Vitest, Playwright) en [`react/glassmorphism/README.md`](react/glassmorphism/README.md).

La pista vanilla sigue siendo la fuente de verdad visual; la React es paralela y opcional
([ADR-001](.harness/decisions/ADR-001-track-react-paralelo.md)).

## Cómo trabajamos

Reglas, mapa del repo y flujo de cambios para agentes y desarrolladores: [`AGENTS.md`](AGENTS.md).
Estado vigente y backlog: `.harness/memory/state.md` y `.harness/specs/`. Antes de cerrar un
cambio: `bash .harness/gate/check.sh`.
