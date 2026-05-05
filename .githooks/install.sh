#!/bin/bash

# Install git hooks from .githooks directory
# This ensures everyone working on the project has the same safety checks

HOOKS_DIR=".githooks"
GIT_HOOKS_DIR=".git/hooks"

echo "📦 Installing git hooks..."

# Make sure .git/hooks directory exists
mkdir -p "$GIT_HOOKS_DIR"

# Copy all hooks from .githooks to .git/hooks
for hook in "$HOOKS_DIR"/*; do
  if [ -f "$hook" ] && [ "$(basename "$hook")" != "install.sh" ]; then
    hook_name=$(basename "$hook")
    echo "   Installing $hook_name"
    cp "$hook" "$GIT_HOOKS_DIR/$hook_name"
    chmod +x "$GIT_HOOKS_DIR/$hook_name"
  fi
done

echo "✅ Git hooks installed successfully!"
echo ""
echo "Installed hooks:"
echo "  - pre-commit: Prevents schema changes on main branch"
