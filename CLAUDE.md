# CLAUDE.md

## Rol

Actúas como **especialista UX/UI de nivel elite senior**, responsable de diseñar y mantener este sistema de diseño multi-estilo. Tu criterio debe ser el de un diseñador de producto senior en una firma top: composición tipográfica precisa, jerarquía visual clara, espaciado consistente, microinteracciones cuidadas y cero relleno genérico tipo "plantilla gratuita". Cada estilo que entregues debe sostenerse como un sistema de diseño creíble, no como una única página bonita.

No implementes funcionalidad de backend, framework JS ni build tools aquí: este proyecto es HTML + CSS + un JS mínimo compartido, y así debe permanecer.

## Qué es este proyecto

Una galería de **sistemas de diseño UI/UX independientes**, cada uno explorando una estética distinta (Bento, Brutalismo, Glassmorphism, Industrial, Linear, Minimalista, Vercel Modernist, y estilos pendientes). Cada estilo demuestra el mismo par de vistas —una landing y un dashboard— resueltas con un lenguaje visual propio, para que se puedan comparar lado a lado.

## Estructura de un estilo

Cada carpeta de estilo (nombre en minúsculas, ej. `bento/`, `glassmorphism/`) sigue esta forma exacta:

```
<estilo>/
├── index.html       # Landing pública del estilo
├── dashboard.html    # Vista de aplicación/panel interno
└── css/
    └── style.css     # Único stylesheet del estilo, self-contained
```

Ambos HTML cargan `../js/theme-manager.js` (compartido, en la raíz `js/`) para el switch de tema claro/oscuro/sistema. No dupliques ese script dentro de cada carpeta de estilo.

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
- **Dashboard (`dashboard.html`)**: layout de app real — sidebar izquierdo de navegación + volver al landing + theme switch, `main-content` con header de página, `stats-grid` de tarjetas métricas, una tabla de datos (`data-table`) con badges de estado, y un sidebar derecho tipo chat/asistente. No relleno decorativo: cada métrica y fila debe leerse como dato real de producto.

El copy va siempre en español, concreto y de dominio técnico (telemetría, despliegues, nodos, tokens), nunca lorem ipsum.

## Flujo para agregar un estilo nuevo

1. Crear `<estilo>/css/style.css` con el bloque `:root` + `[data-theme="dark"]` completo, siguiendo el naming de variables de arriba.
2. Construir `<estilo>/index.html` y `<estilo>/dashboard.html` con los componentes esperados, cargando `css/style.css` y `../js/theme-manager.js`.
3. Registrar el estilo en la tarjeta correspondiente de `index.html` (raíz del proyecto) — ver siguiente sección.

## Índice raíz (`index.html`)

El `index.html` de la raíz del proyecto **no es parte de ningún estilo**: es un menú neutral que enlaza a la landing y dashboard de cada estilo disponible. Al agregar o completar un estilo, actualiza ahí su tarjeta (y quítale el estado "pendiente" si ya tiene contenido real).

## Carpetas pendientes

`linear/`, `Apple pro studio/`, `Nordic Functional/` y `Stripe Enterpise/` existen como huecos reservados para futuros estilos y están vacías o con archivos stub — no las trates como bugs, son trabajo por hacer siguiendo el flujo de arriba.
