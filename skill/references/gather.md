# Gathering sources

The working folder layout (created by `examcram`, or create it yourself):

```
<exam-prep-folder>/
  BRIEF.md          what the student asked for, route, exams
  sources/          raw files (downloads or uploads), never edited
  sources/INVENTORY.md
  SCOPE.md
  work/src/         extracted text
  work/bank/        question bank source files (*.txt) + bank.json
  site/index.html   the study page
```

## Route A: Playwright (student's logged-in course site)

Use this when BRIEF.md says `route: playwright` and a Playwright tool is available. Check for one in this order:
1. A browser-automation tool your harness already gives you (Claude in Chrome, a Playwright MCP, etc.).
2. `playwright-cli` on PATH (`npm install -g @playwright/cli@latest`).
3. Python or Node Playwright (`python3 -c "import playwright"`; `npx playwright --version`).

If none is available, install `playwright-cli` (`npm install -g @playwright/cli@latest`) if the student agrees; otherwise tell them in one line and switch to Route B.

Steps:
1. Open a **headed** (visible) browser on the LMS login page. Tell the student: "Log in in the window that just opened, including 2FA, then tell me when you're on the course home page." Wait. Never fill credential fields yourself.
2. Find each course's pages. Typical locations (labels vary by school):
   | Site | Announcements | Slides and files | Syllabus / exam info |
   |---|---|---|---|
   | Brightspace (D2L) | course home "Announcements" widget | Content → Table of Contents (each module) | Content → "Course Outline"/"Syllabus"; Calendar |
   | Canvas | Announcements | Modules, Files | Syllabus page |
   | Moodle | "Announcements"/"News forum" at the top of the course | the weekly or topic sections | the first section, or a "Course outline" file |
   | Blackboard | Announcements | Course Content / Learning Materials | Syllabus or Course Information |
   Prefer the site's own download buttons; save files with their original names. If the site has an API the logged-in browser can call (for example Brightspace's `/d2l/api/le/<version>/<orgUnitId>/news/`), reading announcements through it is fine.
3. For each course, collect into `sources/<course>/`:
   - announcements and news, newest first (save as text or markdown with dates). **Scope emails and announcements are the most important source.**
   - the syllabus or course outline
   - lecture slides and notes for the in-scope chapters
   - practice exams, past exams, review sheets, solution keys
   - the exam logistics: date, room, format, allowed aids
4. If BRIEF.md says `check school email: yes`, open the student's webmail in the same browser (they log in) and search for the professor's name plus "midterm", "final", "exam", "scope", "chapters". Save the relevant emails as text. Read only course emails. If it says no, ask the student to paste any scope email instead.
5. If the student's email holds a scope message from the professor, ask them to open it (or let you search the mailbox). Then save the text.
6. **Do not open graded quizzes, assignments or exam attempts.** Listing their names to see what exists is fine. Starting one is not.
7. Close the browser when done, or detach if you attached to the student's own browser. Never close the student's personal windows.

## Route B: upload

Tell the student: "Put your course files in `<absolute path>/sources/`: slides, notes, syllabus, practice exams, and any email or announcement about what's on the exam (a screenshot or copy-paste is fine). Say 'done' when finished." Accept PDFs, PPTX, DOCX, images (OCR them), and pasted text.

If the scope announcement is missing, ask for it specifically. It's the most important file.

## Route C: general notes

The student has no files, or only their own notes. Ask for the course, textbook (title and edition), chapters, and exam format. Build from their notes plus the textbook's standard content. On the scope view, label everything "built from general knowledge of <textbook> Ch X, not from your professor's materials", because the student needs to know that.

## Inventory

`sources/INVENTORY.md`, one line per file:

```
- sources/ECON101/ch8-slides.pdf | LMS > Content > Week 9 | 2026-11-02 | prof's lecture slides Ch 8 (in scope)
- sources/ECON101/scope-email.txt | Outlook, from prof | 2026-11-19 | SCOPE: "Ch 8-11 only, 50 MCQ"
```
