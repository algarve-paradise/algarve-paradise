import { cn } from "@/lib/utils";

type Action = {
  label: string;
  href: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
};

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: Action;
  secondaryAction?: Action;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow ? (
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {eyebrow}
        </span>
      ) : null}
      <div className={cn("space-y-2", align === "center" && "max-w-3xl")}>
        <h2 className="font-heading text-2xl leading-tight font-medium tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-wrap items-center gap-4 mt-2">
          {action ? (
            <a href={action.href} className="text-xs font-bold uppercase tracking-widest text-foreground underline underline-offset-4 hover:text-muted-foreground transition-colors">
              {action.label} →
            </a>
          ) : null}
          {secondaryAction ? (
            <a href={secondaryAction.href} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
              {secondaryAction.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
