(function(){
// exam-cram study page engine. Everything course-specific comes from CONFIG, CONTENT, VIDEOS and the bank.
const BANK = JSON.parse(document.getElementById('bank').textContent);
const EX = CONFIG.exams, EXID = EX.map(e=>e.id), BYID = Object.fromEntries(EX.map(e=>[e.id,e]));
const COMBINED = EX.length > 1 && CONFIG.combined;
const THEMES = COMBINED ? CONFIG.combined.themes : [];
const THEMENAME = Object.fromEntries(THEMES.map(t=>[t.id,t.name]));
const themeOf = q => q.theme || (CONFIG.combined && CONFIG.combined.map && (CONFIG.combined.map[q.course]||{})[q.ch]) || (THEMES[0]||{}).id;
const UNITS = id => Object.keys(BYID[id].units).map(k=>isNaN(+k)?k:+k);
const CH = Object.assign({all: THEMES.map(t=>t.id)}, Object.fromEntries(EXID.map(id=>[id, UNITS(id)])));
const chName = (c, ch) => (BYID[c] && BYID[c].units[ch]) || ('Ch '+ch);
const unitOf = q => course==='all' ? themeOf(q) : q.ch;
const unitName = u => course==='all' ? THEMENAME[u] : chName(course, u);
const L = ['A','B','C','D'];
const main = document.getElementById('main');
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'');
const EXTAG = c => `<span class="tag t-${slug(c)}">${esc(BYID[c]?BYID[c].code:c)}</span>`;
window.EXTAG = EXTAG;

// ---- header + per-exam colours, built from CONFIG ----
document.title = CONFIG.title;
document.getElementById('title').textContent = CONFIG.title;
document.getElementById('sub').innerHTML = CONFIG.sub || '';
const tint = c => `color-mix(in srgb, ${c} 13%, #fff)`;
const allColor = (COMBINED && CONFIG.combined.color) || '#7a3b2e';
let css = `body.c-all{--acc:${allColor};--accbg:${tint(allColor)}}`;
EX.forEach(e=>{ const s=slug(e.id); css += `body.c-${s}{--acc:${e.color};--accbg:${tint(e.color)}} .t-${s}{background:${tint(e.color)};color:${e.color}}`; });
document.getElementById('examcss').textContent = css;
const tabs = (COMBINED ? [{id:'all', code:CONFIG.combined.name||'Study as one', meta:CONFIG.combined.meta||'', when:EX.map(e=>e.when).sort()[0]}] : []).concat(EX);
const exEl = document.getElementById('exams');
exEl.style.setProperty('--n', tabs.length);
exEl.innerHTML = tabs.map(t=>`<button class="exam" role="tab" data-course="${esc(t.id)}" aria-selected="false"><div class="code">${esc(t.code)}${t.name?' · '+esc(t.name):''}</div><div class="meta">${esc(t.meta||'')}</div>${t.when?`<div class="cd" data-cd="${esc(t.when)}"></div>`:''}</button>`).join('');

// ---- storage (optional) ----
const KEY = CONFIG.storeKey || 'examcram-'+slug(CONFIG.title);
let store = {};
try { store = JSON.parse(localStorage.getItem(KEY)||'{}'); } catch(e) { store = {}; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch(e){} };
store.stats = store.stats || {};
function record(id, ok){ const s = store.stats[id] || {r:0,w:0}; ok ? s.r++ : s.w++; s.last = ok; store.stats[id]=s; save(); }

let course = COMBINED ? 'all' : EXID[0], view = 'scope';
let pr = null, mock = null, timerId = null;

function tick(){
  document.querySelectorAll('[data-cd]').forEach(el=>{
    const ms = new Date(el.dataset.cd) - new Date();
    if (isNaN(ms)) { el.textContent=''; return; }
    if (ms <= 0) { el.textContent = 'Exam time has passed'; return; }
    const h = Math.floor(ms/3.6e6), m = Math.floor(ms%3.6e6/6e4);
    el.textContent = (h>=24 ? Math.floor(h/24)+'d '+(h%24)+'h ' : h+'h ') + m + 'm to go';
  });
}
tick(); setInterval(tick, 30000);

const VIEWS = ['scope','cram','worked','practice','mock','videos','plan'];
function setHash(){ const h = slug(course)+'-'+view; if (location.hash.slice(1)!==h) history.replaceState(null,'','#'+h); }
function readHash(){
  const h = location.hash.slice(1), i = h.lastIndexOf('-'); if (i<0) return;
  const c = h.slice(0,i), v = h.slice(i+1);
  const id = c==='all' && COMBINED ? 'all' : EXID.find(x=>slug(x)===c);
  if (id && VIEWS.includes(v)) { if (id!==course) { pr=null; mock=null; stopTimer(); } course = id; view = v; }
}
function chrome(){
  document.body.className = 'c-'+slug(course);
  document.querySelectorAll('.exam').forEach(b=>b.setAttribute('aria-selected', b.dataset.course===course));
  document.querySelectorAll('nav.views button').forEach(b=>b.setAttribute('aria-selected', b.dataset.view===view));
}
const C = () => CONTENT[course] || {};
function render(){
  chrome(); setHash();
  if (view !== 'mock') stopTimer();
  if (view==='scope') {
    main.innerHTML = '<div class="view">'+(C().scope||'')+'</div>';
    main.querySelectorAll('[data-count]').forEach(td=>{ const ids=BANK.filter(q=>themeOf(q)===td.dataset.count); td.textContent = EX.map(e=>ids.filter(q=>q.course===e.id).length+' '+e.code).join(' · '); });
  }
  else if (view==='cram') main.innerHTML = '<div class="view">'+(C().cram||'')+'</div>';
  else if (view==='plan') main.innerHTML = '<div class="view">'+(C().plan || (CONTENT.all&&CONTENT.all.plan) || '<p class="empty">No plan yet.</p>')+'</div>';
  else if (view==='videos') renderVideos();
  else if (view==='worked') renderWorked();
  else if (view==='practice') renderPractice();
  else if (view==='mock') renderMock();
  window.scrollTo({top:0});
}
document.querySelectorAll('.exam').forEach(b=>b.addEventListener('click',()=>{ if(course!==b.dataset.course){course=b.dataset.course; pr=null; mock=null;} render(); }));
document.querySelectorAll('nav.views button').forEach(b=>b.addEventListener('click',()=>{ view=b.dataset.view; render(); }));
window.addEventListener('hashchange',()=>{ readHash(); render(); });

const weCard = (w, tag) => `<details class="we"><summary><span>${tag||''} ${w.t}<br><span class="src">${w.s||''}</span></span></summary><div class="body">${w.b}</div></details>`;
function renderWorked(){
  let h = '<div class="view"><h2>Worked examples</h2>';
  if (course==='all') {
    h += '<p class="lead">Grouped by topic. Try each on paper first, then open the steps. The tag shows which exam the example comes from.</p>';
    THEMES.forEach(t=>{ const W = (CONTENT.all.worked||[]).filter(w=>w[0]===t.id); if (W.length) h += `<h3>${t.name}</h3>` + W.map(([_,w,c])=>weCard(w, EXTAG(c))).join(''); });
  } else {
    h += '<p class="lead">Try each one on paper first, then open the steps. These are the professor\'s own examples or direct clones of them, the most likely sources of exam items.</p>' + (C().worked||[]).map(w=>weCard(w)).join('');
  }
  main.innerHTML = h + '</div>';
}

function renderVideos(){
  const groups = course==='all' || !CONFIG.videoGroups ? (COMBINED ? THEMES : (CONFIG.videoGroups||[])) : CONFIG.videoGroups;
  const fits = v => course==='all' || !v.ex || v.ex.includes(course);
  let h = '<div class="view"><h2>Video lessons</h2><p class="lead">Short lessons for each topic, in watching order. The first video per topic is the one to watch if you only have time for one. Links open on YouTube.</p>';
  if (CONFIG.videosWarning) h += `<div class="trap">${CONFIG.videosWarning}</div>`;
  let any = false;
  groups.forEach(t=>{
    const vs = (VIDEOS[t.id]||[]).filter(fits); if (!vs.length) return; any = true;
    h += `<h3>${t.name}</h3><div class="vids">` + vs.map((v,i)=>`<a class="vid" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener noreferrer"><span class="vt">${i===0?'<span class="tag t-in">Watch first</span> ':''}${esc(v.t)}</span><span class="vc">${esc(v.ch)}${v.ex?' · '+v.ex.map(EXTAG).join(' '):''}</span><span class="vw">${esc(v.why)}</span>${v.warn?`<span class="vwarn">${esc(v.warn)}</span>`:''}</a>`).join('') + '</div>';
  });
  if (!any) h += '<p class="empty">No verified videos for this exam.</p>';
  main.innerHTML = h + (CONFIG.videosChecked?`<p class="src">${CONFIG.videosChecked}</p>`:'') + '</div>';
}

// ---------------- Practice ----------------
const inCourse = q => course==='all' || q.course===course;
function pool(){
  return BANK.filter(q=>inCourse(q) && pr.chs.has(unitOf(q)) && (course!=='all'||pr.ex==='both'||q.course===pr.ex) && (pr.src==='all'||q.kind===pr.src) && (!pr.misses || (store.stats[q.id] && store.stats[q.id].last===false)));
}
function prepare(q){
  // real questions keep their original letters; clones shuffle unless an option refers to other options
  const idx = [0,1,2,3];
  const fixed = q.kind==='real' || q.o.some(o=>/above|both|neither|a and b/i.test(o));
  return {q, order: fixed ? idx : shuffle(idx)};
}
function newQueue(){ pr.queue = shuffle(pool()).map(prepare); pr.i=0; pr.right=0; pr.done=0; pr.answered=null; }
function renderPractice(){
  if (!pr) { pr = {chs:new Set(CH[course]), src:'all', ex:'both', misses:false}; newQueue(); }
  const nMiss = BANK.filter(q=>inCourse(q) && store.stats[q.id] && store.stats[q.id].last===false).length;
  const counts = {all:0, real:0, clone:0}; BANK.forEach(q=>{ if(inCourse(q)){counts.all++; counts[q.kind]++;} });
  let h = '<div class="view"><h2>Practice</h2>';
  h += '<div class="toolbar" role="group" aria-label="Topics">'+CH[course].map(c=>`<button class="chip" data-ch="${esc(c)}" aria-pressed="${pr.chs.has(c)}">${esc(unitName(c))}</button>`).join('')+'</div>';
  if (course==='all') h += '<div class="toolbar" role="group" aria-label="Exam">'+[['both','All exams']].concat(EX.map(e=>[e.id, e.code+' only'])).map(([k,l])=>`<button class="chip" data-ex="${esc(k)}" aria-pressed="${pr.ex===k}">${esc(l)}</button>`).join('')+'</div>';
  h += '<div class="toolbar" role="group" aria-label="Source">'+
    (counts.real && counts.clone ? `<button class="chip" data-src="all" aria-pressed="${pr.src==='all'}">All ${counts.all}</button><button class="chip" data-src="real" aria-pressed="${pr.src==='real'}">${esc(CONFIG.realLabel||'Real past-exam')} ${counts.real}</button><button class="chip" data-src="clone" aria-pressed="${pr.src==='clone'}">${esc(CONFIG.cloneLabel||'Written from your notes')} ${counts.clone}</button>`
      : `<span class="src">${counts.all} questions${counts.real?', all from real past exams':', each modelled on a worked example or slide from your course'}.</span>`)+
    `<button class="chip" data-miss="1" aria-pressed="${pr.misses}">My misses (${nMiss})</button></div>`;
  h += '<div id="qzone"></div></div>';
  main.innerHTML = h;
  main.querySelectorAll('[data-ex]').forEach(b=>b.onclick=()=>{ pr.ex=b.dataset.ex; newQueue(); renderPractice(); });
  main.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{ const c = CH[course].find(x=>String(x)===b.dataset.ch); if(pr.chs.has(c)&&pr.chs.size>1) pr.chs.delete(c); else pr.chs.add(c); newQueue(); renderPractice(); });
  main.querySelectorAll('[data-src]').forEach(b=>b.onclick=()=>{ pr.src=b.dataset.src; newQueue(); renderPractice(); });
  main.querySelectorAll('[data-miss]').forEach(b=>b.onclick=()=>{ pr.misses=!pr.misses; newQueue(); renderPractice(); });
  drawQ();
}
function metaLine(q){
  return `<div class="qmeta">${course==='all'?EXTAG(q.course):''}<span class="tag t-acc">${esc(chName(q.course,q.ch))}</span><span>${esc(q.topic)}</span>`+
   (q.kind==='real' ? `<span class="tag t-in">Real: ${esc(q.src)}</span>` : `<span class="tag" style="background:#efe7d6">Modelled on ${esc(q.based||q.src)}</span>`)+'</div>';
}
function drawQ(){
  const z = document.getElementById('qzone');
  if (!pr.queue.length) { z.innerHTML = '<p class="empty">'+(pr.misses?'No misses left in this selection. Nice.':'No questions match these filters.')+'</p>'; return; }
  if (pr.i >= pr.queue.length) {
    const pct = Math.round(100*pr.right/Math.max(1,pr.done));
    z.innerHTML = `<div class="result"><div class="big">${pr.right}/${pr.done}</div><p>${pct}% this round. ${pct>=85?'Ready for a timed mock.':'Switch on “My misses” and run it again.'}</p><div class="rowbtns"><button class="btn" id="again">New round</button></div></div>`;
    document.getElementById('again').onclick=()=>{ newQueue(); drawQ(); };
    return;
  }
  const {q, order} = pr.queue[pr.i];
  let h = `<div class="qcard">${metaLine(q)}<div class="qtext">${esc(q.q)}</div><div class="opts">`;
  order.forEach((oi,pos)=>{ h += `<button class="opt" data-oi="${oi}"><span class="l">${L[pos]}</span><span>${esc(q.o[oi])}</span></button>`; });
  h += `</div><div id="fb"></div><div class="rowbtns"><span class="score">${pr.i+1} of ${pr.queue.length} · ${pr.right}/${pr.done} right</span><span class="src">Keys <span class="kbd">A</span>–<span class="kbd">D</span> answer, <span class="kbd">Enter</span> next</span></div></div>`;
  z.innerHTML = h;
  z.querySelectorAll('.opt').forEach(b=>b.onclick=()=>answer(+b.dataset.oi));
}
function answer(oi){
  if (pr.answered!==null) return;
  const {q} = pr.queue[pr.i]; pr.answered = oi;
  const ok = oi===q.a; pr.done++; if(ok) pr.right++; record(q.id, ok);
  document.querySelectorAll('#qzone .opt').forEach(b=>{ const k=+b.dataset.oi; b.disabled=true; if(k===q.a) b.classList.add('right'); else if(k===oi) b.classList.add('wrong'); });
  let f = `<div class="fb"><div class="verdict ${ok?'r':'w'}">${ok?'Correct':'Not quite'}</div><p>${esc(q.ex)}</p>`;
  if (q.trap) f += `<div class="trap"><b>Trap:</b> ${esc(q.trap)}</div>`;
  if (q.note) f += `<div class="note"><b>Note:</b> ${esc(q.note)}</div>`;
  f += `<p class="src">Source: ${esc(q.src)}${q.based?' · modelled on '+esc(q.based):''}</p><div class="rowbtns"><button class="btn" id="next">Next question</button></div></div>`;
  document.getElementById('fb').innerHTML = f;
  document.getElementById('next').onclick = next;
  document.getElementById('next').focus({preventScroll:true});
}
function next(){ pr.i++; pr.answered=null; drawQ(); }
document.addEventListener('keydown', e=>{
  if (view!=='practice' || !pr || e.metaKey || e.ctrlKey || e.altKey || /TEXTAREA|INPUT/.test(document.activeElement.tagName)) return;
  const k = e.key.toLowerCase();
  if (pr.answered===null && ['a','b','c','d','1','2','3','4'].includes(k)) {
    const pos = 'abcd'.includes(k) ? 'abcd'.indexOf(k) : +k-1;
    const item = pr.queue[pr.i]; if (item) answer(item.order[pos]);
  } else if (pr.answered!==null && (k==='enter'||k==='arrowright')) { e.preventDefault(); next(); }
});

