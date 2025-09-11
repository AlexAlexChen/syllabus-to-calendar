import { NextResponse } from "next/server";
import ical from "ical-generator";

type RRule = { freq: "WEEKLY"; byDay: string[]; until: string };
type Event = {
  title: string;
  start?: string;          // ISO
  end?: string;            // ISO
  location?: string;
  description?: string;
  rrule?: RRule;           // if present => recurring event
};

export async function POST(req: Request) {
  const { events, calendarName = "Syllabus", timezone } = (await req.json()) as {
    events: Event[];
    calendarName?: string;
    timezone?: string;     // e.g., "America/New_York"
  };

  const cal = ical({ name: calendarName });

  // Set calendar timezone when supported by current ical-generator version
  try {
    if (timezone && typeof (cal as any).timezone === "function") {
      (cal as any).timezone(timezone);
    }
  } catch {
    // ignore – timezone is optional
  }

  for (const e of events) {
    // Normal (one-off) events OR recurring seed with RRULE
    if (e.start) {
      const base = {
        summary: e.title,
        start: new Date(e.start),
        end: e.end
          ? new Date(e.end)
          : new Date(new Date(e.start).getTime() + 60 * 60 * 1000), // default 1h
        location: e.location,
        description: e.description,
      } as any;

      if (e.rrule) {
        base.repeating = {
          freq: e.rrule.freq,     // "WEEKLY"
          byDay: e.rrule.byDay,   // ["TU", "TH"]
          until: new Date(e.rrule.until),
        };
      }

      cal.createEvent(base);
    }
  }

  const body = cal.toString();
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${calendarName}.ics"`,
    },
  });
}
