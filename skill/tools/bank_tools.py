#!/usr/bin/env python3
"""Question-bank tools for exam-cram. No dependencies.

  bank_tools.py check  FILES...                       validate + giveaway stats (exit 1 on errors)
  bank_tools.py export FILES... -o bank.json [--course-from-filename] [--balance]
  bank_tools.py blind  FILES... -o blind.json         questions without answers, for the checker
"""
import json, os, re, sys, argparse, collections, glob

def parse(path, course=None):
    items, cur, errs = [], None, []
    for n, raw in enumerate(open(path, encoding='utf-8'), 1):
        line = raw.rstrip('\n')
        if line.startswith('@ '):
            if cur: items.append(cur)
            parts = [p.strip() for p in line[2:].split('|')]
            if len(parts) < 5:
                errs.append(f'{path}:{n}: header needs id|ch|topic|kind|src'); cur = None; continue
            based = next((p[6:].strip() for p in parts[5:] if p.startswith('based:')), '')
            ch = parts[1]
            cur = {'id': parts[0], 'course': course, 'ch': int(ch) if ch.isdigit() else ch, 'topic': parts[2],
                   'kind': parts[3], 'src': parts[4], 'based': based, 'q': '', 'o': [], 'a': None, 'ex': '', '_line': n, '_file': path}
        elif cur is None:
            continue
        elif line.startswith('Q:'): cur['q'] = line[2:].strip()
        elif line.startswith('- '):
            t = line[2:].rstrip()
            if t.endswith(' *'):
                if cur['a'] is not None: errs.append(f"{path}:{n}: {cur['id']} has two correct options")
                cur['a'] = len(cur['o']); t = t[:-2].rstrip()
            cur['o'].append(t)
        elif line[:2] in ('E:', 'T:', 'N:'):
            cur[{'E:': 'ex', 'T:': 'trap', 'N:': 'note'}[line[:2]]] = line[2:].strip()
        elif line.strip() and cur.get('q') and not cur['o']:
            cur['q'] += '\n' + line.strip()          # multi-line stem
    if cur: items.append(cur)
    return items, errs

def load(files, course_from_filename=False):
    allq, errs = [], []
    for f in files:
        course = os.path.splitext(os.path.basename(f))[0] if course_from_filename else None
        q, e = parse(f, course); allq += q; errs += e
    return allq, errs

def validate(items):
    errs, seen, stems = [], set(), {}
    for q in items:
        where = f"{q['_file']}:{q['_line']} {q['id']}"
        if q['id'] in seen: errs.append(f'{where}: duplicate id')
        seen.add(q['id'])
        if len(q['o']) != 4: errs.append(f"{where}: {len(q['o'])} options (need 4)")
        if q['a'] is None: errs.append(f'{where}: no option marked with " *"')
        if not q['q']: errs.append(f'{where}: missing Q:')
        if not q['ex']: errs.append(f'{where}: missing E: explanation')
        if q['kind'] not in ('real', 'clone'): errs.append(f"{where}: kind must be real|clone")
        if q['kind'] == 'clone' and not q['based']: errs.append(f'{where}: clone without "based:"')
        k = re.sub(r'\W+', ' ', q['q'].lower()).strip()
        if k in stems: errs.append(f'{where}: same stem as {stems[k]}')
        stems[k] = q['id']
    return errs

REFS = re.compile(r'\b(all|none|both|above|neither)\b.*\b(above|of these|a and b|options)\b|^both\b|^neither\b', re.I)
def stats(items):
    out = {}
    for course in sorted({str(q['course']) for q in items}):
        cl = [q for q in items if str(q['course']) == course and q['kind'] == 'clone' and q['a'] is not None and len(q['o']) == 4]
        pos = [0] * 4
        for q in cl: pos[q['a']] += 1
        longest = [q['id'] for q in cl if all(len(q['o'][q['a']]) > len(o) for i, o in enumerate(q['o']) if i != q['a'])]
        out[course] = {'n': sum(1 for q in items if str(q['course']) == course), 'clones': len(cl), 'positions': pos,
                       'longest_pct': round(100 * len(longest) / max(1, len(cl)), 1), 'longest_ids': longest}
    return out

def balance(items):
    k = 0
    for q in items:
        if q['kind'] != 'clone' or q['a'] is None or any(REFS.search(o) for o in q['o']): continue
        t = k % 4; k += 1
        c = q['o'][q['a']]; rest = [o for i, o in enumerate(q['o']) if i != q['a']]
        rest.insert(t, c); q['o'], q['a'] = rest, t

def clean(q): return {k: v for k, v in q.items() if not k.startswith('_') and v not in ('', None)} | {'a': q['a']}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('cmd', choices=['check', 'export', 'blind'])
    ap.add_argument('files', nargs='+'); ap.add_argument('-o'); ap.add_argument('--course-from-filename', action='store_true')
    ap.add_argument('--balance', action='store_true'); a = ap.parse_args()
    files = [f for p in a.files for f in (sorted(glob.glob(p)) or [p])]   # Windows shells don't expand *.txt
    items, errs = load(files, True)   # course = file name (e.g. bank/ECON101.txt -> "ECON101")
    errs += validate(items)
    if a.balance: balance(items)
    st = stats(items)
    for c, s in st.items():
        flag = '  <-- over 30%, fix the longest-option tell' if s['longest_pct'] > 30 else ''
        print(f"[{c}] {s['n']} questions, {s['clones']} clones | clone answer positions A-D {s['positions']} | correct is strictly longest in {s['longest_pct']}% of clones{flag}")
        if s['longest_pct'] > 30: print('   longest-correct ids:', ', '.join(s['longest_ids']))
    for e in errs: print('ERROR', e)
    if errs: sys.exit(1)
    if a.cmd == 'check':
        print('OK'); return
    if not a.o: sys.exit('need -o output.json')
    data = [clean(q) for q in items]
    if a.cmd == 'blind': data = [{k: q[k] for k in ('id', 'course', 'q', 'o')} for q in data]
    json.dump(data, open(a.o, 'w', encoding='utf-8'), ensure_ascii=False, indent=0 if a.cmd == 'blind' else None)
    print(f'wrote {len(data)} items to {a.o}')

if __name__ == '__main__': main()
