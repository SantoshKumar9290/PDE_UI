module.exports = {
  apps: [
    {
      name: "PDE_UI",
      cwd: "/var/lib/jenkins/workspace/PDE-FRONTEND",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 2000",
      instances: 2,
      exec_mode: "cluster",
      autorestart: true,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
