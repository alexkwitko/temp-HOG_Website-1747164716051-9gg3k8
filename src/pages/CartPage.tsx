import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'framer-motion';
import PaymentModal from '../components/PaymentModal';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, clearCart } = useCart();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const shippingCost = subtotal >= 100 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Your Cart | Elite MBJJ</title>
        <meta name="description" content="Review and manage items in your shopping cart." />
      </Helmet>

      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-800 mb-8">
            Your Cart
          </h1>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-neutral-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-bold text-primary-800">
                        Cart Items ({cartItems.length})
                      </h2>
                      <button 
                        onClick={clearCart}
                        className="text-sm text-text hover:text-red-600 font-medium"
                      >
                        Clear Cart
                      </button>
                    </div>
                  </div>

                  <div className="divide-y divide-neutral-200">
                    {cartItems.map((item, index) => (
                      <CartItem 
                        key={item.product.id} 
                        item={item} 
                        updateQuantity={updateQuantity}
                        removeFromCart={removeFromCart}
                        index={index}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Link 
                    to="/shop" 
                    className="inline-flex items-center text-accent-500 hover:text-accent-600 font-medium"
                  >
                    <ShoppingBag size={16} className="mr-2" /> Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6 border-b border-neutral-200">
                    <h2 className="text-xl font-bold text-primary-800">Order Summary</h2>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-text">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text">Shipping</span>
                      <span className="font-medium">
                        {subtotal >= 100 ? 'Free' : '$5.99'}
                      </span>
                    </div>

                    {subtotal < 100 && (
                      <div className="text-sm text-accent-500 italic">
                        Add ${(100 - subtotal).toFixed(2)} more to qualify for free shipping!
                      </div>
                    )}

                    <div className="border-t border-neutral-200 pt-4 mt-4">
                      <div className="flex justify-between font-bold">
                        <span className="text-text">Total</span>
                        <span className="text-primary-800">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-4 rounded-md transition-colors mt-4 flex items-center justify-center text-lg"
                    >
                      Pay Now <ArrowRight size={20} className="ml-2" />
                    </button>

                    <div className="text-sm text-text text-center mt-4">
                      Secure checkout powered by Stripe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        productName={`Cart Total (${totalItems} items)`}
      />
    </>
  );
};

interface CartItemProps {
  item: {
    product: {
      id: string;
      name: string;
      price: number;
      images: string[];
    };
    quantity: number;
  };
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  index: number;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeFromCart, index }) => {
  const handleQuantityChange = (value: number) => {
    updateQuantity(item.product.id, value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-6 flex flex-col sm:flex-row items-center"
    >
      <div className="sm:w-20 sm:h-20 w-32 h-32 rounded-md overflow-hidden mb-4 sm:mb-0 mr-0 sm:mr-4">
        <Link to={`/shop/${item.product.id}`}>
          <img 
            src={item.product.images[0]} 
            alt={item.product.name} 
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      
      <div className="flex-1 text-center sm:text-left mb-4 sm:mb-0">
        <Link to={`/shop/${item.product.id}`}>
          <h3 className="text-lg font-bold text-primary-800 hover:text-accent-500 transition-colors">
            {item.product.name}
          </h3>
        </Link>
        <span className="text-text block sm:hidden mt-1">
          ${item.product.price.toFixed(2)}
        </span>
      </div>
      
      <div className="flex items-center sm:w-32 justify-center mb-4 sm:mb-0">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="bg-background hover:bg-neutral-200 text-text w-8 h-8 flex items-center justify-center rounded-l-md transition-colors"
        >
          <Minus size={14} />
        </button>
        <input 
          type="number" 
          min="1" 
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          className="w-10 h-8 text-center border-t border-b border-neutral-300 text-text focus:outline-none"
        />
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="bg-background hover:bg-neutral-200 text-text w-8 h-8 flex items-center justify-center rounded-r-md transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>
      
      <div className="hidden sm:block text-right font-medium text-primary-800 w-24 mr-4">
        ${(item.product.price * item.quantity).toFixed(2)}
      </div>
      
      <button 
        onClick={() => removeFromCart(item.product.id)}
        className="text-text hover:text-red-600 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
};

const EmptyCart: React.FC = () => {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-md">
      <div className="inline-block bg-background p-6 rounded-full mb-6">
        <ShoppingBag size={48} className="text-text" />
      </div>
      <h2 className="text-2xl font-bold text-primary-800 mb-2">Your Cart is Empty</h2>
      <p className="text-text mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Explore our shop to find the perfect gear for your training.
      </p>
      <Link 
        to="/shop" 
        className="bg-background hover:bg-neutral-800 text-white font-bold py-3 px-8 rounded-md transition-colors inline-block"
      >
        Start Shopping
      </Link>
    </div>
  );
};

export default CartPage;