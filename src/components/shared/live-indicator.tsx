import { cn } from "@/lib/utils";

type LiveIndicatorProps = {
  label?: string;
  className?: string;
};

export function LiveIndicator({
  label = "Em direto",
  className,
}: LiveIndicatorProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[color:var(--color-signal-soft)] bg-[color:var(--color-signal-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color:var(--color-signal-foreground)]",
        className
      )}
    >
      <span className="size-2 rounded-full bg-[var(--color-signal)] shadow-[0_0_18px_var(--color-signal)]" />
      {label}
    </span>
  );
}
