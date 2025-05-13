import React, { useState, useEffect, useCallback } from 'react';
import { Save, Eye, EyeOff, Tag, ExternalLink, ShoppingBag, Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase/supabaseClient';
import ComponentPreview from './home/ComponentPreview';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

// Updated interface to match new database schema
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_featured: boolean;
  category?: string;
  order?: number;
}

interface FeaturedProductsConfigType {
  id: string;
  heading: string;
  subheading: string;
  featured_product_ids: string[];
  background_color: string;
  text_color: string; 
  button_text: string;
  button_url: string;
  button_bg_color: string;
  button_text_color: string;
  button_hover_color: string;
  button_alignment: string;
  columns_layout: string;
  enable_special_promotion: boolean;
  promoted_product_id: string | null;
  promotion_badge_text: string;
  promotion_badge_color: string;
  promotion_badge_text_color: string;
  show_preview: boolean;
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_CONFIG: FeaturedProductsConfigType = {
  id: '00000000-0000-0000-0000-000000000002',
  heading: 'Featured Products',
  subheading: 'Premium gear designed for serious practitioners. Quality you can trust.',
  featured_product_ids: [],
  background_color: '#ffffff',
  text_color: 'var(--color-secondary)',
  button_text: 'View Product',
  button_url: '/shop',
  button_bg_color: 'var(--color-text)',
  button_text_color: '#ffffff',
  button_hover_color: '#222222',
  button_alignment: 'center',
  columns_layout: '3',
  enable_special_promotion: false,
  promoted_product_id: null,
  promotion_badge_text: 'Featured',
  promotion_badge_color: '#ff0000',
  promotion_badge_text_color: '#ffffff',
  show_preview: true
};

/**
 * FeaturedProductsConfig Component
 * 
 * This component configures the Featured Products section:
 * - Heading and subheading text
 * - Which products to display
 * - Layout and styling options
 * - Special promotion settings
 * - Preview functionality
 */
const FeaturedProductsConfig: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<FeaturedProductsConfigType>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(Date.now());
  const [showPreview, setShowPreview] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch products from database
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw new Error(`Failed to fetch products: ${productsError.message}`);
      }
      
      if (productsData) {
        setDbProducts(productsData);
      }
      
      // Fetch featured products configuration
      const { data: configData, error: configError } = await supabase
        .from('featured_products_config')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000002')
        .single();
      
      if (configError) {
        if (configError.code === 'PGRST116' || configError.code === 'PGRST104') { 
          // PGRST116 is "no rows returned"
          // PGRST104 is "not acceptable"
          console.log('No configuration found, using default');
          // Try to create the default config
          await createDefaultConfig();
          setConfig(DEFAULT_CONFIG);
        } else {
          throw configError;
        }
      } else if (configData) {
        // Merge with default config to ensure all fields have values even if not in DB yet
        setConfig({
          ...DEFAULT_CONFIG,
          ...configData
        });
        setShowPreview(configData.show_preview !== false);
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

  const handleConfigChange = (field: keyof FeaturedProductsConfigType, value: string | string[] | boolean | null) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update preview immediately when config changes
    setPreviewKey(Date.now());
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
          ...config,
          show_preview: showPreview
        })
        .eq('id', '00000000-0000-0000-0000-000000000002');
      
      if (updateError) {
        console.error('Error updating configuration, trying insert instead:', updateError);
        
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('featured_products_config')
          .insert([{
            ...DEFAULT_CONFIG,
            ...config,
            show_preview: showPreview
          }]);
        
        if (insertError) {
          throw new Error(`Database error: ${insertError.message}`);
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

  const togglePreview = () => {
    const newShowPreview = !showPreview;
    setShowPreview(newShowPreview);
    // Update previewKey when toggling preview
    if (newShowPreview) {
      setPreviewKey(Date.now());
    }
  };

  // Filter products based on search term
  const filteredProducts = dbProducts.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSelectedFilter = !showSelectedOnly || config.featured_product_ids.includes(product.id);
    
    return matchesSearch && matchesSelectedFilter;
  });

  // Sort products to show selected ones first
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aIsSelected = config.featured_product_ids.includes(a.id);
    const bIsSelected = config.featured_product_ids.includes(b.id);
    
    if (aIsSelected && !bIsSelected) return -1;
    if (!aIsSelected && bIsSelected) return 1;
    return 0;
  });

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
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Featured Products Configuration</h2>
            <p className="text-text">
              Configure the heading, subheading, layout, and select products to feature on the homepage.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={togglePreview}
              className="bg-background hover:bg-purple-700 text-white px-4 py-2 rounded flex items-center"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded flex items-center"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
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

      {showPreview && (
        <div className="mb-6 border rounded-lg p-4 bg-background">
          <h3 className="text-xl font-semibold mb-4">Component Preview</h3>
          <div className="bg-white rounded-lg shadow">
            <ComponentPreview 
              components={[
                { 
                  id: 'featured_products', 
                  is_active: true, 
                  order: 5,
                  name: 'Featured Products',
                  background_color: config.background_color,
                  text_color: config.text_color,
                  border_color: 'transparent',
                  border_width: 0,
                  border_radius: 0,
                  padding: '1rem',
                  margin: '0'
                }
              ]}
              globalPaletteId="default"
              componentPaletteOverrides={{}}
              singleComponentId="featured_products"
              triggerRefresh={previewKey}
            />
          </div>
          
          {config.featured_product_ids.length === 0 && (
            <div className="mt-3 p-3 bg-background border border-yellow-200 text-text rounded-md">
              <p className="text-sm font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                No products selected
              </p>
              <p className="text-sm mt-1 ml-7">Select products below to see them in the preview.</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-4">Section Content</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="heading" className="block text-sm font-medium text-text mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  id="heading"
                  value={config.heading}
                  onChange={(e) => handleConfigChange('heading', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label htmlFor="subheading" className="block text-sm font-medium text-text mb-1">
                  Subheading
                </label>
                <textarea
                  id="subheading"
                  value={config.subheading}
                  onChange={(e) => handleConfigChange('subheading', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">Card Columns Layout</label>
                <div className="flex gap-2">
                  {['1', '2', '3', '4'].map((cols) => (
                    <button
                      key={cols}
                      onClick={() => handleConfigChange('columns_layout', cols)}
                      className={`flex-1 p-2 border rounded ${
                        config.columns_layout === cols 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {cols} {parseInt(cols) === 1 ? 'Column' : 'Columns'}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-text mt-1">
                  Choose how many columns to display your products in.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-medium mb-4">Styling Options</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.background_color}
                      onChange={(e) => handleConfigChange('background_color', e.target.value)}
                      className="p-1 border rounded h-10 w-10"
                    />
                    <input
                      type="text"
                      value={config.background_color}
                      onChange={(e) => handleConfigChange('background_color', e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.text_color}
                      onChange={(e) => handleConfigChange('text_color', e.target.value)}
                      className="p-1 border rounded h-10 w-10"
                    />
                    <input
                      type="text"
                      value={config.text_color}
                      onChange={(e) => handleConfigChange('text_color', e.target.value)}
                      className="flex-1 p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Button Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={config.button_text}
                      onChange={(e) => handleConfigChange('button_text', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Button URL
                    </label>
                    <input
                      type="text"
                      value={config.button_url}
                      onChange={(e) => handleConfigChange('button_url', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Button Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.button_bg_color}
                        onChange={(e) => handleConfigChange('button_bg_color', e.target.value)}
                        className="p-1 border rounded h-8 w-8"
                      />
                      <input
                        type="text"
                        value={config.button_bg_color}
                        onChange={(e) => handleConfigChange('button_bg_color', e.target.value)}
                        className="flex-1 p-2 border rounded text-xs"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.button_text_color}
                        onChange={(e) => handleConfigChange('button_text_color', e.target.value)}
                        className="p-1 border rounded h-8 w-8"
                      />
                      <input
                        type="text"
                        value={config.button_text_color}
                        onChange={(e) => handleConfigChange('button_text_color', e.target.value)}
                        className="flex-1 p-2 border rounded text-xs"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">
                      Hover Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={config.button_hover_color}
                        onChange={(e) => handleConfigChange('button_hover_color', e.target.value)}
                        className="p-1 border rounded h-8 w-8"
                      />
                      <input
                        type="text"
                        value={config.button_hover_color}
                        onChange={(e) => handleConfigChange('button_hover_color', e.target.value)}
                        className="flex-1 p-2 border rounded text-xs"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Button Alignment
                  </label>
                  <select
                    value={config.button_alignment}
                    onChange={(e) => handleConfigChange('button_alignment', e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              <h3 className="text-lg font-medium">Special Promotion</h3>
              <div className="ml-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.enable_special_promotion}
                    onChange={(e) => handleConfigChange('enable_special_promotion', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-text transition duration-150 ease-in-out"
                  />
                  <span className="ml-2 text-sm text-text">Enable</span>
                </label>
              </div>
            </div>
            
            <div className={`space-y-4 ${!config.enable_special_promotion && 'opacity-50 pointer-events-none'}`}>
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Promoted Product
                </label>
                <select
                  value={config.promoted_product_id || ''}
                  onChange={(e) => handleConfigChange('promoted_product_id', e.target.value || null)}
                  className="w-full p-2 border rounded"
                  disabled={!config.enable_special_promotion}
                >
                  <option value="">Select a product</option>
                  {dbProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-text mt-1">
                  This product will appear with a special badge and potentially larger display.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Promotion Badge Text
                </label>
                <input
                  type="text"
                  value={config.promotion_badge_text}
                  onChange={(e) => handleConfigChange('promotion_badge_text', e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={!config.enable_special_promotion}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Badge Background Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.promotion_badge_color}
                      onChange={(e) => handleConfigChange('promotion_badge_color', e.target.value)}
                      className="p-1 border rounded h-10 w-10"
                      disabled={!config.enable_special_promotion}
                    />
                    <input
                      type="text"
                      value={config.promotion_badge_color}
                      onChange={(e) => handleConfigChange('promotion_badge_color', e.target.value)}
                      className="flex-1 p-2 border rounded"
                      disabled={!config.enable_special_promotion}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Badge Text Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={config.promotion_badge_text_color}
                      onChange={(e) => handleConfigChange('promotion_badge_text_color', e.target.value)}
                      className="p-1 border rounded h-10 w-10"
                      disabled={!config.enable_special_promotion}
                    />
                    <input
                      type="text"
                      value={config.promotion_badge_text_color}
                      onChange={(e) => handleConfigChange('promotion_badge_text_color', e.target.value)}
                      className="flex-1 p-2 border rounded"
                      disabled={!config.enable_special_promotion}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border p-3 rounded bg-background">
                <div className="flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-text" />
                  <span className="text-sm font-medium">Badge Preview</span>
                </div>
                <div className="mt-2 flex justify-center">
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: config.promotion_badge_color,
                      color: config.promotion_badge_text_color
                    }}
                  >
                    {config.promotion_badge_text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Featured Products</h3>
              <span className="text-sm text-text">
                {config.featured_product_ids.length} product{config.featured_product_ids.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            {dbProducts.length === 0 ? (
              <div className="p-6 text-center bg-background rounded border border-gray-200">
                <ShoppingBag className="h-12 w-12 mx-auto text-text mb-3" />
                <h4 className="font-medium text-lg mb-1">No Products Available</h4>
                <p className="text-text mb-4">You need to create products before you can feature them.</p>
                <a 
                  href="/admin/products/new" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-background hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Create a Product
                </a>
              </div>
            ) : (
              <>
                {/* Search and filters */}
                <div className="mb-4 space-y-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Search className="h-5 w-5 text-text" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products by name or description..."
                      className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-text hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center">
                    <div className="flex items-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={showSelectedOnly}
                          onChange={(e) => setShowSelectedOnly(e.target.checked)}
                          className="form-checkbox h-4 w-4 text-text transition duration-150 ease-in-out"
                        />
                        <span className="ml-2 text-sm text-text">Show selected only</span>
                      </label>
                    </div>
                    
                    {config.featured_product_ids.length > 0 && (
                      <button
                        onClick={() => handleConfigChange('featured_product_ids', [])}
                        className="text-sm text-text hover:text-red-800"
                      >
                        Clear all selections
                      </button>
                    )}
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-6 text-center bg-background rounded border border-gray-200">
                    <p className="text-text">No products match your search criteria.</p>
                  </div>
                ) : (
                  <div className="max-h-[800px] overflow-y-auto border border-gray-200 rounded-md p-2">
                    <div className="space-y-2">
                      {sortedProducts.map((product) => (
                        <label key={product.id} className="flex items-start space-x-3 p-3 border border-neutral-200 rounded-md hover:bg-background">
                          <input
                            type="checkbox"
                            checked={config.featured_product_ids.includes(product.id)}
                            onChange={(e) => {
                              const newIds = e.target.checked
                                ? [...config.featured_product_ids, product.id]
                                : config.featured_product_ids.filter(id => id !== product.id);
                              handleConfigChange('featured_product_ids', newIds);
                            }}
                            className="mt-1 h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="font-medium text-text">{product.name}</span>
                                {product.is_featured && (
                                  <span className="ml-2 bg-background text-text text-xs px-2 py-0.5 rounded-full">
                                    Featured
                                  </span>
                                )}
                                {config.promoted_product_id === product.id && (
                                  <span className="ml-2 bg-background text-text text-xs px-2 py-0.5 rounded-full">
                                    Promoted
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-text">${product.price.toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-text mt-1">{product.description}</p>
                            {product.image_url && (
                              <div className="mt-2 flex items-center">
                                <img 
                                  src={product.image_url} 
                                  alt={product.name} 
                                  className="h-16 w-16 object-cover rounded"
                                />
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredProducts.length > 0 && dbProducts.length > 10 && (
                  <div className="flex justify-between items-center mt-2 text-xs text-text">
                    <span>
                      Showing {filteredProducts.length} of {dbProducts.length} products
                    </span>
                    {searchTerm && (
                      <span>
                        Search results for: <span className="font-medium">"{searchTerm}"</span>
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded flex items-center"
        >
          {saving ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FeaturedProductsConfig; 