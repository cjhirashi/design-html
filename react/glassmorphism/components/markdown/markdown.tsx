// Componente React (RF-004): envuelve la frontera de renderizado puro
// (`render-markdown-core.ts`, sin JSX) para que `app/blog/[slug]/page.tsx` pueda
// renderizar el cuerpo Markdown como Server Component. La función de render en sí
// vive en `render-markdown-core.ts` — separada a propósito de este archivo — para que
// `scripts/build-vanilla-markdown.mjs` (T-024, Node plano) pueda importar exactamente
// la MISMA función sin pasar por un bundler ni tropezar con sintaxis JSX (ninguna
// reimplementación paralela del parser, RF-010). Este módulo re-exporta
// `renderMarkdownToHtml` para no romper los imports existentes
// (`@/components/markdown/markdown`).
import { renderMarkdownToHtml } from "./render-markdown-core";
import { proseRoot } from "./prose";

export { renderMarkdownToHtml };

/**
 * Server Component (RF-004): recibe la fuente Markdown cruda (`source`) y renderiza su
 * HTML ya resuelto (Shiki + Mermaid, build/servidor vía `renderMarkdownToHtml`) dentro
 * del contenedor `proseRoot` (`components/markdown/prose.ts`). El HTML insertado ya
 * viene saneado — sin `<script>`, sin CDN (P5/RNF-002) — por lo que `dangerouslySetInnerHTML`
 * es seguro aquí: no hay entrada de usuario en runtime, todo ocurre en build/servidor.
 */
export async function Markdown({ source }: { source: string }) {
  const html = await renderMarkdownToHtml(source);
  // eslint-disable-next-line react/no-danger -- HTML ya saneado en build/servidor (ver nota arriba).
  return <div className={proseRoot} dangerouslySetInnerHTML={{ __html: html }} />;
}
