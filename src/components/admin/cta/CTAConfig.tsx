import React, { useState, useEffect, useCallback } from 'react';
import { Save, UploadCloud } from 'lucide-react';
import { supabase } from '../../../lib/supabase/supabaseClient';
import { useSiteSettings } from '../../../contexts/SiteSettingsContext';

interface CTAConfigType {
  id: string;
  heading: string;
  subheading: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  background_color: string;
  text_color: string;
  button_primary_color: string;
  button_primary_text_color: string;
  button_secondary_color: string;
  button_secondary_text_color: string;
  background_image_url: string | null;
  is_active: boolean;
}

const DEFAULT_CONFIG: CTAConfigType = {
  id: '00000000-0000-0000-0000-000000000001',
  heading: 'Start Your Journey Today',
  subheading: 'Join House of Grappling and experience the most effective martial art in the world.',
  primary_button_text: 'Get Started',
  primary_button_url: '/contact',
  secondary_button_text: 'View Schedule',
  secondary_button_url: '/schedule',
  background_color: '#1A1A1A',
  text_color: 'var(--color-background)',
  button_primary_color: 'var(--color-background)',
  button_primary_text_color: '#1A1A1A',
  button_secondary_color: 'var(--color-secondary)',
  button_secondary_text_color: 'var(--color-background)',
  background_image_url: null,
  is_active: true
};

