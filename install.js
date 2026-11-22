#!/usr/bin/env node
// exam-cram installer (macOS, Linux, Windows). Run:  node install.js
// Adds the `examcram` command and installs the skill for Claude Code and/or Codex.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const { spawnSync } = require('child_process');
const WIN = process.platform === 'win32';
const HERE = __dirname, HOME = os.homedir();
const say = s => console.log(s);
const has = c => spawnSync(WIN ? 'where' : 'sh', WIN ? [c] : ['-c', `command -v ${c}`], { stdio: 'ignore' }).status === 0;

const major = +process.versions.node.split('.')[0];
if (major < 18) { say(`✗ Node ${process.versions.node} found, need 18+: https://nodejs.org`); process.exit(1); }
const py = ['python3', 'python', 'py'].find(c => spawnSync(c, c === 'py' ? ['-3', '--version'] : ['--version'], { stdio: 'ignore', shell: WIN }).status === 0);
say(py ? `✓ Python found (${py})` : `! Python 3 not found: the question-bank tools need it (${WIN ? 'https://www.python.org/downloads/ and tick "Add python.exe to PATH"' : 'macOS: xcode-select --install'})`);

// 1. the `examcram` command
const launcher = path.join(HERE, 'bin', 'examcram');
let binDir;
if (WIN) {
  // npm's global folder is already on PATH on Windows
  const r = spawnSync('npm', ['prefix', '-g'], { encoding: 'utf8', shell: true });
  binDir = (r.stdout || '').trim() || path.join(process.env.APPDATA || HOME, 'npm');
  fs.mkdirSync(binDir, { recursive: true });
  fs.writeFileSync(path.join(binDir, 'examcram.cmd'), `@echo off\r\nnode "${launcher}" %*\r\n`);
  fs.writeFileSync(path.join(binDir, 'examcram.ps1'), `node "${launcher}" @args\r\n`);
  say(`✓ added examcram -> ${binDir}`);
} else {
  binDir = path.join(HOME, '.local', 'bin');
  fs.mkdirSync(binDir, { recursive: true });
  fs.chmodSync(launcher, 0o755);
  for (const f of fs.readdirSync(path.join(HERE, 'skill', 'tools'))) if (f.endsWith('.py')) fs.chmodSync(path.join(HERE, 'skill', 'tools', f), 0o755);
  const dest = path.join(binDir, 'examcram');
  try { fs.unlinkSync(dest); } catch {}
  fs.symlinkSync(launcher, dest);
  say(`✓ linked examcram -> ${dest}`);
}

// 2. the skill, for each agent present
let linked = 0;
for (const agent of ['claude', 'codex']) {
  const dir = path.join(HOME, '.' + agent);
  if (!has(agent) && !fs.existsSync(dir)) continue;
  const dest = path.join(dir, 'skills', 'exam-cram');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  try { fs.rmSync(dest, { recursive: true, force: true }); } catch {}
  fs.symlinkSync(path.join(HERE, 'skill'), dest, WIN ? 'junction' : 'dir'); // junctions need no admin rights on Windows
  say(`✓ skill installed for ${agent} (${dest})`);
  linked++;
}
if (!linked) say('! Neither Claude Code nor Codex found. Install one and sign in: npm install -g @anthropic-ai/claude-code   (or @openai/codex)');

// 3. Playwright (optional)
say(has('playwright-cli') ? '✓ playwright-cli found (course-site route available)' : '· optional: npm install -g @playwright/cli@latest  (lets the agent pull files from your course site)');

// 4. PATH hint
const onPath = (process.env.PATH || '').split(path.delimiter).some(p => path.resolve(p) === path.resolve(binDir));
if (!onPath) say(WIN ? `! ${binDir} is not on your PATH. Run:  setx PATH "%PATH%;${binDir}"  then open a new terminal.`
                     : `! add ${binDir} to your PATH:  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`);
say('\nDone. ' + (WIN ? 'Open a new terminal, then run:  examcram' : 'Run:  examcram'));
