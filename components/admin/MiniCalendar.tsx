"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalEvent = {
  /** ISO date (jour seul, ex: "2026-05-22") */
  date: string;
  time?: string;
  title: string;
  /** Couleur du dot · par défaut brand-500. */
  color?: string;
};

type Props = {
  /** Évènements à afficher dans la grille + liste sous le calendrier. */
  events?: CalEvent[];
};

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS_FR = ["L", "M", "M", "J", "V", "S", "D"];

function pad(n: number) { return String(n).padStart(2, "0"); }
function toIso(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

export function MiniCalendar({ events = [] }: Props) {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalEvent[]>();
    for (const ev of events) {
      const list = map.get(ev.date) ?? [];
      list.push(ev);
      map.set(ev.date, list);
    }
    return map;
  }, [events]);

  const { year, month } = cursor;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  // Jour de la semaine du 1er (0=Lundi en convention FR)
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  // Jours du mois précédent à afficher
  const prevDaysCount = firstWeekday;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const todayIso = toIso(today.getFullYear(), today.getMonth(), today.getDate());
  const todayIsCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const cells: { day: number; muted: boolean; iso: string }[] = [];
  for (let i = prevDaysCount; i > 0; i--) {
    const d = prevMonthLastDay - i + 1;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({ day: d, muted: true, iso: toIso(prevYear, prevMonth, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, muted: false, iso: toIso(year, month, d) });
  }
  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - prevDaysCount - daysInMonth + 1;
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({ day: nextDay, muted: true, iso: toIso(nextYear, nextMonth, nextDay) });
  }

  const visibleEvents = events.filter((ev) => ev.date.startsWith(`${year}-${pad(month + 1)}`));

  return (
    <div className="bg-white border border-sand-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="font-display font-medium text-[1rem] tracking-tight text-ink-900">
          {MONTHS_FR[month]} {year}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCursor((c) => ({ year: c.month === 0 ? c.year - 1 : c.year, month: c.month === 0 ? 11 : c.month - 1 }))}
            className="w-6 h-6 rounded-md border border-sand-200 grid place-items-center hover:bg-sand-100 transition"
            aria-label="Mois précédent"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={() => setCursor((c) => ({ year: c.month === 11 ? c.year + 1 : c.year, month: c.month === 11 ? 0 : c.month + 1 }))}
            className="w-6 h-6 rounded-md border border-sand-200 grid place-items-center hover:bg-sand-100 transition"
            aria-label="Mois suivant"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-[0.7rem]">
        {DAYS_FR.map((d, i) => (
          <div key={`name-${i}`} className="text-center text-ink-400 font-semibold uppercase tracking-wider py-1 text-[0.6rem]">
            {d}
          </div>
        ))}
        {cells.map((cell, i) => {
          const hasEvent = eventsByDate.has(cell.iso);
          const isToday = !cell.muted && cell.iso === todayIso && todayIsCurrentMonth;
          return (
            <div
              key={`cell-${i}`}
              className={`aspect-square grid place-items-center rounded-md text-[0.74rem] font-medium relative cursor-pointer transition-colors ${
                cell.muted
                  ? "text-sand-300"
                  : isToday
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:bg-sand-100"
              }`}
            >
              {cell.day}
              {hasEvent && !cell.muted && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500"
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>

      {visibleEvents.length > 0 && (
        <div className="mt-3.5 pt-3.5 border-t border-dashed border-sand-200 flex flex-col gap-2">
          {visibleEvents.slice(0, 4).map((ev, i) => (
            <div key={`ev-${i}`} className="flex items-center gap-2.5 text-[0.78rem]">
              <span
                className="w-2 h-2 rounded-sm flex-shrink-0"
                style={{ background: ev.color ?? "#f07a2f" }}
                aria-hidden
              />
              {ev.time && (
                <span className="font-mono text-[0.66rem] text-ink-400 min-w-[36px]">{ev.time}</span>
              )}
              <span className="text-ink-900 truncate">{ev.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
