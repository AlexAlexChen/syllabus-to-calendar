"use client";
import { useState } from "react";

export type EventRow = { title: string; start: string; end?: string; location?: string; description?: string };

export default function EventTable({ initial }: { initial: EventRow[] }) {
  const [events, setEvents] = useState<EventRow[]>(initial);

  const update = (i: number, k: keyof EventRow, v: string) => {
    const copy = [...events];
    (copy[i] as any)[k] = v;
    setEvents(copy);
  };

  const downloadIcs = async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // e.g., "America/New_York"
    const res = await fetch("/api/ics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events, calendarName: "Syllabus", timezone }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "syllabus.ics"; a.click();
    URL.revokeObjectURL(url);
  };
  

  return (
    <div className="mt-6">
      <table className="w-full text-sm border">
        <thead className="bg-gray-50">
          <tr><th className="p-2">Title</th><th className="p-2">Start (ISO)</th><th className="p-2">End (ISO)</th><th className="p-2">Location</th></tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i} className="border-t">
              {["title","start","end","location"].map((k) => (
                <td key={k} className="p-2">
                  <input className="w-full border rounded px-2 py-1" value={(e as any)[k] || ""} onChange={(ev)=>update(i, k as any, ev.target.value)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={downloadIcs} className="mt-4 rounded-xl px-4 py-2 bg-black text-white">Export .ics</button>
    </div>
  );
}
