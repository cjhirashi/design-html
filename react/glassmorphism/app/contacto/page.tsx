import type { Metadata } from "next";

import { AuroraBackground } from "@/components/background/aurora-background";
import { Footer } from "@/components/glass/footer";
import { GlassCard } from "@/components/glass/glass-card";
import { Logo } from "@/components/glass/logo";
import { Navbar, NavLink } from "@/components/glass/navbar";
import { Reveal } from "@/components/glass/reveal";
import { SectionHeading } from "@/components/glass/section-heading";
import { ThemeSwitch } from "@/components/glass/theme-switch";
import { footer } from "@/content/landing";
import { catalogNav } from "@/content/site";

import { ContactForm } from "./_components/contact-form";

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

export const metadata: Metadata = { title: "Contacto" };

/**
 * Contacto (RF-007): formulario con `Field` (RF-013) dentro de una `GlassCard`.
 * Compone `Navbar`/`Logo`/`NavLink`/`ThemeSwitch`/`Footer` directamente con los
 * enlaces compartidos de catálogo (`content/site.ts`) — misma composición que Blog
 * y Productos, sin header/aside propio.
 */
export default function ContactoPage() {
  return (
    <div className="overflow-x-clip">
      <AuroraBackground />
      <Navbar>
        <Logo />
        <nav aria-label="Principal" className="ml-auto flex items-center gap-6 overflow-x-auto">
          {catalogNav.map((l) => (
            <NavLink key={l.href} href={l.href} active={l.href === "/contacto"}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <ThemeSwitch />
      </Navbar>

      <main>
        <section aria-labelledby="contacto-title" className="py-16 sm:py-24">
          <Reveal className={`${container} flex flex-col gap-10`}>
            <SectionHeading
              id="contacto-title"
              eyebrow="Contacto"
              title="Hablemos de tu proyecto"
            />

            <GlassCard as="div" className="max-w-[560px] p-6 sm:p-10">
              <ContactForm />
            </GlassCard>
          </Reveal>
        </section>
      </main>

      <Footer>{footer}</Footer>
    </div>
  );
}
