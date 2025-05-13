import React, { useState, useEffect, useCallback } from 'react';
import { Save, ShoppingBag, Plus, Trash } from 'lucide-react';
import { supabase } from '../../../lib/supabase/supabaseClient';
import { useSiteSettings } from '../../../contexts/SiteSettingsContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  featured: boolean;
}

interface FeaturedProductsConfigType {
  id: string;
  heading: string;
  subheading: string;
  background_color: string;
  text_color: string;
  featured_product_ids: string[];
  max_display_count: number;
}

const DEFAULT_CONFIG: FeaturedProductsConfigType = {
  id: '00000000-0000-0000-0000-000000000001',
  heading: 'Featured Products',
  subheading: 'Premium gear designed for serious practitioners. Quality you can trust.',
  background_color: '#F5F5F5',
  text_color: 'var(--color-text)',
  featured_product_ids: [],
  max_display_count: 3
};

const FeaturedProductsConfig: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<FeaturedProductsConfigType>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (productsError) throw productsError;
      
      // Fetch featured products configuration
      const { data: configData, error: configError } = await supabase
        .from('featured_products_config')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();
      
      if (configError) {
        if (configError.code === 'PGRST116' || configError.code === 'PGRST104') { 
          // PGRST116 is "no rows returned"
          // PGRST104 is "not acceptable"
          console.log('No configuration found, using default');
          // Try to create the default config
          await createDefaultConfig();
        } else {
          throw configError;
        }
      }
      
      setProducts(productsData || []);
      if (configData) {
        setConfig(configData);
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

  const handleConfigChange = (field: keyof FeaturedProductsConfigType, value: string | string[] | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // First try update
      const { error: updateError } = await supabase
        .from('featured_products_config')
        .update({
          heading: config.heading,
          subheading: config.subheading,
          background_color: config.background_color,
          text_color: config.text_color,
          featured_product_ids: config.featured_product_ids,
          max_display_count: config.max_display_count
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');
      
      if (updateError) {
        console.error('Error updating configuration, trying insert instead:', updateError);
        
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('featured_products_config')
          .insert([{
            id: '00000000-0000-0000-0000-000000000001',
            heading: config.heading,
            subheading: config.subheading,
            background_color: config.background_color,
            text_color: config.text_color,
            featured_product_ids: config.featured_product_ids,
            max_display_count: config.max_display_count
          }]);
        
        if (insertError) {
          console.error('Error inserting configuration:', insertError);
          throw insertError;
        }
      }
      
      setSuccessMessage('Featured products configuration saved successfully!');
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  const addProductToFeatured = (productId: string) => {
    if (config.featured_product_ids.includes(productId)) return;
    
    setConfig(prev => ({
      ...prev,
      featured_product_ids: [...prev.featured_product_ids, productId]
    }));
  };

  const removeProductFromFeatured = (productId: string) => {
    setConfig(prev => ({
      ...prev,
      featured_product_ids: prev.featured_product_ids.filter(id => id !== productId)
    }));
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-background rounded w-1/4"></div>
          <div className="h-4 bg-background rounded w-1/2"></div>
          <div className="h-32 bg-background rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">Featured Products Configuration</h2>
          <p className="text-text">
            Customize the featured products section on the homepage.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-background text-white rounded-md hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-5 w-5 mr-2" />
              Save Configuration
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-background border-l-4 border-red-500 text-text">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-background border-l-4 border-green-500 text-text">
          <p className="font-medium">Success</p>
          <p>{successMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Settings */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-bold mb-4">Section Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Heading
              </label>
              <input
                type="text"
                value={config.heading}
                onChange={(e) => handleConfigChange('heading', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="e.g., Featured Products"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Subheading
              </label>
              <textarea
                value={config.subheading}
                onChange={(e) => handleConfigChange('subheading', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                rows={2}
                placeholder="Short description for the featured products section"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Background Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.background_color}
                    onChange={(e) => handleConfigChange('background_color', e.target.value)}
                    className="w-10 h-10 rounded mr-2"
                  />
                  <input
                    type="text"
                    value={config.background_color}
                    onChange={(e) => handleConfigChange('background_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.text_color}
                    onChange={(e) => handleConfigChange('text_color', e.target.value)}
                    className="w-10 h-10 rounded mr-2"
                  />
                  <input
                    type="text"
                    value={config.text_color}
                    onChange={(e) => handleConfigChange('text_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Maximum Products to Display
              </label>
              <input
                type="number"
                min={1}
                max={6}
                value={config.max_display_count}
                onChange={(e) => handleConfigChange('max_display_count', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
              />
              <p className="mt-1 text-sm text-text">
                Recommended: 3-4 products for best display on most screens.
              </p>
            </div>
          </div>
        </div>
        
        {/* Featured Products Selection */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="text-lg font-bold mb-4">Featured Products</h3>
          
          {/* Selected Products */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text mb-2">
              Selected Products ({config.featured_product_ids.length} / {config.max_display_count} recommended)
            </h4>
            
            {config.featured_product_ids.length === 0 ? (
              <div className="p-4 bg-background border border-dashed border-neutral-300 rounded-md">
                <p className="text-text text-center">No products selected</p>
              </div>
            ) : (
              <div className="space-y-2">
                {config.featured_product_ids.map(productId => {
                  const product = products.find(p => p.id === productId);
                  if (!product) return null;
                  
                  return (
                    <div 
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-background border rounded-md"
                    >
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-background rounded overflow-hidden mr-3">
                          {product.images?.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-text" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium">{product.name}</h5>
                          <p className="text-sm text-text">${product.price?.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeProductFromFeatured(product.id)}
                        className="text-text hover:text-red-700 p-1"
                        title="Remove"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Available Products */}
          <div>
            <h4 className="text-sm font-medium text-text mb-2">
              Available Products
            </h4>
            
            {products.length === 0 ? (
              <div className="p-4 bg-background border border-dashed border-neutral-300 rounded-md">
                <p className="text-text text-center">No products available</p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto border rounded-md">
                {products
                  .filter(product => !config.featured_product_ids.includes(product.id))
                  .map(product => (
                    <div 
                      key={product.id}
                      className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-background"
                    >
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-background rounded overflow-hidden mr-3">
                          {product.images?.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ShoppingBag size={20} className="text-text" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium">{product.name}</h5>
                          <p className="text-sm text-text">${product.price?.toFixed(2)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => addProductToFeatured(product.id)}
                        className="text-text hover:text-neutral-900 p-1 rounded-full hover:bg-background"
                        title="Add to Featured"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsConfig; 