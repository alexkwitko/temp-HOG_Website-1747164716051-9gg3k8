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
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_CONFIG: CTAConfigType = {
  id: '00000000-0000-0000-0000-000000000003',
  heading: 'Start Your Journey Today',
  subheading: 'Join House of Grappling and experience the most effective martial art in the world.',
  primary_button_text: 'Get Started',
  primary_button_url: '/contact',
  secondary_button_text: 'View Schedule',
  secondary_button_url: '/schedule'
};

/**
 * CTAConfig Component
 * 
 * This component configures the CONTENT of the Call to Action section:
 * - Heading and subheading text
 * - Button text and URLs
 * 
 * Note: Container styling (background color, padding, etc.) is managed in the 
 * Home Page Configuration screen. This page only configures the content.
 */
const CTAConfig: React.FC = () => {
  const [config, setConfig] = useState<CTAConfigType>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch CTA configuration
      const { data: configData, error: configError } = await supabase
        .from('cta_config')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000003')
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

  const handleConfigChange = (field: keyof CTAConfigType, value: string) => {
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
        .from('cta_config')
        .update({
          heading: config.heading,
          subheading: config.subheading,
          primary_button_text: config.primary_button_text,
          primary_button_url: config.primary_button_url,
          secondary_button_text: config.secondary_button_text,
          secondary_button_url: config.secondary_button_url
        })
        .eq('id', '00000000-0000-0000-0000-000000000003');
      
      if (updateError) {
        console.error('Error updating configuration, trying insert instead:', updateError);
        
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('cta_config')
          .insert([{
            id: '00000000-0000-0000-0000-000000000003',
            heading: config.heading,
            subheading: config.subheading,
            primary_button_text: config.primary_button_text,
            primary_button_url: config.primary_button_url,
            secondary_button_text: config.secondary_button_text,
            secondary_button_url: config.secondary_button_url
          }]);
        
        if (insertError) {
          throw new Error(`Database error: ${insertError.message}`);
        }
      }
      
      setSuccessMessage('Call to Action configuration saved successfully!');
    } catch (err) {
      console.error('Error saving configuration:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Call to Action Configuration</h2>
        <p className="text-text">
          Configure the heading, subheading, and buttons for the Call to Action section on the homepage.
        </p>
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

      <div className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Button Config */}
          <div className="p-4 border border-neutral-200 rounded-lg space-y-4">
            <h3 className="font-medium">Primary Button</h3>
            
            <div>
              <label htmlFor="primary_button_text" className="block text-sm font-medium text-text mb-1">
                Button Text
              </label>
              <input
                type="text"
                id="primary_button_text"
                value={config.primary_button_text}
                onChange={(e) => handleConfigChange('primary_button_text', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="e.g., Get Started"
              />
            </div>
            
            <div>
              <label htmlFor="primary_button_url" className="block text-sm font-medium text-text mb-1">
                Button URL
              </label>
              <input
                type="text"
                id="primary_button_url"
                value={config.primary_button_url}
                onChange={(e) => handleConfigChange('primary_button_url', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="e.g., /contact"
              />
            </div>
            
            <div className="pt-2">
              <div className="bg-background rounded-md p-3 inline-block">
                <div className="bg-background hover:bg-neutral-200 text-text font-bold py-2 px-4 rounded-md inline-flex items-center">
                  {config.primary_button_text || 'Button Text'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Secondary Button Config */}
          <div className="p-4 border border-neutral-200 rounded-lg space-y-4">
            <h3 className="font-medium">Secondary Button</h3>
            
            <div>
              <label htmlFor="secondary_button_text" className="block text-sm font-medium text-text mb-1">
                Button Text
              </label>
              <input
                type="text"
                id="secondary_button_text"
                value={config.secondary_button_text}
                onChange={(e) => handleConfigChange('secondary_button_text', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="e.g., View Schedule"
              />
            </div>
            
            <div>
              <label htmlFor="secondary_button_url" className="block text-sm font-medium text-text mb-1">
                Button URL
              </label>
              <input
                type="text"
                id="secondary_button_url"
                value={config.secondary_button_url}
                onChange={(e) => handleConfigChange('secondary_button_url', e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                placeholder="e.g., /schedule"
              />
            </div>
            
            <div className="pt-2">
              <div className="bg-background rounded-md p-3 inline-block">
                <div className="bg-background hover:bg-neutral-700 text-text font-bold py-2 px-4 rounded-md inline-flex items-center">
                  {config.secondary_button_text || 'Button Text'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
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
      </div>
    </div>
  );
};

export default CTAConfig; 