import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SubscriptionSuccessPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Subscription Confirmed | House of Grappling</title>
        <meta name="description" content="Your subscription has been successfully processed. Welcome to House of Grappling!" />
      </Helmet>

      <div className="min-h-screen bg-background pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-white" />
              </div>
              
              <h1 className="text-3xl font-display font-bold text-text mb-4">
                Subscription Confirmed!
              </h1>
              <p className="text-text mb-8">
                Thank you for subscribing to House of Grappling. Your membership is now active and you can start enjoying all the benefits immediately.
              </p>

              <div className="bg-background rounded-lg p-6 mb-8">
                <h2 className="text-lg font-bold text-text mb-4">What Happens Next?</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start">
                    <Calendar className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-text">Access to All Classes</p>
                      <p className="text-text">You now have unlimited access to all classes on our schedule.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-text">Member Benefits</p>
                      <p className="text-text">Enjoy all member benefits including discounts on merchandise and priority booking for special events.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/schedule" 
                  className="bg-background hover:bg-neutral-800 text-white font-bold py-3 px-8 rounded-md transition-colors flex items-center justify-center"
                >
                  View Class Schedule
                  <ArrowRight size={20} className="ml-2" />
                </Link>
                <Link 
                  to="/subscription" 
                  className="bg-background hover:bg-neutral-300 text-text font-bold py-3 px-8 rounded-md transition-colors"
                >
                  Manage Subscription
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionSuccessPage;