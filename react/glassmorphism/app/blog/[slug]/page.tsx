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
import { proseRoot } from "@/components/markdown/prose";
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
 * el componente `Markdown` (T-022/T-023) + las clases de `prose`. MAQUETA: el render
 * real del Markdown todavía no existe, así que el cuerpo es un contenedor de
 * aviso/placeholder con las mismas clases que usará el contenido final. Compone
 * `Navbar`/`Logo`/`NavLink`/`ThemeSwitch`/`Footer` directamente, igual que el resto
 * del catálogo — sin header/aside propios.
 */
export default async function BlogDetallePage({ params }: BlogDetallePageProps) {
  const { slug } = await params;
  const post = findPost(slug);

  if (!post) {
    notFound();
  }

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
              {/*
                Placeholder del cuerpo (maqueta, T-012): el render real del Markdown
                (Shiki + Mermaid) llega en T-022/T-023 vía `<Markdown>`. Mientras tanto
                este contenedor ya aplica `proseRoot` para validar el estilo visual.
              */}
              <div className={proseRoot}>
                <p>
                  El cuerpo completo de esta publicación se renderiza desde{" "}
                  <code>content/blog/{post.slug}.md</code> con el componente{" "}
                  <code>Markdown</code> (resaltado de sintaxis y diagramas Mermaid
                  incluidos). Esta es una maqueta: el contenido real se conecta en una
                  tarea posterior del catálogo.
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </article>
      </main>

      <Footer>{footer}</Footer>
    </div>
  );
}
