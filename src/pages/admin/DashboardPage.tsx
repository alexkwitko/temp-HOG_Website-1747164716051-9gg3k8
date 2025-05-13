import React, { useState, useEffect } from 'react';
import { Box, ShoppingBag, Users, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  increasing?: boolean;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, increasing, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="flex justify-between">
        <div>
          <p className="text-text text-sm font-medium">{title}</p>
          {isLoading ? (
            <div className="h-8 w-20 bg-background animate-pulse rounded mt-1"></div>
          ) : (
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          )}
          {change && (
            <p className={`text-xs font-medium mt-2 flex items-center ${increasing ? 'text-green-500' : 'text-red-500'}`}>
              <span>{increasing ? '↑' : '↓'}</span> 
              <span className="ml-1">{change} from last month</span>
            </p>
          )}
        </div>
        <div className="p-3 bg-background rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing' | 'cancelled';
}

interface Product {
  id: string;
  name: string;
  stock?: number;
  threshold?: number;
  description: string;
  price: number;
  image_url: string;
  is_featured?: boolean;
}

const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [featuresCount, setFeaturesCount] = useState<number>(0);
  const [methodologyCount, setMethodologyCount] = useState<number>(0);
  const [programsCount, setProgramsCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Check if products table exists
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*');
        
        if (productError) {
          // Display a more informative message if the table doesn't exist
          if (productError.message && productError.message.includes('relation "products" does not exist')) {
            console.error('The products table does not exist. Please run the database setup script from the Supabase dashboard SQL editor.');
            setError('Database tables are missing. Please check the console for more information.');
          } else {
            console.error('Error fetching products:', productError);
            setError('Failed to load products data. Please try again later.');
          }
        } else {
          setProducts(productData || []);
        }
        
        // Check if features table exists
        const { data: featureData, error: featureError } = await supabase
          .from('features')
          .select('*');
        
        if (featureError) {
          // Only log if it's not the same error as before
          if (!featureError.message || !featureError.message.includes('relation') || 
              !productError || !productError.message || !productError.message.includes('relation')) {
            console.error('Error fetching features:', featureError);
          }
        } else {
          setFeaturesCount(featureData?.length || 0);
        }
        
        // Check if methodology table exists
        const { data: methodologyData, error: methodologyError } = await supabase
          .from('methodology')
          .select('*');
        
        if (methodologyError) {
          // Only log if it's not the same error as before
          if (!methodologyError.message || !methodologyError.message.includes('relation') || 
              (!productError || !productError.message || !productError.message.includes('relation'))) {
            console.error('Error fetching methodology:', methodologyError);
          }
        } else {
          setMethodologyCount(methodologyData?.length || 0);
        }
        
        // Check if programs table exists
        try {
          const { data: programData, error: programError } = await supabase
            .from('programs')
            .select('*');
          
          if (programError) {
            // If the error is a missing table, just set count to 0 silently
            if (programError.message && programError.message.includes('relation') && 
                programError.message.includes('does not exist')) {
              setProgramsCount(0);
              console.warn('Programs table does not exist:', programError.message);
            } else {
              console.error('Error fetching programs:', programError);
            }
          } else {
            setProgramsCount(programData?.length || 0);
          }
        } catch (programErr) {
          console.warn('Failed to fetch programs:', programErr);
          setProgramsCount(0);
        }
        
        // If we got here with no error set, clear any previous error
        if (!productError && !error) {
          setError(null);
        }
      } catch (err) {
        console.error('Error in data fetch:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // This would come from Supabase in a real implementation
  const recentOrders: RecentOrder[] = [
    { id: 'ORD-001', customer: 'John Smith', date: '2023-05-15', amount: 149.99, status: 'completed' },
    { id: 'ORD-002', customer: 'Sarah Jones', date: '2023-05-14', amount: 49.99, status: 'processing' },
    { id: 'ORD-003', customer: 'Mike Johnson', date: '2023-05-14', amount: 89.97, status: 'completed' },
    { id: 'ORD-004', customer: 'Emma Davis', date: '2023-05-13', amount: 129.99, status: 'cancelled' },
    { id: 'ORD-005', customer: 'James Wilson', date: '2023-05-12', amount: 199.97, status: 'completed' },
  ];

  // Stats using real data
  const stats = [
    { 
      title: 'Products', 
      value: products.length, 
      icon: <ShoppingBag size={24} className="text-orange-500" />,
      isLoading: loading,
      change: undefined,
      increasing: undefined
    },
    { 
      title: 'Features', 
      value: featuresCount, 
      icon: <Box size={24} className="text-text" />,
      isLoading: loading,
      change: undefined,
      increasing: undefined
    },
    { 
      title: 'Methodology Items', 
      value: methodologyCount, 
      icon: <Calendar size={24} className="text-text" />,
      isLoading: loading,
      change: undefined,
      increasing: undefined
    },
    { 
      title: 'Programs', 
      value: programsCount, 
      icon: <Users size={24} className="text-text" />,
      isLoading: loading,
      change: undefined,
      increasing: undefined
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-text">Dashboard</h1>
        </div>
        
        {error && (
          <div className="mt-4 bg-background border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-text" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-text">{error}</p>
                {error.includes('Database tables are missing') && (
                  <div className="mt-2 text-sm text-text">
                    <p>Please run the database setup script in your Supabase dashboard:</p>
                    <ol className="list-decimal ml-5 mt-1">
                      <li>Log in to your Supabase dashboard</li>
                      <li>Go to the SQL Editor</li>
                      <li>Paste the contents of the <code className="bg-background px-1 rounded">fix_database_schema.sql</code> file</li>
                      <li>Run the script</li>
                      <li>Refresh this page</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stats cards */}
            <div className="bg-white rounded-lg shadow p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-background rounded-md p-3">
                  <svg className="h-6 w-6 text-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-text truncate">Products</dt>
                    <dd>
                      <div className="text-lg font-medium text-text">{products.length}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            {stats.map((stat, index) => (
              <StatsCard 
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                increasing={stat.increasing}
                isLoading={stat.isLoading}
              />
            ))}
          </div>
        )}

        {/* Recent Orders and Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200">
              <h3 className="text-lg font-medium text-text">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-background">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                        ${order.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-background px-6 py-3 border-t border-neutral-200">
              <a href="/admin/orders" className="text-sm font-medium text-text hover:text-blue-500">
                View all orders
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center">
              <ShoppingBag size={18} className="text-orange-500 mr-2" />
              <h3 className="text-lg font-medium text-text">Recent Products</h3>
            </div>
            {loading ? (
              <div className="p-6 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-neutral-900"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="p-6 text-center text-text">
                No products found. <a href="/admin/products/new" className="text-text hover:underline">Add a new product</a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-background">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">
                        Featured
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {products.slice(0, 5).map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded-md object-cover" src={product.image_url} alt={product.name} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-text">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          ${Number(product.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.is_featured ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>
                            {product.is_featured ? 'Featured' : 'Standard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="bg-background px-6 py-3 border-t border-neutral-200">
              <a href="/admin/products" className="text-sm font-medium text-text hover:text-blue-500">
                View all products
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage; 