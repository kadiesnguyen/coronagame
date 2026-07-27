/**
 * Load env once, preferring the server secrets file outside the rsync tree.
 * Prod must never boot with legacy client domains (cbvnsjeikd / xoso*).
 */
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const SECRETS_BACKEND = "/www/wwwroot/coronacasino/secrets/backend.config.env";
const LOCAL_CONFIG = path.join(__dirname, "..", "config.env");

const FORBIDDEN_DOMAIN_RE = /cbvnsjeikd|xosoclient\.|xoso\.cbvnsjeikd/i;
const REQUIRED_CLIENT = "coronacasin24.com";
const REQUIRED_API = "api.coronacasin24.com";

let loaded = false;

function resolveEnvPath() {
  if (process.env.CONFIG_ENV_PATH && fs.existsSync(process.env.CONFIG_ENV_PATH)) {
    return process.env.CONFIG_ENV_PATH;
  }
  if (fs.existsSync(SECRETS_BACKEND)) {
    return SECRETS_BACKEND;
  }
  return LOCAL_CONFIG;
}

function assertSafeEndpoints(envPath) {
  const client = String(process.env.ENDPOINT_CLIENT || "");
  const server = String(process.env.ENDPOINT_SERVER || "");
  const blob = `${client}\n${server}\n${envPath}`;

  if (FORBIDDEN_DOMAIN_RE.test(blob)) {
    console.error(
      `[env-guard] Refusing to start: endpoint still points at legacy domain.\n` +
        `  loaded from: ${envPath}\n` +
        `  ENDPOINT_CLIENT=${client}\n` +
        `  ENDPOINT_SERVER=${server}\n` +
        `  Fix /www/wwwroot/coronacasino/secrets/backend.config.env (not backend/config.env via rsync).`
    );
    process.exit(1);
  }

  const isProdPath = envPath === SECRETS_BACKEND || process.env.NODE_ENV === "production";
  if (isProdPath) {
    if (!client.includes(REQUIRED_CLIENT) || !server.includes(REQUIRED_API)) {
      console.error(
        `[env-guard] Refusing to start: production endpoints must include ${REQUIRED_CLIENT} + ${REQUIRED_API}.\n` +
          `  loaded from: ${envPath}\n` +
          `  ENDPOINT_CLIENT=${client}\n` +
          `  ENDPOINT_SERVER=${server}`
      );
      process.exit(1);
    }
  }
}

function loadEnv() {
  if (loaded) return process.env;
  const envPath = resolveEnvPath();
  if (!fs.existsSync(envPath)) {
    console.error(`[env-guard] Missing env file: ${envPath}`);
    process.exit(1);
  }
  dotenv.config({ path: envPath });
  // Secrets file wins over a polluted in-tree config.env from rsync
  if (envPath !== LOCAL_CONFIG && fs.existsSync(LOCAL_CONFIG)) {
    // re-apply secrets on top in case dotenv was somehow called earlier
    dotenv.config({ path: envPath, override: true });
  }
  assertSafeEndpoints(envPath);
  loaded = true;
  console.log(`[env] loaded ${envPath}`);
  return process.env;
}

module.exports = { loadEnv, resolveEnvPath, SECRETS_BACKEND, FORBIDDEN_DOMAIN_RE };
