/**
 * New Relic Node agent — debe cargarse con NODE_OPTIONS=--require=newrelic
 * antes de arrancar Next (ver script "start" en package.json).
 *
 * Variables recomendadas en .env.local (no las subas al repo):
 *   NEW_RELIC_LICENSE_KEY=...
 *   NEW_RELIC_APP_NAME=vendorNew60
 *
 * Si tu cuenta es EU, descomenta "region" (o configura el host de ingest EU en la UI).
 */
exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || "vendorNew60"],
  license_key: '232cc783532218b4908fc34a03a510920161NRAL',
  // region: "eu", // solo si la cuenta está en el data center EU
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || "info",
  },
};
