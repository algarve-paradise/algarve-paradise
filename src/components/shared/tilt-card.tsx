"use client";

import {
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ElementType,
  type MouseEvent,
  type ReactNode,
} from "react";

import { CardBorderTrace } from "@/components/shared/card-border-trace";
import { cn } from "@/lib/utils";

type TiltCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  intensity?: number;
  /** Radius for the SVG border trace (px). Should roughly match the rounded class. */
  traceRadius?: number;
  /** Disable the line trace overlay (e.g., when card has its own outline) */
  withTrace?: boolean;
  /** Show camera viewfinder corner brackets on hover */
  withCorners?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function TiltCard<T extends ElementType = "div">({
  as,
  children,
  className,
  intensity = 6,
  traceRadius = 24,
  withTrace = true,
  withCorners = true,
  onMouseMove,
  onMouseLeave,
  style,
  ...rest
}: TiltCardProps<T>) {
  const Component = (as ?? "div") as ElementType;

  const handleMove = (event: MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * intensity * 2;
    const rotateX = (0.5 - py) * intensity * 2;
    target.style.setProperty("--mx", `${px * 100}%`);
    target.style.setProperty("--my", `${py * 100}%`);
    target.style.setProperty("--tilt-rx", `${rotateX.toFixed(2)}deg`);
    target.style.setProperty("--tilt-ry", `${rotateY.toFixed(2)}deg`);
    target.style.setProperty(
      "--tilt",
      `perspective(1000px) translate3d(0, -6px, 0) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.012)`,
    );
    if (typeof onMouseMove === "function") {
      (onMouseMove as (e: MouseEvent<HTMLElement>) => void)(event);
    }
  };

  const handleLeave = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-rx", "0deg");
    event.currentTarget.style.setProperty("--tilt-ry", "0deg");
    event.currentTarget.style.setProperty("--tilt", "perspective(1000px) translate3d(0, 0, 0) rotateX(0) rotateY(0) scale(1)");
    if (typeof onMouseLeave === "function") {
      (onMouseLeave as (e: MouseEvent<HTMLElement>) => void)(event);
    }
  };

  return (
    <Component
      className={cn("tech-card group/tilt", className)}
      style={{
        ...(style as CSSProperties | undefined),
        transform: "var(--tilt, perspective(1000px) translate3d(0, 0, 0) rotateX(0) rotateY(0) scale(1))",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      {withTrace ? <CardBorderTrace radius={traceRadius} /> : null}
      {withCorners ? (
        <span className="corner-brackets pointer-events-none absolute inset-0 z-[3]" aria-hidden>
          <span className="tl" />
          <span className="tr" />
          <span className="bl" />
          <span className="br" />
        </span>
      ) : null}
      <span className="tilt-card-content relative z-[1] block">{children}</span>
    </Component>
  );
}
