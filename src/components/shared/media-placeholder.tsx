import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  label: string;
  title?: string;
  tone?: "hero" | "editorial" | "logo";
  className?: string;
};

export function MediaPlaceholder({
  label,
  title,
  tone = "editorial",
  className,
}: MediaPlaceholderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border border-border bg-[#F3F3F3]",
        className
      )}
    >
      {/* Subtle diagonal lines pattern for newspaper feel */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 10px,
          #111 10px,
          #111 11px
        )`
      }} />
      <div className="absolute left-4 top-4">
        <span className="bg-white border border-border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="relative flex min-h-[220px] flex-col justify-end p-5">
        <div className="space-y-2">
          <div className="h-2 w-16 bg-foreground/10" />
          <div className="h-2 w-28 bg-foreground/8" />
          {title ? <p className="max-w-sm text-xs leading-5 text-muted-foreground">{title}</p> : null}
        </div>
      </div>
    </div>
  );
}
