import { cn } from "@/lib/utils";

export type Tone = "primary" | "secondary" | "success" | "warning" | "error";

const tones: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary-ink border-primary/30",
  secondary: "bg-secondary-soft text-secondary-ink border-secondary/30",
  success: "bg-success-soft text-success border-success-line",
  warning: "bg-warning-soft text-warning border-warning-line",
  error: "bg-error-soft text-error border-error-line",
};

export function Badge({
  tone = "primary",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 items-center whitespace-nowrap gap-1.5 rounded-full border px-3 py-1 text-[0.6875rem] leading-none font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
