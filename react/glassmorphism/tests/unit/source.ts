// Utilidad de los tests estáticos: lista y lee el código propio de la app.
// `components/magicui/` queda fuera: es código vendorizado (ADR-001).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const ROOT = join(__dirname, "../..");
const DIRS = ["app", "components", "lib", "content"];
const VENDORED = /^components\/magicui\//;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export function ownSources(ext = /\.(ts|tsx)$/): { file: string; code: string }[] {
  return DIRS.flatMap((d) => walk(join(ROOT, d)))
    .map((full) => relative(ROOT, full))
    .filter((file) => ext.test(file) && !VENDORED.test(file))
    .map((file) => ({ file, code: readFileSync(join(ROOT, file), "utf8") }));
}

export function read(file: string): string {
  return readFileSync(join(ROOT, file), "utf8");
}
