import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

import { Markdown } from "@/components/markdown/markdown";

import { DashboardShell } from "./_components/dashboard-shell";

export const metadata: Metadata = { title: "Dashboard" };

// La Vista Markdown (RF-002 §6) reusa el componente Markdown (RF-004). Como `DashboardShell`
// es un client component y `Markdown` es un Server Component async (Shiki en build/servidor,
// `"use cache"`), se renderiza aquí en el servidor y se inyecta como `markdownSlot`. La MISMA
// fuente `.md` alimenta la pista vanilla vía `scripts/build-vanilla-markdown.mjs` (RF-010).
export default function DashboardPage() {
  const doc = readFileSync(join(process.cwd(), "content/dashboard-doc.md"), "utf8");
  return <DashboardShell markdownSlot={<Markdown source={doc} />} />;
}
