import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Link } from 'react-router-dom';
import { Settings, CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { stripeProducts } from '../stripe-config';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
}

const ProfilePage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

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
        setError('Failed to load subscription information');
      } else {
        setSubscription(data);
      }
    } catch (err) {
      console.error('Error in fetchSubscription:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp?: number | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getProductName = (priceId?: string | null) => {
    if (!priceId) return 'Unknown Plan';
    const product = stripeProducts.find(p => p.priceId === priceId);
    return product ? product.name : 'Unknown Plan';
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
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
            <AlertCircle className="w-3 h-3 mr-1" />
            {status === 'past_due' ? 'Past Due' : 'Incomplete'}
          </span>
        );
      case 'canceled':
      case 'incomplete_expired':
      case 'unpaid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            {status === 'canceled' ? 'Canceled' : status === 'unpaid' ? 'Unpaid' : 'Expired'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-background text-white p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
          
          <div className="p-6">
            {/* Admin Dashboard Link - Only visible for admins */}
            {isAdmin && (
              <div className="mb-6 bg-background border-l-4 border-red-500 p-4">
                <Link 
                  to="/admin" 
                  className="flex items-center text-text hover:text-red-800 font-medium"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Go to Admin Dashboard
                </Link>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Account Information</h2>
              <div className="border-t border-b border-neutral-200 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text">User ID</p>
                    <p className="font-medium text-sm truncate">{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Subscription</h2>
              <div className="border-t border-b border-neutral-200 py-4">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                    <span className="ml-2 text-sm text-text">Loading subscription information...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                ) : subscription && subscription.subscription_status === 'active' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-text">Current Plan</p>
                        <p className="font-medium">{getProductName(subscription.price_id)}</p>
                      </div>
                      {getStatusBadge(subscription.subscription_status)}
                    </div>
                    
                    <div>
                      <p className="text-sm text-text">Renewal Date</p>
                      <p className="font-medium">{formatDate(subscription.current_period_end)}</p>
                    </div>
                    
                    {subscription.cancel_at_period_end && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Your subscription is set to cancel at the end of the current billing period.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Link 
                        to="/subscription" 
                        className="inline-flex items-center text-text hover:text-background font-medium"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <p className="text-text mb-3">You don't have an active subscription.</p>
                    <Link 
                      to="/subscription" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-background hover:bg-neutral-800"
                    >
                      View Subscription Options
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Account Settings</h2>
              <div className="space-y-4">
                <button 
                  className="text-text hover:text-red-700 font-medium flex items-center"
                >
                  Change Password
                </button>
                <button 
                  className="text-text hover:text-red-700 font-medium flex items-center"
                >
                  Update Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;