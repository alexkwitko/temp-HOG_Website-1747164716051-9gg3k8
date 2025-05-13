import React, { useState, useEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase/supabaseClient';

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
  subheading: 'Join our community and transform your life through the art of Brazilian Jiu-Jitsu',
  primary_button_text: 'Get Started',
  primary_button_url: '/contact',
  secondary_button_text: 'Learn More',
  secondary_button_url: '/programs',
  background_color: '#1a1a1a',
  text_color: '#ffffff',
  button_primary_color: '#3b82f6',
  button_primary_text_color: '#ffffff',
  button_secondary_color: 'transparent',
  button_secondary_text_color: '#ffffff',
  background_image_url: null,
  is_active: true
};

const CTAConfig: React.FC = () => {
  const [config, setConfig] = useState<CTAConfigType>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      let imageUrl = config.background_image_url;
      
      // Upload image if it exists
      if (imageFile) {
        const filePath = `cta-backgrounds/${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, imageFile, {
            upsert: true
          });
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }
      
      // Update the config
      const { error } = await supabase
        .from('cta_config')
        .upsert({
          ...config,
          background_image_url: imageUrl
        });
        
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving CTA config:', err);
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
        <h1 className="text-2xl font-bold">CTA Section Configuration</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Content</h2>
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
            <h2 className="text-lg font-medium mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <input
                  type="color"
                  value={config.background_color}
                  onChange={(e) => handleConfigChange('background_color', e.target.value)}
                  className="w-full h-10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={config.text_color}
                  onChange={(e) => handleConfigChange('text_color', e.target.value)}
                  className="w-full h-10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Background Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Background Preview" className="h-20 object-cover rounded" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Primary Button</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input
                  type="text"
                  value={config.primary_button_text}
                  onChange={(e) => handleConfigChange('primary_button_text', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Button URL</label>
                <input
                  type="text"
                  value={config.primary_button_url}
                  onChange={(e) => handleConfigChange('primary_button_url', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Button Color</label>
                <input
                  type="color"
                  value={config.button_primary_color}
                  onChange={(e) => handleConfigChange('button_primary_color', e.target.value)}
                  className="w-full h-10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Button Text Color</label>
                <input
                  type="color"
                  value={config.button_primary_text_color}
                  onChange={(e) => handleConfigChange('button_primary_text_color', e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">Secondary Button</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Button Text</label>
                <input
                  type="text"
                  value={config.secondary_button_text}
                  onChange={(e) => handleConfigChange('secondary_button_text', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Button URL</label>
                <input
                  type="text"
                  value={config.secondary_button_url}
                  onChange={(e) => handleConfigChange('secondary_button_url', e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Button Color</label>
                <input
                  type="color"
                  value={config.button_secondary_color}
                  onChange={(e) => handleConfigChange('button_secondary_color', e.target.value)}
                  className="w-full h-10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Button Text Color</label>
                <input
                  type="color"
                  value={config.button_secondary_text_color}
                  onChange={(e) => handleConfigChange('button_secondary_text_color', e.target.value)}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAConfig; 