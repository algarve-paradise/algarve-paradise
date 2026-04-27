"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, CalendarDays, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EventItem } from "@/types/content";

type Props = {
  events: EventItem[];
};

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function startOfMonday(date: Date): number {
  // JS getDay(): 0=Sun … 6=Sat  →  Mon-first offset
  return (date.getDay() + 6) % 7;
}

export function EventsCalendar({ events }: Props) {
  const today = new Date();
  const [cursor, setCursor] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstOffset = startOfMonday(new Date(year, month, 1));

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  // Group events by calendar day for the current month view
  const eventsByDay = new Map<number, EventItem[]>();
  for (const ev of events) {
    if (!ev.startsAt) continue;
    const d = new Date(ev.startsAt);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const day = d.getDate();
    const list = eventsByDay.get(day) ?? [];
    list.push(ev);
    eventsByDay.set(day, list);
  }

  const selectedEvents = selectedDay ? (eventsByDay.get(selectedDay) ?? []) : [];
  const totalEventsThisMonth = Array.from(eventsByDay.values()).reduce(
    (s, v) => s + v.length,
    0
  );

  function prevMonth() {
    setCursor(new Date(year, month - 1, 1));
    setSelectedDay(null);
  }
  function nextMonth() {
    setCursor(new Date(year, month + 1, 1));
    setSelectedDay(null);
  }
  function handleDayClick(day: number) {
    setSelectedDay(prev => (prev === day ? null : day));
  }

  return (
    <div className="space-y-5">
      {/* Month navigator */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          aria-label="Mês anterior"
          className="flex items-center justify-center size-7 border border-border hover:bg-muted transition-colors"
        >
          <ChevronLeft className="size-3.5" />
        </button>
        <div className="text-center">
          <div className="font-heading text-base font-medium leading-none">
            {MONTHS[month]}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
            {year}
          </div>
        </div>
        <button
          onClick={nextMonth}
          aria-label="Próximo mês"
          className="flex items-center justify-center size-7 border border-border hover:bg-muted transition-colors"
        >
          <ChevronRight className="size-3.5" />
        </button>
      </div>

      {/* Summary pill */}
      {totalEventsThisMonth > 0 ? (
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <CalendarDays className="size-3" />
          {totalEventsThisMonth} evento{totalEventsThisMonth !== 1 ? "s" : ""} este mês
        </div>
      ) : (
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Sem eventos registados neste mês
        </div>
      )}

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-px">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-px">
        {/* Empty offset cells */}
        {Array.from({ length: firstOffset }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const hasEvents = eventsByDay.has(day);
          const isToday = isCurrentMonth && day === today.getDate();
          const isSelected = day === selectedDay;
          const count = eventsByDay.get(day)?.length ?? 0;

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              disabled={!hasEvents}
              aria-label={`${day} de ${MONTHS[month]}${hasEvents ? ` — ${count} evento${count !== 1 ? "s" : ""}` : ""}`}
              className={cn(
                "relative flex aspect-square items-center justify-center text-xs transition-colors",
                isSelected
                  ? "bg-foreground text-background font-bold"
                  : isToday && hasEvents
                  ? "border-2 border-foreground font-bold hover:bg-muted"
                  : isToday
                  ? "border border-foreground font-medium"
                  : hasEvents
                  ? "hover:bg-muted font-medium cursor-pointer"
                  : "text-muted-foreground/50 cursor-default"
              )}
            >
              {day}
              {hasEvents && (
                <span
                  className={cn(
                    "absolute bottom-1 left-1/2 -translate-x-1/2 size-1 rounded-full",
                    isSelected ? "bg-background" : "bg-foreground"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day panel */}
      <div className="border-t border-border pt-4 min-h-[72px]">
        {selectedDay && selectedEvents.length > 0 ? (
          <div className="space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
              {selectedDay} de {MONTHS[month]}
            </div>
            {selectedEvents.map((ev) => (
              <Link
                key={ev.slug}
                href={ev.href}
                className="group flex flex-col gap-0.5 border-l-2 border-foreground pl-3 py-1 hover:bg-muted/50 transition-colors"
              >
                <span className="font-heading text-sm font-medium text-foreground leading-snug group-hover:underline decoration-foreground/30 underline-offset-2">
                  {ev.title}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="size-2.5" />
                  {ev.location}
                </span>
              </Link>
            ))}
          </div>
        ) : selectedDay ? (
          <p className="text-xs text-muted-foreground">
            Sem eventos a {selectedDay} de {MONTHS[month]}.
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Selecione um dia destacado para ver os eventos.
          </p>
        )}
      </div>
    </div>
  );
}
