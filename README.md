# 📅 Syllabus → Calendar

Convert syllabus schedules (text or PDF) into calendar events with `.ics` export.  
Built with **Next.js**, **TypeScript**, **TailwindCSS**, **pdf.js**, and **ical-generator**.

---

## 📋 Prerequisites

- **Node.js and npm**  
  Install from the [official guide](https://nodejs.org/en/download).  
  Confirm installation by running:  

  ```bash
  node -v
  npm -v
  ```

- **Git**  
  Ensure Git is installed and configured:  

  ```bash
  git --version
  ```

## ⚙️ Setting Up Syllabus → Calendar

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/AlexAlexChen/syllabus-to-calendar.git
   ```

2. **Navigate to the Project Root**  
   ```bash
   cd syllabus-to-calendar
   ```

3. **Install Dependencies**  
   ```bash
   npm install
   ```

4. **Run the Development Server**  
   ```bash
   npm run dev
   ```

   By default, the app runs at:  
   👉 http://localhost:3000

---

## 🚀 Usage

- Upload a syllabus PDF or paste text into the textarea.  
- Click **Parse Text** to extract events.  
- Single events (Midterms, Finals) are detected.  
- Recurring classes (e.g., every Tue/Thu … from X to Y) are auto-detected and exported with an RRULE.  
- Review and edit events in the table.  
- Click **Export .ics** to download a calendar file.  
- Import the `.ics` file into Google Calendar, Apple Calendar, or Outlook.

---

## 🛠️ Project Structure

```
app/
  api/
    parse/route.ts     → Parses syllabus text and detects recurring rules
    ics/route.ts       → Generates `.ics` files with RRULE support
  components/
    EventTable.tsx     → Editable events table with export button
  page.tsx             → Main app UI

lib/
  pdf.ts               → PDF text extraction using pdf.js
```

---

## 📝 Notes

- The parser currently supports English syllabus formats.  
- Recurring detection uses chrono-node and RRULE generation via ical-generator.  
- Timezone defaults to your browser’s timezone when exporting `.ics`.  