// ---------------- Mock ----------------
// exam.mock = {mins, pts, quota:{ch:n}, sa:[points...], desc}; combined.mix = {mins, quota:{themeId:n}, desc}
function stopTimer(){ if(timerId){ clearInterval(timerId); timerId=null; } }
const mockCfg = k => k==='mix' ? Object.assign({pts:1}, CONFIG.combined.mix) : Object.assign({pts:1}, BYID[k].mock);
function buildMock(kind){
  const cfg = mockCfg(kind), qs = [];
  for (const [u,n] of Object.entries(cfg.quota||{})) {
    const p = BANK.filter(q=> kind==='mix' ? themeOf(q)===u : (q.course===kind && String(q.ch)===u));
    qs.push(...shuffle(p).slice(0,n));
  }
  const items = shuffle(qs).map(prepare);
  const SA = kind==='mix' ? [] : ((CONTENT[kind]||{}).sa||[]);
  const sas = (cfg.sa||[]).map(p=>shuffle(SA.filter(s=>s.pts===p))[0]).filter(Boolean);
  return {kind, cfg, items, sas, picks:{}, notes:{}, rub:{}, mins:cfg.mins, end: Date.now()+cfg.mins*60*1000, submitted:false};
}
function renderMock(){
  if (!mock) {
    const kinds = course==='all' ? ['mix'].concat(EXID) : [course];
    main.innerHTML = `<div class="view"><h2>Timed mock</h2><p class="lead">${esc(CONFIG.mockAids||'Exam conditions.')} No feedback until you submit.</p>` + kinds.map(k=>{ const c=mockCfg(k); return `<div class="box" style="margin:14px 0"><p>${c.desc||''}</p><div class="rowbtns"><button class="btn${k===kinds[0]?'':' ghost'}" data-start="${esc(k)}">Start (${c.mins} min)</button></div></div>`; }).join('') + '</div>';
    main.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{ mock=buildMock(b.dataset.start); renderMock(); });
    return;
  }
  const mcPts = mock.cfg.pts;
  let h = `<div class="view"><div class="mockbar"><span class="timer" id="timer"></span><span class="score" id="prog"></span><button class="btn" id="submit">${mock.submitted?'New mock':'Submit and mark'}</button></div>`;
  if (mock.submitted) h += resultBox();
  h += `<h2>Part A: multiple choice <small class="src">(${mock.items.length} × ${mcPts})</small></h2>`;
  mock.items.forEach(({q,order},n)=>{
    const pick = mock.picks[q.id];
    h += `<div class="mq qcard" id="m${n}">${mock.submitted?metaLine(q):''}<div class="qtext">${n+1}. ${esc(q.q)}</div><div class="opts">`;
    order.forEach((oi,pos)=>{
      let cls = 'opt';
      if (mock.submitted) { if (oi===q.a) cls+=' right'; else if (oi===pick) cls+=' wrong'; }
      else if (oi===pick) cls+=' sel';
      h += `<button class="${cls}" data-q="${esc(q.id)}" data-oi="${oi}" ${mock.submitted?'disabled':''}><span class="l">${L[pos]}</span><span>${esc(q.o[oi])}</span></button>`;
    });
    h += '</div>';
    if (mock.submitted) h += `<div class="fb"><p>${esc(q.ex)}</p>${q.note?`<div class="note"><b>Note:</b> ${esc(q.note)}</div>`:''}</div>`;
    h += '</div>';
  });
  if (mock.sas.length) {
    h += '<h2>Part B: written answers</h2>';
    mock.sas.forEach((s,k)=>{
      h += `<div class="sa"><div class="pts">${s.pts} points · ${esc(s.t)}</div><div>${s.q}</div>`;
      h += `<textarea data-sa="${k}" placeholder="Answer here or on paper. Full sentences, every step." ${mock.submitted?'readonly':''}>${esc(mock.notes[k]||'')}</textarea>`;
      if (mock.submitted) h += `<div class="model"><h3>Model answer</h3>${s.model}<h3>Mark yourself</h3><div class="rub">`+ s.rub.map((r,j)=>`<label><input type="checkbox" data-rub="${k}-${j}" ${mock.rub[k+'-'+j]?'checked':''}> <span>${esc(r)}</span></label>`).join('')+ `</div><p class="src">Built from: ${esc(s.based)}</p></div>`;
      h += '</div>';
    });
  }
  main.innerHTML = h + '</div>';
  main.querySelectorAll('.opt[data-q]').forEach(b=>b.onclick=()=>{ mock.picks[b.dataset.q]=+b.dataset.oi; b.parentNode.querySelectorAll('.opt').forEach(x=>x.classList.toggle('sel', x===b)); prog(); });
  main.querySelectorAll('textarea[data-sa]').forEach(t=>t.oninput=()=>{ mock.notes[t.dataset.sa]=t.value; });
  main.querySelectorAll('input[data-rub]').forEach(c=>c.onchange=()=>{ mock.rub[c.dataset.rub]=c.checked; const r=document.getElementById('res'); if(r) r.outerHTML=resultBox(); });
  document.getElementById('submit').onclick=()=>{
    if (mock.submitted) { mock=null; renderMock(); return; }
    const left = mock.items.filter(({q})=>mock.picks[q.id]===undefined).length;
    const b = document.getElementById('submit');
    if (left && !b.dataset.confirm) { b.dataset.confirm='1'; b.textContent=`${left} unanswered: submit anyway?`; return; }
    finish();
  };
  prog(); startTimer();
}
function prog(){ const p=document.getElementById('prog'); if(p&&mock) p.textContent = Object.keys(mock.picks).length+'/'+mock.items.length+' answered'; }
function startTimer(){
  stopTimer();
  const t = document.getElementById('timer');
  const upd = ()=>{
    if (!mock || !t) return;
    if (mock.submitted) { t.textContent = 'Marked'; t.classList.remove('low'); return; }
    const ms = mock.end - Date.now();
    if (ms <= 0) { t.textContent = '0:00'; finish(); return; }
    const m = Math.floor(ms/6e4), s = Math.floor(ms%6e4/1000);
    t.textContent = m+':'+String(s).padStart(2,'0'); t.classList.toggle('low', ms < 10*6e4);
  };
  upd(); timerId = setInterval(upd, 1000);
}
function finish(){
  stopTimer(); mock.submitted = true;
  mock.items.forEach(({q})=>record(q.id, mock.picks[q.id]===q.a));
  mock.usedMin = Math.round((mock.mins*60*1000 - Math.max(0, mock.end-Date.now()))/6e4);
  renderMock(); window.scrollTo({top:0});
}
function resultBox(){
  const mcPts = mock.cfg.pts;
  const right = mock.items.filter(({q})=>mock.picks[q.id]===q.a).length;
  const key = q => mock.kind==='mix' ? THEMENAME[themeOf(q)]+' · '+BYID[q.course].code : chName(q.course, q.ch);
  const by = {}; mock.items.forEach(({q})=>{ const k=key(q); by[k]=by[k]||[0,0]; by[k][1]++; if(mock.picks[q.id]===q.a) by[k][0]++; });
  let saGot = 0, saMax = 0;
  mock.sas.forEach((s,k)=>{ saMax += s.pts; const n = s.rub.filter((r,j)=>mock.rub[k+'-'+j]).length; saGot += s.pts*n/s.rub.length; });
  const total = right*mcPts + saGot, max = mock.items.length*mcPts + saMax;
  return `<div class="result" id="res"><div class="big">${Math.round(total*10)/10} / ${max}</div><p>Multiple choice ${right}/${mock.items.length} (${right*mcPts} pts)${mock.sas.length?` · written ${Math.round(saGot*10)/10}/${saMax} from your rubric ticks below`:''}${mock.usedMin!=null?` · ${mock.usedMin} min used`:''}.</p>
  <table><tr><th>${mock.kind==='mix'?'Topic · exam':'Chapter'}</th><th>Right</th></tr>${Object.entries(by).sort().map(([c,v])=>`<tr><td>${esc(c)}</td><td>${v[0]}/${v[1]}</td></tr>`).join('')}</table>
  <p class="src">Misses are saved, so Practice → “My misses” replays them.</p></div>`;
}

readHash(); render();
})();
