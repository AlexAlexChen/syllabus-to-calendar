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

## 🧪 Current Status & Limitations

You can **upload a syllabus PDF or paste text**, but right now the app **cannot fully auto-extract times/dates from arbitrary syllabi**.  
For correct `.ics` generation, you need to edit or paste your schedule using the **supported input format** below.

### ✅ Supported Input Format

**Recurring class (weekly RRULE):**
Lecture every Tue/Thu 10:30 AM–11:50 AM from Sep 24, 2025 to Dec 12, 2025
**Single events:**
Midterm: Oct 29, 2025 7:00 PM–9:00 PM
Final Exam: Dec 15, 2025 8:00 AM–10:00 AM


### 📝 Notes
- Use an en dash `–` or a hyphen `-` between times (e.g., `7:00 PM–9:00 PM`).  
- Month names can be abbreviated (`Sep`, `Oct`, `Dec`) or full (`September`, `October`, `December`).  
- Day names can be written `Mon/Tue/Wed/Thu/Fri` (case-insensitive).  
- The app assumes your **local timezone** when exporting `.ics`.  

### 🛠️ What Works Today
1. **Paste text in the supported format** → click **Parse Text** → review in the table → **Export .ics**.  
2. **Upload a PDF syllabus**, then manually edit the textarea so only supported format lines remain → **Parse Text** → **Export .ics**.  

### 🚧 Roadmap
- Robust auto-extraction from arbitrary syllabi (different phrasings, tables, and layouts).  
- Parsing of location/room and smarter event titles.  
- Support for multiple recurring blocks in one syllabus.  
