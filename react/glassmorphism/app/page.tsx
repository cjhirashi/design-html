import { AuroraBackground } from "@/components/background/aurora-background";
import { Badge } from "@/components/glass/badge";
import { Band } from "@/components/glass/band";
import { ButtonLink } from "@/components/glass/button";
import { GlassCard } from "@/components/glass/glass-card";
import { ArrowRightIcon } from "@/components/glass/icons";
import { MediaCard } from "@/components/glass/media-card";
import { Reveal } from "@/components/glass/reveal";
import { SectionHeading } from "@/components/glass/section-heading";
import { StatusRow } from "@/components/glass/status-row";
import { TerminalWindow } from "@/components/glass/terminal-window";
import { features, footer, gallery, hero } from "@/content/landing";

import { SiteHeader } from "./_landing/site-header";

const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

export default function LandingPage() {
  return (
    // overflow-x-clip: el cajón móvil cerrado vive fuera de pantalla a la derecha y no debe
    // generar scroll horizontal (clip, a diferencia de hidden, no rompe el navbar sticky).
    <div className="overflow-x-clip">
      <AuroraBackground />
      <SiteHeader />

      <main>
        <section
          id="inicio"
          aria-labelledby="hero-title"
          className={`${container} grid scroll-mt-16 grid-cols-[minmax(0,1fr)] items-center gap-12 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-28`}
        >
          <div className="flex flex-col items-start gap-6">
            <div className="flex flex-wrap gap-2">
              {hero.badges.map((b) => (
                <Badge key={b.label} tone={b.tone}>
                  {b.label}
                </Badge>
              ))}
            </div>
            <h1
              id="hero-title"
              className="text-[clamp(2.25rem,6vw,3.5rem)] leading-[1.06] font-bold tracking-[-0.03em] text-balance text-fg"
            >
              {hero.title}
            </h1>
            <p className="max-w-[56ch] text-lg leading-relaxed text-fg-2">{hero.lead}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href="/dashboard">
                {hero.primaryCta}
                <ArrowRightIcon />
              </ButtonLink>
              <ButtonLink href="#sistema" variant="secondary">
                {hero.secondaryCta}
              </ButtonLink>
            </div>
          </div>

          <TerminalWindow title={hero.mockupFile}>
            {hero.telemetry.map((t) => (
              <StatusRow key={t.message} tone={t.tone} message={t.message} label={t.label} />
            ))}
          </TerminalWindow>
        </section>

        <Band id="sistema" aria-labelledby="sistema-title" className="scroll-mt-16 py-16 sm:py-24">
          <Reveal className={`${container} flex flex-col gap-10`}>
            <SectionHeading id="sistema-title" eyebrow={features.eyebrow} tone="secondary" title={features.title} />
            <ul className="grid gap-6 md:grid-cols-3">
              {features.items.map((f) => (
                <GlassCard key={f.title} as="li" interactive className="flex flex-col items-start gap-3 p-8">
                  <Badge tone={f.tone} className="mb-2">
                    {f.badge}
                  </Badge>
                  <h3 className="text-lg font-semibold text-fg">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-fg-2">{f.body}</p>
                </GlassCard>
              ))}
            </ul>
          </Reveal>
        </Band>

        <section id="galeria" aria-labelledby="galeria-title" className="scroll-mt-16 py-16 sm:py-24">
          <Reveal className="flex flex-col gap-10">
            <SectionHeading id="galeria-title" eyebrow={gallery.eyebrow} title={gallery.title} className={container} />
            <div className={container}>
              <ul
                data-scroll-x
                aria-label={gallery.title}
                className="-mx-2 flex snap-x snap-mandatory gap-6 overflow-x-auto px-2 pt-2 pb-6"
              >
                {gallery.items.map((item) => (
                  <MediaCard key={item.src} {...item} />
                ))}
              </ul>
            </div>
          </Reveal>
        </section>
      </main>

      <Band as="footer" className="px-6 py-12 text-center text-sm text-fg-2">
        {footer}
      </Band>
    </div>
  );
}
