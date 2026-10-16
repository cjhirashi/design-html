---
id: PLAN-0001
tipo: plan
feature: 0001-glassmorphism-react
estado: draft
aprobaciones:
  fase_2: pendiente   # implementación ejecutada bajo instrucción explícita de sesión (2026-10-16); falta ratificación humana del plan
actualizado: 2026-10-16
---

# PLAN-0001 · Piloto glassmorphism en React/Next.js

## 0. Gates de simplicidad
- [x] Simplicity — una sola app Next.js, dos rutas, sin estado de servidor.
- [x] Anti-Abstraction — un único módulo de "receta de vidrio" (`surface.ts`) y
  componentes base. Sin sistema de temas genérico: el tema es un archivo de tokens.
- [x] Integration-First — el contrato (familia de tokens P3) se fija antes que los
  componentes (T-003 antes que T-006+).

## 1. Cumplimiento constitucional
| Artículo | Cómo lo respeta este plan |
|---|---|
| Art. 1–2 (patrón) | Pista React paralela (ADR-001): `react/glassmorphism/` y `glassmorphism/` intacto. "Mismos componentes, distintos tokens": el estilo vive sólo en `app/tokens.css`. |
| Art. 3 (vistas) | Landing (navbar, hero, features, galería, footer con crédito) y dashboard (topbar, sidebar-left, main con stats + tabla, sidebar-right con chat). |
| Art. 5 (seguridad) | Sin backend ni estado. Sin recursos externos en runtime (RNF-002). |
| Art. 8 P3/P4 | `tokens.css` declara la familia P3 completa en `:root` y `[data-theme="dark"]`, y un test de contraste AA la valida (RNF-001). |
| Art. 8 P5/P6 (equiv. ADR-001) | Fuentes `geist` vía `next/font/local`, imágenes en `public/`, colores sólo vía tokens, y un test que escanea literales (RNF-003). |
| Art. 8 P7 | Copy en español en `content/*.ts`. |
| Art. 8 P8 | Commits `feat:/test:/docs: … (RF-NNN)`. |

## 2. Arquitectura de la feature
El patrón de la Constitución es "componentes visuales compartidos + parametrización por
estilo". En React, sus zonas son:

### Tokens (equivale a `css/style.css` por estilo) — lo único que cambia por estilo
- `app/tokens.css` — familia P3 + tokens propios del estilo (`--bg-card`, `--border-glass`,
  `--primary-glow`, `--aurora-a/b`) en `:root` y `[data-theme="dark"]`.
- `app/globals.css` — `@import "tailwindcss"`, `@custom-variant dark` sobre
  `[data-theme=dark]` y `@theme inline` que expone cada token como utilidad Tailwind
  (`bg-card`, `text-muted`, `border-glass`, …). No contiene ningún valor de color.

### Componentes base compartidos (equivale a `index.html`/`dashboard.html` + `base.css`)
`components/glass/`:
- `surface.ts` — **receta única** de superficie de vidrio (clases `backdrop-blur`, borde,
  sombra) por nivel: `panel`, `card`, `chrome`, `pill` (RF-007).
- `button.tsx`, `badge.tsx`, `glass-card.tsx`, `stat-card.tsx`, `data-table.tsx`,
  `status-row.tsx`, `chat-panel.tsx`, `logo.tsx`, `avatar.tsx`, `icons.tsx`.
- `navbar.tsx` — barra superior de vidrio con slots (`start`, `center`, `end`). El
  landing la compone con logo + links; el dashboard, con breadcrumb + búsqueda + usuario.
- `sidebar.tsx` — panel lateral de vidrio que en `lg+` va fijo en la rejilla y bajo `lg`
  se vuelve off-canvas con scrim. El landing lo usa como menú móvil; el dashboard, como
  sidebar izquierdo y derecho.
- `theme-switch.tsx` — 3 botones (claro/sistema/oscuro) con indicador animado (Motion).
- `reveal.tsx` — aparición de secciones (Motion `whileInView`).

### Coordinación
- `components/providers.tsx` — `ThemeProvider` (next-themes, `attribute="data-theme"`,
  `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`) +
  `MotionConfig reducedMotion="user"`.
- `lib/motion.ts` — `EASE_OUT = [0.16, 1, 0.3, 1]`, duraciones (150 ms micro, 450 ms
  sección) y variantes compartidas. Única fuente de easing (RF-004).
- `content/landing.ts`, `content/dashboard.ts` — copy y datos de maqueta en español.

### Fronteras de salida
| Frontera | Para qué | Implementación concreta |
|---|---|---|
| Fondo dinámico | Aurora tras el vidrio | `components/magicui/light-rays.tsx` (vendorizado tal cual de magicui.design) envuelto por `components/background/aurora-background.tsx` |
| Fuentes | Tipografía con personalidad sin red | `geist/font/sans` + `geist/font/mono` (`next/font/local`) |
| Imágenes | Galería sin hosts externos | `public/gallery/*.jpg` + `next/image` |

## 3. Modelo de datos
- Sin persistencia. Datos de maqueta tipados en `content/*.ts`.

## 4. Contratos
| Archivo en `contracts/` | Frontera | Gate(s) de CI |
|---|---|---|
| — | — | No aplica (sin API/MCP/eventos). El contrato de tokens se valida con `tests/unit/tokens.test.ts`. |

