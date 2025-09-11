// /app/api/parse/route.ts
import { NextResponse } from "next/server";
import * as chrono from "chrono-node";

type RRule = { freq: "WEEKLY"; byDay: string[]; until: string };
type Event = {
  title: string;
  start?: string; // ISO
  end?: string;   // ISO
  location?: string;
  description?: string;
  rrule?: RRule;  // present => recurring
};

const DAY_STR_TO_ABBR: Record<string, "SU"|"MO"|"TU"|"WE"|"TH"|"FR"|"SA"> = {
  sun: "SU",
  mon: "MO",
  tue: "TU",
  tues: "TU",
  wed: "WE",
  thu: "TH",
  thur: "TH",
  thurs: "TH",
  fri: "FR",
  sat: "SA",
};

// Find first date >= rangeStart whose weekday is in byDay
function firstOccurrence(byDay: string[], rangeStart: Date): Date {
  const want = new Set(byDay);
  const d = new Date(rangeStart);
  d.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const abbr = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"][d.getDay()];
    if (want.has(abbr)) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return new Date(rangeStart);
}

export async function POST(req: Request) {
  const { text } = (await req.json()) as { text: string };
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const events: Event[] = [];

  // Ex: "every Tue/Thu 10:30 AM–11:50 AM from Sep 24, 2025 to Dec 12, 2025"
  const recurrenceRegex =
    /every\s+([a-z\/,\s]+)\s+(\d{1,2}:\d{2}\s*[ap]m?)\s*[–-]\s*(\d{1,2}:\d{2}\s*[ap]m?)\s+from\s+(.+?)\s+to\s+(.+)/i;

  for (const raw of lines) {
    const line = raw.replace(/\u2013|\u2014/g, "-"); // normalize –—
    const m = recurrenceRegex.exec(line);

    if (m) {
      const [, dayStr, startTimeStr, endTimeStr, rangeStartStr, rangeEndStr] = m;

      // BYDAY tokens
      const byDay = dayStr
        .split(/[\/,]/)
        .map(s => s.trim().toLowerCase())
        .map(s => (s.startsWith("thur") ? "thu" : s))
        .map(s => s.slice(0, 3))
        .map(s => DAY_STR_TO_ABBR[s]!)
        .filter(Boolean);

      const startTime = chrono.parseDate(startTimeStr);
      const endTime = chrono.parseDate(endTimeStr);
      const rStart = chrono.parseDate(rangeStartStr);
      const rEnd = chrono.parseDate(rangeEndStr);

      if (byDay.length && startTime && rStart && rEnd) {
        const first = firstOccurrence(byDay, rStart);

        const dtStart = new Date(first);
        dtStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

        const dtEnd = new Date(first);
        if (endTime) {
          dtEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);
        } else {
          dtEnd.setTime(dtStart.getTime() + 60 * 60 * 1000);
        }

        const title = raw.replace(/every.+$/i, "").trim() || "Lecture";

        events.push({
          title,
          start: dtStart.toISOString(),
          end: dtEnd.toISOString(),
          rrule: {
            freq: "WEEKLY",
            byDay, // e.g., ["TU", "TH"]
            until: new Date(new Date(rEnd).setHours(23, 59, 59, 999)).toISOString(),
          },
        });

        continue; // handled this line
      }
    }

    // Fallback: single events (midterm/final/etc.)
    const results = chrono.parse(line, new Date(), { forwardDate: true });
    if (results.length) {
      const r = results[0];
      const s = r.start?.date();
      const e = r.end?.date();
      const title = line.replace(r.text, "").trim() || "Event";
      if (s) {
        events.push({
          title,
          start: s.toISOString(),
          end: e?.toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ events });
}
