# nginx config

Copies of the two server blocks that run IntoBrick. They live on the VPS at
`/etc/nginx/sites-available/` and are **not** installed by any deploy — nothing
in `scripts/deploy-remote.sh` touches nginx. These files exist so a VPS rebuild
does not have to reconstruct them from memory.

| File | Lives at | Serves |
|---|---|---|
| `intobrick.conf` | `/etc/nginx/sites-available/intobrick` | the live site, all ten locale subdomains |
| `figtracker-redirects.conf` | `/etc/nginx/sites-enabled/figtracker` | the old domain, 301s only |
| `bot-throttle.conf` | `/etc/nginx/conf.d/bot-throttle.conf` | caps crawler traffic against the origin |
| `page-cache.conf` | `/etc/nginx/conf.d/page-cache.conf` | the page cache zone, and who skips it |

## Installing the page cache

On the **VPS**, from a checkout of this repo:

```bash
mkdir -p /var/cache/nginx/intobrick
cp deploy/nginx/page-cache.conf /etc/nginx/conf.d/page-cache.conf
cp deploy/nginx/intobrick.conf  /etc/nginx/sites-available/intobrick
nginx -t && systemctl reload nginx
```

Check it is working — the second request should say HIT:

```bash
curl -sI https://intobrick.com/minifigs/sw1522 | grep -i x-cache-status
curl -sI https://intobrick.com/minifigs/sw1522 | grep -i x-cache-status
```

Two things the page cache must never do, and the config that stops it:

- **Serve one locale's page to another.** The key is
  `$scheme://$host$request_uri`; ten locales on ten subdomains share the same
  paths, so dropping `$host` would serve the German page to English readers.
- **Cache anything that depends on who is asking.** `location ^~ /api/` is
  declared above `location /` and turns caching off: `/api/geo` reports the
  country Cloudflare resolved for that connection and
  `/api/inventory/temp-pricing` converts prices for that visitor. No *page*
  resolves geo server-side — it is all client-side — which is what makes
  caching the HTML safe at all. Check that again before adding geo to a page.

`proxy_cache_use_stale` is the quiet hero: if Node is slow, erroring or
restarting, nginx serves the stale copy rather than an error. Had it been in
place on 15 September, that outage would have been invisible to visitors.

## The crawler throttle is load-bearing. Do not remove it casually.

Added 15 September 2026, during an outage, and it is the only thing standing
between Googlebot and a dead site.

Google is working through the ~420,000 URLs submitted with the intobrick.com
move. The minifig and set pages declare `revalidate = 21600`, but they also
call `headers()` to resolve the locale from the host — and that opts a route
out of static generation entirely, so the declared revalidate never applies.
The proof is in the database: `IsrCache` held **four** rows (favicon, icon,
robots.txt, one API route) and not a single page.

So every crawl hit was a full server render. The origin reached 280 concurrent
connections it could not finish, the accept queue pinned at 455, the Node
process climbed to 2.1GB and 92% CPU, and the site went down. It re-wedged
within a minute of every restart until this throttle went in.

Two details that look wrong and are not:

- **The rate-limit key is the bot flag, not the client address.** Cloudflare
  fronts every request, so `$binary_remote_addr` is an edge IP — keying on it
  would scatter one crawler across dozens of buckets and limit nothing. One
  shared bucket for all bots is the point: it caps total crawler throughput
  against the origin.
- **Humans map to an empty key.** nginx skips rate limiting entirely for an
  empty key, so this costs real visitors nothing.

It is a tourniquet, not a cure. The cure is making those pages cacheable —
either at Cloudflare (cache per hostname, bypass on session cookie) or by
taking the locale out of `headers()`. Until one of those lands, this file is
the only protection.

Keep them in step by hand. If you change nginx on the server, re-copy it here:

```bash
ssh -i ~/.ssh/figtracker_vps root@187.77.202.14 'cat /etc/nginx/sites-available/intobrick' > deploy/nginx/intobrick.conf
```

## Restoring on a fresh VPS

On the **VPS**:

```bash
# 1. Put the files in place (from a checkout of this repo)
cp deploy/nginx/intobrick.conf /etc/nginx/sites-available/intobrick
cp deploy/nginx/figtracker-redirects.conf /etc/nginx/sites-available/figtracker
ln -sf /etc/nginx/sites-available/intobrick /etc/nginx/sites-enabled/intobrick
ln -sf /etc/nginx/sites-available/figtracker /etc/nginx/sites-enabled/figtracker

# 2. Certificates are NOT in this repo. Reissue before reloading, or nginx
#    will refuse to start on the missing ssl_certificate paths.
certbot --nginx -d intobrick.com -d www.intobrick.com \
  -d de.intobrick.com -d es.intobrick.com -d fr.intobrick.com \
  -d it.intobrick.com -d ja.intobrick.com -d nl.intobrick.com \
  -d pl.intobrick.com -d pt.intobrick.com -d sv.intobrick.com

nginx -t && systemctl reload nginx
```

## Three things that look wrong and are not

Documented at greater length in `CLAUDE.md`; repeated here because this is the
file someone will be reading when they are tempted to "fix" them.

**The maintenance fallback is what shows the snapping-brick screen.** During
every deploy there is a ~20 second window between the PM2 restart and Node
answering again. Without this block, visitors get Cloudflare's raw 502:

```nginx
error_page 502 503 504 =503 @maintenance;
location @maintenance {
    root /var/www/figtracker/public;
    try_files /maintenance.html =503;
}
```

It returns **503, not 502**, on purpose — "temporarily unavailable, come back"
is both true and the code search engines treat as a reason to retry rather than
to drop the URL. The page itself is `public/maintenance.html`, which *is* in
this repo and ships with every deploy. This block lived only on the old
`figtracker.ericksu.com` server and did not come across with the rename, so
from the move to intobrick.com until 11 September 2026 every deploy showed
Cloudflare's error page instead.

**Port 80 on the old domain redirects straight to `https://intobrick.com`,** not
to https on the same host first. The two-hop version is more conventional and
ends up in the same place, but Google's Change of Address validator only
inspects the first hop — it saw the old domain again and refused the move.

**`figtracker.ericksu.com` is DNS-only in Cloudflare (grey cloud).** The
`ericksu.com` zone carries WAF rules from when that domain served real content,
including one that challenges any request to `/minifigs/` or `/sets/` with no
referer. On a redirect-only host those protect nothing and blocked Google's own
migration tooling. Re-proxying it would silently break crawling of the
redirects.
