import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { AlertCircle, RefreshCw, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const SaleErrorPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Payment Failed | Elite MBJJ</title>
        <meta name="description" content="There was an issue processing your payment. Please try again or contact support for assistance." />
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
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} className="text-white" />
              </div>
              
              <h1 className="text-3xl font-display font-bold text-text mb-4">
                Payment Failed
              </h1>
              <p className="text-text mb-8">
                We encountered an issue while processing your payment. Don't worry - your cart is still saved and you can try again.
              </p>

              <div className="bg-background rounded-lg p-6 mb-8">
                <h2 className="text-lg font-bold text-text mb-4">Common Issues & Solutions</h2>
                <div className="space-y-4 text-left">
                  <div className="flex items-start">
                    <RefreshCw className="text-text mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-text">Try Again</p>
                      <ul className="text-text list-disc list-inside">
                        <li>Check your card details and try again</li>
                        <li>Ensure you have sufficient funds</li>
                        <li>Try a different payment method</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="text-text mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-text">Need Assistance?</p>
                      <p className="text-text">Our support team is available to help resolve any payment issues.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/cart" 
                  className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-8 rounded-md transition-colors"
                >
                  Try Again
                </Link>
                <Link 
                  to="/contact" 
                  className="bg-background hover:bg-neutral-300 text-text font-bold py-3 px-8 rounded-md transition-colors"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SaleErrorPage;