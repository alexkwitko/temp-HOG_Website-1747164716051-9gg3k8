import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { stripeProducts } from '../stripe-config';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/useAuth';

interface SubscriptionStatus {
  status: string;
  currentPeriodEnd?: number;
  priceId?: string;
  cancelAtPeriodEnd?: boolean;
}

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }

    fetchSubscription();
  }, [user, navigate]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        throw new Error('Failed to load subscription information');
      }

      if (data) {
        setSubscription({
          status: data.subscription_status,
          currentPeriodEnd: data.current_period_end,
          priceId: data.price_id,
          cancelAtPeriodEnd: data.cancel_at_period_end
        });
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error('Error in fetchSubscription:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/subscription' } });
      return;
    }

    try {
      setCheckoutLoading(true);
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
          success_url: `${window.location.origin}/subscription/success`,
          cancel_url: `${window.location.origin}/subscription`,
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
      setCheckoutLoading(false);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </span>
        );
      case 'trialing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Trial
          </span>
        );
      case 'past_due':
      case 'incomplete':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status === 'past_due' ? 'Past Due' : 'Incomplete'}
          </span>
        );
      case 'canceled':
      case 'incomplete_expired':
      case 'unpaid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {status === 'canceled' ? 'Canceled' : status === 'unpaid' ? 'Unpaid' : 'Expired'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status || 'Unknown'}
          </span>
        );
    }
  };

  const getProductName = (priceId?: string) => {
    if (!priceId) return 'Unknown Plan';
    const product = stripeProducts.find(p => p.priceId === priceId);
    return product ? product.name : 'Unknown Plan';
  };

  return (
    <>
      <Helmet>
        <title>Subscription | House of Grappling</title>
        <meta name="description" content="Manage your House of Grappling subscription" />
      </Helmet>

      <div className="min-h-screen pt-32 pb-16 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-text">Membership & Subscription</h1>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-text" />
              <span className="ml-2 text-text">Loading subscription information...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {subscription && subscription.status === 'active' ? (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-text">Current Subscription</h2>
                    {getStatusBadge(subscription.status)}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-text">Plan</p>
                        <p className="font-medium text-text">{getProductName(subscription.priceId)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-text">Renewal Date</p>
                        <p className="font-medium text-text">{formatDate(subscription.currentPeriodEnd)}</p>
                      </div>
                    </div>
                    
                    {subscription.cancelAtPeriodEnd && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Your subscription is set to cancel at the end of the current billing period.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        className="text-text hover:text-red-600 font-medium"
                        onClick={() => {
                          // This would typically open a modal or navigate to a cancellation page
                          alert('Cancellation functionality would be implemented here');
                        }}
                      >
                        {subscription.cancelAtPeriodEnd ? 'Resume Subscription' : 'Cancel Subscription'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-text mb-4">No Active Subscription</h2>
                  <p className="text-text mb-4">
                    You don't currently have an active subscription. Choose a plan below to get started.
                  </p>
                </div>
              )}

              <h2 className="text-2xl font-bold mb-6 text-text">Available Plans</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stripeProducts
                  .filter(product => product.mode === 'subscription')
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-text mb-2">{product.name}</h3>
                        <p className="text-text mb-4">{product.description}</p>
                        <div className="mb-6">
                          <span className="text-3xl font-bold text-text">$150</span>
                          <span className="text-text">/month</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-text">Unlimited access to all classes</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-text">Priority booking for special events</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-text">10% discount on merchandise</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-text">Free gi rental for your first month</span>
                          </li>
                        </ul>
                        <button
                          onClick={() => handleSubscribe(product.priceId)}
                          disabled={checkoutLoading || (subscription?.status === 'active' && subscription?.priceId === product.priceId)}
                          className={`w-full flex items-center justify-center py-3 px-4 rounded-md text-white font-medium transition-colors ${
                            subscription?.status === 'active' && subscription?.priceId === product.priceId
                              ? 'bg-green-500 cursor-default'
                              : checkoutLoading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-background hover:bg-neutral-800'
                          }`}
                        >
                          {subscription?.status === 'active' && subscription?.priceId === product.priceId ? (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Current Plan
                            </>
                          ) : checkoutLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Subscribe Now
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>

              <h2 className="text-2xl font-bold mb-6 text-text">One-time Purchases</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stripeProducts
                  .filter(product => product.mode === 'payment')
                  .map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-text mb-2">{product.name}</h3>
                        <p className="text-text mb-4">{product.description}</p>
                        <div className="mb-6">
                          <span className="text-2xl font-bold text-text">$150</span>
                        </div>
                        <button
                          onClick={() => handleSubscribe(product.priceId)}
                          disabled={checkoutLoading}
                          className={`w-full flex items-center justify-center py-3 px-4 rounded-md text-white font-medium transition-colors ${
                            checkoutLoading
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-background hover:bg-neutral-800'
                          }`}
                        >
                          {checkoutLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Buy Now
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SubscriptionPage;