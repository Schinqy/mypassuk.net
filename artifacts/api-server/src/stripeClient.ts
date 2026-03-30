import Stripe from 'stripe';

let connectionSettings: any;

async function fetchCredentialsForEnv(
  hostname: string,
  xReplitToken: string,
  env: 'production' | 'development',
): Promise<{ publishableKey: string; secretKey: string } | null> {
  const url = new URL(`https://${hostname}/api/v2/connection`);
  url.searchParams.set('include_secrets', 'true');
  url.searchParams.set('connector_names', 'stripe');
  url.searchParams.set('environment', env);

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    });
    const data = await response.json();
    const settings = data.items?.[0];
    if (settings?.settings?.publishable && settings?.settings?.secret) {
      connectionSettings = settings;
      return {
        publishableKey: settings.settings.publishable,
        secretKey: settings.settings.secret,
      };
    }
  } catch {
    // ignore — will try next env
  }
  return null;
}

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  const isProduction = process.env.REPLIT_DEPLOYMENT === '1';

  // In production, try live keys first; fall back to test keys if none configured yet.
  // In development, only use test keys.
  const envOrder: Array<'production' | 'development'> = isProduction
    ? ['production', 'development']
    : ['development'];

  for (const env of envOrder) {
    const creds = await fetchCredentialsForEnv(hostname!, xReplitToken, env);
    if (creds) {
      if (isProduction && env === 'development') {
        console.warn('[Stripe] No production connection found — falling back to test credentials. Add a production Stripe connection to accept real payments.');
      }
      return creds;
    }
  }

  throw new Error('Stripe connection not found in any environment');
}

export async function getUncachableStripeClient() {
  const { secretKey } = await getCredentials();
  return new Stripe(secretKey, { apiVersion: '2025-08-27.basil' as any });
}

export async function getStripePublishableKey() {
  const { publishableKey } = await getCredentials();
  return publishableKey;
}

export async function getStripeSecretKey() {
  const { secretKey } = await getCredentials();
  return secretKey;
}

let stripeSync: any = null;

export async function getStripeSync() {
  if (!stripeSync) {
    const { StripeSync } = await import('stripe-replit-sync');
    const secretKey = await getStripeSecretKey();
    stripeSync = new StripeSync({
      poolConfig: {
        connectionString: process.env.DATABASE_URL!,
        max: 2,
      },
      stripeSecretKey: secretKey,
    });
  }
  return stripeSync;
}
