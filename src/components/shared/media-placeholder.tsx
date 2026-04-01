import { Image as ImageIcon, Play, Radio } from "lucide-react";

import { cn } from "@/lib/utils";

type MediaPlaceholderProps = {
  label: string;
  title?: string;
  tone?: "hero" | "editorial" | "logo";
  className?: string;
};

const toneStyles = {
  hero: "from-[#00224a] via-[#004c99] to-[#0b8bd9]",
  editorial: "from-[#03172f] via-[#0f3f74] to-[#cc1439]",
  logo: "from-white via-[#eef4fb] to-[#d9e6f4]",
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
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#02142b] shadow-[0_24px_80px_rgba(2,20,43,0.35)]",
        className
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", toneStyles[tone])} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_40%),linear-gradient(125deg,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
        <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/80 backdrop-blur">
          {label}
        </span>
        {tone === "logo" ? (
          <ImageIcon className="size-5 text-white/70" />
        ) : tone === "hero" ? (
          <Radio className="size-5 text-white/80" />
        ) : (
          <Play className="size-5 text-white/80" />
        )}
      </div>
      <div className="relative flex min-h-[220px] flex-col justify-end p-6">
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <div className="space-y-2">
            <div className="h-2.5 w-24 rounded-full bg-white/30" />
            <div className="h-2.5 w-40 rounded-full bg-white/20" />
            {title ? <p className="max-w-sm text-sm leading-6 text-white/90">{title}</p> : null}
          </div>
          <div className="grid w-20 gap-2">
            <div className="h-8 rounded-2xl border border-white/15 bg-white/10" />
            <div className="h-8 rounded-2xl border border-white/15 bg-black/15" />
          </div>
        </div>
      </div>
    </div>
  );
}
