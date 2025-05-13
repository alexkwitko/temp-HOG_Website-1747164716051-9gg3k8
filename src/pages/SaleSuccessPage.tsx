import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Check, ShoppingBag, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const SaleSuccessPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Elite MBJJ</title>
        <meta name="description" content="Your order has been successfully processed. Thank you for shopping with Elite MBJJ." />
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
              <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-white" />
              </div>
              
              <h1 className="text-3xl font-display font-bold text-text mb-4">
                Order Confirmed!
              </h1>
              <p className="text-text mb-8">
                Thank you for your purchase. Your order has been successfully processed and will be shipped soon.
              </p>

              <div className="bg-background rounded-lg p-6 mb-8">
                <h2 className="text-lg font-bold text-text mb-4">What Happens Next?</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start">
                    <Mail className="text-secondary-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-text">Order Confirmation Email</p>
                      <p className="text-text">You'll receive a detailed order confirmation email shortly.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <ShoppingBag className="text-secondary-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-text">Order Processing</p>
                      <p className="text-text">We'll begin processing your order immediately. Most orders ship within 1-2 business days.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/shop" 
                  className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-8 rounded-md transition-colors"
                >
                  Continue Shopping
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-background hover:bg-neutral-300 text-text font-bold py-3 px-8 rounded-md transition-colors"
                >
                  Need Help?
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SaleSuccessPage;