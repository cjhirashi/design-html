# CLAUDE.md

## Rol

Actúas como **especialista UX/UI de nivel elite senior**, responsable de diseñar y mantener este sistema de diseño multi-estilo. Tu criterio debe ser el de un diseñador de producto senior en una firma top: composición tipográfica precisa, jerarquía visual clara, espaciado consistente, microinteracciones cuidadas y cero relleno genérico tipo "plantilla gratuita". Cada estilo que entregues debe sostenerse como un sistema de diseño creíble, no como una única página bonita.

No implementes funcionalidad de backend, framework JS ni build tools aquí: este proyecto es HTML + CSS + un JS mínimo compartido, y así debe permanecer.

## Qué es este proyecto

Una galería de **sistemas de diseño UI/UX independientes**, cada uno explorando una estética distinta: Apple Pro Studio, Bento, Brutalismo, Glassmorphism, Industrial, Linear, Minimalista, Nordic Functional, Stripe Enterprise y Vercel Modernist. Cada estilo demuestra el mismo par de vistas —una landing y un dashboard— resueltas con un lenguaje visual propio, para que se puedan comparar lado a lado.

Además, `glassmorphism/` tiene cinco variantes de color hermanas que comparten exactamente su mismo mecanismo (blur, aurora translúcida, layout) pero con acento cian institucional + un secundario distinto cada una: `glass-aurum/` (+ oro), `glass-ember/` (+ coral), `glass-borealis/` (+ lima), `glass-neon/` (+ fucsia) y `glass-steel/` (+ gris acero). Todas las variantes reutilizan la misma escala de fondo neutro teal-navy (`#071018` / `rgba(16,30,42,.6)` / `rgba(12,24,34,.7)` / `rgba(26,48,64,.5)`) y el mismo texto secundario cian-gris (`#a3b6c0` / `#6b808a`) — nunca el fondo/texto violeta original de `glassmorphism/`, que solo tiene sentido con su propio acento violeta. Si tocas la estructura o los componentes de `glassmorphism/`, valora si el mismo ajuste aplica a las cinco variantes para no desincronizarlas.

## Estructura de un estilo

Cada carpeta de estilo (nombre en minúsculas, ej. `bento/`, `glassmorphism/`) sigue esta forma exacta:

```
<estilo>/
├── index.html       # Landing pública del estilo
├── dashboard.html    # Vista de aplicación/panel interno
└── css/
    └── style.css     # Único stylesheet del estilo, self-contained
```

Ambos HTML cargan `../js/theme-manager.js` (compartido, en la raíz `js/`) para el switch de tema claro/oscuro/sistema, y `../js/nav-toggle.js` para el menú hamburguesa y los sidebars off-canvas en móvil. No dupliques esos scripts dentro de cada carpeta de estilo.

## Convenciones de CSS (obligatorias para todo estilo nuevo)

Cada `style.css` define su propio `:root` con esta misma familia de variables (los valores cambian por estilo, los nombres no):

```css
--bg-primary / --bg-secondary / --bg-tertiary / --bg-glass
--text-primary / --text-secondary / --text-muted
--border-color / --border-focus
--primary-color / --primary-hover / --primary-light / --primary-text
--secondary-color / --secondary-hover / --secondary-light / --secondary-text
--error-bg / --error-text / --error-border
--warning-bg / --warning-text / --warning-border
--success-bg / --success-text / --success-border
--shadow-sm / --shadow-md / --shadow-lg
--radius-sm / --radius-md / --radius-lg
--transition-smooth
```

El modo oscuro se activa con `[data-theme="dark"]` en `<html>` (lo gestiona `theme-manager.js`, nunca lo hardcodees en el HTML). Todo estilo **debe** definir un bloque `[data-theme="dark"]` completo que reescriba estas mismas variables — nunca lances un estilo que solo funcione en un modo. Verifica contraste AA en ambos modos, especialmente en `--text-secondary`/`--text-muted` sobre `--bg-secondary`.

