import React, { useState, useEffect, useCallback } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';
import { supabaseAdmin } from '../../lib/supabase/supabaseAdmin';

// Add interface for global button styles
interface GlobalButtonStyles {
  enabled: boolean;
  fixed_width: boolean;
  width: string;
  height: string;
  text_color: string;
  bg_color: string;
  hover_color: string;
  hover_text_color: string;
  padding_x: string;
  padding_y: string;
  font_weight: string;
  border_radius: string;
  border_width: string;
  border_color: string;
  transition_speed: string;
  
  // Secondary button specific styles
  secondary_text_color: string;
  secondary_bg_color: string;
  secondary_hover_color: string;
  secondary_hover_text_color: string;
  secondary_width: string;
  secondary_height: string;
  secondary_border_radius: string;
  secondary_border_width: string;
  secondary_border_color: string;
  secondary_style: 'solid' | 'outline' | 'ghost';
}

interface TextBackgroundSettings {
  enabled: boolean;
  color: string;
  opacity: number;
  size: string; // 'sm', 'md', 'lg', 'full'
  padding: string;
}

interface TextPosition {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
}

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  text_color?: string;
  image_url?: string;
  image_id?: string | undefined;
  image_opacity?: number;
  text_background?: TextBackgroundSettings;
  text_position?: TextPosition;
  button_text?: string;
  button_url?: string;
  button_active?: boolean;
  button_bg?: string;
  button_text_color?: string;
  button_hover?: string;
  button_padding_x?: string;
  button_padding_y?: string;
  button_font?: string;
  button_mobile_width?: string;
  button_desktop_width?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  secondary_button_active?: boolean;
  secondary_button_bg?: string;
  secondary_button_text_color?: string;
  secondary_button_hover?: string;
  secondary_button_padding_x?: string;
  secondary_button_padding_y?: string;
  secondary_button_font?: string;
  secondary_button_mobile_width?: string;
  secondary_button_desktop_width?: string;
  order: number;
  is_active?: boolean;
  created_at: string;
}

const DEFAULT_TEXT_BACKGROUND_SETTINGS: TextBackgroundSettings = {
  enabled: false,
  color: 'rgba(0,0,0,0.7)',
  opacity: 70,
  size: 'md',
  padding: '16px'
};

const DEFAULT_TEXT_POSITION: TextPosition = {
  horizontal: 'center',
  vertical: 'center'
};

// Add a type for basic slide data
type SlideDataBase = {
  title: string;
  subtitle: string;
  description?: string;
  text_color?: string;
  image_url?: string | null;
  image_id?: string | null;
  image_opacity?: number;
  text_background?: TextBackgroundSettings;
  order: number;
  is_active: boolean;
};

// Extended slide data type with all optional fields
type SlideDataExtended = SlideDataBase & {
  text_position?: TextPosition;
  button_active?: boolean;
  button_text?: string;
  button_url?: string;
  button_bg?: string;
  button_text_color?: string;
  button_hover?: string;
  button_padding_x?: string;
  button_padding_y?: string;
  button_font?: string;
  button_mobile_width?: string;
  button_desktop_width?: string;
  secondary_button_active?: boolean;
  secondary_button_text?: string;
  secondary_button_url?: string;
  secondary_button_bg?: string;
  secondary_button_text_color?: string;
  secondary_button_hover?: string;
  secondary_button_padding_x?: string;
  secondary_button_padding_y?: string;
  secondary_button_font?: string;
  secondary_button_mobile_width?: string;
  secondary_button_desktop_width?: string;
};

