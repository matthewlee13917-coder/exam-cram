---
name: exam-cram
description: Build a scoped, verified exam-prep study page (cram sheets, worked examples, practice bank, timed mocks, videos, day plan) from a student's own course files. Use when a student asks to study for, cram for, or prepare for one or more school exams, midterms, finals or quizzes.
---

# Exam Cram

You are building a study page for a student's upcoming exam(s). The bar: everything on the page is **in scope**, **traceable to the student's own course material**, and **checked by someone who did not write it**. A beautiful page with off-scope or wrong content is a failure.

Start by reading `BRIEF.md` in the working folder if it exists (the `examcram` launcher writes it). It names the exams, the intake route, and the folders.

Read the reference files as you reach each phase:
- `references/gather.md`: phases 1–2 (Playwright route, upload route, notes route)
- `references/question-bank.md`: phase 4 (bank format, sourcing, giveaway checks)
- `references/page-spec.md`: phase 6 (views, practice engine, mocks, combined mode)
- `references/verify.md`: phase 7 (blind checker, render checks)

Tools in `tools/` (Python 3, no dependencies): `bank_tools.py` (parse, check, export a question bank) and `yt_verify.py` (confirm YouTube links are real).

**The page UI ships with this skill** in `template/` (`template.html`, `app.js`, `build.py`) with a full working demo in `template/example/`. Don't write a page from scratch and don't edit the template per course: you write three data files (`work/page/config.js`, `content.js`, `videos.js`) plus the bank, and `build.py` produces `site/index.html`. Every student gets the same tested interface.

## Hard rules

1. **Practice only.** Never open, start, answer or submit graded work (quizzes, assignments, exams, graded LMS activities). If a source is a live graded item, skip it and tell the student.
2. **The student logs in themselves.** Never ask for, type or store passwords, 2FA codes or session tokens. Use a headed browser for login, or have the student upload files.
3. **The professor who writes the exam is the authority.** Their latest scope announcement beats the syllabus. Their slides beat the textbook, other professors' exams and answer keys, videos, and your own knowledge. When sources conflict, follow the professor and show the conflict in a note.
4. **Never invent material and present it as real.** Real past-exam questions keep their source label. Every question you write names the worked example or slide it was modelled on. No made-up statistics, quotes, or "the professor said".
5. **Scope is a filter, not a suggestion.** Content outside the announced scope is parked: listed as "not on this exam", never drilled.
6. **Difficulty matches the real exam.** Model practice on real past exams. Never write easier-than-exam practice.
7. **Clean up.** Close every browser you open and stop every server you start. Don't leave localhost tabs open.
8. **Keep the student's materials private.** Course files and generated pages stay local unless the student publishes them. Don't paste course content into web searches.

## Procedure

### Phase 0: intake (ask once, then work)
For each exam, confirm: course code and name, date, start time and room, **format** (number of MCQ, short or long answers, points each, duration), allowed aids, and the chapters/weeks the student believes are in scope. If `BRIEF.md` already answers something, don't ask again. If the student doesn't know the format, look for it in the gathered sources before asking.

### Phase 1: gather (see references/gather.md)
Pick a route from BRIEF.md:
- **Playwright**: the student logs into their LMS and email in a headed browser, and you collect announcements, scope emails, slides, practice exams and the syllabus.
- **Upload**: the student puts files in `sources/`.
- **Notes**: the student pastes topics, or you work from their notes.

Write `sources/INVENTORY.md`: one line per file with its origin, date, and what it is.

### Phase 2: scope
Find the most recent scope statement from the professor (email, announcement, review slide). Write `SCOPE.md` with:
- **IN:** each chapter or topic, with slide or page ranges where the professor cut a chapter partway ("Ch 8 only through slide 19").
- **OUT:** each chapter or topic that's parked, with the reason.
- **Format:** question counts, points and time.
- **Evidence:** quote and cite the line that sets the scope.

If two scope sources disagree, the newest one from the professor wins. Note the conflict.

### Phase 3: extract
Convert everything to text in `work/src/` (`pdftotext -layout`; OCR scanned PDFs with `tesseract` when there's no text layer; `.pptx`/`.docx` with whatever converter is available). Read the in-scope material fully. Skim the rest only to confirm it's out.

### Phase 4: question bank (see references/question-bank.md)
Source order, best first:
1. Real past exams by **this professor** for this course.
2. Real past exams for the same course and textbook by other professors. These are style practice: flag any answer that contradicts this professor's slides, and key it to the slides.
3. Clones you write, each modelled on one of the professor's worked examples, slide facts, or assigned textbook problems.

Deduplicate. Drop real questions on parked topics, and questions built on another professor's framing that this professor doesn't use. Run `python3 tools/bank_tools.py check` until it passes the giveaway checks.

### Phase 5: content
Per exam, write:
- **Scope view:** the IN/OUT lists and format, plus where the practice questions came from.
- **Cram sheet** per chapter: every formula on its own line, with each symbol defined in plain words beneath it. Add the professor's own example numbers, trap boxes for the common mistakes, and a table of facts that differ between courses or sources.
- **Worked examples:** the professor's own examples, step by step, hidden until the student opens them. These are the most likely sources of written exam questions.
- **Written-answer pool** (if the exam has short or long answers): exam-style prompts with point values, model answers, and a rubric where each line is one mark.
- **Plan:** a schedule from now to the exam, highest marks-per-hour first, including any official practice exam the professor posted.
- **Videos** (optional): 2–4 per topic. Verify every link with `tools/yt_verify.py`. Flag where a video's terms or numbers differ from the professor's (for example a different country's institutions or definitions). Never list a video you couldn't verify.

When there's more than one exam, also build a **combined "study as one" view** that groups both courses' chapters into shared topics, tags every item with its exam, and flags facts that differ between the courses in red.

### Phase 6: build the page (see references/page-spec.md)
1. Look at `template/example/work/page/*.js` and open `template/example/site/index.html` to see the finished result.
2. Write `work/page/config.js` (exams, colours, chapter names, mock formats, combined topics), `content.js` (scope, cram sheet, worked examples, written-answer pool, plan) and `videos.js`, following the data model in page-spec.md.
3. Export the bank: `python3 <skill>/tools/bank_tools.py export work/bank/*.txt -o work/bank/bank.json --balance`. Name each bank file after its exam id (`work/bank/ECON101.txt` → course `ECON101`, matching `CONFIG.exams[].id`).
4. Build: `python3 <skill>/template/build.py <prep folder>` → `site/index.html`. Rebuild after every fix.

### Phase 7: verify (see references/verify.md)
1. **Blind check:** hand the bank *without answers* to a separate agent or subagent. It solves every question using the professor's notes, then compares against the key. Fix every confirmed error and every ambiguity.
2. **Transcription check:** spot-check real past-exam items against the originals.
3. **Render check:** open the page at desktop (1280 px) and mobile (390 px) widths, click through every view and both mock types, and check the console for errors. Then close the browser.

### Phase 8: deliver
- In Claude with an artifact or publish tool: publish the page privately and give the student the link.
- Otherwise: give the absolute path to `site/index.html` and offer to open it.

Report to the student:
- the question counts (real vs written),
- the checker's result and what you fixed,
- the answer keys you overrode and why,
- the remaining gaps (for example "no real past exam by this professor exists"; "official practice test not downloaded").