## 5. Estrategia de pruebas (por zona)
| Zona | Qué se prueba | Herramienta |
|---|---|---|
| Tokens | Familia P3 completa en ambos temas; contraste AA (RNF-001) | Vitest (parseo de `tokens.css`) |
| Componentes base | Receta de vidrio única; ambas rutas reusan los mismos componentes (RF-007); sin literales de color ni `style` (RNF-003); easing único y sin bounce/spring (RF-004) | Vitest (escaneo estático + render con Testing Library) |
| Fondo | Aurora renderiza rayos con tokens; con reduced-motion no anima (RF-003, RF-005) | Vitest + Testing Library |
| Sistema | Tema sin FOUC antes de hidratar (RF-001); sigue el SO (RF-002); aurora tras el vidrio (RF-003); reduced-motion (RF-005); responsive 375/768/1280 (RF-006); sin peticiones externas (RNF-002) | Playwright (Chromium) contra `next build && next start` |

El gate (`gate/services.txt` → `react/glassmorphism:node`) corre `type-check` + Vitest.
Playwright se corre con `npm run test:e2e`; su salida se pega como evidencia en la
sesión y en `history.md`.

## 6. Secuenciación de archivos
1. Andamiaje (create-next-app, Vitest, Playwright).
2. Test de tokens → `tokens.css` + `globals.css`.
3. Tests estáticos de motion/surface/literales → `lib/motion.ts`, `surface.ts`.
4. Test de la aurora → vendorizar `light-rays` + `aurora-background.tsx`.
5. Componentes base → landing → dashboard (test de reuso RF-007 antes).
6. Specs de Playwright → ajustes hasta pasar.
7. /audit + /polish (`frontend-design-pro`) → docs.

## 7. Seguimiento de complejidad
| Excepción a la simplicidad | Justificación |
|---|---|
| Regla `react-hooks/set-state-in-effect` desactivada sólo en `components/magicui/**` | El código vendorizado se mantiene tal cual; `light-rays` genera los rayos aleatorios en un efecto a propósito (sólo cliente, sin desajuste de hidratación) |
| `overflow-x-clip` en la raíz del landing | El cajón móvil cerrado (`fixed`, desplazado a la derecha) agrandaba el área desplazable. `clip` no rompe el navbar `sticky`. El test e2e verifica aparte que nada en flujo se sale del viewport, para que el recorte no oculte desbordes reales |
| Dos runners de test (Vitest + Playwright) | RF-001/002/005/006 dependen del navegador real (script de next-themes, media queries, layout); jsdom no los puede demostrar. |

## 8. Impacto en documentación
| Documento del mapa | Qué cambia | Acción |
|---|---|---|
| `AGENTS.md` | No menciona la pista React | Añadir una sección corta "Pista React (ADR-001)" con ubicación y comandos |
| `react/glassmorphism/README.md` | Nuevo | Cómo instalar, correr, testear y portar otro estilo cambiando tokens |
| `.harness/gate/services.txt` | Sin servicios declarados | Declarar `react/glassmorphism:node` |
| `.harness/memory/state.md` / `history.md` | Estado del piloto | Session-End (§10) |

## 9. Implementación por requisito
### Implementación de RF-001
- `app/layout.tsx` (`<html suppressHydrationWarning>`), `components/providers.tsx`
  (next-themes inyecta un script bloqueante en `<head>` que fija `data-theme` antes del
  primer paint), `theme-switch.tsx`.
- Test: `e2e/theme.spec.ts` → bloquea los chunks JS de Next (sin hidratación) y
  comprueba `data-theme` + color de fondo; clic en "oscuro" persiste tras recargar.
### Implementación de RF-002
- `defaultTheme="system"` + `enableSystem`.
- Test: `e2e/theme.spec.ts` → `emulateMedia({colorScheme})` sin tema guardado, cambio en caliente.
### Implementación de RF-003
- `components/magicui/light-rays.tsx`, `components/background/aurora-background.tsx`
  (capa `fixed -z-10`, color `var(--aurora-a)`/`var(--aurora-b)` + degradados radiales
  del original), montada en `app/page.tsx`.
- Tests: `tests/unit/aurora.test.tsx`, `e2e/landing.spec.ts`.
### Implementación de RF-004
- `lib/motion.ts`, `reveal.tsx`, `button.tsx`, `glass-card.tsx`, `theme-switch.tsx`.
- Test: `tests/unit/motion.test.ts` (easing exacto, cero `spring|bounce|elastic|backOut|anticipate` en el código propio).
### Implementación de RF-005
- `MotionConfig reducedMotion="user"`; `useReducedMotion` en `aurora-background.tsx` (no
  monta rayos), `glass-card.tsx` y `button.tsx` (sin `whileHover`); `reveal.tsx` con
  `motion-reduce:transform-none!`. Se comprobó en Fase 4 que `MotionConfig` por sí solo
  **no** anula el `y` de las variantes, así que el CSS ligado a la media query evita
  además desajustes de hidratación. `motion-reduce:transition-none` en las transiciones CSS.
- Tests: `tests/unit/aurora.test.tsx`, `e2e/reduced-motion.spec.ts`.
### Implementación de RF-006
- Breakpoints Tailwind estándar (`sm/md/lg/xl`). `navbar.tsx` + `sidebar.tsx` off-canvas
  bajo `lg`. Tabla con scroll horizontal propio.
- Test: `e2e/responsive.spec.ts`.
### Implementación de RF-007
- `components/glass/*` usados por `app/page.tsx` y `app/dashboard/page.tsx`.
- Test: `tests/unit/reuse.test.ts` (imports compartidos + `backdrop-blur` sólo en `surface.ts`).
### Implementación de RNF-001 / RNF-002 / RNF-003
- `tests/unit/tokens.test.ts` · `e2e/network.spec.ts` · `tests/unit/literals.test.ts`.
