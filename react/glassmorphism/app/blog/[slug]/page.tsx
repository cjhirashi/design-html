import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { AuroraBackground } from "@/components/background/aurora-background";
import { Footer } from "@/components/glass/footer";
import { GlassCard } from "@/components/glass/glass-card";
import { Logo } from "@/components/glass/logo";
import { Navbar, NavLink } from "@/components/glass/navbar";
import { Reveal } from "@/components/glass/reveal";
import { ThemeSwitch } from "@/components/glass/theme-switch";
import { Markdown } from "@/components/markdown/markdown";
import { footer } from "@/content/landing";
import { posts } from "@/content/blog";
import { catalogNav } from "@/content/site";

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

type BlogDetallePageProps = {
  params: Promise<{ slug: string }>;
};

function findPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

// Fuente única del cuerpo (RF-010): el mismo `.md` que lee
// `scripts/build-vanilla-markdown.mjs` para la pista vanilla — cero divergencia de
// contenido entre pistas. No todo post de `content/blog.ts` tiene un `.md` propio
// todavía; para esos casos se cae con elegancia al `excerpt` (sin romper la ruta ni
// `generateStaticParams`).
function readPostSource(slug: string): string | null {
  const path = join(process.cwd(), "content/blog", `${slug}.md`);
  if (!existsSync(path)) {
    return null;
  }
  return readFileSync(path, "utf8");
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetallePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  return { title: post ? post.title : "Publicación" };
}

/**
 * Detalle de Blog (RF-004): título, fecha, imagen de portada y cuerpo renderizado con
 * el componente `Markdown` (T-022/T-023/T-024), que ya aplica las clases de `prose`.
 * La fuente del cuerpo es el `.md` propio del post (`content/blog/<slug>.md`); si el
 * post todavía no tiene uno, se renderiza su `excerpt` como cuerpo corto (sin romper
 * `generateStaticParams`). Compone `Navbar`/`Logo`/`NavLink`/`ThemeSwitch`/`Footer`
 * directamente, igual que el resto del catálogo — sin header/aside propios.
 */
export default async function BlogDetallePage({ params }: BlogDetallePageProps) {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) {
    notFound();
  }

  const source = readPostSource(slug) ?? post.excerpt;

  return (
    <div className="overflow-x-clip">
      <AuroraBackground />
      <Navbar>
        <Logo />
        <nav aria-label="Principal" className="ml-auto flex items-center gap-6 overflow-x-auto">
          {catalogNav.map((l) => (
            <NavLink key={l.href} href={l.href} active={l.href === "/blog"}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <ThemeSwitch />
      </Navbar>

      <main>
        <article aria-labelledby="blog-detalle-title" className="py-16 sm:py-24">
          <Reveal className={`${container} flex flex-col gap-8`}>
            <header className="flex flex-col gap-4">
              <time className="text-xs font-semibold tracking-wide text-muted uppercase">{post.date}</time>
              <h1 id="blog-detalle-title" className="text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">
                {post.title}
              </h1>
              <p className="max-w-[720px] text-base text-fg-2">{post.excerpt}</p>
            </header>

            <div className="relative aspect-[16/10] overflow-hidden rounded-glass-lg">
              <Image
                src={post.src}
                width={post.width}
                height={post.height}
                alt={post.alt}
                sizes="(max-width: 1024px) 100vw, 1200px"
                className="size-full object-cover"
                priority
              />
            </div>

            <GlassCard as="div" className="p-6 sm:p-10">
              <Markdown source={source} />
            </GlassCard>
          </Reveal>
        </article>
      </main>

      <Footer>{footer}</Footer>
    </div>
  );
}
