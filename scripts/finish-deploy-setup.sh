#!/bin/bash
# Run this ON the VPS as root. Safe to run twice — it detects work already done.
#
#   1. Points the deploy key at scripts/deploy-remote.sh (build-then-swap)
#   2. Tells nginx to serve the maintenance page when the app is down
#
# Everything is backed up first. nginx is only reloaded if its own config
# test passes; if it fails, the old config is restored and nothing changes.

set -uo pipefail

APP_DIR="/var/www/figtracker"
NEW_CMD="$APP_DIR/scripts/deploy-remote.sh"
AK="$HOME/.ssh/authorized_keys"
STAMP=$(date +%Y%m%d-%H%M%S)

echo "================================================"
echo " STEP 1 - point the deploy key at the new script"
echo "================================================"

if [ ! -f "$NEW_CMD" ]; then
  echo "!! $NEW_CMD is missing. Run a deploy first, then re-run this."
  exit 1
fi
chmod +x "$NEW_CMD"

cp "$AK" "$AK.bak-$STAMP"
echo "backup: $AK.bak-$STAMP"
echo
echo "current deploy command:"
grep -o 'command="[^"]*"' "$AK" | sed 's/^/  /' || echo "  (none found)"
echo

python3 - "$AK" "$NEW_CMD" <<'PY'
import re, sys
path, new_cmd = sys.argv[1], sys.argv[2]
with open(path) as f:
    lines = f.read().splitlines()

changed = 0
out = []
for line in lines:
    if 'command="' in line and 'figtracker' in line:
        updated = re.sub(r'command="[^"]*"', 'command="%s"' % new_cmd, line, count=1)
        if updated != line:
            changed += 1
        out.append(updated)
    else:
        out.append(line)

if changed:
    with open(path, 'w') as f:
        f.write('\n'.join(out) + '\n')
    print('updated %d key(s)' % changed)
else:
    print('nothing to change (already pointing at the script, or no figtracker key found)')
PY

echo
echo "new deploy command:"
grep -o 'command="[^"]*"' "$AK" | sed 's/^/  /'

echo
echo "================================================"
echo " STEP 2 - nginx maintenance page"
echo "================================================"

CONF=$(grep -rl "figtracker.ericksu.com" /etc/nginx/ 2>/dev/null | grep -v "\.bak" | head -1)
if [ -z "$CONF" ]; then
  echo "!! Could not find an nginx config mentioning figtracker.ericksu.com."
  echo "   Step 1 is done. Add this by hand inside the server block:"
  echo
  echo '     error_page 502 503 504 =503 @maintenance;'
  echo '     location @maintenance {'
  echo "         root $APP_DIR/public;"
  echo '         try_files /maintenance.html =503;'
  echo '     }'
  exit 0
fi
echo "config file: $CONF"

if grep -q "@maintenance" "$CONF"; then
  echo "already configured - nothing to do"
else
  cp "$CONF" "$CONF.bak-$STAMP"
  echo "backup: $CONF.bak-$STAMP"

  python3 - "$CONF" "$APP_DIR" <<'PY'
import re, sys
path, app_dir = sys.argv[1], sys.argv[2]
text = open(path).read()

block = (
    "\n    # Served straight from disk when the Node app is not answering -\n"
    "    # during the restart at the end of a deploy, or if it crashes.\n"
    "    # =503 keeps the real status code so search engines do not index\n"
    "    # the maintenance text as if it were the page.\n"
    "    error_page 502 503 504 =503 @maintenance;\n"
    "\n"
    "    location @maintenance {\n"
    "        root %s/public;\n"
    "        try_files /maintenance.html =503;\n"
    "    }\n" % app_dir
)

# Insert after the server_name of the block that actually proxies to Node.
# Matching on server_name alone picks the http->https redirect block first,
# where error_page would never fire.
pattern = re.compile(r'^[ \t]*server_name[^;]*figtracker\.ericksu\.com[^;]*;[ \t]*$', re.M)

target = None
for match in pattern.finditer(text):
    # Everything from this server_name to the start of the next server block.
    rest = text[match.end():]
    next_block = re.search(r'^\s*server\s*\{', rest, re.M)
    body = rest[:next_block.start()] if next_block else rest
    if 'proxy_pass' in body:
        target = match
        break

if target is None:
    print('FAILED: found no figtracker server block containing proxy_pass')
    sys.exit(1)

new_text = text[:target.end()] + "\n" + block + text[target.end():]
open(path, 'w').write(new_text)
print('inserted maintenance block into the proxying server block')
PY

  if [ $? -ne 0 ]; then
    echo "!! Restoring original config, nothing changed."
    cp "$CONF.bak-$STAMP" "$CONF"
    exit 1
  fi

  echo
  echo "testing nginx config..."
  if nginx -t 2>&1 | sed 's/^/  /'; then
    systemctl reload nginx && echo "  nginx reloaded"
  else
    echo "!! Config test FAILED - restoring backup, nginx left untouched."
    cp "$CONF.bak-$STAMP" "$CONF"
    exit 1
  fi
fi

echo
echo "================================================"
echo " Done. Next deploy will use the new pipeline."
echo "================================================"
