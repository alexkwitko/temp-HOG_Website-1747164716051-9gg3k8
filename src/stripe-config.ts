// Stripe product configuration
export const stripeProducts = [
  {
    id: 'prod_SIvWalPt40zslR',
    name: 'BJJ Advanced Subscription',
    description: 'Unlimited BJJ subscriotion',
    priceId: 'price_1ROJfsFQOOXEsFWhv5fPuPWC',
    mode: 'subscription' as const
  },
  {
    id: 'prod_SIvWsrJ4GPJsbK',
    name: 'White Gi',
    description: 'White ultra light GI',
    priceId: 'price_1ROJfNFQOOXEsFWhvgM7odgF',
    mode: 'payment' as const
  }
];

// Get a product by ID
export function getProductById(id: string) {
  return stripeProducts.find(product => product.id === id);
}

// Get a product by price ID
export function getProductByPriceId(priceId: string) {
  return stripeProducts.find(product => product.priceId === priceId);
}