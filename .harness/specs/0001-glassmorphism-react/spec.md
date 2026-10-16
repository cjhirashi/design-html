---
id: SPEC-0001
tipo: spec
feature: 0001-glassmorphism-react
estado: implemented
# --- anclaje (fusionado; ver method.md §9) ---
anchor_commit: 699da40
anchor_mode: strict
covers:
  - react/glassmorphism/**
  - .harness/decisions/ADR-001-track-react-paralelo.md
# --- aprobaciones humanas ---
aprobaciones:
  fase_1: { por: "Carlos (alcance del brief, 'así es')", fecha: 2026-10-16 }
  fase_2: pendiente
actualizado: 2026-10-16
---

# SPEC-0001 · Piloto glassmorphism en React/Next.js

> Fase 1 cerrada **fuera de esta sesión**: Carlos aprobó el alcance del brief
> `DESIGN-HTML-BRIEF-REACT-PORT-PILOTO.md` (workspace AIRA, 2026-10-16) con un "así es".
> Los RF-001…RF-007 se transcriben **sin cambiar su alcance**. Cada uno lleva su
> interpretación verificable (cómo se prueba), que no amplía lo pedido. Los RNF vienen de
> la sección "Criterios de calidad" del mismo brief y de ADR-001.

## 1. Contexto del dominio
- **Problema:** un estilo elegido en la galería no se puede reutilizar como código en los
  proyectos reales, que son Next.js; hoy se reinterpreta a mano.
- **Límite:** app Next.js autocontenida en `react/glassmorphism/`, sin backend ni estado
  de servidor. Depende sólo de paquetes npm empaquetados en el build (ADR-001).
- **Fuente de verdad visual:** `glassmorphism/` (vanilla), que no se edita.

## 2. Alcance
### En alcance
- Landing (`/`) y dashboard (`/dashboard`) del estilo `glassmorphism`, con la misma
  composición de contenido que el original (Constitución Art. 3).
- Tema claro/oscuro/sistema con next-themes, animaciones con Motion, fondo dinámico de
  MagicUI, layout responsive.
- Tokens de tema con los nombres de la familia P3, para que otro estilo se porte
  cambiando sólo tokens.
### Fuera de alcance
- Los otros 20 estilos, incluidas las 5 variantes `glass-*`.
- Editar o borrar `glassmorphism/` (HTML/CSS vanilla).
- Funcionalidad real: búsqueda, chat, notificaciones y botones son maqueta, igual que
  en el original.
- Despliegue o publicación: el piloto queda en rama, sin push.

## 3. Modelo de datos y contratos de E/S
| Frontera | Dirección | Tipo | Contrato en `contracts/` |
|---|---|---|---|
| — | — | — | No aplica: no hay API, MCP ni eventos. |

- El único "contrato" es la **familia de tokens P3**: `app/tokens.css` define
  `:root` + `[data-theme="dark"]` con los mismos nombres de variable que el `style.css`
  vanilla. Errores RFC 9457: no aplica (no hay endpoints).

## 4. Criterios de aceptación (EARS)

- **RF-001** — CUANDO el usuario cambia el tema, el sistema DEBE aplicar
  claro/oscuro/sistema sin parpadeo visible (FOUC) en la primera carga.
  - *Verificable:* con un tema guardado, `<html data-theme>` y el color de fondo
    correcto ya están presentes en el HTML/primer frame, antes de la hidratación de React.
- **RF-002** — MIENTRAS el usuario no haya elegido tema, el sistema DEBE seguir la
  preferencia `prefers-color-scheme` del SO.
  - *Verificable:* sin tema guardado, si el SO emula `dark` se aplica `data-theme="dark"`,
    si emula `light` se aplica `light`, y se sigue el cambio en caliente.
- **RF-003** — El landing DEBE incluir un fondo dinámico de `MagicUI` que reproduzca el
  efecto aurora translúcida tras los paneles de vidrio (ej. `Aurora`/`Warp Background`
  con blur), coherente con la base violeta y la paleta ya definida en el estilo original.
  - *Verificable:* el componente MagicUI está montado detrás (z-index menor) de paneles
    con `backdrop-filter: blur`, y su color sale de tokens violeta/rosa.
- **RF-004** — Las transiciones de micro-interacción (hover, aparición de secciones)
  DEBEN usar `Motion` con easing de salida suave, nunca bounce/elastic.
  - *Verificable:* existe un único easing `cubic-bezier(0.16, 1, 0.3, 1)` compartido, y
    ninguna transición usa `spring`, `bounce` ni `elastic`. El movimiento (elevación en
    hover, aparición de secciones, indicador del switch) lo hace Motion. Los cambios de
    color de borde o texto en hover usan transición CSS con la misma curva (`ease-glass`).
- **RF-005** — DONDE el usuario tenga `prefers-reduced-motion` activado, el sistema DEBE
  desactivar animaciones no esenciales.
  - *Verificable:* con `reduce`, los rayos del fondo no se animan, las secciones aparecen
    sin desplazamiento y los hovers no trasladan elementos.
- **RNF-004** — Toda sección del landing DEBE ser visible (opacidad 1) sin hacer scroll y
  sin JavaScript; la animación de aparición NO DEBE ocultar contenido (§6.1).
- **RF-006** — El layout DEBE ser responsive en mobile/tablet/desktop (breakpoints
  Tailwind estándar).
  - *Verificable:* a 375, 768 y 1280 px no hay scroll horizontal del documento; bajo
    `lg` la navegación del landing y los sidebars del dashboard pasan a off-canvas.
- **RF-007** — El dashboard DEBE reusar los mismos componentes base (navbar, sidebar,
  tarjetas) que el landing, solo con distinta composición — no duplicar estilos.
  - *Verificable:* ambas rutas importan los mismos componentes de `components/glass/`, y
    la receta de superficie de vidrio está definida en un solo módulo.

## 5. Casos límite y manejo de errores
- JavaScript desactivado: el tema se resuelve con el script bloqueante de next-themes;
  sin JS, se usa la paleta clara por defecto y el contenido sigue siendo legible (RF-001).
- `localStorage` inaccesible (modo privado estricto): next-themes cae a `system` (RF-002).
- Navegadores sin `backdrop-filter`: los paneles mantienen el fondo translúcido con
  `--bg-card`, así que el contenido sigue legible aunque no haya blur.

## 6. Registro de decisiones y descartes
| Decisión | Justificación | Alternativa descartada | ADR |
|---|---|---|---|
| Pista React paralela, vanilla = fuente de verdad | Gobernanza del brief | Reemplazar vanilla | ADR-001 |
| Paleta = tokens reales de `glassmorphism/` (`#0b1020` oscuro, `#f5f3ff` claro, violeta `#7c3aed`/`#8b5cf6`, rosa) | El brief menciona "violeta/`#071018`", pero `#071018` es la base de las variantes `glass-*`, no del original, y la doc previa del repo prohíbe mezclarlos. Se aplica "divergencia → a favor del vanilla" (ADR-001 §1). | Usar `#071018` | ADR-001 |
| Fondo MagicUI = `light-rays` teñido violeta/rosa sobre los degradados radiales del original | MagicUI no tiene "Aurora background" (sólo `aurora-text`); `warp-background` es una rejilla en perspectiva dentro de una tarjeta y no evoca una aurora | `warp-background`, `particles` | — |
| `--text-muted` ajustado para AA (claro `#5f6b80`, oscuro `#8f8aab`) | El original (`#94a3b8` / `#6f6b8a`) no llega a 4.5:1; P4 prevalece sobre la fidelidad (ADR-001 §1). El vanilla conserva el defecto (fuera de alcance). | Copiar valores tal cual | ADR-001 |
| Textos semánticos en claro oscurecidos (`--success-text #047857`, `--warning-text #9a4a08`, `--error-text #b91c1c`) y botones sobre `--primary-solid #7c3aed` en ambos temas | En el vanilla (`#059669`/`#d97706`/`#dc2626`, y blanco sobre `#8b5cf6` en oscuro) no llegan a 4.5:1 como badge. P4 prevalece (ADR-001 §1) | Copiar valores tal cual | ADR-001 |
| Familia P3 completada (`--bg-tertiary`, `--border-color/focus`, `--primary/secondary-text`, `--shadow-sm/md/lg`) | El `style.css` vanilla de glassmorphism no define estas variables (usa `--border-glass`, `--shadow-glass`); el contrato React exige la familia completa | Contrato parcial | ADR-001 |
| Etiquetas en inglés del original ("Success State", "Cyan Core") traducidas al español | P7. Además, "Cyan Core" era un resto de otra variante, porque el acento es violeta. | Copiar tal cual | — |
| Tipografía Geist Sans + Geist Mono (paquete `geist`, `next/font/local`) | Brief: "tipografía con personalidad"; se auto-hospeda en el build, sin red ni en build ni en runtime (equivalente P5) | `system-ui` (vanilla), `next/font/google` (descarga en build) | ADR-001 |
| Imágenes del carrusel vendorizadas en `public/` (las mismas 3 de Unsplash, licencia Unsplash) | El equivalente P5 prohíbe recursos de hosts externos en runtime | `next/image` remoto | ADR-001 |
| Tema por `data-theme` en `<html>` (next-themes `attribute="data-theme"`) | Mismo selector que la pista vanilla, así los tokens se comparten 1:1 | clase `.dark` | ADR-001 |

### 6.1 Ajustes tras revisión visual de Carlos (2026-10-16)
Reporte: "no se ve diferencia con la versión vieja; parece que se quitaron tarjetas". Se
verificó con capturas: la galería quedaba con `opacity: 0` hasta hacer scroll (`Reveal`), los
rayos de la aurora casi no se percibían y en claro las tarjetas de vidrio se leían como
tarjetas blancas sólidas (borde blanco sobre fondo casi blanco).

| Decisión | Valor anterior → nuevo | Justificación |
|---|---|---|
| `Reveal` nunca oculta contenido | `initial: opacity 0, y 16` (SSR) → contenido visible en SSR y sin JS; si al hidratar la sección está fuera de pantalla, al entrar se desplaza `y: 16 → 0` con `EASE_OUT`, **sin tocar la opacidad**; con reduced-motion no hay animación | La aparición no puede depender de JS ni de scroll (capturas, impresión, enlaces de ancla) |
| Rayos de la aurora, oscuro | `--aurora-ray: rgba(167,139,250,0.32)` → `rgba(167,139,250,0.6)` | Los rayos (MagicUI) deben notarse (RF-003) |
| Rayos de la aurora, claro | `--aurora-ray: rgba(139,92,246,0.28)` → `rgba(124,58,237,0.5)` (fusión `multiply`) | Ídem en tema claro |
| Fondo de tarjeta de vidrio, claro | `--bg-card: rgba(255,255,255,0.5)` → `rgba(255,255,255,0.35)` | Más translucidez, para que se lea vidrio y no blanco sólido |
| Borde de vidrio, claro | `--border-glass` / `--border-color: rgba(255,255,255,0.6)` → `rgba(124,58,237,0.16)` (violeta tenue) | Borde visible sobre fondo claro; el hover sigue en `rgba(124,58,237,0.4)` |
| Contraste | Revalidado con `tests/unit/tokens.test.ts` (AA ≥ 4.5:1) | P4 |

## 7. Requisitos no funcionales (RNF)
- **RNF-001** — Todo par texto/fondo de los tokens (`--text-primary/secondary/muted`
  sobre `--bg-primary`, en claro y oscuro) DEBE cumplir WCAG AA (≥ 4.5:1).
- **RNF-002** — El navegador NO DEBE solicitar recursos a hosts externos al cargar `/`
  ni `/dashboard` (equivalente P5, ADR-001).
- **RNF-003** — Los componentes y páginas NO DEBEN contener colores literales ni
  atributos `style` con valores literales (equivalente P6, ADR-001).

## Marcadores abiertos
- Ninguno.
