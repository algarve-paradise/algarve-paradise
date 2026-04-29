"use client";

import { cn } from "@/lib/utils";

type CardBorderTraceProps = {
  /** corner radius of the rect in pixels (matches the parent's rounded class) */
  radius?: number;
  /** stroke color CSS value (defaults to accent) */
  color?: string;
  className?: string;
  /** stroke width in px */
  width?: number;
};

/**
 * Animated SVG border accent that runs just outside the card on hover.
 *
 * The dash is intentionally short and offset from the card edge so it reads
 * as a light sweep instead of a line trapped inside the full perimeter.
 */
export function CardBorderTrace({
  radius = 24,
  color = "var(--dt-color-accent)",
  className,
  width = 1.4,
}: CardBorderTraceProps) {
  return (
    <svg
      aria-hidden="true"
      preserveAspectRatio="none"
      className={cn(
        "card-trace pointer-events-none absolute -inset-[7px] z-[3] h-[calc(100%+14px)] w-[calc(100%+14px)] overflow-visible",
        className,
      )}
    >
      {/* trail (faint dim line that hints at the path) */}
      <rect
        x="1%"
        y="1%"
        width="98%"
        height="98%"
        rx={radius}
        ry={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.05"
        strokeWidth={width}
        className="text-foreground"
      />
      {/* animated trace */}
      <rect
        x="1%"
        y="1%"
        width="98%"
        height="98%"
        rx={radius}
        ry={radius}
        fill="none"
        stroke={color}
        strokeWidth={width}
        pathLength={1}
        strokeLinecap="round"
        className="card-trace-rect"
      />
    </svg>
  );
}
