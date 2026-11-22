# Study page spec

The UI is already built: `template/template.html` + `template/app.js`, assembled by `template/build.py`. **Use it; don't hand-write a page.** A complete working example (two exams, combined mode, mocks with a written answer, videos) is in `template/example/`.

```
<prep folder>/work/bank/<EXAMID>.txt   question banks (one per exam, file name = exam id)
<prep folder>/work/bank/bank.json      bank_tools.py export ... --balance
<prep folder>/work/page/config.js      const CONFIG = {...}
<prep folder>/work/page/content.js     const CONTENT = {...}
<prep folder>/work/page/videos.js      const VIDEOS = {...}   (optional)
python3 <skill>/template/build.py <prep folder>   ->  <prep folder>/site/index.html
```

Only change `template.html` or `app.js` if something is genuinely broken, and then fix it in the skill so every student gets the fix.

## CONFIG
```js
const CONFIG = {
  title: 'ECON 101 + PSYC 201 finals cram',
  sub: 'One line: dates, and where the scope came from.',      // HTML allowed
  exams: [{
    id: 'ECON101',                 // = bank file name = bank item "course"
    code: 'ECON 101', name: 'Principles of Macro', color: '#2c4a86',   // one accent per exam; dark enough for white text
    meta: 'Fri 9:00 am · Hall B · 50 MCQ · 80 min',
    when: '2026-12-11T09:00:00-05:00',                          // ISO with offset: drives the countdown
    units: {8:'Ch 8 Saving', 9:'Ch 9 Unemployment'},            // chapter number -> chip label; every bank "ch" must appear here
    mock: {mins: 80, pts: 1, quota: {8: 25, 9: 25}, sa: [9, 18], desc: '<b>Format:</b> ...'}  // quota = real chapter mix; sa = written-answer point values
  }],
  combined: {                      // only with 2+ exams
    name: 'Study as one', meta: 'Both courses merged into 4 topics', color: '#7a3b2e',
    themes: [{id:'labour', name:'Unemployment & the labour market'}],
    map: {ECON101: {9:'labour'}},  // exam -> chapter -> theme. A bank item can override with a "theme" field.
    mix: {mins: 50, quota: {labour: 8}, desc: '<b>Mixed mock:</b> ...'}
  },
  mockAids: 'Calculator only.',
  realLabel: 'Real past-exam', cloneLabel: 'Modelled on your slides',
  videosWarning: '<b>These are not your professor's lectures.</b> ...',   // HTML
  videosChecked: 'Each link was checked against YouTube on <date>.',
  videoGroups: [{id:'ch8', name:'Ch 8 Saving'}]   // single-exam pages only: which VIDEOS keys to show, in order
};
```

## CONTENT
```js
const CONTENT = {
  ECON101: {
    scope: `HTML`,   // facts grid (.facts), IN box (.box.in) and OUT box (.box.out), where questions came from, disputed keys
    cram: `HTML`,    // per chapter: <div class="chap"><h2>..<small>..</small></h2><div class="sheet">..</div></div>
                     // formulas in <div class="f">, symbols in <p class="sym">, traps in <div class="trap"><b>Trap:</b> ..</div>
    worked: [{t:'title', s:'source', b:'HTML steps'}],
    sa: [{pts:9, t:'topic', based:'source', q:'HTML prompt', model:'HTML model answer', rub:['one mark per line', ...]}],
    plan: `HTML`     // <table class="plan"> from now to the exam
  },
  all: {             // combined mode only
    scope: `HTML`,   // <td data-count="<themeId>"></td> is filled with per-exam question counts
    cram: `HTML`,    // grouped by theme; tag blocks with EXTAG('ECON101'); red .trap boxes for "same idea, different number"
    worked: [['<themeId>', {t,s,b}, '<examId>']],
    plan: `HTML`
  }
};
```

## VIDEOS
`VIDEOS[themeId or videoGroups id] = [{id:'<11-char YouTube id>', t:'title', ch:'channel', ex:['ECON101'], why:'why watch', warn:'where it differs from the prof'}]`. The first per group is shown as "Watch first". Every id must pass `tools/yt_verify.py`.

## What the template already does (don't rebuild)
- Header tab per exam with live countdown, plus "Study as one" first when there are 2+ exams.
- Views: Scope, Cram sheet, Worked examples, Practice, Timed mock, Videos, Plan. Hash routing (`#econ101-practice`) keeps the place on refresh.
- Practice: chapter/topic chips, exam filter in combined mode, real/clone filter, "My misses", A–D / 1–4 keys and Enter, explanation + trap + note + source after each answer. Real questions keep their letters; clones are shuffled unless an option refers to the others.
- Timed mock in each exam's real format (quota per chapter, points per MCQ, written answers with model answer and rubric checkboxes that update the score), mixed mock in combined mode, auto-submit at 0:00, breakdown by chapter/topic. Results saved in localStorage (wrapped in try/catch).
- Readable at 390 px; calm print-like design; red only for traps and conflicts.

## Writing rules for the HTML you put in CONTENT
- Body text in plain sentences. Each formula on its own line, each symbol defined in words beneath it.
- No emoji icons, no gradient text, no external scripts, no `alert`/`confirm`/`prompt`.
- Escape `<` in maths as `&lt;`. Use backtick strings; escape any backtick or `${` inside them.
