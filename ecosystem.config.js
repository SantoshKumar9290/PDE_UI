module.exports = {
  apps: [
    {
      name: "pde_ui",
      cwd: "/var/lib/jenkins/workspace/PDE_UI",
      script: "npm",
      args: "run start:pm2",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
