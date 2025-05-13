import React, { useState, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ShoppingBag, 
  Users, 
  Image, 
  Settings, 
  CreditCard, 
  Tag, 
  Truck, 
  BarChart2, 
  LogOut,
  Home,
  Calendar,
  Layout,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';

// Admin section uses a fixed black, white, and grey color scheme
// regardless of site color palette settings
const ADMIN_COLORS = {
  background: '#2A2A2A',
  backgroundLight: '#F5F5F5',  // Light grey main background
  contentBg: '#FFFFFF',        // White content areas
  text: '#111111',             // Almost black text
  textMuted: '#555555',        // Medium grey text
  border: '#E0E0E0',           // Light grey borders
  accent: '#333333',           // Dark grey accents
  hoverBackground: '#EEEEEE',  // Slightly darker grey for hover states
};

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/admin', 
      icon: <Home size={20} /> 
    },
    {
      name: 'Home Page',
      path: '/admin/home-config',
      icon: <Home size={20} />,
      submenu: [
        { name: 'Page Configuration', path: '/admin/home-config' },
        { name: 'Hero Section', path: '/admin/hero-config' },
        { name: 'Why Choose Section', path: '/admin/why-choose' },
        { name: 'Training Methodology', path: '/admin/methodology-config' },
        { name: 'Featured Products', path: '/admin/featured-products-config' },
        { name: 'Call to Action', path: '/admin/cta-config' },
        { name: 'Location Section', path: '/admin/location-config' },
        { name: 'Featured Programs', path: '/admin/featured-programs' },
      ]
    },
    { 
      name: 'Schedule', 
      path: '/admin/schedule',
      icon: <Calendar size={20} />,
      submenu: [
        { name: 'Regular Schedule', path: '/admin/schedule-config' },
        { name: 'Special Events', path: '/admin/special-schedule' },
      ]
    },
    { 
      name: 'Products', 
      path: '/admin/products',
      icon: <ShoppingBag size={20} />,
      submenu: [
        { name: 'All Products', path: '/admin/products' },
        { name: 'Add New', path: '/admin/products/new' },
        { name: 'Categories', path: '/admin/products/categories' },
      ]
    },
    { 
      name: 'Programs', 
      path: '/admin/programs',
      icon: <Layout size={20} />,
    },
    { 
      name: 'Orders', 
      path: '/admin/orders',
      icon: <Truck size={20} />,
    },
    { 
      name: 'Customers', 
      path: '/admin/customers',
      icon: <Users size={20} />,
    },
    { 
      name: 'Media', 
      path: '/admin/media-management',
      icon: <Image size={20} />,
    },
    { 
      name: 'Blog', 
      path: '/admin/blog-management',
      icon: <BookOpen size={20} />,
    },
    { 
      name: 'Marketing', 
      path: '/admin/marketing',
      icon: <Tag size={20} />,
      submenu: [
        { name: 'Coupons', path: '/admin/marketing/coupons' },
        { name: 'Promotions', path: '/admin/marketing/promotions' },
      ]
    },
    { 
      name: 'Payments', 
      path: '/admin/payments',
      icon: <CreditCard size={20} />,
      submenu: [
        { name: 'Settings', path: '/admin/payments/settings' },
        { name: 'Transactions', path: '/admin/payments/transactions' },
      ]
    },
    { 
      name: 'Reports', 
      path: '/admin/reports',
      icon: <BarChart2 size={20} />,
    },
    { 
      name: 'Settings', 
      path: '/admin/settings',
      icon: <Settings size={20} />,
    },
    { 
      name: 'Admin Users', 
      path: '/admin/users',
      icon: <Users size={20} />,
    },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: ADMIN_COLORS.backgroundLight }}>
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md transition-all" 
          style={{ 
            backgroundColor: '#000000', 
            color: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            border: 'none',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 overflow-y-auto border-r`}
        style={{ 
          backgroundColor: ADMIN_COLORS.contentBg, 
          color: ADMIN_COLORS.text,
          borderColor: ADMIN_COLORS.border,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/images/Logo hog 2 - 1.png" 
              alt="HOG Admin" 
              className="h-10 w-auto" 
            />
            <span className="ml-2 text-xl font-bold" style={{ color: ADMIN_COLORS.text }}>Admin Console</span>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.name} className="py-1">
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(item.name)}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                        isActiveLink(item.path) ? '' : 'hover:bg-gray-100'
                      }`}
                      style={{ 
                        backgroundColor: isActiveLink(item.path) ? ADMIN_COLORS.hoverBackground : 'transparent',
                        color: isActiveLink(item.path) ? ADMIN_COLORS.text : ADMIN_COLORS.textMuted
                      }}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </div>
                      <ChevronDown 
                        size={16} 
                        className={`transform transition-transform ${expandedMenu === item.name ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    {expandedMenu === item.name && (
                      <div className="mt-1 pl-8 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-3 py-2 text-sm rounded-md ${
                              isActiveLink(subItem.path) ? '' : 'hover:bg-gray-100'
                            }`}
                            style={{ 
                              backgroundColor: isActiveLink(subItem.path) ? ADMIN_COLORS.hoverBackground : 'transparent',
                              color: isActiveLink(subItem.path) ? ADMIN_COLORS.text : ADMIN_COLORS.textMuted
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm rounded-md ${
                      isActiveLink(item.path) ? '' : 'hover:bg-gray-100'
                    }`}
                    style={{ 
                      backgroundColor: isActiveLink(item.path) ? ADMIN_COLORS.hoverBackground : 'transparent',
                      color: isActiveLink(item.path) ? ADMIN_COLORS.text : ADMIN_COLORS.textMuted
                    }}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-4" style={{ borderTop: `1px solid ${ADMIN_COLORS.border}` }}>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
            style={{ 
              color: ADMIN_COLORS.textMuted, 
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              transition: 'all 200ms ease',
            }}
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 overflow-x-hidden">
        <header className="shadow" style={{ 
          backgroundColor: ADMIN_COLORS.contentBg,
          borderBottom: `1px solid ${ADMIN_COLORS.border}`
        }}>
          <div className="px-4 py-4 sm:px-6 md:px-8 flex justify-between items-center">
            <h1 className="text-xl font-semibold" style={{ color: ADMIN_COLORS.text }}>
              Admin Dashboard
            </h1>
            <Link 
              to="/"
              className="text-sm hover:underline"
              style={{ color: ADMIN_COLORS.textMuted }}
            >
              View Site
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-8" style={{ backgroundColor: ADMIN_COLORS.backgroundLight, minHeight: 'calc(100vh - 4rem)' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 