const CTAConfig: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [config, setConfig] = useState<CTAConfigType>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const createDefaultConfig = async () => {
      try {
        const { error } = await supabase
          .from('cta_config')
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
      // Fetch CTA configuration
      const { data, error } = await supabase
        .from('cta_config')
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
        if (data.background_image_url) {
          setImagePreview(data.background_image_url);
        }
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

  const handleConfigChange = (field: keyof CTAConfigType, value: string | boolean | null) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (loadEvent) => {
        if (loadEvent.target && loadEvent.target.result) {
          setImagePreview(loadEvent.target.result.toString());
        }
      };
      
      reader.readAsDataURL(file);
      setBackgroundImage(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!backgroundImage) return config.background_image_url;
    
    try {
      // Generate a unique filename
      const fileExt = backgroundImage.name.split('.').pop();
      const fileName = `${Date.now()}-cta-bg.${fileExt}`;
      const filePath = `site-images/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(filePath, backgroundImage, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (err) {
      console.error('Error in uploadImage:', err);
      throw err;
    }
  };

  const removeImage = () => {
    setBackgroundImage(null);
    setImagePreview(null);
    setConfig(prev => ({
      ...prev,
      background_image_url: null
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    setUploadProgress(0);
    
    try {
      // Upload image if there's a new one
      let imageUrl = config.background_image_url;
      if (backgroundImage) {
        imageUrl = await uploadImage();
      }
      
      // First try update
      const { error: updateError } = await supabase
        .from('cta_config')
        .update({
          ...config,
          background_image_url: imageUrl
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');
      
      if (updateError) {
        console.error('Error updating configuration, trying insert instead:', updateError);
        
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('cta_config')
          .insert([{
            ...config,
            id: '00000000-0000-0000-0000-000000000001',
            background_image_url: imageUrl
          }]);
        
        if (insertError) {
          console.error('Error inserting configuration:', insertError);
          throw insertError;
        }
      }
      
      // Update local state with the new image URL
      setConfig(prev => ({
        ...prev,
        background_image_url: imageUrl
      }));
      
      setSuccessMessage('Call to Action configuration saved successfully!');
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
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
          <h2 className="text-2xl font-bold mb-2">Call to Action Configuration</h2>
          <p className="text-text">
            Customize the Call to Action section displayed on the homepage.
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

      <div className="bg-white border rounded-lg p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Content Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Content</h3>
            
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Heading
              </label>
              <input
                type="text"
                value={config.heading}
                onChange={(e) => handleConfigChange('heading', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="e.g., Start Your Journey Today"
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
                placeholder="Brief engaging message"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Button */}
              <div className="space-y-4">
                <h4 className="font-medium">Primary Button</h4>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={config.primary_button_text}
                    onChange={(e) => handleConfigChange('primary_button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    placeholder="e.g., Get Started"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Button URL
                  </label>
                  <input
                    type="text"
                    value={config.primary_button_url}
                    onChange={(e) => handleConfigChange('primary_button_url', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    placeholder="e.g., /contact"
                  />
                </div>
              </div>
              
              {/* Secondary Button */}
              <div className="space-y-4">
                <h4 className="font-medium">Secondary Button</h4>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={config.secondary_button_text}
                    onChange={(e) => handleConfigChange('secondary_button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    placeholder="e.g., Learn More"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Button URL
                  </label>
                  <input
                    type="text"
                    value={config.secondary_button_url}
                    onChange={(e) => handleConfigChange('secondary_button_url', e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    placeholder="e.g., /about"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.is_active}
                  onChange={(e) => handleConfigChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-text focus:ring-neutral-500 border-neutral-300 rounded"
                />
                <span className="ml-2 text-sm text-text">Display this section</span>
              </label>
            </div>
          </div>
          
          {/* Right Column - Style Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Appearance</h3>
            
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                Background Image
              </label>
              <div className="mb-3">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg p-4 bg-background hover:bg-neutral-100 transition-colors">
                  <input
                    type="file"
                    id="background-image"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Background Preview" 
                        className="h-40 w-full object-cover rounded mb-2"
                      />
                      <button
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-background text-white p-1 rounded-full"
                        title="Remove Image"
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="background-image" className="cursor-pointer p-4 flex flex-col items-center">
                      <UploadCloud size={32} className="text-text mb-2" />
                      <span className="text-sm text-text">Click to upload a background image</span>
                      <span className="text-xs text-text mt-1">(Optional)</span>
                    </label>
                  )}
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-background rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-background h-2.5 rounded-full" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Primary Button Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.button_primary_color}
                    onChange={(e) => handleConfigChange('button_primary_color', e.target.value)}
                    className="w-10 h-10 rounded mr-2"
                  />
                  <input
                    type="text"
                    value={config.button_primary_color}
                    onChange={(e) => handleConfigChange('button_primary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Primary Button Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.button_primary_text_color}
                    onChange={(e) => handleConfigChange('button_primary_text_color', e.target.value)}
                    className="w-10 h-10 rounded mr-2"
                  />
                  <input
                    type="text"
                    value={config.button_primary_text_color}
                    onChange={(e) => handleConfigChange('button_primary_text_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Secondary Button Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.button_secondary_color}
                    onChange={(e) => handleConfigChange('button_secondary_color', e.target.value)}
                    className="w-10 h-10 rounded mr-2"
                  />
                  <input
                    type="text"
                    value={config.button_secondary_color}
                    onChange={(e) => handleConfigChange('button_secondary_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-1">
                  Secondary Button Text Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={config.button_secondary_text_color}
                    onChange={(e) => handleConfigChange('button_secondary_text_color', e.target.value)}
                    className="w-10 h-10 rounded mr-2"
                  />
                  <input
                    type="text"
                    value={config.button_secondary_text_color}
                    onChange={(e) => handleConfigChange('button_secondary_text_color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Preview Section */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Preview</h3>
          <div 
            className="rounded-lg overflow-hidden p-8 text-center"
            style={{ 
              backgroundColor: config.background_color,
              color: config.text_color,
              backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}
          >
            {/* Overlay if background image is present */}
            {imagePreview && (
              <div 
                className="absolute inset-0 z-0"
                style={{ backgroundColor: `${config.background_color}80` }} // 80 = 50% opacity
              ></div>
            )}
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2" style={{ color: config.text_color }}>
                {config.heading}
              </h2>
              <p className="max-w-2xl mx-auto mb-6" style={{ color: config.text_color }}>
                {config.subheading}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  className="px-6 py-2 rounded-md font-medium"
                  style={{ 
                    backgroundColor: config.button_primary_color,
                    color: config.button_primary_text_color
                  }}
                >
                  {config.primary_button_text}
                </button>
                <button 
                  className="px-6 py-2 rounded-md font-medium"
                  style={{ 
                    backgroundColor: config.button_secondary_color,
                    color: config.button_secondary_text_color
                  }}
                >
                  {config.secondary_button_text}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAConfig; 