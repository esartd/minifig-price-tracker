# PM2 Ecosystem Configuration

This document describes the PM2 setup for zero-downtime deployments on the VPS.

## PM2 Ecosystem File (Optional Advanced Setup)

For more control, you can create a `ecosystem.config.js` file:

```javascript
module.exports = {
  apps: [
    {
      name: 'figtracker',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/figtracker',
      instances: 2,  // Run 2 instances for zero-downtime reloads
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000
    },
    {
      name: 'figtracker-staging',
      script: 'npm',
      args: 'start -- -p 3001',
      cwd: '/var/www/figtracker-staging',
      instances: 1,  // Single instance for staging (saves resources)
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000
    }
  ]
};
```

### Setup with Ecosystem File

```bash
# Copy ecosystem.config.js to VPS
scp PM2_ECOSYSTEM_CONFIG.js root@187.77.202.14:/var/www/ecosystem.config.js

# On VPS: Delete existing PM2 processes
ssh root@187.77.202.14
pm2 delete all

# Start from ecosystem file
pm2 start /var/www/ecosystem.config.js

# Save configuration
pm2 save

# Setup startup script (restart PM2 on server reboot)
pm2 startup
```

## PM2 Cluster Mode for Production (Advanced)

### Why Cluster Mode?

**Current Setup:** Single Node.js process
- Downside: Restart = brief downtime
- Upside: Simple, uses less memory

**Cluster Mode:** Multiple Node.js processes
- Benefit: PM2 reloads one process at a time → **true zero-downtime**
- Downside: Uses 2x memory (2 instances)

### Enable Cluster Mode

**Option 1: CLI (Quick)**
```bash
ssh root@187.77.202.14
pm2 delete figtracker
pm2 start npm --name "figtracker" -i 2 -- start
pm2 save
```

**Option 2: Ecosystem File (Recommended)**
Already configured in the ecosystem.config.js above.

### Resource Usage

**Current (Fork Mode):**
- Production: ~150MB RAM
- Staging: ~150MB RAM
- Total: ~300MB RAM

**Cluster Mode (2 instances):**
- Production: ~300MB RAM (2 x 150MB)
- Staging: ~150MB RAM
- Total: ~450MB RAM

**Hostinger VPS:** Typically 2GB-4GB RAM, so cluster mode is feasible.

### Recommended Configuration

**For Most Users:**
```javascript
// ecosystem.config.js
{
  name: 'figtracker',
  instances: 2,        // 2 instances for zero-downtime
  exec_mode: 'cluster'
}
```

**For High Traffic:**
```javascript
{
  name: 'figtracker',
  instances: 'max',    // Use all CPU cores
  exec_mode: 'cluster'
}
```

**For Resource-Constrained VPS:**
```javascript
{
  name: 'figtracker',
  instances: 1,        // Single instance (minimal resources)
  exec_mode: 'fork'
}
```

## PM2 Reload vs Restart

### pm2 restart
- **Stops** all instances
- **Then** starts new instances
- **Result:** Brief downtime (1-3 seconds)

### pm2 reload
- **Starts** new instance first
- **Then** stops old instance
- **Result:** Zero downtime

**Current GitHub Actions:** Uses `pm2 reload` for zero-downtime deployments.

## Health Check Endpoint

The deployment workflows check `/api/health` after deployment. Make sure this endpoint exists:

**File:** `app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Optional: Check database connection
    // await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: String(error) },
      { status: 503 }
    );
  }
}
```

**If health endpoint doesn't exist yet:**

You can remove health checks from GitHub Actions workflows temporarily, or create the endpoint above.

## PM2 Monitoring Commands

### Real-Time Monitoring
```bash
pm2 monit
```

### Process Details
```bash
pm2 show figtracker
pm2 show figtracker-staging
```

### Memory Usage
```bash
pm2 status
```

### CPU Usage Over Time
```bash
pm2 describe figtracker | grep "CPU"
```

## Automatic Process Management

### Auto-Restart on Crash
PM2 automatically restarts crashed processes. Check crash logs:

```bash
pm2 logs figtracker --err --lines 50
```

### Memory Limits (Advanced)
Restart process if it exceeds memory limit:

```bash
pm2 start npm --name "figtracker" --max-memory-restart 500M -- start
```

### Auto-Restart on File Changes (Dev Only)
**Never use in production:**
```bash
pm2 start npm --name "figtracker" --watch -- start
```

## Backup and Disaster Recovery

### Backup PM2 Configuration
```bash
pm2 save
# Saves to: ~/.pm2/dump.pm2
```

### Restore PM2 Configuration
```bash
pm2 resurrect
```

### Manual Backup
```bash
cp ~/.pm2/dump.pm2 ~/pm2-backup-$(date +%Y%m%d).pm2
```

## Log Management

### Log Rotation
PM2 automatically rotates logs, but you can configure:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### Clear Old Logs
```bash
pm2 flush  # Clear all logs
```

## Performance Tuning

### Optimize for VPS Resources

**Check current resource usage:**
```bash
pm2 status
free -h  # Check available memory
top      # Check CPU usage
```

**If memory is tight:**
- Use fork mode (1 instance) instead of cluster mode
- Reduce PM2 log retention

**If CPU is underutilized:**
- Use cluster mode with 2-4 instances
- Distribute load across multiple processes

## Common Issues

### "Error: listen EADDRINUSE: port 3000 already in use"

```bash
# Find process using port
lsof -i :3000

# Kill it
pm2 stop figtracker
# or
kill -9 <PID>

# Restart
pm2 start figtracker
```

### "Process not found"

```bash
# List all PM2 processes
pm2 list

# Restart from correct directory
cd /var/www/figtracker
pm2 start npm --name "figtracker" -- start
pm2 save
```

### PM2 doesn't start on server reboot

```bash
# Setup startup script
pm2 startup
# Copy and run the command it outputs

# Save current processes
pm2 save
```

## Zero-Downtime Deployment Verification

### Test Deployment Process

**Terminal 1: Monitor logs**
```bash
ssh root@187.77.202.14
pm2 logs figtracker --lines 0
```

**Terminal 2: Continuous requests**
```bash
while true; do
  curl -s https://figtracker.ericksu.com/api/health
  sleep 1
done
```

**Terminal 3: Deploy**
```bash
git push origin main  # Trigger deployment
```

**Expected:** No 502/503 errors in Terminal 2 during deployment.

## Next Steps

1. Review current PM2 setup: `ssh root@187.77.202.14 && pm2 list`
2. Decide: Fork mode (simple) or Cluster mode (true zero-downtime)
3. Optionally create ecosystem.config.js for advanced control
4. Test zero-downtime deployment with monitoring
