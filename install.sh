#!/usr/bin/env sh
# Mac/Linux shortcut for the cross-platform installer. On Windows run:  node install.js
exec node "$(cd "$(dirname "$0")" && pwd)/install.js"
