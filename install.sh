#!/usr/bin/env sh
# exam-cram installer: links the `examcram` command and installs the skill for Claude Code and/or Codex.
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
BIN="$HOME/.local/bin"

say() { printf '%s\n' "$*"; }

command -v node >/dev/null 2>&1 || { say "✗ Node.js 18+ is required: https://nodejs.org"; exit 1; }
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[ "$NODE_MAJOR" -ge 18 ] || { say "✗ Node $NODE_MAJOR found, need 18+"; exit 1; }
command -v python3 >/dev/null 2>&1 || say "! python3 not found: the bank tools need it (macOS: xcode-select --install)"

chmod +x "$HERE/bin/examcram" "$HERE/skill/tools/"*.py
mkdir -p "$BIN"
ln -sf "$HERE/bin/examcram" "$BIN/examcram"
say "✓ linked examcram -> $BIN/examcram"

linked=0
for agent in claude codex; do
  dir="$HOME/.$agent"
  if command -v "$agent" >/dev/null 2>&1 || [ -d "$dir" ]; then
    mkdir -p "$dir/skills"
    ln -sfn "$HERE/skill" "$dir/skills/exam-cram"
    say "✓ skill installed for $agent ($dir/skills/exam-cram)"
    linked=1
  fi
done
[ "$linked" = 1 ] || say "! Neither Claude Code nor Codex found. Install one: https://claude.com/claude-code or https://github.com/openai/codex"

if command -v playwright-cli >/dev/null 2>&1; then say "✓ playwright-cli found (course-site route available)"
else say "· optional: npm install -g @playwright/cli@latest  (lets the agent pull files from your course site)"; fi

case ":$PATH:" in *":$BIN:"*) ;; *) say "! add $BIN to your PATH:  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.zshrc && source ~/.zshrc";; esac
say ""
say "Done. Run:  examcram"
