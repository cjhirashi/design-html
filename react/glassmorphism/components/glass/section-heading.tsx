import { cn } from "@/lib/utils";

import { Badge, type Tone } from "./badge";

export function SectionHeading({
  eyebrow,
  tone = "primary",
  title,
  id,
  className,
}: {
  eyebrow: string;
  tone?: Tone;
  title: string;
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      <Badge tone={tone}>{eyebrow}</Badge>
      <h2 id={id} className="text-3xl font-bold tracking-tight text-balance text-fg sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}
