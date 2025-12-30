module.exports = {
  apps: [
    {
      name: "pde_ui",
      script: "npx",
      args: "serve -s build -p 3000",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
