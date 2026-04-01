import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
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
        "flex flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start",
        className
      )}
    >
      {eyebrow ? (
        <Badge
          variant="outline"
          className="rounded-full border-[color:var(--color-brand-200)] bg-white px-3 py-1 uppercase tracking-[0.24em] text-[var(--color-brand-700)]"
        >
          {eyebrow}
        </Badge>
      ) : null}
      <div className={cn("space-y-3", align === "center" && "max-w-3xl")}>
        <h2 className="font-heading text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-wrap gap-3">
          {action ? (
            <ButtonLink href={action.href} variant={action.variant ?? "default"}>
              {action.label}
            </ButtonLink>
          ) : null}
          {secondaryAction ? (
            <ButtonLink
              href={secondaryAction.href}
              variant={secondaryAction.variant ?? "outline"}
            >
              {secondaryAction.label}
            </ButtonLink>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
