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
import { footer } from "@/content/landing";
import { products } from "@/content/productos";
import { catalogNav } from "@/content/site";

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

type ProductoDetallePageProps = {
  params: Promise<{ slug: string }>;
};

function findProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductoDetallePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  return { title: product ? product.name : "Producto" };
}

/**
 * Detalle de Producto (RF-006): imagen, nombre, precio y descripción en TEXTO PLANO
 * (párrafos simples) — decisión explícita de spec, SIN el componente `Markdown`
 * (único consumidor del renderer es Blog Detalle). Compone `Navbar`/`Logo`/
 * `NavLink`/`ThemeSwitch` directamente con los enlaces compartidos de catálogo
 * (`content/site.ts`), igual que el listado de Productos.
 */
export default async function ProductoDetallePage({ params }: ProductoDetallePageProps) {
  const { slug } = await params;
  const product = findProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="overflow-x-clip">
      <AuroraBackground />
      <Navbar>
        <Logo />
        <nav aria-label="Principal" className="ml-auto flex items-center gap-6 overflow-x-auto">
          {catalogNav.map((l) => (
            <NavLink key={l.href} href={l.href} active={l.href === "/productos"}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <ThemeSwitch />
      </Navbar>

      <main>
        <section aria-labelledby="producto-detalle-title" className="py-16 sm:py-24">
          <Reveal className={`${container} flex flex-col gap-10`}>
            <GlassCard as="article" className="grid gap-8 overflow-hidden p-6 sm:p-10 lg:grid-cols-2">
              <div className="relative aspect-square overflow-hidden rounded-glass-sm">
                <Image
                  src={product.src}
                  width={product.width}
                  height={product.height}
                  alt={product.alt}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="size-full object-cover"
                  priority
                />
              </div>

              <div className="flex flex-col gap-4">
                <h1 id="producto-detalle-title" className="text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">
                  {product.name}
                </h1>
                <p className="font-mono text-xl font-semibold text-muted">{product.price}</p>

                <div className="flex flex-col gap-4 text-base text-fg/90">
                  {product.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </section>
      </main>

      <Footer>{footer}</Footer>
    </div>
  );
}
