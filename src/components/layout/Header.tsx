import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, LogIn, LogOut, Settings, User } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/useAuth';
import { motion } from 'framer-motion';

interface HeaderProps {
  isScrolled: boolean;
}

interface NavLink {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isAccountMenuOpen && 
          accountMenuRef.current && 
          !accountMenuRef.current.contains(event.target as Node) &&
          accountButtonRef.current &&
          !accountButtonRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  const isProductPage = location.pathname.startsWith('/shop/');
  const isCartPage = location.pathname === '/cart';
  const shouldShowDarkHeader = isScrolled || isProductPage || isCartPage;

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowDarkHeader
          ? 'bg-neutral-900/95 backdrop-blur-sm shadow-lg py-2' 
          : 'bg-neutral-900/70 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/images/Logo hog 2 - 1.png" 
              alt="HOG Logo" 
              className="h-12 w-auto" 
            />
            <span className="text-sm text-text ml-2 hidden sm:inline">House of Grappling</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks isScrolled={shouldShowDarkHeader} />
            <Link to="/cart" className="relative text-text hover:text-neutral-300 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-background text-text text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link 
              to="/contact" 
              className="bg-background hover:bg-neutral-800 text-text font-bold py-2 px-4 rounded-md transition-colors"
            >
              Contact Us
            </Link>
            {user ? (
              <div className="relative group">
                <button
                  ref={accountButtonRef}
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center text-text hover:text-neutral-300 transition-colors"
                >
                  <User size={20} className="mr-1" />
                  <span>Account</span>
                </button>
                <div 
                  ref={accountMenuRef}
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ${isAccountMenuOpen ? 'block' : 'hidden'}`}
                >
                  <Link 
                    to="/profile" 
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/subscription" 
                    onClick={() => setIsAccountMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Subscription
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsAccountMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center text-text hover:text-neutral-300 transition-colors"
              >
                <LogIn size={20} className="mr-1" />
                <span>Login</span>
              </Link>
            )}
          </nav>

          {/* Mobile Navigation Button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="relative text-text mr-4">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-background text-text text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-background/95 backdrop-blur-sm shadow-lg py-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-4">
            <NavLinks isScrolled={shouldShowDarkHeader} />
            <Link 
              to="/contact" 
              className="bg-background hover:bg-neutral-800 text-text font-bold py-2 px-4 rounded-md transition-colors text-center"
            >
              Contact Us
            </Link>
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center justify-center text-text hover:text-neutral-300 transition-colors"
                >
                  <User size={20} className="mr-1" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/subscription"
                  className="flex items-center justify-center text-text hover:text-neutral-300 transition-colors"
                >
                  <Settings size={20} className="mr-1" />
                  <span>Subscription</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center justify-center text-text hover:text-neutral-300 transition-colors"
                  >
                    <Settings size={20} className="mr-1" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center text-text hover:text-neutral-300 transition-colors"
                >
                  <LogOut size={20} className="mr-1" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center justify-center text-text hover:text-neutral-300 transition-colors"
              >
                <LogIn size={20} className="mr-1" />
                <span>Login</span>
              </Link>
            )}
          </nav>
        </div>
      </motion.div>
    </header>
  );
};

interface NavLinksProps {
  isScrolled: boolean;
}

const NavLinks: React.FC<NavLinksProps> = ({ isScrolled }) => {
  const location = useLocation();
  useAuth();
  
  const links: NavLink[] = [
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Instructors', path: '/instructors' },
    { name: 'Shop', path: '/shop' },
    { name: 'Subscription', path: '/subscription' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link 
          key={link.path}
          to={link.path}
          className={`font-medium transition-colors flex items-center ${
            location.pathname === link.path 
              ? 'text-red-500' 
              : `text-neutral-50 hover:text-neutral-300 ${!isScrolled ? 'md:text-neutral-50' : ''}`
          }`}
        >
          {link.icon && link.icon}
          {link.name}
        </Link>
      ))}
    </>
  );
};

export default Header;