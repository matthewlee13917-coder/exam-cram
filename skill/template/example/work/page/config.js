// DEMO config: fictional courses. Your agent writes one of these per prep folder.
const CONFIG = {
  title: 'Demo: Macro finals cram',
  sub: 'Two fictional exams, used to show what exam-cram builds. Study them as one, or switch to a single course.',
  exams: [
    { id:'ECON101', code:'ECON 101', name:'Principles of Macro', color:'#2c4a86',
      meta:'Fri 9:00 am · Hall B · 8 MCQ · 15 min', when:'2026-12-11T09:00:00-05:00',
      units:{1:'Ch 1 Unemployment', 2:'Ch 2 Inflation', 3:'Ch 3 Money'},
      mock:{mins:15, pts:1, quota:{1:4, 2:2, 3:2}, desc:'<b>ECON 101 format:</b> 8 multiple-choice questions, 1 point each, in the real chapter mix (4 / 2 / 2). 15 minutes.'} },
    { id:'ECON201', code:'ECON 201', name:'Intermediate Macro', color:'#2b6650',
      meta:'Fri 2:00 pm · Room 210 · 8 MCQ + 1 written · 25 min', when:'2026-12-11T14:00:00-05:00',
      units:{4:'Ch 4 Labour market', 5:'Ch 5 Inflation & bonds', 6:'Ch 6 Phillips curve'},
      mock:{mins:25, pts:2, quota:{4:3, 5:3, 6:2}, sa:[6], desc:'<b>ECON 201 format:</b> 8 multiple-choice questions at 2 points each plus one 6-point written answer. 25 minutes. Mark the written answer yourself against the rubric.'} }
  ],
  combined: {
    name:'Study as one', meta:'Both courses merged into 3 topics · 16 questions', color:'#7a3b2e',
    themes:[ {id:'labour', name:'Unemployment & the labour market'}, {id:'inflation', name:'Inflation, interest & bonds'}, {id:'money', name:'Money & the Phillips curve'} ],
    map:{ ECON101:{1:'labour', 2:'inflation', 3:'money'}, ECON201:{4:'labour', 5:'inflation', 6:'money'} },
    mix:{ mins:20, quota:{labour:4, inflation:4, money:4}, desc:'<b>Mixed one-exam mock:</b> 12 questions across all three topics from both courses, 1 point each, 20 minutes.' }
  },
  mockAids: 'Calculator only.',
  realLabel: 'Real past-exam', cloneLabel: 'Modelled on your slides',
  videosWarning: '<b>These are not your professor\'s lectures.</b> Several are American: where they say "Fed", read your central bank. Red notes flag where a video differs from the course.',
  videosChecked: 'Each link was checked against YouTube for its title and channel when the page was built.'
};
