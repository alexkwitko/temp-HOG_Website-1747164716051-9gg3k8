import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products, ProductType } from '../data/products';
import { ChevronLeft, Minus, Plus, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<{size?: string; color?: string}>({});
  const [addedToCart, setAddedToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const { addToCart, cartItems } = useCart();
  const hasItemsInCart = cartItems.length > 0;
  
  useEffect(() => {
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
      
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        setSelectedVariant(foundProduct.variants[0]);
      }
    }
  }, [productId]);
  
  useEffect(() => {
    if (addedToCart) {
      const timer = setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [addedToCart]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h2 className="text-2xl font-bold text-text mb-4">Product Not Found</h2>
        <p className="text-text mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/shop" 
          className="bg-background hover:bg-neutral-800 text-white font-semibold py-2 px-6 rounded-md transition-colors inline-block"
        >
          Return to Shop
        </Link>
      </div>
    );
  }
  
  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };
  
  const handleAddToCart = () => {
    if (!product.inStock) return;
    
    addToCart(product, quantity);
    setAddedToCart(true);
    setQuantity(1);
    setShowNotification(true);
  };
  
  const sizes = product.variants 
    ? [...new Set(product.variants.filter(v => v.size).map(v => v.size))] 
    : [];
    
  const colors = product.variants 
    ? [...new Set(product.variants.filter(v => v.color).map(v => v.color))] 
    : [];

  return (
    <>
      <Helmet>
        <title>{product.name} | Elite MBJJ Shop</title>
        <meta name="description" content={product.description} />
      </Helmet>

      {/* Cart Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-secondary-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
          >
            <Check size={20} className="mr-2" />
            Item added to cart successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <section className="pt-32 pb-16 md:pt-40">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/shop" className="flex items-center text-secondary-500 hover:text-secondary-600 font-medium">
              <ChevronLeft size={16} className="mr-1" /> Back to Shop
            </Link>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 overflow-hidden rounded-lg shadow-md"
              >
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-auto object-cover"
                />
              </motion.div>
              
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden ${
                        currentImageIndex === index ? 'ring-2 ring-secondary-500' : 'opacity-70'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} view ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="lg:w-1/2">
              <div className="mb-2">
                <span className="inline-block bg-background text-text px-3 py-1 text-sm font-medium rounded-full">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-display font-bold text-text mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl font-bold text-secondary-500">${product.price.toFixed(2)}</span>
                {!product.inStock && (
                  <span className="text-text font-medium">Out of Stock</span>
                )}
              </div>
              
              <div className="prose prose-lg text-text mb-8">
                <p>{product.description}</p>
              </div>
              
              {sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-text mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedVariant({...selectedVariant, size})}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          selectedVariant.size === size 
                            ? 'border-secondary-500 bg-secondary-500 text-white' 
                            : 'border-neutral-300 text-neutral-700 hover:border-secondary-500'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-text mb-2">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedVariant({...selectedVariant, color})}
                        className={`px-4 py-2 border rounded-md transition-colors ${
                          selectedVariant.color === color 
                            ? 'border-secondary-500 bg-secondary-500 text-white' 
                            : 'border-neutral-300 text-neutral-700 hover:border-secondary-500'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-lg font-bold text-text mb-2">Quantity</h3>
                <div className="flex items-center w-32">
                  <button 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="bg-background hover:bg-neutral-200 text-text w-10 h-10 flex items-center justify-center rounded-l-md transition-colors"
                    disabled={!product.inStock}
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-12 h-10 text-center border-t border-b border-neutral-300 text-text focus:outline-none"
                    disabled={!product.inStock}
                  />
                  <button 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="bg-background hover:bg-neutral-200 text-text w-10 h-10 flex items-center justify-center rounded-r-md transition-colors"
                    disabled={!product.inStock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addedToCart}
                  className={`${hasItemsInCart ? 'flex-1' : 'w-full'} flex items-center justify-center py-3 px-6 rounded-md transition-colors text-white font-bold ${
                    !product.inStock 
                      ? 'bg-neutral-400 cursor-not-allowed' 
                      : addedToCart 
                        ? 'bg-secondary-500' 
                        : 'bg-secondary-500 hover:bg-secondary-600'
                  }`}
                >
                  {!product.inStock 
                    ? 'Out of Stock' 
                    : addedToCart 
                      ? <span className="flex items-center"><Check size={20} className="mr-2" /> Added to Cart</span> 
                      : 'Add to Cart'
                  }
                </button>

                {hasItemsInCart && (
                  <Link
                    to="/cart"
                    className="flex-1 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                  >
                    Proceed to Checkout <ArrowRight size={20} className="ml-2" />
                  </Link>
                )}
              </div>
              
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-text mb-1">Shipping</h3>
                    <p className="text-sm text-text">Free shipping on orders over $100</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text mb-1">Returns</h3>
                    <p className="text-sm text-text">30-day easy returns for unworn items</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-text mb-8">
            You May Also Like
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 3)
              .map((relatedProduct, index) => (
                <motion.div 
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <Link to={`/shop/${relatedProduct.id}`} className="block">
                    <div 
                      className="h-48 bg-cover bg-center"
                      style={{ backgroundImage: `url(${relatedProduct.images[0]})` }}
                    />
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/shop/${relatedProduct.id}`} className="block">
                      <h3 className="text-lg font-bold text-text mb-1 group-hover:text-secondary-500 transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-secondary-500">${relatedProduct.price.toFixed(2)}</span>
                      <Link 
                        to={`/shop/${relatedProduct.id}`} 
                        className="text-sm font-medium text-text hover:text-secondary-500 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;