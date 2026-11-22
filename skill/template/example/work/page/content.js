// DEMO content. Your agent writes this from the professor's own slides and scope announcement.
const F = (f, sym) => `<div class="f">${f}</div><p class="sym">${sym}</p>`;
const CONTENT = {
ECON101: {
scope: `<h2>What's on it, and what isn't</h2>
<p class="lead">Demo scope, as if taken from the professor's latest announcement: <b>Chapters 1–3</b>. 8 multiple-choice questions in 15 minutes.</p>
<div class="facts"><div><b>8 MCQ × 1</b><span>8 points</span></div><div><b>15 min</b><span>≈ 2 min per question</span></div><div><b>Ch 1–3</b><span>from the scope announcement</span></div><div><b>Bring</b><span>Calculator, pencil</span></div></div>
<div class="cols"><div class="box in"><h3><span class="tag t-in">In scope</span></h3><ul><li><b>Ch 1:</b> unemployment and participation rates, the three kinds of unemployment, discouraged workers.</li><li><b>Ch 2:</b> real vs nominal interest, who wins and loses from surprise inflation.</li><li><b>Ch 3:</b> functions of money, MV = PY.</li></ul></div>
<div class="box out"><h3><span class="tag t-out">Not on this exam</span></h3><ul><li>Ch 4 onward (final exam).</li><li>Graded online quizzes: practice only, this page never touches them.</li></ul></div></div>`,
cram: `<div class="chap"><h2>Ch 1 Unemployment<small>Rates and kinds</small></h2><div class="sheet">
<h3>Rates</h3>${F('u = unemployed / labour force\nlabour force = employed + unemployed\nparticipation = labour force / adult population','u is the unemployment rate. Adults not working and not looking are outside the labour force: they are in neither count.')}
<div class="trap"><b>Trap:</b> divide by the labour force, not the adult population.</div>
<h3>Three kinds</h3><table><tr><th>Kind</th><th>Cause</th><th>Example</th></tr><tr><td>Frictional</td><td>Searching between jobs</td><td>Designer moving cities</td></tr><tr><td>Structural</td><td>Skills or location mismatch</td><td>Plant closes, skills obsolete</td></tr><tr><td>Cyclical</td><td>Recession</td><td>Layoffs in a downturn</td></tr></table></div></div>
<div class="chap"><h2>Ch 2 Inflation<small>Real rates and redistribution</small></h2><div class="sheet">${F('r ≈ i − π','r is the real interest rate, i the nominal rate, π inflation.')}<div class="trap"><b>Trap:</b> surprise inflation helps borrowers on fixed-rate loans, not lenders.</div></div></div>
<div class="chap"><h2>Ch 3 Money<small>Functions and the quantity theory</small></h2><div class="sheet">${F('M × V = P × Y\n%ΔM + %ΔV = %ΔP + %ΔY','M is the money supply, V velocity, P the price level, Y real output.')}</div></div>`,
worked: [
 {t:'Unemployment and participation from a table', s:'Demo slides Ch 1', b:'<p>Employed 40,000, unemployed 2,500, not in labour force 7,500.</p><p>Labour force = 42,500. u = 2,500 / 42,500 = 5.9%. Participation = 42,500 / 50,000 = 85%.</p>'},
 {t:'Money growth for stable prices', s:'Demo slides Ch 3', b:'<p>V constant, Y grows 2%. %ΔP = %ΔM + 0 − 2%. For %ΔP = 0, %ΔM = 2%.</p>'}
],
plan: `<h2>Plan</h2><table class="plan"><tr><td>Day 1</td><td>Cram sheet Ch 1–3, then the worked examples on paper.</td></tr><tr><td>Day 2</td><td>Practice until 85%, then one timed mock.</td></tr><tr><td>Exam eve</td><td>My misses only. Sleep.</td></tr></table>`
},
ECON201: {
scope: `<h2>What's on it, and what isn't</h2>
<p class="lead">Demo scope: <b>Chapters 4–6</b>. 8 MCQ at 2 points plus one 6-point written answer, 25 minutes.</p>
<div class="facts"><div><b>8 MCQ × 2</b><span>16 points</span></div><div><b>1 written</b><span>6 points</span></div><div><b>25 min</b><span>≈ 1 min per point</span></div><div><b>Bring</b><span>Calculator</span></div></div>
<div class="cols"><div class="box in"><h3><span class="tag t-in">In scope</span></h3><ul><li><b>Ch 4:</b> steady-state unemployment, Okun's law, hysteresis.</li><li><b>Ch 5:</b> costs of anticipated inflation, taxing nominal interest, bond prices.</li><li><b>Ch 6:</b> expectations-augmented and long-run Phillips curve.</li></ul></div>
<div class="box out"><h3><span class="tag t-out">Not on this exam</span></h3><ul><li>Ch 7 open economy (cut in the scope announcement).</li></ul></div></div>`,
cram: `<div class="chap"><h2>Ch 4 Labour market<small>Flows and output</small></h2><div class="sheet">${F('u* = s / (s + f)\nY gap ≈ −2 × (u − u*)','s is the monthly job-loss rate, f the job-finding rate, u* the natural rate. 2 is the demo Okun coefficient.')}</div></div>
<div class="chap"><h2>Ch 5 Inflation &amp; bonds<small>Taxes and present value</small></h2><div class="sheet">${F('after-tax real return = i(1 − t) − π\nprice of zero-coupon bond = FV / (1 + i)ⁿ','t is the tax rate on interest, FV the face value, n years to maturity.')}<div class="trap"><b>Trap:</b> divide by 1.05, don't multiply by 0.95.</div></div></div>
<div class="chap"><h2>Ch 6 Phillips curve<small>Short run and long run</small></h2><div class="sheet">${F('π = πᵉ − β(u − u*)','πᵉ is expected inflation, β how strongly inflation responds to slack.')}</div></div>`,
worked: [
 {t:'Steady-state unemployment', s:'Demo slides Ch 4', b:'<p>s = 2%, f = 23%. u* = 0.02 / 0.25 = 8%.</p>'},
 {t:'After-tax real return', s:'Demo slides Ch 5', b:'<p>i = 8%, t = 50%, π = 5%. 8 × 0.5 = 4; 4 − 5 = −1%.</p>'}
],
sa: [
 {pts:6, t:'Phillips curve', based:'Demo slides Ch 6 "The long run"', q:'<p>Explain why a central bank cannot keep unemployment below its natural rate forever by accepting higher inflation. Use the expectations-augmented Phillips curve.</p>',
  model:'<p>In the short run, surprise inflation pushes u below u*. Workers then raise πᵉ, which shifts the short-run curve up. To hold u below u*, inflation must keep beating expectations, so it accelerates. Once πᵉ = π, u returns to u*: the long-run curve is vertical.</p>',
  rub:['States the equation π = πᵉ − β(u − u*)','Short run: surprise inflation lowers u','Expectations rise and the curve shifts up','Holding u < u* needs ever-rising inflation','Long run: πᵉ = π so u = u*','Long-run curve is vertical at u*']}
],
plan: `<h2>Plan</h2><table class="plan"><tr><td>Day 1</td><td>Formulas Ch 4–5, worked examples.</td></tr><tr><td>Day 2</td><td>Phillips curve written answer, then the timed mock.</td></tr></table>`
}
};
CONTENT.all = {
scope: `<h2>One exam, three topics</h2><p class="lead">Both demo courses teach the same ideas at two levels, so this view merges them into <b>three shared topics</b>. Every item is tagged with its exam.</p>
<table><tr><th>Topic</th><th>Questions</th></tr><tr><td>Unemployment &amp; the labour market</td><td data-count="labour"></td></tr><tr><td>Inflation, interest &amp; bonds</td><td data-count="inflation"></td></tr><tr><td>Money &amp; the Phillips curve</td><td data-count="money"></td></tr></table>
<div class="trap"><b>Same idea, different number:</b> ECON 101 uses r ≈ i − π; ECON 201 also subtracts tax: i(1 − t) − π.</div>`,
cram: CONTENT.ECON101.cram + CONTENT.ECON201.cram,
worked: [['labour', CONTENT.ECON101.worked[0], 'ECON101'], ['labour', CONTENT.ECON201.worked[0], 'ECON201'], ['inflation', CONTENT.ECON201.worked[1], 'ECON201'], ['money', CONTENT.ECON101.worked[1], 'ECON101']],
plan: `<h2>Plan</h2><table class="plan"><tr><td>Day 1</td><td>Shared topics first: unemployment, then inflation.</td></tr><tr><td>Day 2</td><td>Mixed mock, then each exam's own mock.</td></tr></table>`
};
