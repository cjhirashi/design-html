import type { Metadata } from "next";

import { AuroraBackground } from "@/components/background/aurora-background";
import { EmptyState } from "@/components/glass/empty-state";
import { Footer } from "@/components/glass/footer";
import { PostCard } from "@/components/glass/post-card";
import { Reveal } from "@/components/glass/reveal";
import { SectionHeading } from "@/components/glass/section-heading";
import { footer } from "@/content/landing";
import { heading, posts } from "@/content/blog";

import { SiteNav } from "./_components/site-nav";

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

export const metadata: Metadata = { title: "Blog" };

/** Listado de Blog (RF-003): grid de `PostCard` con imagen, título, extracto y fecha. */
export default function BlogPage() {
  return (
    <div className="overflow-x-clip">
      <AuroraBackground />
      <SiteNav active="/blog" />

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
