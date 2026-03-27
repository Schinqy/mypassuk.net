import app from "./app";
import { logger } from "./lib/logger";
import { getStripeSync } from "./stripeClient";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  // Initialise StripeSync and register managed webhook
  try {
    const sync = await getStripeSync();
    const webhookUrl = process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/stripe/webhook`
      : `http://localhost:${port}/api/stripe/webhook`;
    await sync.findOrCreateManagedWebhook(webhookUrl);
    logger.info({ webhookUrl }, "Stripe sync initialised");
  } catch (err) {
    logger.warn({ err }, "Stripe sync init failed — continuing without it");
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "Server listening");
  });
}

start();
