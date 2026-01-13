module.exports = {
  apps: [
    {
      name: "PDE_UI",
      cwd: "/var/lib/jenkins/workspace/PDE-FRONTEND",   // <-- adjust if needed
      script: "node_modules/next/dist/bin/next",
      args: "start -p 2000",
      instances: 2,                // <-- EXACTLY 2 
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
