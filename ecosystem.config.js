module.exports = {
  apps: [
    {
      name: "pde_ui",
      script: "serve",
      args: "-s build -l 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
