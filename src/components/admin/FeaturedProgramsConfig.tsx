import React, { useState, useEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase/supabaseClient';

interface ProgramType {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  image_url: string;
  is_featured: boolean;
  order: number;
}

interface FeaturedProgramsConfigType {
  id: string;
  heading: string;
  subheading: string;
  featured_program_ids: string[];
  created_at?: string;
  updated_at?: string;
}

const DEFAULT_CONFIG: FeaturedProgramsConfigType = {
  id: '00000000-0000-0000-0000-000000000001',
  heading: 'Featured Programs',
  subheading: 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.',
  featured_program_ids: []
};

/**
 * FeaturedProgramsConfig Component
 * 
 * This component configures the CONTENT of the Featured Programs section:
 * - Heading and subheading text
 * - Which programs to display
 * 
 * Note: Container styling (background color, padding, etc.) is managed in the 
 * Home Page Configuration screen. This page only configures the content.
 */
const FeaturedProgramsConfig: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [config, setConfig] = useState<FeaturedProgramsConfigType>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all programs
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select('*')
        .order('title');
      
      if (programsError) throw programsError;
      
      // Fetch featured programs configuration
      const { data: configData, error: configError } = await supabase
        .from('featured_programs_config')
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
      
      setPrograms(programsData || []);
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
        .from('featured_programs_config')
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

  const handleConfigChange = (field: keyof FeaturedProgramsConfigType, value: string | string[]) => {
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
        .from('featured_programs_config')
        .update({
          heading: config.heading,
          subheading: config.subheading,
          featured_program_ids: config.featured_program_ids
        })
        .eq('id', '00000000-0000-0000-0000-000000000001');
      
      if (updateError) {
        console.error('Error updating configuration, trying insert instead:', updateError);
        
        // If update fails, try insert
        const { error: insertError } = await supabase
          .from('featured_programs_config')
          .insert([{
            id: '00000000-0000-0000-0000-000000000001',
            heading: config.heading,
            subheading: config.subheading,
            featured_program_ids: config.featured_program_ids
          }]);
        
        if (insertError) {
          console.error('Error inserting configuration:', insertError);
          
          // Handle specific error codes
          if (insertError.code === '42501') {
            throw new Error('Permission denied: You do not have permission to update featured programs configuration. Please contact an administrator.');
          } else if (insertError.code === 'PGRST301') {
            throw new Error('Row-level security policy violation. Please check your permissions.');
          } else {
            throw new Error(`Database error: ${insertError.message}`);
          }
        }
      }
      
      setSuccessMessage('Featured programs configuration saved successfully!');
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
        <h2 className="text-2xl font-bold mb-4">Featured Programs Configuration</h2>
        <p className="text-text">
          Configure the heading, subheading, and select programs to feature on the homepage.
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

        <div>
          <label className="block text-sm font-medium text-text mb-2">
            Featured Programs
          </label>
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm text-text">
              {config.featured_program_ids.length} program{config.featured_program_ids.length !== 1 ? 's' : ''} selected
            </span>
            {config.featured_program_ids.length > 0 && (
              <button
                onClick={() => handleConfigChange('featured_program_ids', [])}
                className="text-sm text-text hover:text-red-800"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto border border-gray-200 rounded-md p-2">
            {programs.length === 0 ? (
              <div className="p-4 text-center text-text">
                No programs available. Please create programs first.
              </div>
            ) : (
              programs.map((program) => (
                <label key={program.id} className="flex items-start space-x-3 p-3 border border-neutral-200 rounded-md hover:bg-background">
                  <input
                    type="checkbox"
                    checked={config.featured_program_ids.includes(program.id)}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...config.featured_program_ids, program.id]
                        : config.featured_program_ids.filter(id => id !== program.id);
                      handleConfigChange('featured_program_ids', newIds);
                    }}
                    className="mt-1 h-4 w-4 text-text focus:ring-neutral-500 border-neutral-300 rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-text">{program.title}</span>
                      <span className="text-sm text-text">{program.duration} min</span>
                    </div>
                    <p className="text-sm text-text mt-1">{program.description}</p>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background text-text">
                        {program.level}
                      </span>
                    </div>
                  </div>
                </label>
              ))
            )}
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

export default FeaturedProgramsConfig; 