#!/usr/bin/env python3
"""Build the study page from a prep folder.

  build.py PREP_FOLDER        reads  PREP_FOLDER/work/page/{config,content,videos}.js
                                     PREP_FOLDER/work/bank/bank.json  (from bank_tools.py export)
                              writes PREP_FOLDER/site/index.html

Rebuild after every fix. The template and app.js live next to this script; don't edit them per course.
"""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__))
d = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else '.')
page = os.path.join(d, 'work', 'page')
def rd(p, default=None):
    if not os.path.exists(p):
        if default is not None: return default
        sys.exit(f'missing {p}')
    return open(p, encoding='utf-8').read()
bank = rd(os.path.join(d, 'work', 'bank', 'bank.json'))
json.loads(bank)  # fail early on bad JSON
cfg = rd(os.path.join(page, 'config.js'))
t = rd(os.path.join(HERE, 'template.html'))
title = cfg.split("title:", 1)[1].split('\n', 1)[0].strip().strip(",").strip("'\"") if "title:" in cfg else 'Exam cram'
for k, v in [('/*TITLE*/', title.replace('<', '&lt;')), ('/*BANK*/', bank.replace('</', '<\\/')), ('/*CONFIG*/', cfg),
             ('/*CONTENT*/', rd(os.path.join(page, 'content.js'))), ('/*VIDEOS*/', rd(os.path.join(page, 'videos.js'), 'const VIDEOS = {};')),
             ('/*APP*/', rd(os.path.join(HERE, 'app.js')))]:
    t = t.replace(k, v, 1)
os.makedirs(os.path.join(d, 'site'), exist_ok=True)
out = os.path.join(d, 'site', 'index.html')
open(out, 'w', encoding='utf-8').write(t)
print(f'wrote {out} ({len(t)//1024} KB)')