const HeroConfigPage: React.FC = () => {
  // const { settings } = useSiteSettings(); // Removed as unused
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Record<string, 'content' | 'primary' | 'secondary' | 'background'>>({});
  
  // Global settings toggle at the HeroConfigPage level
  const [useGlobalSettings, setUseGlobalSettings] = useState(true);
  
  // Store global button settings loaded from settings table
  const [globalButtonSettings, setGlobalButtonSettings] = useState<{
    isLoading: boolean;
    settings: GlobalButtonStyles 
  }>({
    isLoading: true,
    settings: {
      enabled: false,
      fixed_width: localStorage.getItem('fixed_width_buttons') === 'true',
      width: '180px',
      height: '48px',
      text_color: 'var(--color-background)',
      bg_color: 'var(--color-text)',
      hover_color: 'var(--color-secondary)',
      hover_text_color: 'var(--color-background)',
      padding_x: '1.5rem',
      padding_y: '0.75rem',
      font_weight: '500',
      border_radius: '0.25rem',
      border_width: '0px',
      border_color: 'transparent',
      transition_speed: '300ms',
      secondary_text_color: 'var(--color-background)',
      secondary_bg_color: 'rgba(0,0,0,0.5)',
      secondary_hover_color: 'rgba(0,0,0,0.7)',
      secondary_hover_text_color: 'var(--color-background)',
      secondary_width: '180px',
      secondary_height: '48px',
      secondary_border_radius: '0.25rem',
      secondary_border_width: '1px',
      secondary_border_color: 'var(--color-background)',
      secondary_style: 'outline'
    }
  });
  
  // Store per-slide overrides for using global settings
  const [slideOverrides, setSlideOverrides] = useState<Record<string, boolean>>({});
  
  // Add function to create hero_config table if it doesn't exist
  const ensureHeroConfigTable = async () => {
    try {
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.hero_config (
            id TEXT PRIMARY KEY,
            text_background_settings JSONB DEFAULT '{"enabled": false, "color": "rgba(0,0,0,0.7)", "opacity": 70}'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Insert default row if it doesn't exist
          INSERT INTO public.hero_config (id)
          VALUES ('00000000-0000-0000-0000-000000000001')
          ON CONFLICT (id) DO NOTHING;
        `
      });
      
      if (error) {
        console.error('Error ensuring hero_config table:', error);
      }
    } catch (err) {
      console.error('Error in ensureHeroConfigTable:', err);
    }
  };
  
  // Add function to fetch global button settings from site_settings table
  const fetchGlobalButtonSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('button_settings_json')
        .eq('key', 'button_settings')
        .single();
        
      if (error) {
        console.error("Error fetching global button settings:", error);
        return;
      }
      
      // Get fixed_width from localStorage instead of the database
      const isFixedWidth = localStorage.getItem('fixed_width_buttons') === 'true';
      
      if (data?.button_settings_json) {
        setGlobalButtonSettings({
          isLoading: false,
          settings: {
            enabled: data.button_settings_json.enabled || false,
            fixed_width: isFixedWidth, // Use localStorage value
            width: data.button_settings_json.width || '180px',
            height: data.button_settings_json.height || '48px',
            text_color: data.button_settings_json.text_color || 'var(--color-background)',
            bg_color: data.button_settings_json.bg_color || 'var(--color-text)',
            hover_color: data.button_settings_json.hover_color || 'var(--color-secondary)', 
            hover_text_color: data.button_settings_json.hover_text_color || 'var(--color-background)',
            padding_x: data.button_settings_json.padding_x || '1.5rem',
            padding_y: data.button_settings_json.padding_y || '0.75rem',
            font_weight: data.button_settings_json.font_weight || '500',
            border_radius: data.button_settings_json.border_radius || '0.25rem',
            border_width: data.button_settings_json.border_width || '0px',
            border_color: data.button_settings_json.border_color || 'transparent',
            transition_speed: data.button_settings_json.transition_speed || '300ms',
            secondary_text_color: data.button_settings_json.secondary_text_color || 'var(--color-background)',
            secondary_bg_color: data.button_settings_json.secondary_bg_color || 'rgba(0,0,0,0.5)',
            secondary_hover_color: data.button_settings_json.secondary_hover_color || 'rgba(0,0,0,0.7)',
            secondary_hover_text_color: data.button_settings_json.secondary_hover_text_color || 'var(--color-background)',
            secondary_width: data.button_settings_json.secondary_width || '180px',
            secondary_height: data.button_settings_json.secondary_height || '48px',
            secondary_border_radius: data.button_settings_json.secondary_border_radius || '0.25rem',
            secondary_border_width: data.button_settings_json.secondary_border_width || '1px',
            secondary_border_color: data.button_settings_json.secondary_border_color || 'var(--color-background)',
            secondary_style: data.button_settings_json.secondary_style || 'outline'
          }
        });
      }
    } catch (err) {
      console.error("Error in fetchGlobalButtonSettings:", err);
    }
  };
  
  // Memoize fetchHeroSlides with useCallback
  const fetchHeroSlides = useCallback(async () => {
    setError(null);
    
    try {
      await ensureHeroConfigTable();
      
      const { data, error } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order');
      
      if (error) throw error;
      
      // Also fetch global button settings
      await fetchGlobalButtonSettings();
      
      // Initialize slideOverrides - default to using global settings (if enabled)
      const overrides: Record<string, boolean> = {};
      (data || []).forEach(slide => {
        // Default to not using overrides
        overrides[slide.id] = false;
      });
      setSlideOverrides(overrides);
      
      // Add image_url field if it doesn't exist
      const slidesWithImageUrl = await Promise.all((data || []).map(async (slide) => {
        // If image_url is already set, return as is
        if (slide.image_url) return slide;
        
        // If we have an image_id but no image_url, fetch the image URL
        if (slide.image_id) {
          const { data: imageData } = await supabase
            .from('images')
            .select('url')
            .eq('id', slide.image_id)
            .single();
          
          if (imageData) {
            return { ...slide, image_url: imageData.url };
          }
        }
        
        // Ensure each slide has a text_background property
        if (!slide.text_background) {
          slide.text_background = DEFAULT_TEXT_BACKGROUND_SETTINGS;
        }
        
        // Ensure each slide has a text_position property
        if (!slide.text_position) {
          slide.text_position = DEFAULT_TEXT_POSITION;
        }
        
        // Ensure image_opacity has a default value
        if (slide.image_opacity === undefined) {
          slide.image_opacity = 100;
        }
        
        // Ensure button_active flags have default values
        if (slide.button_active === undefined) {
          slide.button_active = true;
        }
        
        if (slide.secondary_button_active === undefined) {
          slide.secondary_button_active = true;
        }
        
        return slide;
      }));
      
      setSlides(slidesWithImageUrl);
    } catch (err) {
      console.error('Error fetching hero slides:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }, []);  // No dependencies since this doesn't depend on any props or state directly

  useEffect(() => {
    fetchHeroSlides();
  }, [fetchHeroSlides]);

  const handleSlideChange = (slideId: string, field: keyof HeroSlide, value: string | number | boolean | null | TextBackgroundSettings) => {
    setSlides(
      slides.map(slide => 
        slide.id === slideId ? { ...slide, [field]: value } : slide
      )
    );
  };

  // Add function to update text background settings for a specific slide
  const updateTextBackgroundSettings = (slideId: string, field: keyof TextBackgroundSettings, value: boolean | string | number) => {
    setSlides(
      slides.map(slide => {
        if (slide.id !== slideId) return slide;
        
        const currentSettings = slide.text_background || { ...DEFAULT_TEXT_BACKGROUND_SETTINGS };
        const updatedSettings = {
          ...currentSettings,
          [field]: value
        };
        
        // Update opacity in color if changing opacity
        if (field === 'opacity' && currentSettings.color.startsWith('rgba')) {
          const rgbaMatch = currentSettings.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
          if (rgbaMatch) {
            const [, r, g, b] = rgbaMatch;
            updatedSettings.color = `rgba(${r},${g},${b},${value as number/100})`;
          }
        }
        
        return {
          ...slide,
          text_background: updatedSettings
        };
      })
    );
  };

  const addNewSlide = () => {
    const newSlide: HeroSlide = {
      id: `temp-${Date.now()}`, // Will be replaced with a real ID after saving
      title: 'New Slide',
      subtitle: 'Add your subtitle here',
      image_url: '',
      button_text: 'Learn More',
      button_url: '/',
      button_active: true,
      secondary_button_active: false,
      text_background: DEFAULT_TEXT_BACKGROUND_SETTINGS,
      text_position: DEFAULT_TEXT_POSITION,
      order: slides.length + 1,
      is_active: true,
      created_at: new Date().toISOString()
    };
    
    setSlides([...slides, newSlide]);
  };

  const removeSlide = async (slideId: string) => {
    try {
      // First, check if this is a temporary slide
      if (slideId.startsWith('temp-')) {
        // Just remove from local state
        setSlides(slides.filter(slide => slide.id !== slideId));
        return;
      }
      
      // If not temporary, delete from database
      console.log('Deleting slide from database:', slideId);
      
      // Get the slide to check for images
      const slide = slides.find(s => s.id === slideId);
      if (!slide) return;
      
      // Delete the slide from the database
      const { error } = await supabase
        .from('hero_slides')
        .delete()
        .eq('id', slideId);
      
      if (error) {
        console.error('Error deleting slide:', error);
        setError(`Failed to delete slide: ${error.message}`);
        return;
      }
      
      // Remove from local state
      setSlides(slides.filter(slide => slide.id !== slideId));
      setSuccessMessage('Slide deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error during slide deletion:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const reorderSlides = (slideId: string, direction: 'up' | 'down') => {
    const slideIndex = slides.findIndex(slide => slide.id === slideId);
    if (slideIndex === -1) return;
    
    const newSlides = [...slides];
    
    if (direction === 'up' && slideIndex > 0) {
      // Swap with the previous slide
      [newSlides[slideIndex - 1], newSlides[slideIndex]] = [newSlides[slideIndex], newSlides[slideIndex - 1]];
    } else if (direction === 'down' && slideIndex < slides.length - 1) {
      // Swap with the next slide
      [newSlides[slideIndex], newSlides[slideIndex + 1]] = [newSlides[slideIndex + 1], newSlides[slideIndex]];
    }
    
    // Update order values
    const updatedSlides = newSlides.map((slide, index) => ({
      ...slide,
      order: index + 1
    }));
    
    setSlides(updatedSlides);
  };

  // Add function to check and update database schema if needed
  const ensureHeroSlidesSchema = async () => {
    try {
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: `
          -- Add missing columns to hero_slides table if they don't exist
          DO $$
          BEGIN
            -- Add text_position column if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'hero_slides' AND column_name = 'text_position') THEN
              ALTER TABLE public.hero_slides ADD COLUMN text_position JSONB DEFAULT '{"horizontal": "center", "vertical": "center"}'::jsonb;
            END IF;

            -- Add image_opacity column if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'hero_slides' AND column_name = 'image_opacity') THEN
              ALTER TABLE public.hero_slides ADD COLUMN image_opacity INTEGER DEFAULT 100;
            END IF;

            -- Add text_color column if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'hero_slides' AND column_name = 'text_color') THEN
              ALTER TABLE public.hero_slides ADD COLUMN text_color TEXT DEFAULT 'var(--color-background)';
            END IF;

            -- Add button_active column if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'hero_slides' AND column_name = 'button_active') THEN
              ALTER TABLE public.hero_slides ADD COLUMN button_active BOOLEAN DEFAULT true;
            END IF;

            -- Add secondary_button_active column if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'hero_slides' AND column_name = 'secondary_button_active') THEN
              ALTER TABLE public.hero_slides ADD COLUMN secondary_button_active BOOLEAN DEFAULT true;
            END IF;
          END
          $$;
        `
      });
      
      if (error) {
        console.error('Error updating hero_slides schema:', error);
      }
    } catch (err) {
      console.error('Error in ensureHeroSlidesSchema:', err);
    }
  };

  const saveHeroSlides = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // First ensure database tables exist and have required columns
      await ensureHeroConfigTable();
      await ensureHeroSlidesSchema();
      
      // Check if hero_slides table exists
      const { error: tableCheckError } = await supabase
        .from('hero_slides')
        .select('id')
        .limit(1);
      
      if (tableCheckError) {
        console.error('Table check error:', tableCheckError);
        if (tableCheckError.message.includes('relation "hero_slides" does not exist')) {
          throw new Error('Hero slides table does not exist. Please run the database setup script from the SQL editor in your Supabase dashboard.');
        }
        throw tableCheckError;
      }
      
      console.log('Saving slides:', slides);
      
      // For each slide, either update or insert with compatible data
      for (const slide of slides) {
        // Create a compatible data object with base fields
        const slideData: SlideDataBase = {
          title: slide.title || 'Untitled Slide',
          subtitle: slide.subtitle || '',
          description: slide.description,
          text_color: slide.text_color || 'var(--color-background)',
          image_url: slide.image_url,
          image_id: slide.image_id,
          image_opacity: slide.image_opacity || 100,
          text_background: slide.text_background || DEFAULT_TEXT_BACKGROUND_SETTINGS,
          order: slide.order,
          is_active: slide.is_active ?? true
        };
        
        // Track if we should use extended fields
        let useExtendedFields = false;
        const extendedData: SlideDataExtended = { ...slideData };
        
        // Add the new fields only if the database schema was updated successfully
        try {
          // Just check if we can select with the new column - we don't need the data
          await supabase.from('hero_slides').select('button_active').limit(1);
          
          // If we get here without error, the columns exist
          useExtendedFields = true;
          
          // Add extended fields
          extendedData.text_position = slide.text_position || DEFAULT_TEXT_POSITION;
          extendedData.button_active = slide.button_active !== undefined ? slide.button_active : true;
          extendedData.button_text = slide.button_text;
          extendedData.button_url = slide.button_url;
          extendedData.button_bg = slide.button_bg;
          extendedData.button_text_color = slide.button_text_color;
          extendedData.button_hover = slide.button_hover;
          extendedData.button_padding_x = slide.button_padding_x;
          extendedData.button_padding_y = slide.button_padding_y;
          extendedData.button_font = slide.button_font;
          extendedData.button_mobile_width = slide.button_mobile_width;
          extendedData.button_desktop_width = slide.button_desktop_width;
          extendedData.secondary_button_active = slide.secondary_button_active !== undefined ? slide.secondary_button_active : true;
          extendedData.secondary_button_text = slide.secondary_button_text;
          extendedData.secondary_button_url = slide.secondary_button_url;
          extendedData.secondary_button_bg = slide.secondary_button_bg;
          extendedData.secondary_button_text_color = slide.secondary_button_text_color;
          extendedData.secondary_button_hover = slide.secondary_button_hover;
          extendedData.secondary_button_padding_x = slide.secondary_button_padding_x;
          extendedData.secondary_button_padding_y = slide.secondary_button_padding_y;
          extendedData.secondary_button_font = slide.secondary_button_font;
          extendedData.secondary_button_mobile_width = slide.secondary_button_mobile_width;
          extendedData.secondary_button_desktop_width = slide.secondary_button_desktop_width;
        } catch {
          console.warn('Some columns may not exist in database yet, using compatible subset of data');
        }
        
        // Choose which data object to use based on schema compatibility
        const dataToUse = useExtendedFields ? extendedData : slideData;
        
        if (slide.id.startsWith('temp-')) {
          // This is a new slide, insert it
          console.log('Inserting new slide:', dataToUse);
          const { error } = await supabase
            .from('hero_slides')
            .insert([dataToUse])
            .select();
          
          if (error) {
            console.error('Insert error details:', error);
            throw error;
          }
        } else {
          // This is an existing slide, update it
          console.log('Updating slide:', slide.id, dataToUse);
          const { error } = await supabase
            .from('hero_slides')
            .update(dataToUse)
            .eq('id', slide.id)
            .select();
          
          if (error) {
            console.error('Update error details:', error);
            throw error;
          }
        }
      }
      
      // Fetch the updated slides
      await fetchHeroSlides();
      
      setSuccessMessage('Hero slides saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error saving hero slides:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  const directDeleteFromStorage = async (filePath: string): Promise<boolean> => {
    console.log('Attempting direct deletion from storage bucket...');
    
    // Get the Service Role Key from the admin client
    const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4d3dtanVicGt5endtdmlsbXN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjU2NDgyNiwiZXhwIjoyMDYyMTQwODI2fQ.ijwmiQPDrZyTfRAfA8I1e0QBh4uRGvMDF7A4w1v9y9k';
    
    // Define the URL for the delete operation
    const url = `https://yxwwmjubpkyzwmvilmsw.supabase.co/storage/v1/object/site-images/${filePath}`;
    
    try {
      // Use fetch API to delete the file
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${serviceRoleKey}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Direct delete failed:', errorData);
        return false;
      }
      
      console.log('File deleted successfully via direct method');
      return true;
    } catch (error) {
      console.error('Error in direct delete:', error);
      return false;
    }
  };

  const deleteHeroImage = async (slideId: string): Promise<boolean> => {
    console.log('Deleting image for slide:', slideId);
    
    // Find the slide with the image
    const slideToUpdate = slides.find(s => s.id === slideId);
    if (!slideToUpdate || !slideToUpdate.image_url) {
      console.log('No image to delete');
      return false;
    }
    
    try {
      // Extract image path from URL if available
      let filePath: string | null = null;
      
      if (slideToUpdate.image_url.includes('/hero/')) {
        const urlParts = slideToUpdate.image_url.split('/hero/');
        if (urlParts.length > 1) {
          const filename = urlParts[1].split('?')[0]; // Remove any query parameters
          filePath = `hero/${filename}`;
        }
      }
      
      if (!filePath) {
        console.warn('Could not extract file path from URL, using standard method');
        return false;
      }
      
      console.log('Attempting to delete file:', filePath);
      
      // Try direct delete first
      const deleteResult = await directDeleteFromStorage(filePath);
      
      if (!deleteResult) {
        // Try standard method as backup
        const { error } = await supabaseAdmin.storage
          .from('site-images')
          .remove([filePath]);
        
        if (error) {
          console.error('Error deleting image via standard method:', error);
          return false;
        }
      }
      
      // Update slide state to remove image references
      setSlides(prevSlides => 
        prevSlides.map(slide => 
          slide.id === slideId ? { ...slide, image_url: undefined, image_id: undefined } : slide
        )
      );
      
      setSuccessMessage('Image removed successfully. Save changes to confirm.');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      return true;
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    }
  };

  // Replace the existing handleImageUpload function with this enhanced version
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideId: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setError(null);
    
    try {
      // Check file size - limit to 5MB
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File is too large. Please use an image smaller than 5MB.');
      }

      // Show loading message
      setSuccessMessage('Uploading image...');
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `hero-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `hero/${fileName}`;
      
      // Upload the file
      const { error: uploadError } = await supabaseAdmin.storage
        .from('site-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabaseAdmin.storage
        .from('site-images')
        .getPublicUrl(filePath);
      
      if (data) {
        // Create a new version of the slide with the updated image URL
        const updatedSlide = {
          ...slides.find(slide => slide.id === slideId)!,
          image_url: data.publicUrl
        };
        
        // Update the slides state directly for immediate UI update
        setSlides(prevSlides => 
          prevSlides.map(slide => 
            slide.id === slideId ? updatedSlide : slide
          )
        );
        
        // Try to create an image record in the images table
        try {
          const { data: imageData, error: imageError } = await supabase
            .from('images')
            .insert({
              url: data.publicUrl,
              alt_text: 'Hero slide image'
            })
            .select('id')
            .single();
            
          if (!imageError && imageData) {
            // Update the image_id in the slide
            setSlides(prevSlides => 
              prevSlides.map(slide => 
                slide.id === slideId ? { ...slide, image_id: imageData.id } : slide
              )
            );
          }
        } catch (err) {
          console.warn('Could not create image record, but upload successful:', err);
          // Continue anyway since the image URL is available
        }
      }
      
      setSuccessMessage('Image uploaded successfully! Save changes to confirm.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  // Add function to update text position for a specific slide
  const updateTextPosition = (slideId: string, field: keyof TextPosition, value: 'left' | 'center' | 'right' | 'top' | 'bottom') => {
    setSlides(
      slides.map(slide => {
        if (slide.id !== slideId) return slide;
        
        const currentPosition = slide.text_position || { ...DEFAULT_TEXT_POSITION };
        return {
          ...slide,
          text_position: {
            ...currentPosition,
            [field]: value
          }
        };
      })
    );
  };

  // Add function to toggle using global settings or custom settings for a slide
  const toggleUseGlobalSettings = (slideId: string) => {
    setSlideOverrides(prev => ({
      ...prev,
      [slideId]: !prev[slideId]
    }));
    
    // If turning off override, copy global styles to the slide
    if (!slideOverrides[slideId]) {
      copyGlobalStylesToSlide(slideId);
    }
  };

  // Add function to copy global styles to a specific slide
  const copyGlobalStylesToSlide = (slideId: string) => {
    if (!globalButtonSettings.settings.enabled) return;
    
    // Get fixed_width setting from localStorage 
    const isFixedWidth = localStorage.getItem('fixed_width_buttons') === 'true';
    
    // Get all button properties from localStorage
    // Primary Button
    const primaryTextColor = localStorage.getItem('btn_text_color') || 'var(--color-background)';
    const primaryBgColor = localStorage.getItem('btn_bg_color') || 'var(--color-text)';
    const primaryHoverColor = localStorage.getItem('btn_hover_color') || 'var(--color-secondary)';
    const primaryWidth = localStorage.getItem('btn_width') || '180px';
    const primaryBorderRadius = localStorage.getItem('btn_border_radius') || '0.25rem';
    const primaryBorderWidth = localStorage.getItem('btn_border_width') || '0px';
    const primaryBorderColor = localStorage.getItem('btn_border_color') || 'transparent';
    const primaryPaddingX = localStorage.getItem('btn_padding_x') || '1.5rem';
    const primaryPaddingY = localStorage.getItem('btn_padding_y') || '0.75rem';
    const primaryFontWeight = localStorage.getItem('btn_font_weight') || '500';
    
    // Secondary Button
    const secondaryTextColor = localStorage.getItem('sec_btn_text_color') || 'var(--color-background)';
    const secondaryBgColor = localStorage.getItem('sec_btn_bg_color') || '#666666';
    const secondaryHoverColor = localStorage.getItem('sec_btn_hover_color') || '#444444';
    const secondaryWidth = localStorage.getItem('sec_btn_width') || '180px';
    const secondaryBorderRadius = localStorage.getItem('sec_btn_border_radius') || '0.25rem';
    const secondaryBorderWidth = localStorage.getItem('sec_btn_border_width') || '0px';
    const secondaryBorderColor = localStorage.getItem('sec_btn_border_color') || 'transparent';
    const secondaryPaddingX = localStorage.getItem('sec_btn_padding_x') || '1.5rem';
    const secondaryPaddingY = localStorage.getItem('sec_btn_padding_y') || '0.75rem';
    const secondaryFontWeight = localStorage.getItem('sec_btn_font_weight') || '500';
    
    // Determine the width value based on fixed_width setting
    const primaryButtonWidth = isFixedWidth ? primaryWidth : 'auto';
    const secondaryButtonWidth = isFixedWidth ? secondaryWidth : 'auto';
    
    setSlides(
      slides.map(slide => 
        slide.id === slideId ? {
          ...slide,
          // Primary button
          button_text_color: primaryTextColor,
          button_bg: primaryBgColor,
          button_hover: primaryHoverColor,
          button_padding_x: primaryPaddingX,
          button_padding_y: primaryPaddingY,
          button_font: primaryFontWeight,
          button_desktop_width: primaryButtonWidth,
          button_mobile_width: primaryButtonWidth,
          button_border_radius: primaryBorderRadius,
          button_border_width: primaryBorderWidth,
          button_border_color: primaryBorderColor,
          
          // Secondary button
          secondary_button_text_color: secondaryTextColor,
          secondary_button_bg: secondaryBgColor,
          secondary_button_hover: secondaryHoverColor,
          secondary_button_padding_x: secondaryPaddingX,
          secondary_button_padding_y: secondaryPaddingY,
          secondary_button_font: secondaryFontWeight,
          secondary_button_desktop_width: secondaryButtonWidth,
          secondary_button_mobile_width: secondaryButtonWidth,
          secondary_button_border_radius: secondaryBorderRadius,
          secondary_button_border_width: secondaryBorderWidth,
          secondary_button_border_color: secondaryBorderColor,
        } : slide
      )
    );
    
    // Set this slide to override global (since we just copied the styles)
    setSlideOverrides(prev => ({
      ...prev,
      [slideId]: true
    }));
    
    setSuccessMessage(`Global button styles copied to slide`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Hero Slides Configuration</h1>
          <button
            onClick={saveHeroSlides}
            disabled={saving}
            className="px-4 py-2 bg-background text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {error && (
          <div className="bg-background border border-red-400 text-text px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-background border border-green-400 text-text px-4 py-3 rounded mb-4">
            <p>{successMessage}</p>
          </div>
        )}

        {/* Global settings info banner */}
        {globalButtonSettings.settings.enabled && (
          <div className="bg-background border-l-4 border-blue-500 text-text p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="use-global-settings"
                    checked={useGlobalSettings}
                    onChange={(e) => setUseGlobalSettings(e.target.checked)}
                    className="h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded mr-2"
                  />
                  <label htmlFor="use-global-settings" className="font-medium">
                    Use global button settings for all slides
                  </label>
                </div>
                <p className="text-sm mt-1">When enabled, all slides will inherit the global button styles. Individual slides can be configured to override these styles.</p>
              </div>
              <a href="/admin/settings" className="text-text hover:text-blue-800 text-sm underline">
                Configure global settings
              </a>
            </div>
          </div>
        )}

        {/* Hero slides management UI - Full width */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Hero Slides</h2>
            <button 
              onClick={addNewSlide}
              className="px-3 py-1.5 bg-background text-white rounded-md hover:bg-blue-700 transition text-sm"
            >
              Add New Slide
            </button>
          </div>
          
          <div>
            {slides.length === 0 ? (
              <div className="text-center py-8 text-text">
                No slides found. Click "Add New Slide" to create one.
              </div>
            ) : (
              <div className="space-y-6">
                {slides.map((slide) => (
                  <div key={slide.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">{slide.title}</h3>
                        <p className="text-sm text-text">{slide.subtitle}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => reorderSlides(slide.id, 'up')}
                          className="p-1 text-text hover:text-gray-700"
                        >
                          ↑
                        </button>
                        <button 
                          onClick={() => reorderSlides(slide.id, 'down')}
                          className="p-1 text-text hover:text-gray-700"
                        >
                          ↓
                        </button>
                        <button 
                          onClick={() => removeSlide(slide.id)}
                          className="p-1 text-text hover:text-red-700"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* Image preview with controls */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                      <div className="lg:col-span-1">
                        <h4 className="text-sm font-medium mb-2 pb-1 border-b">Image Upload</h4>
                        {slide.image_url ? (
                          <div className="relative h-40 bg-background rounded overflow-hidden">
                            <img 
                              src={slide.image_url} 
                              alt={slide.title} 
                              className="w-full h-full object-cover"
                              style={{ opacity: (slide.image_opacity || 100) / 100 }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => deleteHeroImage(slide.id)}
                                className="px-3 py-1 bg-background text-white rounded hover:bg-red-700 shadow text-sm mb-2"
                              >
                                Delete Image
                              </button>
                              <label className="px-3 py-1 bg-background text-white rounded hover:bg-blue-700 transition cursor-pointer text-sm">
                                Replace Image
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, slide.id)}
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-background h-40 flex flex-col items-center justify-center rounded">
                            <p className="text-text mb-2">No image uploaded</p>
                            <label className="px-3 py-1.5 bg-background text-white rounded-md hover:bg-blue-700 transition text-sm cursor-pointer">
                              Upload Image
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, slide.id)}
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Hero Preview */}
                      <div className="lg:col-span-2">
                        <h4 className="text-sm font-medium mb-2 pb-1 border-b">Live Preview</h4>
                        <div className="relative h-72 bg-background rounded overflow-hidden">
                          {slide.image_url && (
                            <img 
                              src={slide.image_url} 
                              alt={slide.title} 
                              className="w-full h-full object-cover"
                              style={{ opacity: (slide.image_opacity || 100) / 100 }}
                            />
                          )}

                          {/* Text Content Container with Positioning */}
                          <div className="absolute inset-0 flex">
                            {/* This section handles the vertical and horizontal alignment */}
                            <div 
                              className="absolute inset-0 flex"
                              style={{
                                justifyContent: (slide.text_position?.horizontal || 'center') === 'left' 
                                  ? 'flex-start' 
                                  : (slide.text_position?.horizontal || 'center') === 'right' 
                                    ? 'flex-end' 
                                    : 'center',
                                alignItems: (slide.text_position?.vertical || 'center') === 'top' 
                                  ? 'flex-start' 
                                  : (slide.text_position?.vertical || 'center') === 'bottom' 
                                    ? 'flex-end' 
                                    : 'center'
                              }}
                            >
                              {/* Content box with background */}
                              <div 
                                className={`
                                  ${slide.text_background?.size === 'sm' ? 'w-1/3' : 
                                    slide.text_background?.size === 'md' ? 'w-1/2' : 
                                    slide.text_background?.size === 'lg' ? 'w-3/4' : 
                                    'w-full h-full'}
                                  ${(slide.text_position?.horizontal || 'center') === 'left' ? 'ml-4' : ''}
                                  ${(slide.text_position?.horizontal || 'center') === 'right' ? 'mr-4' : ''}
                                  ${(slide.text_position?.vertical || 'center') === 'top' ? 'mt-4' : ''}
                                  ${(slide.text_position?.vertical || 'center') === 'bottom' ? 'mb-4' : ''}
                                  relative
                                `}
                              >
                                {/* Background overlay */}
                                {slide.text_background?.enabled && (
                                  <div 
                                    className="absolute inset-0" 
                                    style={{
                                      backgroundColor: slide.text_background?.color || 'rgba(0,0,0,0.7)',
                                      opacity: (slide.text_background?.opacity || 70) / 100
                                    }}
                                  ></div>
                                )}
                                
                                {/* Text content with alignment */}
                                <div 
                                  className="relative z-10"
                                  style={{
                                    padding: slide.text_background?.enabled ? slide.text_background?.padding || '16px' : '8px',
                                    textAlign: (slide.text_position?.horizontal || 'center') as 'left' | 'center' | 'right'
                                  }}
                                >
                                  <h3 
                                    className="text-xl font-bold"
                                    style={{
                                      color: slide.text_color || 'var(--color-background)'
                                    }}
                                  >
                                    {slide.title || 'Title'}
                                  </h3>
                                  <p 
                                    className="opacity-90"
                                    style={{
                                      color: slide.text_color || 'var(--color-background)'
                                    }}
                                  >
                                    {slide.subtitle || 'Subtitle'}
                                  </p>
                                  
                                  {/* Buttons container with alignment */}
                                  <div 
                                    className="mt-3 flex flex-wrap gap-2"
                                    style={{
                                      justifyContent: (slide.text_position?.horizontal || 'center') === 'left' 
                                        ? 'flex-start' 
                                        : (slide.text_position?.horizontal || 'center') === 'right' 
                                          ? 'flex-end' 
                                          : 'center'
                                    }}
                                  >
                                    {slide.button_active !== false && slide.button_text && (
                                      <button 
                                        className="text-sm"
                                        style={{
                                          backgroundColor: slide.button_bg || 'var(--color-text)',
                                          color: slide.button_text_color || 'var(--color-background)',
                                          padding: `${(slide.button_padding_y || 'py-2').replace('py-', '').replace('rem', '')}rem ${(slide.button_padding_x || 'px-4').replace('px-', '').replace('rem', '')}rem`,
                                          fontWeight: (slide.button_font || 'font-medium').includes('bold') ? 'bold' : 
                                                    (slide.button_font || 'font-medium').includes('medium') ? '500' : 'normal',
                                          borderRadius: '0.25rem'
                                        }}
                                      >
                                        {slide.button_text}
                                      </button>
                                    )}
                                    
                                    {slide.secondary_button_active !== false && slide.secondary_button_text && (
                                      <button 
                                        className="text-sm"
                                        style={{
                                          backgroundColor: slide.secondary_button_bg || 'var(--color-background)',
                                          color: slide.secondary_button_text_color || 'var(--color-text)',
                                          padding: `${(slide.secondary_button_padding_y || 'py-2').replace('py-', '').replace('rem', '')}rem ${(slide.secondary_button_padding_x || 'px-4').replace('px-', '').replace('rem', '')}rem`,
                                          fontWeight: (slide.secondary_button_font || 'font-medium').includes('bold') ? 'bold' : 
                                                    (slide.secondary_button_font || 'font-medium').includes('medium') ? '500' : 'normal',
                                          borderRadius: '0.25rem'
                                        }}
                                      >
                                        {slide.secondary_button_text}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content tabs */}
                    <div className="border-b border-gray-200 mb-4">
                      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button 
                          onClick={() => setActiveTab({...activeTab, [slide.id]: 'content'})}
                          className={`${
                            !activeTab[slide.id] || activeTab[slide.id] === 'content' 
                              ? 'border-blue-500 text-blue-600' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                        >
                          Content
                        </button>
                        <button 
                          onClick={() => setActiveTab({...activeTab, [slide.id]: 'background'})}
                          className={`${
                            activeTab[slide.id] === 'background' 
                              ? 'border-blue-500 text-blue-600' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                        >
                          Text Background
                        </button>
                        <button 
                          onClick={() => setActiveTab({...activeTab, [slide.id]: 'primary'})}
                          className={`${
                            activeTab[slide.id] === 'primary' 
                              ? 'border-blue-500 text-blue-600' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                        >
                          Primary Button
                        </button>
                        <button 
                          onClick={() => setActiveTab({...activeTab, [slide.id]: 'secondary'})}
                          className={`${
                            activeTab[slide.id] === 'secondary' 
                              ? 'border-blue-500 text-blue-600' 
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                        >
                          Secondary Button
                        </button>
                      </nav>
                    </div>

                    {/* Content Tab */}
                    {(!activeTab[slide.id] || activeTab[slide.id] === 'content') && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">Title</label>
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">Subtitle</label>
                            <input
                              type="text"
                              value={slide.subtitle}
                              onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-text mb-1">Text Color</label>
                            <div className="flex items-center">
                              <input
                                type="color"
                                value={slide.text_color || 'var(--color-background)'}
                                onChange={(e) => handleSlideChange(slide.id, 'text_color', e.target.value)}
                                className="w-8 h-8 rounded mr-2"
                              />
                              <input
                                type="text"
                                value={slide.text_color || 'var(--color-background)'}
                                onChange={(e) => handleSlideChange(slide.id, 'text_color', e.target.value)}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                placeholder="var(--color-background)"
                              />
                            </div>
                          </div>
                          
                          {slide.image_url && (
                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Image Opacity: {slide.image_opacity || 100}%
                              </label>
                              <input
                                type="range"
                                min="10"
                                max="100"
                                value={slide.image_opacity || 100}
                                onChange={(e) => handleSlideChange(slide.id, 'image_opacity', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text mb-2">Text Position</label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-text mb-1">Horizontal Alignment</label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateTextPosition(slide.id, 'horizontal', 'left');
                                  }}
                                  className={`flex-1 p-2 border rounded ${
                                    (slide.text_position?.horizontal || 'center') === 'left'
                                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Left
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateTextPosition(slide.id, 'horizontal', 'center');
                                  }}
                                  className={`flex-1 p-2 border rounded ${
                                    (slide.text_position?.horizontal || 'center') === 'center'
                                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Center
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateTextPosition(slide.id, 'horizontal', 'right');
                                  }}
                                  className={`flex-1 p-2 border rounded ${
                                    (slide.text_position?.horizontal || 'center') === 'right'
                                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Right
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-xs text-text mb-1">Vertical Alignment</label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateTextPosition(slide.id, 'vertical', 'top');
                                  }}
                                  className={`flex-1 p-2 border rounded ${
                                    (slide.text_position?.vertical || 'center') === 'top'
                                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Top
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateTextPosition(slide.id, 'vertical', 'center');
                                  }}
                                  className={`flex-1 p-2 border rounded ${
                                    (slide.text_position?.vertical || 'center') === 'center'
                                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Center
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    updateTextPosition(slide.id, 'vertical', 'bottom');
                                  }}
                                  className={`flex-1 p-2 border rounded ${
                                    (slide.text_position?.vertical || 'center') === 'bottom'
                                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Bottom
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-text mb-1">Slide Status</label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`slide-active-${slide.id}`}
                              checked={slide.is_active !== false}
                              onChange={(e) => handleSlideChange(slide.id, 'is_active', e.target.checked)}
                              className="h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={`slide-active-${slide.id}`} className="text-sm text-text">
                              Slide is active
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Text Background Tab */}
                    {activeTab[slide.id] === 'background' && (
                      <div className="space-y-4">
                        <div className="bg-background p-3 rounded-md border border-gray-200 mb-3">
                          <p className="text-sm text-text">
                            The text background helps highlight your slide text against the image background, making it more readable. You can customize its appearance below.
                          </p>
                        </div>
                        
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`text-bg-enabled-${slide.id}`}
                            checked={slide.text_background?.enabled || false}
                            onChange={(e) => updateTextBackgroundSettings(slide.id, 'enabled', e.target.checked)}
                            className="h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded mr-2"
                          />
                          <label htmlFor={`text-bg-enabled-${slide.id}`} className="text-sm font-medium text-text">
                            Enable text background overlay
                          </label>
                        </div>
                        
                        {slide.text_background?.enabled && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">
                                  Background Color
                                </label>
                                <div className="flex items-center">
                                  <input
                                    type="color"
                                    value={(slide.text_background?.color || 'rgba(0,0,0,0.7)').replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')')}
                                    onChange={(e) => {
                                      // Convert hex to rgba
                                      const hex = e.target.value;
                                      const r = parseInt(hex.slice(1, 3), 16);
                                      const g = parseInt(hex.slice(3, 5), 16);
                                      const b = parseInt(hex.slice(5, 7), 16);
                                      const opacity = slide.text_background?.opacity || 70;
                                      updateTextBackgroundSettings(slide.id, 'color', `rgba(${r},${g},${b},${opacity/100})`);
                                    }}
                                    className="w-10 h-10 rounded mr-2"
                                  />
                                  <input
                                    type="text"
                                    value={slide.text_background?.color || 'rgba(0,0,0,0.7)'}
                                    onChange={(e) => updateTextBackgroundSettings(slide.id, 'color', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                    placeholder="rgba(0,0,0,0.7)"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">
                                  Background Opacity: {slide.text_background?.opacity || 70}%
                                </label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={slide.text_background?.opacity || 70}
                                  onChange={(e) => {
                                    const opacity = parseInt(e.target.value);
                                    updateTextBackgroundSettings(slide.id, 'opacity', opacity);
                                  }}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Background Size
                              </label>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <button
                                  type="button"
                                  onClick={() => updateTextBackgroundSettings(slide.id, 'size', 'sm')}
                                  className={`p-2 border rounded ${
                                    slide.text_background?.size === 'sm' 
                                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Small
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateTextBackgroundSettings(slide.id, 'size', 'md')}
                                  className={`p-2 border rounded ${
                                    slide.text_background?.size === 'md' || !slide.text_background?.size
                                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Medium
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateTextBackgroundSettings(slide.id, 'size', 'lg')}
                                  className={`p-2 border rounded ${
                                    slide.text_background?.size === 'lg' 
                                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Large
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateTextBackgroundSettings(slide.id, 'size', 'full')}
                                  className={`p-2 border rounded ${
                                    slide.text_background?.size === 'full' 
                                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                                      : 'border-gray-300'
                                  }`}
                                >
                                  Full Width
                                </button>
                              </div>
                              <p className="text-xs text-text mt-1">
                                Choose how much of the slide the background should cover behind your text.
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-text mb-1">
                                Padding: {slide.text_background?.padding || '16px'}
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="40"
                                value={parseInt((slide.text_background?.padding || '16px').replace('px', ''))}
                                onChange={(e) => {
                                  const padding = `${e.target.value}px`;
                                  updateTextBackgroundSettings(slide.id, 'padding', padding);
                                }}
                                className="w-full"
                              />
                              <p className="text-xs text-text mt-1">
                                Adjust the space between the text and the edge of the background.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Primary Button Tab */}
                    {activeTab[slide.id] === 'primary' && (
                      <div className="space-y-4">
                        {globalButtonSettings.settings.enabled && (
                          <div className="flex items-center justify-between mb-3 bg-background p-2 rounded">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`use-global-primary-${slide.id}`}
                                checked={!slideOverrides[slide.id] && useGlobalSettings}
                                onChange={() => toggleUseGlobalSettings(slide.id)}
                                className="h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded mr-2"
                              />
                              <label htmlFor={`use-global-primary-${slide.id}`} className={`text-sm ${!slideOverrides[slide.id] && useGlobalSettings ? 'font-medium' : 'text-gray-500'}`}>
                                Use global button settings for this slide
                              </label>
                            </div>
                            {slideOverrides[slide.id] && (
                              <button
                                onClick={() => copyGlobalStylesToSlide(slide.id)}
                                className="text-xs bg-background text-text px-2 py-1 rounded hover:bg-blue-200"
                              >
                                Copy from global
                              </button>
                            )}
                          </div>
                        )}
                    
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            id={`button-active-${slide.id}`}
                            checked={slide.button_active !== false}
                            onChange={(e) => handleSlideChange(slide.id, 'button_active', e.target.checked)}
                            className="h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded mr-2"
                            disabled={!slideOverrides[slide.id] && useGlobalSettings && globalButtonSettings.settings.enabled}
                          />
                          <label htmlFor={`button-active-${slide.id}`} className="text-sm font-medium text-text">
                            Show primary button
                          </label>
                        </div>
                        
                        {slide.button_active !== false && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">Button Text</label>
                                <input
                                  type="text"
                                  value={slide.button_text || ''}
                                  onChange={(e) => handleSlideChange(slide.id, 'button_text', e.target.value)}
                                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${!slideOverrides[slide.id] && useGlobalSettings && globalButtonSettings.settings.enabled ? 'bg-gray-100' : ''}`}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">Button URL</label>
                                <input
                                  type="text"
                                  value={slide.button_url || ''}
                                  onChange={(e) => handleSlideChange(slide.id, 'button_url', e.target.value)}
                                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${!slideOverrides[slide.id] && useGlobalSettings && globalButtonSettings.settings.enabled ? 'bg-gray-100' : ''}`}
                                />
                              </div>
                            </div>
                            
                            {/* Button styling options - Only shown when global settings aren't applied */}
                            {(slideOverrides[slide.id] || !useGlobalSettings || !globalButtonSettings.settings.enabled) && (
                              <div className="border-t pt-4 mt-2">
                                <h4 className="font-medium text-sm mb-3">Button Styling</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-text mb-1">Button Background</label>
                                    <div className="flex items-center">
                                      <input
                                        type="color"
                                        value={slide.button_bg || 'var(--color-text)'}
                                        onChange={(e) => handleSlideChange(slide.id, 'button_bg', e.target.value)}
                                        className="w-8 h-8 rounded mr-2"
                                      />
                                      <input
                                        type="text"
                                        value={slide.button_bg || ''}
                                        placeholder="var(--color-text) or bg-black"
                                        onChange={(e) => handleSlideChange(slide.id, 'button_bg', e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-text mb-1">Button Text Color</label>
                                    <div className="flex items-center">
                                      <input
                                        type="color"
                                        value={slide.button_text_color || 'var(--color-background)'}
                                        onChange={(e) => handleSlideChange(slide.id, 'button_text_color', e.target.value)}
                                        className="w-8 h-8 rounded mr-2"
                                      />
                                      <input
                                        type="text"
                                        value={slide.button_text_color || ''}
                                        placeholder="var(--color-background) or text-white"
                                        onChange={(e) => handleSlideChange(slide.id, 'button_text_color', e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-text mb-1">Hover Background</label>
                                    <div className="flex items-center">
                                      <input
                                        type="color"
                                        value={slide.button_hover || 'var(--color-secondary)'}
                                        onChange={(e) => handleSlideChange(slide.id, 'button_hover', e.target.value)}
                                        className="w-8 h-8 rounded mr-2"
                                      />
                                      <input
                                        type="text"
                                        value={slide.button_hover || ''}
                                        placeholder="var(--color-secondary) or hover:bg-gray-800"
                                        onChange={(e) => handleSlideChange(slide.id, 'button_hover', e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    {/* Secondary Button Tab */}
                    {activeTab[slide.id] === 'secondary' && (
                      <div className="space-y-4">
                        {globalButtonSettings.settings.enabled && (
                          <div className="flex items-center justify-between mb-3 bg-background p-2 rounded">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`use-global-secondary-${slide.id}`}
                                checked={!slideOverrides[slide.id] && useGlobalSettings}
                                onChange={() => toggleUseGlobalSettings(slide.id)}
                                className="h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded mr-2"
                              />
                              <label htmlFor={`use-global-secondary-${slide.id}`} className={`text-sm ${!slideOverrides[slide.id] && useGlobalSettings ? 'font-medium' : 'text-gray-500'}`}>
                                Use global button settings for this slide
                              </label>
                            </div>
                            {slideOverrides[slide.id] && (
                              <button
                                onClick={() => copyGlobalStylesToSlide(slide.id)}
                                className="text-xs bg-background text-text px-2 py-1 rounded hover:bg-blue-200"
                              >
                                Copy from global
                              </button>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center mb-3">
                          <input
                            type="checkbox"
                            id={`secondary-button-active-${slide.id}`}
                            checked={slide.secondary_button_active !== false}
                            onChange={(e) => handleSlideChange(slide.id, 'secondary_button_active', e.target.checked)}
                            className="h-4 w-4 text-text focus:ring-blue-500 border-gray-300 rounded mr-2"
                            disabled={!slideOverrides[slide.id] && useGlobalSettings && globalButtonSettings.settings.enabled}
                          />
                          <label htmlFor={`secondary-button-active-${slide.id}`} className="text-sm font-medium text-text">
                            Show secondary button
                          </label>
                        </div>
                        
                        {slide.secondary_button_active !== false && (
                          <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">Button Text</label>
                                <input
                                  type="text"
                                  value={slide.secondary_button_text || ''}
                                  placeholder="Contact Us"
                                  onChange={(e) => handleSlideChange(slide.id, 'secondary_button_text', e.target.value)}
                                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${!slideOverrides[slide.id] && useGlobalSettings && globalButtonSettings.settings.enabled ? 'bg-gray-100' : ''}`}
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-text mb-1">Button URL</label>
                                <input
                                  type="text"
                                  value={slide.secondary_button_url || ''}
                                  onChange={(e) => handleSlideChange(slide.id, 'secondary_button_url', e.target.value)}
                                  className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${!slideOverrides[slide.id] && useGlobalSettings && globalButtonSettings.settings.enabled ? 'bg-gray-100' : ''}`}
                                />
                              </div>
                            </div>

                            {/* Show styling options only when global settings aren't applied */}
                            {(slideOverrides[slide.id] || !useGlobalSettings || !globalButtonSettings.settings.enabled) && (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Button Background</label>
                                  <div className="flex items-center">
                                    <input
                                      type="color"
                                      value={slide.secondary_button_bg || 'var(--color-background)'}
                                      onChange={(e) => handleSlideChange(slide.id, 'secondary_button_bg', e.target.value)}
                                      className="w-8 h-8 rounded mr-2"
                                    />
                                    <input
                                      type="text"
                                      value={slide.secondary_button_bg || ''}
                                      placeholder="var(--color-background) or bg-white"
                                      onChange={(e) => handleSlideChange(slide.id, 'secondary_button_bg', e.target.value)}
                                      className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Button Text Color</label>
                                  <div className="flex items-center">
                                    <input
                                      type="color"
                                      value={slide.secondary_button_text_color || 'var(--color-text)'}
                                      onChange={(e) => handleSlideChange(slide.id, 'secondary_button_text_color', e.target.value)}
                                      className="w-8 h-8 rounded mr-2"
                                    />
                                    <input
                                      type="text"
                                      value={slide.secondary_button_text_color || ''}
                                      placeholder="var(--color-text) or text-black"
                                      onChange={(e) => handleSlideChange(slide.id, 'secondary_button_text_color', e.target.value)}
                                      className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">Hover Background</label>
                                  <div className="flex items-center">
                                    <input
                                      type="color"
                                      value={slide.secondary_button_hover || '#F3F4F6'}
                                      onChange={(e) => handleSlideChange(slide.id, 'secondary_button_hover', e.target.value)}
                                      className="w-8 h-8 rounded mr-2"
                                    />
                                    <input
                                      type="text"
                                      value={slide.secondary_button_hover || ''}
                                      placeholder="#F3F4F6 or hover:bg-gray-100"
                                      onChange={(e) => handleSlideChange(slide.id, 'secondary_button_hover', e.target.value)}
                                      className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HeroConfigPage; 