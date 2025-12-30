module.exports = {
  apps: [
    {
      name: "pde_ui",
      script: "serve",
      args: "-s build -l 3000",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
