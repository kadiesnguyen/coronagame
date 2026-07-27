/** PM2 apps — env secrets live in /www/wwwroot/coronacasino/secrets/ (never rsync). */
module.exports = {
  apps: [
    {
      name: "corona-api",
      cwd: "/www/wwwroot/coronacasino/backend",
      script: "server.js",
      interpreter: "/root/.nvm/versions/node/v18.20.8/bin/node",
      env: {
        NODE_ENV: "production",
        CONFIG_ENV_PATH: "/www/wwwroot/coronacasino/secrets/backend.config.env",
      },
      max_memory_restart: "512M",
    },
    {
      name: "corona-web",
      cwd: "/www/wwwroot/coronacasino/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3002",
      interpreter: "/root/.nvm/versions/node/v18.20.8/bin/node",
      env: { NODE_ENV: "production", PORT: "3002" },
      max_memory_restart: "768M",
    },
  ],
};
