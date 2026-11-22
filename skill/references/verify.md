# Verification

Nothing ships until all three checks pass.

## 1. Blind check (independent)
- Export the bank without answers: `python3 tools/bank_tools.py blind work/bank/*.txt -o work/bank/blind.json`.
- Give it to a **separate** agent or subagent that didn't write the questions, along with the path to the professor's extracted notes. Instructions for the checker:
  1. Solve every question blind. Work numeric ones out in code.
  2. Only then open `bank.json` and compare against the key.
  3. Rule on each disagreement, citing the notes, and check every explanation's arithmetic.
  4. Flag ambiguous items and giveaways.
  5. Write `work/checker-report.md`.
- If no subagent is available, run the check yourself in a fresh pass. Solve from `blind.json` before looking at the keys. Say in the final report that the check wasn't independent.
- Fix every confirmed error. For a disputed item that you keep, add an `N:` note explaining which source wins.

## 2. Transcription check
For at least 15 real items (or all of them, if there are fewer), compare the stem, options and key against the original paper or its OCR. Fix any drift.

## 3. Render check
- Serve `site/` locally, or open it as a file. Check it at 1280×900 and 390×844.
- Visit every view, answer a practice question with the keyboard, then start and submit each mock type and tick a rubric box.
- Confirm there are no console errors and no text overflow.
- Close the browser and stop the server afterwards.

## Final report to the student
- Question counts per exam (real vs clone).
- The checker's agreement rate and what you fixed.
- Answer keys you overrode, and why.
- Giveaway stats: answer positions, and the longest-correct-option percentage.
- Remaining gaps, each in one line.
