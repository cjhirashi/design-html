import type { Metadata } from "next";

import { AuroraBackground } from "@/components/background/aurora-background";
import { EmptyState } from "@/components/glass/empty-state";
import { Footer } from "@/components/glass/footer";
import { Logo } from "@/components/glass/logo";
import { Navbar, NavLink } from "@/components/glass/navbar";
import { ProductCard } from "@/components/glass/product-card";
import { Reveal } from "@/components/glass/reveal";
import { SectionHeading } from "@/components/glass/section-heading";
import { ThemeSwitch } from "@/components/glass/theme-switch";
import { footer } from "@/content/landing";
import { heading, products } from "@/content/productos";
import { catalogNav } from "@/content/site";

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

export const metadata: Metadata = { title: "Productos" };

/**
 * Listado de Productos (RF-005): grid de `ProductCard` con imagen, nombre y precio.
 * Compone `Navbar`/`Logo`/`NavLink`/`ThemeSwitch` directamente con los enlaces
 * compartidos de catálogo (`content/site.ts`) — misma composición que Blog, sin wrapper
 * duplicado por ruta.
 */
export default function ProductosPage() {
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
        <section aria-labelledby="productos-title" className="py-16 sm:py-24">
          <Reveal className={`${container} flex flex-col gap-10`}>
            <SectionHeading id="productos-title" eyebrow={heading.eyebrow} title={heading.title} />

            {products.length > 0 ? (
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <li key={product.slug}>
                    <ProductCard
                      src={product.src}
                      width={product.width}
                      height={product.height}
                      alt={product.alt}
                      name={product.name}
                      price={product.price}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState message="No hay productos todavía." />
            )}
          </Reveal>
        </section>
      </main>

      <Footer>{footer}</Footer>
    </div>
  );
}
