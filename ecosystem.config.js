module.exports = {
  apps: [
    {
      name: "pde-ui",
      script: "npm",
      args: "start",
      cwd: "/var/www/PDE_UI",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
