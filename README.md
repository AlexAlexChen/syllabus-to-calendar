📅 Syllabus → Calendar

Convert syllabus schedules (text or PDF) into calendar events with .ics export.
Built with Next.js, TypeScript, TailwindCSS, and pdf.js.

✨ Features

📂 Upload a syllabus PDF or paste raw text

🔍 Parse single events (Midterms, Finals)

🔁 Auto-detect recurring classes
Example:
Lecture every Tue/Thu 10:30 AM–11:50 AM from Sep 24, 2025 to Dec 12, 2025
→ generates an RRULE repeating on Tue/Thu until the end date

📝 Edit events in a table before exporting

📤 Export to .ics → import into Google Calendar, Apple Calendar, Outlook, etc.

🚀 Getting Started
1. Clone the repo

git clone https://github.com/AlexAlexChen/syllabus-to-calendar.git
cd syllabus-to-calendar

2. Install dependencies

npm install

3. Run locally

npm run dev
App will be live at http://localhost:3000

4. Build & start

npm run build
npm start

📂 Project Structure

app/api/parse/route.ts → Parse syllabus text, detect recurrence

app/api/ics/route.ts → Generate ICS with RRULE

app/components/EventTable.tsx → Event editor table

app/page.tsx → Main UI

lib/pdf.ts → PDF text extraction (pdf.js)

🛠️ Tech Stack

Next.js 15 (App Router)

TypeScript

TailwindCSS

pdfjs-dist

chrono-node

ical-generator
