import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Loader2 } from 'lucide-react';
import { stripeProducts } from '../stripe-config';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/useAuth';

const ShopSection: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = async (priceId: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/shop' } });
      return;
    }

    try {
      setLoading(priceId);
      setError(null);

      const product = stripeProducts.find(p => p.priceId === priceId);
      if (!product) {
        throw new Error('Invalid product selected');
      }

      // Get the JWT token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Call the Stripe checkout edge function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          price_id: priceId,
          success_url: `${window.location.origin}/sale/success`,
          cancel_url: `${window.location.origin}/shop`,
          mode: product.mode
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start checkout process');
      setLoading(null);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-text">Shop Our Products</h2>
          <p className="text-lg text-text max-w-2xl mx-auto">
            Premium gear designed for serious practitioners. Quality you can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stripeProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-text">{product.name}</h3>
                <p className="text-text mb-4">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-text">
                    {product.mode === 'subscription' ? '$150/month' : '$150'}
                  </span>
                  <span className="text-sm text-text">
                    {product.mode === 'subscription' ? 'Subscription' : 'One-time purchase'}
                  </span>
                </div>
                <button
                  onClick={() => handleBuyNow(product.priceId)}
                  disabled={loading === product.priceId}
                  className="w-full bg-background hover:bg-neutral-800 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center"
                >
                  {loading === product.priceId ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {product.mode === 'subscription' ? 'Subscribe Now' : 'Buy Now'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-4 mx-auto max-w-2xl">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/shop" 
            className="inline-flex items-center text-text hover:text-background font-bold"
          >
            View All Products <ShoppingCart className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;