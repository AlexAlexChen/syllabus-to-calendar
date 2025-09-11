import { NextResponse } from "next/server";
import ical, { ICalEventRepeatingFreq, type ICalWeekday } from "ical-generator";

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
  const {
    events,
    calendarName = "Syllabus",
  }: {
    events: Event[];
    calendarName?: string;
  } = await req.json();

  const cal = ical({ name: calendarName });

  for (const e of events) {
    if (!e.start) continue;

    const base = {
      summary: e.title,
      start: new Date(e.start),
      end: e.end
        ? new Date(e.end)
        : new Date(new Date(e.start).getTime() + 60 * 60 * 1000),
      location: e.location,
      description: e.description,
    };

    if (e.rrule) {
      // Cast to the library’s ICalWeekday type
      const byDay = e.rrule.byDay.map((d) => d as ICalWeekday);

      cal.createEvent({
        ...base,
        repeating: {
          freq: ICalEventRepeatingFreq.WEEKLY,
          byDay,
          until: new Date(e.rrule.until),
        },
      });
    } else {
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
