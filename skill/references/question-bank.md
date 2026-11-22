# Question bank

## File format (`work/bank/<course>.txt`)

```
@ W25-12 | 9 | Labour force rates | real | Prof X W25 MT2 Q12
Q: A discouraged worker stops searching. The unemployment rate...
- rises
- falls *
- is unchanged
- falls only if the participation rate rises
E: She leaves the labour force: U and LF both fall by 1, so U/LF falls.
T: Students think "fewer unemployed = good news". It isn't: nobody found a job.
N: (optional) Prof X's printed key says A; this professor's slide 14 says B. Keyed to the slide.

@ C-LF-3 | 9 | Labour force rates | clone | written | based: prof's slide 12 worked example
Q: ...
```

- Header: `@ id | chapter | topic | kind | source` with optional `| based: ...`.
  - `kind` is `real` (copied from an actual exam) or `clone` (you wrote it).
  - Clones must name what they were modelled on in `based:`.
- Exactly 4 options. A trailing ` *` marks the correct option.
- `E:` explanation (required). Show the arithmetic for numeric questions and cite the slide when wording matters.
- `T:` trap (optional): the mistake that the most popular wrong answer encodes.
- `N:` note (optional): disputed keys, cross-source conflicts.

Run `python3 tools/bank_tools.py check work/bank/*.txt` to validate, and `python3 tools/bank_tools.py export work/bank/*.txt -o work/bank/bank.json --course-from-filename` to export.

## Sourcing rules

- **Real questions keep their original option order** (the letters match the paper).
- **Drop** real questions that are off-scope, or that rely on another professor's framing, terms or numbers that this professor doesn't use. Record what you dropped in the scope view.
- **Disputed keys:** when a real key contradicts this professor's material, key it to the professor and add an `N:` note with the printed key.
- **Clones** come from the professor's worked examples, slide facts that appear only in this course, and assigned textbook problems. Give them new numbers, the same structure, and the same difficulty.
- **Courses with no real past exams:** every question is a clone. Say so on the scope view.
- Aim for at least 3× the exam's question count per exam, spread across chapters in proportion to their weight.

## Giveaway checks (the `check` command enforces these)

- **Answer position:** clones are balanced across A–D (the tool rebalances them with `--balance`). The page also shuffles clone options at runtime unless an option refers to other options ("all of the above", "both A and B").
- **Longest-option tell:** the correct answer is strictly the longest option in **≤30%** of clones. Fix offenders by shortening the correct option or lengthening distractors with plausible content.
- **Distractors are real mistakes:** a sign error, the forgotten term, the wrong base, the other course's number. Never use obviously silly options.
- **No duplicate ids, no duplicate stems, exactly one correct option.**
