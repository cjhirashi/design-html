// Receta única de estilos para el contenido Markdown renderizado (RF-004/RF-009).
// Mismo patrón que `components/glass/surface.ts`: un solo módulo de clases, sin
// literales de color — solo utilidades Tailwind sobre los tokens P3 ya declarados
// en `app/tokens.css` (expuestos en `app/globals.css` @theme).
//
// NOTA AA del enlace (contrato de T-004/T-019, RF-009): el enlace usa
// `text-primary-ink` (token `--primary-text`, 6.69:1 claro / 8.68:1 oscuro sobre
// `--bg-card`), NO `text-primary` (`--primary-color`, falla AA en oscuro: 3.78:1).
// La conciliación final de `tests/unit/tokens.test.ts` — hoy esa aserción compara
// `--primary-color` contra `--bg-card` y queda roja a propósito — es tarea de T-019
// (zona tokens); este módulo ya construye con el token que SÍ cumple.
import { cn } from "@/lib/utils";

/**
 * Clases del contenedor raíz del cuerpo Markdown. El renderer (`components/markdown/
 * markdown.tsx`, T-022/T-023) envuelve su HTML con esta clase; hasta entonces la
 * maqueta (T-012) la usa sobre el placeholder del cuerpo.
 */
export const proseRoot = cn(
  "max-w-none text-base leading-relaxed text-fg-2",
  // Encabezados.
  "[&_h1]:mt-10 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-fg [&_h1]:first:mt-0",
  "[&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-fg",
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-fg",
  "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-fg",
  "[&_h5]:mt-6 [&_h5]:mb-2 [&_h5]:text-base [&_h5]:font-semibold [&_h5]:text-fg",
  "[&_h6]:mt-6 [&_h6]:mb-2 [&_h6]:text-sm [&_h6]:font-semibold [&_h6]:tracking-wide [&_h6]:uppercase [&_h6]:text-muted",
  // Párrafos.
  "[&_p]:my-4 [&_p]:text-fg-2",
  // Listas (incluye anidadas).
  "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
  "[&_li]:my-1 [&_li]:text-fg-2 [&_li>ul]:my-1 [&_li>ol]:my-1",
  // Blockquote.
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-glass-line [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-fg-2",
  // Código inline.
  "[&_:not(pre)>code]:rounded-glass-sm [&_:not(pre)>code]:bg-surface-2 [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm [&_:not(pre)>code]:text-fg-2",
  // Bloque de código.
  "[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-glass-md [&_pre]:border [&_pre]:border-glass-line [&_pre]:bg-surface-2 [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-fg-2",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
  // Tabla.
  "[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "[&_th]:border [&_th]:border-glass-line [&_th]:bg-surface-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-fg",
  "[&_td]:border [&_td]:border-glass-line [&_td]:px-3 [&_td]:py-2 [&_td]:text-fg-2",
  // Enlaces: token P3 legible en AA sobre claro y oscuro (ver nota de arriba).
  "[&_a]:text-primary-ink [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary-ink",
  // Imágenes.
  "[&_img]:my-6 [&_img]:rounded-glass-md [&_img]:border [&_img]:border-glass-line",
  // Regla horizontal.
  "[&_hr]:my-10 [&_hr]:border-glass-line",
);
