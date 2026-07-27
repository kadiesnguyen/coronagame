const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const rawClient = process.env.ENDPOINT_CLIENT;
const clientOrigins = parseOrigins(rawClient);
const clientEndpoint = clientOrigins.length <= 1 ? clientOrigins[0] || rawClient : clientOrigins;

const endpoint = {
  development: {
    clientEndpoint,
    clientOrigins: clientOrigins.length ? clientOrigins : [rawClient].filter(Boolean),
    serverEndpoint: process.env.ENDPOINT_SERVER,
  },
  production: {
    clientEndpoint,
    clientOrigins: clientOrigins.length ? clientOrigins : [rawClient].filter(Boolean),
    serverEndpoint: process.env.ENDPOINT_SERVER,
  },
};

module.exports = endpoint[process.env.NODE_ENV || "development"];
