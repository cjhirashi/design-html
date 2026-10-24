import type { Metadata } from "next";

import { AuroraBackground } from "@/components/background/aurora-background";
import { EmptyState } from "@/components/glass/empty-state";
import { Footer } from "@/components/glass/footer";
import { Logo } from "@/components/glass/logo";
import { Navbar, NavLink } from "@/components/glass/navbar";
import { PostCard } from "@/components/glass/post-card";
import { Reveal } from "@/components/glass/reveal";
import { SectionHeading } from "@/components/glass/section-heading";
import { ThemeSwitch } from "@/components/glass/theme-switch";
import { heading, posts } from "@/content/blog";
import { footer } from "@/content/landing";
import { catalogNav } from "@/content/site";

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

export const metadata: Metadata = { title: "Blog" };

/**
 * Listado de Blog (RF-003): grid de `PostCard` con imagen, título, extracto y fecha.
 * Compone `Navbar`/`Logo`/`NavLink`/`ThemeSwitch` directamente con los enlaces
 * compartidos de catálogo (`content/site.ts`) — misma composición que Productos, sin
 * wrapper duplicado por ruta.
 */
export default function BlogPage() {
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
        <section aria-labelledby="blog-title" className="py-16 sm:py-24">
          <Reveal className={`${container} flex flex-col gap-10`}>
            <SectionHeading id="blog-title" eyebrow={heading.eyebrow} title={heading.title} />

            {posts.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <PostCard
                      src={post.src}
                      width={post.width}
                      height={post.height}
                      alt={post.alt}
                      title={post.title}
                      excerpt={post.excerpt}
                      date={post.date}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No hay publicaciones todavía." />
            )}
          </Reveal>
        </section>
      </main>

      <Footer>{footer}</Footer>
    </div>
  );
}
