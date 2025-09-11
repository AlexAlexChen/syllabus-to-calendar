"use client";
import { useState } from "react";
import EventTable, { EventRow } from "./components/EventTable";

export default function Page() {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<EventRow[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fromPdf = async (f: File) => {
    setLoading(true);
    const { extractPdfText } = await import("@/lib/pdf"); // good
    const t = await extractPdfText(f);
    setText(t);
    setLoading(false);
  };  

  const parse = async () => {
    setLoading(true);
    const res = await fetch("/api/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setEvents(data.events);
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">Syllabus → Calendar</h1>
      <p className="text-gray-600 mt-1">Upload a syllabus PDF or paste text, review events, export .ics</p>

      <div className="mt-4 space-y-3">
        <input type="file" accept="application/pdf" onChange={e => e.target.files?.[0] && fromPdf(e.target.files[0])} />
        <textarea
          className="w-full h-48 border rounded p-3"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste syllabus text here..."
        />
        <button onClick={parse} disabled={loading || !text} className="rounded-xl px-4 py-2 bg-black text-white">
          {loading ? "Parsing..." : "Parse Text"}
        </button>
      </div>

      {events && <EventTable initial={events} />}
    </main>
  );
}
