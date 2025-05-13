import React from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  productName: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, productName }) => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    const isSuccessful = Math.random() > 0.2; // 80% success rate
    
    if (isSuccessful) {
      navigate('/sale/success');
    } else {
      navigate('/sale/error');
    }
    
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-[5%] sm:top-[15%] left-[5%] right-[5%] sm:left-1/2 sm:-translate-x-1/2 w-[90%] sm:w-full max-w-md bg-background rounded-lg shadow-xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 flex justify-between items-center p-4 border-b border-neutral-200 bg-background">
              <h3 className="text-xl font-bold text-text">Secure Payment</h3>
              <button 
                onClick={onClose}
                className="text-text hover:text-neutral-700 transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-text mb-2">Order Summary</h4>
                <div className="bg-background p-4 rounded-md">
                  <p className="text-text font-medium">{productName}</p>
                  <p className="text-2xl font-bold text-secondary-500 mt-2">
                    ${amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 pl-10"
                    />
                    <CreditCard size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-text" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-secondary-500 text-text py-4 rounded-md hover:bg-secondary-600 transition-colors flex items-center justify-center font-bold text-lg"
                >
                  <Lock size={20} className="mr-2" />
                  Pay ${amount.toFixed(2)}
                </button>

                <div className="text-center text-sm text-text flex items-center justify-center">
                  <Lock size={16} className="mr-1" />
                  Secured by Stripe
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;