module.exports = {
  apps: [{
    name: 'figtracker',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 2, // Run 2 instances for zero-downtime reloads
    exec_mode: 'cluster', // Required for pm2 reload to work without port conflicts
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Error handling
    max_memory_restart: '500M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,

    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
  }]
};
