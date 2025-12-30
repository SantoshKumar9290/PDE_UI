module.exports = {
  apps: [
    {
      name: "pde_ui",
      script: "npm",
      args: "run start",
      cwd: "/var/lib/jenkins/workspace/PDE_UI",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
