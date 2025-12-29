module.exports = {
  apps: [
    {
      name: "pde_ui",
      script: "serve",
      args: "-s build -l 3000", // serve the build folder on port 3000
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
