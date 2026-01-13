module.exports = {
  apps: [
    {
      name: "pde_frontend",
      cwd: "/opt/apps/frontend/current",          // Working directory
      script: "node_modules/next/dist/bin/next",  // Next.js executable
      args: "start -p 2000",                      // Start Next.js on port 2000
      exec_mode: "cluster",                       // Use all CPU cores
      instances: "max",
      autorestart: true,
      max_restarts: 10,
      watch: false,                                // Disable file watching in prod
      max_memory_restart: "700M",                  // Auto-restart if memory exceeds limit
      env: {
        NODE_ENV: "production"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/var/log/pm2/pde_frontend-error.log",
      out_file: "/var/log/pm2/pde_frontend-out.log"
    }
  ]
};
