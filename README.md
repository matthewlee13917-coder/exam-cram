# exam-cram

Turn your course files into a **scoped, double-checked study page** for your next exam, built by your own AI agent (Claude Code or Codex).

```
examcram
```

An open book turns into 1s and 0s, which settle into your notes. Then:

1. **Setup check**: Node, Python, Claude Code / Codex, Playwright, and whether the skill is installed, each with a ✓ or a fix.
2. **How should your agent get your material?**
   - **Auto-pull from your course site**: pick Brightspace, Canvas, Moodle, Blackboard or other, paste the address, and choose whether it should also check your school email for the scope announcement. If Playwright is missing, it offers to install it, lets your agent install it, or switches you to manual upload.
   - **Manual upload**: it makes a `sources/` folder and opens it in Finder for you to drop files into.
   - **No files**: just the course, textbook and topics.
3. **Your exams**, one per line, plus anything you find hard.
4. It writes `BRIEF.md` and starts **Claude Code or Codex** in that folder with the instructions loaded. On the auto-pull route a browser window opens: you log in yourself, and the agent downloads the files.

**[See the demo →](docs/demo/index.html)**: a real recording of the launcher, plus the live study page it builds (open the file in a browser after cloning).

Your agent then builds a single study page with:

| View | What's in it |
|---|---|
| Scope | What's on the exam and what's not, taken from your professor's own announcement |
| Cram sheet | Formulas with every symbol explained, traps, your professor's examples |
| Worked examples | Step by step, hidden until you open them |
| Practice | Real past-exam questions plus checked look-alikes, filters, and a "my misses" replay |
| Timed mock | Your exam's real format and timing, with rubrics for written answers |
| Videos | Verified YouTube lessons per topic, flagged where they differ from your prof |
| Plan | A schedule from now until the exam |

If you have more than one exam, a **Study as one** tab merges them into shared topics.

## Install (2 minutes)

You need: **Node 18+**, **Python 3**, **Git**, and **[Claude Code](https://claude.com/claude-code) or [Codex](https://github.com/openai/codex)** signed in.

**Mac / Linux** (Terminal):
```sh
git clone https://github.com/matthewlee13917-coder/exam-cram.git ~/exam-cram
cd ~/exam-cram && node install.js
examcram
```

**Windows** (PowerShell):
```powershell
git clone https://github.com/matthewlee13917-coder/exam-cram.git $HOME\exam-cram
cd $HOME\exam-cram; node install.js
```
Then open a **new** PowerShell window and run `examcram`. When installing Python, tick "Add python.exe to PATH". If PowerShell blocks scripts, run `examcram.cmd` instead.

Optional, for the course-site route: `npm install -g @playwright/cli@latest`

## What the agent will and won't do

- **Won't** touch graded work: no quizzes, assignments or exam attempts. Practice only.
- **Won't** ask for your password. You log in yourself in the browser window it opens.
- **Treats your professor as the authority**: their latest scope announcement and slides win over textbooks, other professors' answer keys, and videos. Conflicts are shown in notes, not hidden.
- **Checks itself**: a second agent re-solves every question blind before you see the page, and the agent tells you what it fixed.
- **Keeps your files local.** Your course files and the page stay on your machine unless you choose to share them.

## Update

```sh
cd ~/exam-cram && git pull
```

## Layout

```
bin/examcram            launcher: animation, setup check, questions, hands off to your agent
skill/SKILL.md          the instructions your agent follows
skill/references/       gather · question-bank · page-spec · verify
skill/template/         the study page UI (template.html, app.js, build.py) + a working example
skill/tools/            bank_tools.py (validate/export questions) · yt_verify.py (check video links)
docs/demo/              recorded demo of the launcher + the example study page
install.js              installer (Mac, Linux, Windows); install.sh calls it
```

Without the launcher, you can point any agent at it directly: *"Read ~/exam-cram/skill/SKILL.md and follow it to build my exam cram page."*
