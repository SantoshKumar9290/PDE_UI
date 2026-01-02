module.exports = {
  apps: [
    {
      name: "PDE-UI",
      script: "npm",
      args: "start",
      cwd: "/var/www/PDE_UI",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
