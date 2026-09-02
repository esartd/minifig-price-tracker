#!/usr/bin/env node
/**
 * Generates public/maintenance.html from lib/deploy-copy.json.
 *
 * nginx serves this file directly from disk when Node is not answering —
 * during the PM2 restart at the end of a deploy, or if the app crashes.
 * At that moment Next cannot render anything, so the page has to be plain
 * static HTML with no server, no framework and no build-time hydration.
 *
 * It is generated rather than hand-written so the wording stays identical
 * to app/global-error.tsx. Two maintenance screens that drift apart is a
 * small thing that looks careless in ten languages at once.
 *
 * Runs from `npm run build`. Do not edit public/maintenance.html by hand.
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const copy = require(path.join(root, 'lib', 'deploy-copy.json'));
const outputPath = path.join(root, 'public', 'maintenance.html');

const BRICKS = [
  ['#f59e0b', '0.6s'],
  ['#22c55e', '0.4s'],
  ['#3b82f6', '0.2s'],
  ['#ef4444', '0s'],
];

const bricks = BRICKS.map(
  ([color, delay]) =>
    `<div class="ft-brick" style="background:${color};animation-delay:${delay}"></div>`
).join('');

// </script> inside a script block would close it early.
const payload = JSON.stringify(copy).replace(/<\//g, '<\\/');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>FigTracker</title>
<style>
  body { margin:0; min-height:100vh; background:#fff; font-family: system-ui, -apple-system, "Segoe UI", sans-serif }
  .ft-wrap { max-width:600px; margin:0 auto; padding:96px 16px; text-align:center }
  .ft-stack { display:flex; flex-direction:column; align-items:center; gap:4px; margin-bottom:28px }
  .ft-brick { width:44px; height:20px; border-radius:3px; position:relative; animation:ftrise 1.8s ease-in-out infinite }
  .ft-brick::before, .ft-brick::after { content:""; position:absolute; top:-5px; width:10px; height:6px; border-radius:2px 2px 0 0; background:inherit }
  .ft-brick::before { left:8px }
  .ft-brick::after { left:25px }
  h1 { font-size:20px; font-weight:600; color:#171717; margin:0 0 16px; letter-spacing:-0.01em }
  p { font-size:16px; color:#737373; line-height:1.6; margin:0 0 32px }
  button { padding:12px 24px; font-size:16px; font-weight:600; color:#fff; background:#3b82f6; border:none; border-radius:8px; cursor:pointer }
  @keyframes ftrise { 0% { transform:translateY(6px); opacity:.2 } 40%,100% { transform:translateY(0); opacity:1 } }
  @media (prefers-reduced-motion: reduce) { .ft-brick { animation:none } }
</style>
</head>
<body>
<div class="ft-wrap">
  <div class="ft-stack" role="status" aria-live="polite">${bricks}</div>
  <h1 id="ft-title">${copy.en.updatingTitle}</h1>
  <p id="ft-body">${copy.en.updatingBody}</p>
  <button type="button" onclick="location.reload()" id="ft-reload">${copy.en.reload}</button>
</div>
<script>
(function () {
  var copy = ${payload};
  var prefix = location.hostname.split('.')[0];
  var t = Object.prototype.hasOwnProperty.call(copy, prefix) ? copy[prefix] : copy.en;

  document.documentElement.lang = Object.prototype.hasOwnProperty.call(copy, prefix) ? prefix : 'en';
  document.getElementById('ft-title').textContent = t.updatingTitle;
  document.getElementById('ft-body').textContent = t.updatingBody;
  document.getElementById('ft-reload').textContent = t.reload;

  // nginx serves this via error_page, so the address bar still shows the
  // page the visitor actually wanted and reloading returns them to it.
  // Someone who opens /maintenance.html directly has nothing to go back
  // to, and polling would just reload this page every three seconds
  // forever — so don't poll in that case.
  if (location.pathname === '/maintenance.html') return;

  // Being served at all means the origin was down, so one successful probe
  // is genuine recovery. (The in-app boundary has to be more careful — see
  // the note in app/global-error.tsx.)
  var startedAt = Date.now();
  setInterval(function () {
    if (Date.now() - startedAt > 90000) {
      document.getElementById('ft-body').textContent = t.updatingSlow;
    }
    fetch('/?_probe=' + Date.now(), { method: 'HEAD', cache: 'no-store' })
      .then(function (r) { if (r.ok) location.reload(); })
      .catch(function () { /* still down */ });
  }, 3000);
})();
</script>
</body>
</html>
`;

fs.writeFileSync(outputPath, html, 'utf8');
console.log('[maintenance] wrote ' + path.relative(root, outputPath) + ' (' + Object.keys(copy).length + ' locales)');
