module.exports = {
  apps: [
    {
      name: "pde_frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 2000",
      cwd: "/opt/apps/frontend/current",
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
