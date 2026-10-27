// Hook de resolución mínimo (Node 20+/`node:module` customization hooks, API estable)
// para que un specifier relativo SIN extensión (p.ej. `./render-mermaid`, tal y como
// ya está escrito en `components/markdown/*.ts` para TypeScript/Next, que sí resuelven
// extensión) también resuelva bajo Node ESM puro, que NO hace resolución automática de
// extensión. Sin este hook, `node scripts/build-vanilla-markdown.mjs` no podría
// `import` el módulo compartido `render-markdown-core.ts` (fallaría en su import
// interno de `./render-mermaid`).
//
// Deliberadamente NO se añade ninguna dependencia nueva (p.ej. `tsx`/`ts-node`): Node
// 24 ya soporta type-stripping nativo de `.ts` (`--experimental-strip-types`, activo
// por defecto); lo único que falta es la resolución de extensión, que este hook cubre
// en ~10 líneas sin tocar `tsconfig.json` ni los imports existentes del componente
// React (que deben seguir sin extensión para `moduleResolution: "bundler"`, RF-010: un
// solo módulo de renderer, sin bifurcar su código fuente por consumidor).
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const CANDIDATE_EXTENSIONS = [".ts", ".tsx", ".mts"];

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("./") || specifier.startsWith("../")) {
    const hasExtension = /\.[a-zA-Z]+$/.test(specifier);
    if (!hasExtension) {
      const basePath = fileURLToPath(new URL(specifier, context.parentURL));
      for (const ext of CANDIDATE_EXTENSIONS) {
        if (existsSync(basePath + ext)) {
          return nextResolve(specifier + ext, context);
        }
      }
    }
  }
  return nextResolve(specifier, context);
}
