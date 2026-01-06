module.exports = {
  apps: [
    {
      name: "pde_frontend",
      script: "node_modules/.bin/serve",
      args: "-s /opt/apps/frontend/current -l 3000",
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
