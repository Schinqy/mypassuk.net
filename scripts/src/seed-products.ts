import { getUncachableStripeClient } from './stripeClient';

async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Creating UK EdGuide products in Stripe...');

    const existing = await stripe.products.search({
      query: "name:'Student Premium' AND active:'true'",
    });

    if (existing.data.length > 0) {
      console.log('Student Premium already exists:', existing.data[0].id);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      prices.data.forEach(p => console.log(`  Price: ${p.id} — ${p.unit_amount! / 100} ${p.currency?.toUpperCase()}/${(p.recurring as any)?.interval}`));
      return;
    }

    const product = await stripe.products.create({
      name: 'Student Premium',
      description: 'Unlimited AI Study Assistant messages, unlimited saved Study Plans, PDF export, and ad-free experience.',
      metadata: { plan: 'premium' },
    });
    console.log('Created product:', product.id);

    const monthly = await stripe.prices.create({
      product: product.id,
      unit_amount: 399,
      currency: 'gbp',
      recurring: { interval: 'month' },
    });
    console.log('Monthly price:', monthly.id, '— £3.99/mo');

    const annual = await stripe.prices.create({
      product: product.id,
      unit_amount: 3588,
      currency: 'gbp',
      recurring: { interval: 'year' },
    });
    console.log('Annual price:', annual.id, '— £35.88/yr (save 25%)');

    console.log('\n✓ Products created. Webhooks will sync to DB automatically.');
    console.log('\nPrice IDs to use in checkout:');
    console.log('  Monthly:', monthly.id);
    console.log('  Annual:', annual.id);
  } catch (err: any) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

createProducts();
