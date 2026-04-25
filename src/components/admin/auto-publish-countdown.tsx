"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  deadline: string | null;
};

function formatDelta(ms: number): string {
  if (ms <= 0) return "Pronto a publicar";
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m ate auto-publicar`;
  return `${minutes}m ate auto-publicar`;
}

export function AutoPublishCountdown({ deadline }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!deadline) return null;
  const ms = new Date(deadline).getTime() - now;
  return (
    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
      {formatDelta(ms)}
    </span>
  );
}
