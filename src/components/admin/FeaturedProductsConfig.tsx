import React, { useState, useEffect, useCallback } from 'react';
import { Save, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase/supabaseClient';
import { products } from '../../data/products';

interface FeaturedProductsConfig {
  id: string;
  heading: string;
  subheading: string;
  featured_product_ids: string[];
}

const DEFAULT_CONFIG: FeaturedProductsConfig = {
  id: '00000000-0000-0000-0000-000000000001',
  heading: 'Featured Products',
  subheading: 'Premium gear designed for serious practitioners. Quality you can trust.',
  featured_product_ids: []
};

const FeaturedProductsConfig: React.FC = () => {
  const [config, setConfig] = useState<FeaturedProductsConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const createDefaultConfig = async () => {
      try {
        const { error } = await supabase
          .from('featured_products_config')
          .insert([DEFAULT_CONFIG]);
        
        if (error) {
          console.error('Error creating default config:', error);
        } else {
          console.log('Default config created successfully');
        }
      } catch (err) {
        console.error('Error in createDefaultConfig:', err);
      }
    };
    
    try {
      // Fetch featured products configuration
      const { data, error } = await supabase
        .from('featured_products_config')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116' || error.code === 'PGRST104') { 
          // PGRST116 is "no rows returned"
          // PGRST104 is "not acceptable"
          console.log('No configuration found, using default');
          // Try to create the default config
          await createDefaultConfig();
        } else {
          throw error;
        }
      }
      
      if (data) {
        setConfig(data);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfigChange = (field: keyof FeaturedProductsConfig, value: string | string[]) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleProductSelection = (productId: string) => {
    const newFeaturedProductIds = [...config.featured_product_ids];
    
    if (newFeaturedProductIds.includes(productId)) {
      // Remove product if already selected
      const index = newFeaturedProductIds.indexOf(productId);
      newFeaturedProductIds.splice(index, 1);
    } else {
      // Add product if not selected
      newFeaturedProductIds.push(productId);
    }
    
    handleConfigChange('featured_product_ids', newFeaturedProductIds);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Update the config
      const { error } = await supabase
        .from('featured_products_config')
        .upsert(config);
        
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving featured products config:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Featured Products Configuration</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-neutral-800 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
        >
          {saving ? (
            'Saving...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
          <p>Changes saved successfully!</p>
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Section Content</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Heading</label>
              <input
                type="text"
                value={config.heading}
                onChange={(e) => handleConfigChange('heading', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Subheading</label>
              <textarea
                value={config.subheading}
                onChange={(e) => handleConfigChange('subheading', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium mb-4">Featured Products</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select up to 6 products to feature in this section.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(product => (
              <div 
                key={product.id}
                className={`border rounded-md p-4 cursor-pointer ${
                  config.featured_product_ids.includes(product.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleProductSelection(product.id)}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="ml-2">
                    {config.featured_product_ids.includes(product.id) ? (
                      <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="h-5 w-5 border border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsConfig; 