Tipografía por pila de fuentes del sistema, sin depender de red: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` para UI y `ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace` para datos/mono. No uses `@import` ni `<link>` a Google Fonts ni a ningún host externo — ya se probó que bloquea el render cuando la red no está disponible en el entorno de vista previa. La clase `.mono` se usa para timestamps, tokens, badges técnicos y microcopy de sistema.

## Componentes esperados en cada estilo

Diseña (con la estética propia del estilo, no copies literalmente el marcado de otro) al menos:

- **Navbar** con logo, links de sección, link a `dashboard.html`, y el `theme-switch` de 3 botones (light/system/dark, ver `vercel/index.html` como referencia de marcado).
- **Landing (`index.html`)**: hero, sección de features/estados (success/warning/error como badges), sección de galería (carrusel de imágenes, usar Unsplash con `?auto=format&fit=crop&w=800&q=80`), footer con crédito `© 2026 Carlos Alberto Jiménez Hirashi. <Nombre del Estilo>.`
- **Dashboard (`dashboard.html`)**: estructura de producto real de dos niveles, no un simple split de 3 columnas:
  - `.dash-wrapper` (`display: flex; flex-direction: column; height: 100vh;`) contiene, en orden, `.dash-topbar` y `.dash-body`.
  - `.dash-topbar`: franja superior de ancho completo con `.dash-breadcrumb` (marca / sección actual), `.dash-search` (buscador falso con ícono), y `.dash-topbar-right` con `.dash-bell` (notificaciones) + `.dash-user` (avatar + nombre + rol).
  - `.dash-body` (`display: grid; grid-template-columns: <izq> 1fr <der>;`) es el split de 3 columnas: `sidebar-left`, `main-content`, `sidebar-right`.
  - `sidebar-left`: `.sidebar-menu` con ítems agrupados bajo `.sidebar-section-label` (mínimo dos grupos, ej. "General" / "Sistema"), y al final un `.sidebar-profile` (avatar + nombre + rol) antes del link "Volver al Landing" y el theme switch.
  - `main-content`: header de página, `stats-grid` de tarjetas métricas — al menos dos de ellas con `.stat-card-head` (label + `.stat-trend.up`/`.down` con flecha y %), una tabla de datos (`data-table`) con badges de estado.
  - `sidebar-right`: chat/asistente como en los estilos existentes.
  
  No relleno decorativo: cada métrica, fila y mensaje debe leerse como dato real de producto.

El copy va siempre en español, concreto y de dominio técnico (telemetría, despliegues, nodos, tokens), nunca lorem ipsum.

## Responsive (obligatorio en todo estilo)

Cada `style.css` termina con dos bloques `@media` compartidos entre los 14 estilos — mismos nombres de clase, mismo comportamiento, solo cambian los tokens de color/tipografía de cada estilo:

- **Navbar → menú hamburguesa**: en el HTML, `.nav-links` (solo los `<a>`) y `.theme-switch` van dentro de un wrapper `.nav-right`, seguido de un `<button class="nav-toggle" onclick="toggleNav()">` con ícono de 3 líneas, y un `<div class="nav-scrim" id="navScrim" onclick="closeNav()"></div>` justo después de `</nav>`. En CSS, bajo `max-width: 900px`, `.nav-links` se convierte en un drawer fijo (`position:fixed`, deslizado con `transform: translateX(100%)` → `.nav-open` lo trae a `translateX(0)`).
- **Dashboard → sidebars off-canvas**: dos `<button class="sidebar-toggle" onclick="toggleSidebar('left'|'right')">` — uno al inicio de `.dash-topbar` (antes de `.dash-breadcrumb`, controla `sidebar-left`) y otro al inicio de `.dash-topbar-right` (antes de `.dash-bell`, controla `sidebar-right`) — más un `<div class="sidebar-scrim" id="sidebarScrim" onclick="closeSidebars()"></div>` como primer hijo de `.dash-wrapper`. Bajo `max-width: 900px`, ambos sidebars pasan a `position:fixed` fuera de pantalla (`translateX(-100%)`/`translateX(100%)`) y `.sidebar-open` los trae a `translateX(0)`.
- Las funciones `toggleNav`, `closeNav`, `toggleSidebar`, `closeSidebars` viven en `js/nav-toggle.js` (compartido, igual que `theme-manager.js`) — no las reimplementes por estilo.
- `.hero-split` colapsa a una columna y `.data-table-container` scrollea horizontal en cualquier ancho.

Si agregas un componente nuevo a un estilo, revisa que siga viéndose bien bajo 900px y 560px antes de darlo por terminado.

## Flujo para agregar un estilo nuevo

1. Crear `<estilo>/css/style.css` con el bloque `:root` + `[data-theme="dark"]` completo, siguiendo el naming de variables de arriba.
2. Construir `<estilo>/index.html` y `<estilo>/dashboard.html` con los componentes esperados, cargando `css/style.css`, `../js/theme-manager.js` y `../js/nav-toggle.js`, y siguiendo el patrón responsive de la sección anterior (navbar con `.nav-toggle`, dashboard con `.sidebar-toggle` × 2).
3. Registrar el estilo en la tarjeta correspondiente de `index.html` (raíz del proyecto) — ver siguiente sección.

## Índice raíz (`index.html`)

El `index.html` de la raíz del proyecto **no es parte de ningún estilo**: es un menú neutral que enlaza a la landing y dashboard de cada estilo disponible. Al agregar o completar un estilo, actualiza ahí su tarjeta (y quítale el estado "pendiente" si ya tiene contenido real).

## Estado actual

Los 10 estilos listados arriba están completos (landing + dashboard + luz/oscuro funcionales). No hay carpetas pendientes en este momento. Si se agrega un estilo nuevo, sigue el flujo de la sección anterior y usa nombre de carpeta en kebab-case minúsculas (ej. `nueva-estetica/`), consistente con el resto.
