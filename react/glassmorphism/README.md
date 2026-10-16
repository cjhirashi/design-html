# Glassmorphism · pista React/Next.js (piloto)

Port del estilo `glassmorphism/` de Design-HTML a Next.js (App Router) + Tailwind v4 +
next-themes + Motion + MagicUI. Es una pista **paralela** a la vanilla, que sigue siendo
la fuente de verdad visual (ADR-001, `.harness/decisions/ADR-001-track-react-paralelo.md`).
Spec: `.harness/specs/0001-glassmorphism-react/`.

## Uso local

```bash
npm install
npm run dev          # http://localhost:3000  ·  /  y  /dashboard
npm run build && npm run start   # versión de producción
```

## Verificación

```bash
npm run type-check   # TypeScript
npm run lint         # ESLint
npm test             # Vitest: tokens + contraste AA, easing, literales, reuso, aurora
npm run test:e2e     # Playwright: tema sin FOUC, SO, aurora, reduced-motion, responsive, red
```

`test:e2e` levanta su propio `build` + `start` en el puerto 3107. El gate del arnés
(`bash .harness/gate/check.sh`, desde la raíz del repo) corre `type-check` + Vitest.

**Si Chromium no arranca** (`error while loading shared libraries: libatk-1.0.so.0`), al
sistema le faltan dependencias del navegador. Hay dos salidas:
- con sudo: `sudo npx playwright install-deps chromium`;
- sin sudo: descargar los `.deb` con `apt-get download` (libatk1.0-0t64,
  libatk-bridge2.0-0t64, libatspi2.0-0t64, libxcomposite1, libxdamage1, libxfixes3,
  libxrandr2, libxi6, libxres1, libgbm1, libasound2t64), extraerlos con
  `dpkg-deb -x <deb> ~/.cache/pw-libs/root` y lanzar con
  `LD_LIBRARY_PATH=~/.cache/pw-libs/root/usr/lib/x86_64-linux-gnu npm run test:e2e`.

## Estructura

| Ruta | Qué es |
|---|---|
| `app/tokens.css` | **Único archivo propio del estilo**: familia P3 en `:root` y `[data-theme="dark"]` |
| `app/globals.css` | Tailwind + `@theme inline` que expone cada token como utilidad (sin colores) |
| `components/glass/` | Componentes base compartidos por landing y dashboard |
| `components/glass/surface.ts` | Receta única del vidrio (blur, borde, sombra) |
| `components/background/aurora-background.tsx` | Aurora: degradados del original + MagicUI `light-rays` |
| `components/magicui/` | Código vendorizado de magicui.design, sin modificar |
| `lib/motion.ts` | Única fuente de easing (`[0.16, 1, 0.3, 1]`) y duraciones |
| `content/` | Copy y datos de maqueta en español |
| `app/page.tsx`, `app/dashboard/` | Composición de las dos vistas |

## Portar otro estilo (p. ej. `glass-aurum`)

1. Copiar esta app a `react/<estilo>/`.
2. Reescribir **sólo** `app/tokens.css` con los valores de `<estilo>/css/style.css`,
   manteniendo los nombres de variable.
3. `npm test`: el test de tokens exige la familia P3 completa y contraste AA en ambos temas.

Los componentes no cambian. Si un estilo necesita otra *estructura* (no sólo otra
paleta), eso es una feature nueva con su propio spec.
