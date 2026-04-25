/**
 * Minimal iCalendar (RFC 5545) parser.
 *
 * Handles the fields we need: SUMMARY, DESCRIPTION, DTSTART, DTEND,
 * LOCATION, URL, UID. Implements line unfolding (continuation lines start
 * with whitespace) and the most common DATE-TIME formats.
 *
 * If a feed turns out to use VALARM-heavy or recurring events with RRULE,
 * swap this for `node-ical`. For municipality calendars (Faro, Lagos,
 * Portimao, etc.) the simple shape below is sufficient in practice.
 */
import type { RawIngestedEvent } from "../types";

/** Reverse the RFC 5545 line folding (CRLF + space/tab continues a line). */
function unfold(input: string): string {
  return input.replace(/\r?\n[ \t]/g, "");
}

function unescape(value: string): string {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

/**
 * Parse an iCal DATE or DATE-TIME value.
 * Examples:
 *   20260415T180000Z       -> UTC
 *   20260415T180000        -> floating, treated as local
 *   20260415               -> all-day
 */
function parseICalDate(value: string): Date | null {
  const trimmed = value.trim();
  if (/^\d{8}$/.test(trimmed)) {
    const year = Number(trimmed.slice(0, 4));
    const month = Number(trimmed.slice(4, 6)) - 1;
    const day = Number(trimmed.slice(6, 8));
    return new Date(Date.UTC(year, month, day));
  }
  const dtMatch = trimmed.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z?)$/);
  if (dtMatch) {
    const [, y, m, d, hh, mm, ss, z] = dtMatch;
    if (z === "Z") {
      return new Date(
        Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss))
      );
    }
    return new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
  }
  return null;
}

type Line = { name: string; value: string };

function parseLine(rawLine: string): Line | null {
  // Strip parameters: NAME;TZID=Europe/Lisbon:VALUE
  const colonIndex = rawLine.indexOf(":");
  if (colonIndex === -1) return null;
  const left = rawLine.slice(0, colonIndex);
  const value = rawLine.slice(colonIndex + 1);
  const name = left.split(";")[0].toUpperCase().trim();
  if (!name) return null;
  return { name, value };
}

export function parseICal(text: string): RawIngestedEvent[] {
  const unfolded = unfold(text);
  const events: RawIngestedEvent[] = [];

  const blocks = unfolded.split(/BEGIN:VEVENT/i).slice(1);
  for (const block of blocks) {
    const endIndex = block.search(/END:VEVENT/i);
    if (endIndex === -1) continue;
    const body = block.slice(0, endIndex);
    const lines = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseLine)
      .filter((line): line is Line => line !== null);

    const dict = new Map<string, string>();
    for (const line of lines) {
      if (!dict.has(line.name)) dict.set(line.name, line.value);
    }

    const summary = dict.get("SUMMARY");
    const dtstart = dict.get("DTSTART");
    if (!summary || !dtstart) continue;

    const startsAt = parseICalDate(dtstart);
    if (!startsAt) continue;

    const dtend = dict.get("DTEND");
    const endsAt = dtend ? parseICalDate(dtend) : null;

    const url = dict.get("URL") ?? dict.get("UID") ?? "";
    if (!url) continue;

    events.push({
      url,
      title: unescape(summary).trim(),
      summary: dict.get("DESCRIPTION") ? unescape(dict.get("DESCRIPTION")!).slice(0, 2000) : null,
      startsAt,
      endsAt,
      location: dict.get("LOCATION") ? unescape(dict.get("LOCATION")!).trim() : null,
      payload: { source: "ical" },
    });
  }

  return events;
}
