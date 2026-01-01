module.exports = {
  apps: [
    {
      name: "pde-ui",
      script: "npm",
      args: "run start",
      cwd: "/var/www/PDE_UI",
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
