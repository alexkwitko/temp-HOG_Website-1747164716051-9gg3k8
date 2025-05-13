import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';
// Color palette selector temporarily disabled - will be reimplemented later
// import ColorPaletteSelector from '../../components/admin/ColorPaletteSelector';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  business_hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  color_palette_settings?: {
    globalPaletteId: string;
    homePagePaletteId?: string;
    useIntercalatedColors?: boolean;
    useUniformColors?: boolean;
  };
  font_settings?: {
    enabled: boolean;
    primary_font: string;
    secondary_font: string;
    body_font: string;
    heading_font: string;
  };
  button_settings: {
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
    border_radius_style: 'none' | 'small' | 'medium' | 'large' | 'full';
    border_width: string;
    border_color: string;
    transition_speed: string;
    primary_style: 'solid' | 'outline' | 'ghost' | 'gradient';
    secondary_text_color: string;
    secondary_bg_color: string;
    secondary_hover_color: string;
    secondary_hover_text_color: string;
    secondary_width: string;
    secondary_height: string;
    secondary_border_radius: string;
    secondary_border_radius_style: 'none' | 'small' | 'medium' | 'large' | 'full';
    secondary_border_width: string;
    secondary_border_color: string;
    secondary_style: 'solid' | 'outline' | 'ghost' | 'gradient';
    text_size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    secondary_text_size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    gradient_direction: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    gradient_from_color: string;
    gradient_to_color: string;
    secondary_gradient_direction: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    secondary_gradient_from_color: string;
    secondary_gradient_to_color: string;
  };
}

const defaultSettings: SiteSettings = {
  site_name: 'House of Grappling',
  site_description: 'Premier BJJ and martial arts training academy',
  contact_email: 'info@houseofgrappling.com',
  social_links: {
    facebook: 'https://facebook.com/houseofgrappling',
    instagram: 'https://instagram.com/houseofgrappling',
    twitter: '',
    youtube: ''
  },
  business_hours: {
    monday: '6:00 AM - 9:00 PM',
    tuesday: '6:00 AM - 9:00 PM',
    wednesday: '6:00 AM - 9:00 PM',
    thursday: '6:00 AM - 9:00 PM',
    friday: '6:00 AM - 9:00 PM',
    saturday: '8:00 AM - 4:00 PM',
    sunday: 'Closed'
  },
  color_palette_settings: {
    globalPaletteId: 'monochrome',
    useUniformColors: true
  },
  font_settings: {
    enabled: true,
    primary_font: 'Verdana',
    secondary_font: 'Verdana',
    body_font: 'Verdana',
    heading_font: 'Verdana'
  },
  button_settings: {
    enabled: true,
    fixed_width: false,
    width: '180px',
    height: '48px',
    text_color: '#FFFFFF',
    bg_color: '#000000',
    hover_color: '#333333',
    hover_text_color: '#FFFFFF',
    padding_x: '1.5rem',
    padding_y: '0.75rem',
    font_weight: '500',
    border_radius: '0.25rem',
    border_radius_style: 'small',
    border_width: '0px',
    border_color: '#000000',
    transition_speed: '300ms',
    primary_style: 'solid',
    secondary_text_color: '#FFFFFF',
    secondary_bg_color: '#666666',
    secondary_hover_color: '#444444',
    secondary_hover_text_color: '#FFFFFF',
    secondary_width: '180px',
    secondary_height: '48px',
    secondary_border_radius: '0.25rem',
    secondary_border_radius_style: 'small',
    secondary_border_width: '1px',
    secondary_border_color: '#FFFFFF',
    secondary_style: 'solid',
    text_size: 'md',
    secondary_text_size: 'md',
    gradient_direction: 'to-right',
    gradient_from_color: '#4F46E5',
    gradient_to_color: '#8B5CF6',
    secondary_gradient_direction: 'to-right',
    secondary_gradient_from_color: '#F59E0B',
    secondary_gradient_to_color: '#B91C1C'
  }
};

const SettingsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [editingButtonTheme, setEditingButtonTheme] = useState(false);

  // Helper function to convert text size names to CSS values
  const getFontSizeValue = (size: string): string => {
    switch(size) {
      case 'xs': return '0.75rem';
      case 'sm': return '0.875rem';
      case 'md': return '1rem';
      case 'lg': return '1.125rem';
      case 'xl': return '1.25rem';
      default: return '1rem';
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get site info (basic settings)
        const { data: siteInfoData, error: siteInfoError } = await supabase
          .from('site_settings')
          .select('site_name, site_description, contact_email')
          .eq('key', 'site_info')
          .single();
        
        if (siteInfoError && siteInfoError.code !== 'PGRST116') {
          console.error('Error fetching site info:', siteInfoError);
        }
        
        // Get social links
        const { data: socialLinksData, error: socialLinksError } = await supabase
          .from('site_settings')
          .select('social_links_json')
          .eq('key', 'social_links')
          .single();
        
        if (socialLinksError && socialLinksError.code !== 'PGRST116') {
          console.error('Error fetching social links:', socialLinksError);
        }
        
        // Get business hours
        const { data: businessHoursData, error: businessHoursError } = await supabase
          .from('site_settings')
          .select('business_hours_json')
          .eq('key', 'business_hours')
          .single();
        
        if (businessHoursError && businessHoursError.code !== 'PGRST116') {
          console.error('Error fetching business hours:', businessHoursError);
        }
        
        // Get color palette settings
        const { data: colorPaletteData, error: colorPaletteError } = await supabase
          .from('site_settings')
          .select('color_palette_settings_json')
          .eq('key', 'color_palette')
          .single();
        
        if (colorPaletteError && colorPaletteError.code !== 'PGRST116') {
          console.error('Error fetching color palette settings:', colorPaletteError);
        }
        
        // Get font settings
        const { data: fontSettingsData, error: fontSettingsError } = await supabase
          .from('site_settings')
          .select('font_settings_json')
          .eq('key', 'font_settings')
          .single();
        
        if (fontSettingsError && fontSettingsError.code !== 'PGRST116') {
          console.error('Error fetching font settings:', fontSettingsError);
        }
        
        // Get button settings
        const { data: buttonSettingsData, error: buttonSettingsError } = await supabase
          .from('site_settings')
          .select('button_settings_json')
          .eq('key', 'button_settings')
          .single();
        
        if (buttonSettingsError && buttonSettingsError.code !== 'PGRST116') {
          console.error('Error fetching button settings:', buttonSettingsError);
        }
        
        // Combine all data
        const loadedSettings = {
          ...defaultSettings,
          // Add basic settings if available
          ...(siteInfoData || {}),
          // Add JSON data with safe parsing
          social_links: socialLinksData?.social_links_json || defaultSettings.social_links,
          business_hours: businessHoursData?.business_hours_json || defaultSettings.business_hours,
          color_palette_settings: colorPaletteData?.color_palette_settings_json || defaultSettings.color_palette_settings,
          font_settings: fontSettingsData?.font_settings_json || defaultSettings.font_settings,
          button_settings: buttonSettingsData?.button_settings_json || defaultSettings.button_settings
        };
        
        setSettings(loadedSettings);
        
        // Apply font settings to document if enabled
        if (loadedSettings.font_settings?.enabled) {
          document.documentElement.style.setProperty('--font-primary', loadedSettings.font_settings.primary_font);
          document.documentElement.style.setProperty('--font-secondary', loadedSettings.font_settings.secondary_font);
          document.documentElement.style.setProperty('--font-body', loadedSettings.font_settings.body_font);
          document.documentElement.style.setProperty('--font-heading', loadedSettings.font_settings.heading_font);
          
          // Add Google Fonts link if not already present
          const fonts = [
            loadedSettings.font_settings.primary_font,
            loadedSettings.font_settings.secondary_font,
            loadedSettings.font_settings.body_font,
            loadedSettings.font_settings.heading_font
          ].filter((font, index, self) => self.indexOf(font) === index); // remove duplicates
          
          const fontLink = document.getElementById('google-fonts');
          if (!fontLink) {
            const link = document.createElement('link');
            link.id = 'google-fonts';
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${fonts.join('&family=').replace(/ /g, '+')}&display=swap`;
            document.head.appendChild(link);
          } else {
            // Cast to HTMLLinkElement to access href property
            (fontLink as HTMLLinkElement).href = `https://fonts.googleapis.com/css2?family=${fonts.join('&family=').replace(/ /g, '+')}&display=swap`;
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Save site info
      const { error: siteInfoError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'site_info',
          value: 'default',
          site_name: settings.site_name,
          site_description: settings.site_description,
          contact_email: settings.contact_email
        }, { onConflict: 'key' });

      if (siteInfoError) {
        setError('Failed to save site information: ' + siteInfoError.message);
        console.error('Error saving site info:', siteInfoError);
        return;
      }

      // Save social links
      const { error: socialLinksError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'social_links',
          value: 'default',
          social_links_json: settings.social_links
        }, { onConflict: 'key' });

      if (socialLinksError) {
        setError('Failed to save social links: ' + socialLinksError.message);
        console.error('Error saving social links:', socialLinksError);
        return;
      }

      // Save business hours
      const { error: businessHoursError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'business_hours',
          value: 'default',
          business_hours_json: settings.business_hours
        }, { onConflict: 'key' });

      if (businessHoursError) {
        setError('Failed to save business hours: ' + businessHoursError.message);
        console.error('Error saving business hours:', businessHoursError);
        return;
      }

      // Save color palette settings
      const { error: colorPaletteError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'color_palette',
          value: 'default',
          color_palette_settings_json: settings.color_palette_settings
        }, { onConflict: 'key' });

      if (colorPaletteError) {
        setError('Failed to save color palette settings: ' + colorPaletteError.message);
        console.error('Error saving color palette settings:', colorPaletteError);
        return;
      }

      // Save font settings
      const { error: fontSettingsError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'font_settings',
          value: 'default',
          font_settings_json: settings.font_settings
        }, { onConflict: 'key' });

      if (fontSettingsError) {
        setError('Failed to save font settings: ' + fontSettingsError.message);
        console.error('Error saving font settings:', fontSettingsError);
        return;
      }

      // Make sure any transparent or rgba values are converted to hex
      const fixedButtonSettings = {
        ...settings.button_settings,
        // Add new properties if needed
        primary_style: settings.button_settings.primary_style || 'solid',
        secondary_style: settings.button_settings.secondary_style || 'solid',
        text_size: settings.button_settings.text_size || 'md',
        secondary_text_size: settings.button_settings.secondary_text_size || 'md',
        hover_color: settings.button_settings.hover_color || '#333333',
        hover_text_color: settings.button_settings.hover_text_color || '#FFFFFF',
        secondary_hover_color: settings.button_settings.secondary_hover_color || '#444444',
        secondary_hover_text_color: settings.button_settings.secondary_hover_text_color || '#FFFFFF',
        border_radius_style: settings.button_settings.border_radius_style || 'small',
        secondary_border_radius_style: settings.button_settings.secondary_border_radius_style || 'small',
        gradient_direction: settings.button_settings.gradient_direction || 'to-right',
        gradient_from_color: settings.button_settings.gradient_from_color || '#3B82F6',
        gradient_to_color: settings.button_settings.gradient_to_color || '#8B5CF6',
        secondary_gradient_direction: settings.button_settings.secondary_gradient_direction || 'to-right',
        secondary_gradient_from_color: settings.button_settings.secondary_gradient_from_color || '#F59E0B',
        secondary_gradient_to_color: settings.button_settings.secondary_gradient_to_color || '#B91C1C'
      };
      
      // Convert any non-hex color values
      if (fixedButtonSettings.border_color === 'transparent') {
        fixedButtonSettings.border_color = '#000000';
      }
      if (fixedButtonSettings.secondary_bg_color && 
          (fixedButtonSettings.secondary_bg_color.includes('rgba') || 
           fixedButtonSettings.secondary_bg_color === 'transparent')) {
        fixedButtonSettings.secondary_bg_color = '#666666';
      }
      if (fixedButtonSettings.secondary_hover_color && 
          (fixedButtonSettings.secondary_hover_color.includes('rgba') || 
           fixedButtonSettings.secondary_hover_color === 'transparent')) {
        fixedButtonSettings.secondary_hover_color = '#444444';
      }
      if (fixedButtonSettings.secondary_border_color === 'transparent') {
        fixedButtonSettings.secondary_border_color = '#000000';
      }

      // Save button settings
      const { error: buttonSettingsError } = await supabase
        .from('site_settings')
        .upsert({
          key: 'button_settings',
          value: 'default',
          button_settings_json: fixedButtonSettings
        }, { onConflict: 'key' });

      if (buttonSettingsError) {
        setError('Failed to save button settings: ' + buttonSettingsError.message);
        console.error('Error saving button settings:', buttonSettingsError);
        return;
      }

      setSuccessMessage('Settings saved successfully!');
      
      // Force immediate application of theme by dispatching a custom event that GlobalStylesApplier listens for
      const settingsChangedEvent = new CustomEvent('globalSettingsChanged', {
        detail: {
          timestamp: Date.now(),
          settings: {
            button: fixedButtonSettings,
            font: settings.font_settings,
            color: settings.color_palette_settings
          }
        }
      });
      window.dispatchEvent(settingsChangedEvent);
      console.log('Dispatched globalSettingsChanged event to force theme application');
        
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error in handleSaveSettings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  // Color palette settings handlers
  /* Color palette functions temporarily disabled - will be reimplemented later
  const handlePaletteChange = (paletteId: string) => {
    setSettings({
      ...settings,
      color_palette_settings: {
        ...settings.color_palette_settings,
        globalPaletteId: paletteId
      }
    });
  };
  */

  const handleColorModeChange = (mode: 'uniform' | 'intercalated') => {
    setSettings(prev => {
      const updatedSettings = {
        ...prev,
        color_palette_settings: {
          ...prev.color_palette_settings,
          useUniformColors: mode === 'uniform',
          useIntercalatedColors: mode === 'intercalated',
          globalPaletteId: prev.color_palette_settings?.globalPaletteId || 'monochrome'
        }
      };
      return updatedSettings;
    });
  };

  const handleQuickPaletteSelect = (paletteId: string) => {
    setSettings(prev => ({
      ...prev,
      color_palette_settings: {
        ...prev.color_palette_settings!,
        globalPaletteId: paletteId
      }
    }));
  };

  const handleButtonSettingsChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => {
      // Deep clone to avoid reference issues
      const newSettings = JSON.parse(JSON.stringify(prev));
      
      // Special handling for secondary button gradient preview
      if (newSettings.button_settings.secondary_style === 'gradient') {
        const direction = newSettings.button_settings.secondary_gradient_direction && 
          newSettings.button_settings.secondary_gradient_direction.replace ? 
          newSettings.button_settings.secondary_gradient_direction.replace('to-', 'to ') : 'to right';
        
        // Update localStorage for secondary gradient preview
        let newDirection = direction;
        if (key === 'secondary_gradient_direction') newDirection = (value as string).replace ? (value as string).replace('to-', 'to ') : 'to right';
        
        localStorage.setItem('btn_secondary_gradient', `linear-gradient(${newDirection}, ${
          key === 'secondary_gradient_from_color' ? (value as string) : newSettings.button_settings.secondary_gradient_from_color
        }, ${
          key === 'secondary_gradient_to_color' ? (value as string) : newSettings.button_settings.secondary_gradient_to_color
        })`);
      }
      
      // Special handling for primary button gradient preview
      if (newSettings.button_settings.primary_style === 'gradient') {
        const direction = newSettings.button_settings.gradient_direction && 
          newSettings.button_settings.gradient_direction.replace ? 
          newSettings.button_settings.gradient_direction.replace('to-', 'to ') : 'to right';
        
        // Update localStorage for primary gradient preview
        let newDirection = direction;
        if (key === 'gradient_direction') newDirection = (value as string).replace ? (value as string).replace('to-', 'to ') : 'to right';
        
        localStorage.setItem('btn_gradient', `linear-gradient(${newDirection}, ${
          key === 'gradient_from_color' ? (value as string) : newSettings.button_settings.gradient_from_color
        }, ${
          key === 'gradient_to_color' ? (value as string) : newSettings.button_settings.gradient_to_color
        })`);
      }

      // Update the specific setting
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        newSettings[parent][child] = value;
      } else {
        newSettings.button_settings[key] = value;
      }
      
      return newSettings;
    });
  };

  // Handle applying pre-defined button themes
  const handleApplyTheme = (theme: string) => {
    setSettings(prev => {
      // Deep clone to avoid reference issues
      const newSettings = JSON.parse(JSON.stringify(prev));
      
      switch(theme) {
        case 'hogRed':
          // Primary
          newSettings.button_settings.bg_color = '#c81e1e';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#a51818';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'small';
          newSettings.button_settings.border_radius = '4px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - complementary
          newSettings.button_settings.secondary_bg_color = '#333333';
          newSettings.button_settings.secondary_text_color = '#ffffff';
          newSettings.button_settings.secondary_hover_color = '#111111';
          newSettings.button_settings.secondary_hover_text_color = '#ffffff';
          newSettings.button_settings.secondary_border_radius_style = 'small';
          newSettings.button_settings.secondary_border_radius = '4px';
          newSettings.button_settings.secondary_style = 'outline';
          newSettings.button_settings.secondary_border_color = '#c81e1e';
          newSettings.button_settings.secondary_border_width = '2px';
          break;
        case 'modernDark':
          // Primary
          newSettings.button_settings.bg_color = '#171717';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#000000';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'small';
          newSettings.button_settings.border_radius = '4px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - contrast
          newSettings.button_settings.secondary_bg_color = '#f5f5f5';
          newSettings.button_settings.secondary_text_color = '#171717';
          newSettings.button_settings.secondary_hover_color = '#e5e5e5';
          newSettings.button_settings.secondary_hover_text_color = '#000000';
          newSettings.button_settings.secondary_border_radius_style = 'small';
          newSettings.button_settings.secondary_border_radius = '4px';
          newSettings.button_settings.secondary_style = 'solid';
          break;
        case 'indigo':
          // Primary
          newSettings.button_settings.bg_color = '#4F46E5';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#4338CA';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - lighter
          newSettings.button_settings.secondary_bg_color = 'transparent';
          newSettings.button_settings.secondary_text_color = '#4F46E5';
          newSettings.button_settings.secondary_hover_color = '#EEF2FF';
          newSettings.button_settings.secondary_hover_text_color = '#4338CA';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          newSettings.button_settings.secondary_style = 'outline';
          newSettings.button_settings.secondary_border_color = '#4F46E5';
          newSettings.button_settings.secondary_border_width = '1px';
          break;
        case 'monochrome':
          // Primary
          newSettings.button_settings.bg_color = '#1F2937';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#111827';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'none';
          newSettings.button_settings.border_radius = '0px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - lighter gray
          newSettings.button_settings.secondary_bg_color = '#6B7280';
          newSettings.button_settings.secondary_text_color = '#ffffff';
          newSettings.button_settings.secondary_hover_color = '#4B5563';
          newSettings.button_settings.secondary_hover_text_color = '#ffffff';
          newSettings.button_settings.secondary_border_radius_style = 'none';
          newSettings.button_settings.secondary_border_radius = '0px';
          newSettings.button_settings.secondary_style = 'solid';
          break;
        case 'blue':
          // Primary
          newSettings.button_settings.bg_color = '#2563EB';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#1D4ED8';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - navy
          newSettings.button_settings.secondary_bg_color = '#1E3A8A';
          newSettings.button_settings.secondary_text_color = '#ffffff';
          newSettings.button_settings.secondary_hover_color = '#1E3070';
          newSettings.button_settings.secondary_hover_text_color = '#ffffff';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          newSettings.button_settings.secondary_style = 'solid';
          break;
        case 'green':
          // Primary
          newSettings.button_settings.bg_color = '#059669';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#047857';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - lighter green
          newSettings.button_settings.secondary_bg_color = '#10B981';
          newSettings.button_settings.secondary_text_color = '#ffffff';
          newSettings.button_settings.secondary_hover_color = '#059669';
          newSettings.button_settings.secondary_hover_text_color = '#ffffff';
          newSettings.button_settings.secondary_border_radius_style = 'full';
          newSettings.button_settings.secondary_border_radius = '9999px';
          newSettings.button_settings.secondary_style = 'solid';
          break;
        case 'amber':
          // Primary
          newSettings.button_settings.bg_color = '#D97706';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#B45309';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - golden
          newSettings.button_settings.secondary_bg_color = '#F59E0B';
          newSettings.button_settings.secondary_text_color = '#7C2D12';
          newSettings.button_settings.secondary_hover_color = '#FBBF24';
          newSettings.button_settings.secondary_hover_text_color = '#7C2D12';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          newSettings.button_settings.secondary_style = 'solid';
          break;
        case 'purple':
          // Primary
          newSettings.button_settings.bg_color = '#7C3AED';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#6D28D9';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - violet
          newSettings.button_settings.secondary_bg_color = '#8B5CF6';
          newSettings.button_settings.secondary_text_color = '#ffffff';
          newSettings.button_settings.secondary_hover_color = '#7C3AED';
          newSettings.button_settings.secondary_hover_text_color = '#ffffff';
          newSettings.button_settings.secondary_border_radius_style = 'large';
          newSettings.button_settings.secondary_border_radius = '8px';
          newSettings.button_settings.secondary_style = 'outline';
          newSettings.button_settings.secondary_border_color = '#4C1D95';
          newSettings.button_settings.secondary_border_width = '2px';
          break;
        case 'pink':
          // Primary
          newSettings.button_settings.bg_color = '#DB2777';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#BE185D';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'full';
          newSettings.button_settings.border_radius = '9999px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - lighter
          newSettings.button_settings.secondary_bg_color = '#EC4899';
          newSettings.button_settings.secondary_text_color = '#ffffff';
          newSettings.button_settings.secondary_hover_color = '#DB2777';
          newSettings.button_settings.secondary_hover_text_color = '#ffffff';
          newSettings.button_settings.secondary_border_radius_style = 'full';
          newSettings.button_settings.secondary_border_radius = '9999px';
          newSettings.button_settings.secondary_style = 'ghost';
          newSettings.button_settings.secondary_border_color = '#831843';
          newSettings.button_settings.secondary_border_width = '2px';
          break;
        case 'teal':
          // Primary
          newSettings.button_settings.bg_color = '#0D9488';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_color = '#0F766E';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          newSettings.button_settings.primary_style = 'solid';
          
          // Secondary - blue-teal
          newSettings.button_settings.secondary_bg_color = '#14B8A6';
          newSettings.button_settings.secondary_text_color = '#134E4A';
          newSettings.button_settings.secondary_hover_color = '#2DD4BF';
          newSettings.button_settings.secondary_hover_text_color = '#134E4A';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          newSettings.button_settings.secondary_style = 'ghost';
          newSettings.button_settings.secondary_border_color = '#0F766E';
          newSettings.button_settings.secondary_border_width = '2px';
          break;
        case 'redGradient':
          // Primary
          newSettings.button_settings.primary_style = 'gradient';
          newSettings.button_settings.gradient_direction = 'to-right';
          newSettings.button_settings.gradient_from_color = '#991B1B';
          newSettings.button_settings.gradient_to_color = '#EA580C';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          
          // Secondary
          newSettings.button_settings.secondary_style = 'outline';
          newSettings.button_settings.secondary_text_color = '#991B1B';
          newSettings.button_settings.secondary_bg_color = 'transparent';
          newSettings.button_settings.secondary_hover_color = '#FEF2F2';
          newSettings.button_settings.secondary_hover_text_color = '#7F1D1D';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          newSettings.button_settings.secondary_border_color = '#991B1B';
          newSettings.button_settings.secondary_border_width = '2px';
          break;
        case 'blueGradient':
          // Primary
          newSettings.button_settings.primary_style = 'gradient';
          newSettings.button_settings.gradient_direction = 'to-right';
          newSettings.button_settings.gradient_from_color = '#1E40AF';
          newSettings.button_settings.gradient_to_color = '#4338CA';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          
          // Secondary
          newSettings.button_settings.secondary_style = 'solid';
          newSettings.button_settings.secondary_bg_color = '#EEF2FF';
          newSettings.button_settings.secondary_text_color = '#1E40AF';
          newSettings.button_settings.secondary_hover_color = '#E0E7FF';
          newSettings.button_settings.secondary_hover_text_color = '#1E3A8A';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          break;
        case 'greenGradient':
          // Primary
          newSettings.button_settings.primary_style = 'gradient';
          newSettings.button_settings.gradient_direction = 'to-right';
          newSettings.button_settings.gradient_from_color = '#047857';
          newSettings.button_settings.gradient_to_color = '#065F46';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          
          // Secondary
          newSettings.button_settings.secondary_style = 'ghost';
          newSettings.button_settings.secondary_bg_color = 'transparent';
          newSettings.button_settings.secondary_text_color = '#047857';
          newSettings.button_settings.secondary_hover_color = '#ECFDF5';
          newSettings.button_settings.secondary_hover_text_color = '#065F46';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          newSettings.button_settings.secondary_border_color = '#047857';
          newSettings.button_settings.secondary_border_width = '1px';
          break;
        case 'purpleGradient':
          // Primary
          newSettings.button_settings.primary_style = 'gradient';
          newSettings.button_settings.gradient_direction = 'to-right';
          newSettings.button_settings.gradient_from_color = '#6D28D9';
          newSettings.button_settings.gradient_to_color = '#DB2777';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          
          // Secondary
          newSettings.button_settings.secondary_style = 'gradient';
          newSettings.button_settings.secondary_gradient_direction = 'to-right';
          newSettings.button_settings.secondary_gradient_from_color = '#4C1D95';
          newSettings.button_settings.secondary_gradient_to_color = '#831843';
          newSettings.button_settings.secondary_text_color = '#ffffff';
          newSettings.button_settings.secondary_hover_text_color = '#ffffff';
          newSettings.button_settings.secondary_border_radius_style = 'full';
          newSettings.button_settings.secondary_border_radius = '9999px';
          break;
        case 'darkGradient':
          // Primary
          newSettings.button_settings.primary_style = 'gradient';
          newSettings.button_settings.gradient_direction = 'to-right';
          newSettings.button_settings.gradient_from_color = '#111827';
          newSettings.button_settings.gradient_to_color = '#374151';
          newSettings.button_settings.text_color = '#ffffff';
          newSettings.button_settings.hover_text_color = '#ffffff';
          newSettings.button_settings.border_radius_style = 'medium';
          newSettings.button_settings.border_radius = '6px';
          
          // Secondary
          newSettings.button_settings.secondary_style = 'outline';
          newSettings.button_settings.secondary_bg_color = 'transparent';
          newSettings.button_settings.secondary_text_color = '#E5E7EB';
          newSettings.button_settings.secondary_hover_color = '#1F2937';
          newSettings.button_settings.secondary_hover_text_color = '#F3F4F6';
          newSettings.button_settings.secondary_border_radius_style = 'medium';
          newSettings.button_settings.secondary_border_radius = '6px';
          newSettings.button_settings.secondary_border_color = '#E5E7EB';
          newSettings.button_settings.secondary_border_width = '1px';
          break;
      }
      
      // Set text sizes
      newSettings.button_settings.text_size = 'md';
      newSettings.button_settings.secondary_text_size = 'md';
      
      return newSettings;
    });
  };

  // Handle font settings changes
  const handleFontSettingsChange = (key: string, value: string | boolean) => {
    setSettings(prev => {
      // Create a properly typed copy of the settings
      const newSettings: SiteSettings = {
        ...prev,
        font_settings: {
          ...prev.font_settings!,
          [key]: value
        }
      };
      
      // Apply changes immediately for preview
      if (key === 'enabled' && value === false) {
        // Remove font settings from document
        document.documentElement.style.removeProperty('--font-primary');
        document.documentElement.style.removeProperty('--font-secondary');
        document.documentElement.style.removeProperty('--font-body');
        document.documentElement.style.removeProperty('--font-heading');
      } else if (newSettings.font_settings?.enabled) {
        // Apply font settings to document - use non-null assertion as we've checked for enabled
        document.documentElement.style.setProperty('--font-primary', newSettings.font_settings.primary_font!);
        document.documentElement.style.setProperty('--font-secondary', newSettings.font_settings.secondary_font!);
        document.documentElement.style.setProperty('--font-body', newSettings.font_settings.body_font!);
        document.documentElement.style.setProperty('--font-heading', newSettings.font_settings.heading_font!);
        
        // Update Google Fonts link
        const fonts = [
          newSettings.font_settings.primary_font!,
          newSettings.font_settings.secondary_font!,
          newSettings.font_settings.body_font!,
          newSettings.font_settings.heading_font!
        ].filter((font, index, self) => self.indexOf(font) === index); // remove duplicates
        
        const fontLink = document.getElementById('google-fonts');
        if (fontLink) {
          // Cast to HTMLLinkElement to access href property
          (fontLink as HTMLLinkElement).setAttribute('href', 
            `https://fonts.googleapis.com/css2?family=${fonts.join('&family=').replace(/ /g, '+')}&display=swap`
          );
        }
      }
      
      return newSettings;
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="h-40 bg-gray-200 rounded mb-6"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Site Settings</h1>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  name="site_description"
                  value={settings.site_description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contact_email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                />
              </div>
            </div>
          </div>

          {/* Global Font Settings */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Global Font Settings</h2>
            
            <div className="mb-4 pb-3 border-b">
              <p className="text-sm text-gray-600 mb-2">
                These settings apply fonts across the entire site. Choose fonts that are legible and match your brand's style.
              </p>
            </div>

            {/* Font Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-md font-medium mb-3">Primary Font</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Used for primary interface elements, buttons, and important UI components.
                </p>
                <select
                  value={settings.font_settings!.primary_font}
                  onChange={(e) => handleFontSettingsChange('primary_font', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="Bahnschrift">Bahnschrift</option>
                  <option value="Baskerville">Baskerville</option>
                  <option value="Bookman Old Style">Bookman Old Style</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Cambria">Cambria</option>
                  <option value="Candara">Candara</option>
                  <option value="Century Gothic">Century Gothic</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Constantia">Constantia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Garamond">Garamond</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Impact">Impact</option>
                  <option value="Inter">Inter</option>
                  <option value="Lato">Lato</option>
                  <option value="Lucida Console">Lucida Console</option>
                  <option value="Lucida Sans">Lucida Sans</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Palatino">Palatino</option>
                  <option value="Perpetua">Perpetua</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Segoe UI">Segoe UI</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Verdana">Verdana</option>
                </select>
                
                <div className="mt-4 p-4 border rounded-md h-[180px]">
                  <div className="mb-2 text-sm text-gray-500">Primary Font Preview</div>
                  <div style={{ fontFamily: settings.font_settings!.primary_font }} className="text-xl">
                    The quick brown fox jumps over the lazy dog.
                  </div>
                  <div style={{ fontFamily: settings.font_settings!.primary_font }} className="text-sm mt-2">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                    abcdefghijklmnopqrstuvwxyz<br />
                    1234567890
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3">Secondary Font</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Used for secondary elements, less important buttons, and supporting UI elements.
                </p>
                <select
                  value={settings.font_settings!.secondary_font}
                  onChange={(e) => handleFontSettingsChange('secondary_font', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="Bahnschrift">Bahnschrift</option>
                  <option value="Baskerville">Baskerville</option>
                  <option value="Bookman Old Style">Bookman Old Style</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Cambria">Cambria</option>
                  <option value="Candara">Candara</option>
                  <option value="Century Gothic">Century Gothic</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Constantia">Constantia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Garamond">Garamond</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Impact">Impact</option>
                  <option value="Inter">Inter</option>
                  <option value="Lato">Lato</option>
                  <option value="Lucida Console">Lucida Console</option>
                  <option value="Lucida Sans">Lucida Sans</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Palatino">Palatino</option>
                  <option value="Perpetua">Perpetua</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Segoe UI">Segoe UI</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Verdana">Verdana</option>
                </select>
                
                <div className="mt-4 p-4 border rounded-md h-[180px]">
                  <div className="mb-2 text-sm text-gray-500">Secondary Font Preview</div>
                  <div style={{ fontFamily: settings.font_settings!.secondary_font }} className="text-xl">
                    The quick brown fox jumps over the lazy dog.
                  </div>
                  <div style={{ fontFamily: settings.font_settings!.secondary_font }} className="text-sm mt-2">
                    ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
                    abcdefghijklmnopqrstuvwxyz<br />
                    1234567890
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-md font-medium mb-3">Body Text Font</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Used for paragraphs, general text content, descriptions, and longer text passages.
                </p>
                <select
                  value={settings.font_settings!.body_font}
                  onChange={(e) => handleFontSettingsChange('body_font', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="Bahnschrift">Bahnschrift</option>
                  <option value="Baskerville">Baskerville</option>
                  <option value="Bookman Old Style">Bookman Old Style</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Cambria">Cambria</option>
                  <option value="Candara">Candara</option>
                  <option value="Century Gothic">Century Gothic</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Constantia">Constantia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Garamond">Garamond</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Impact">Impact</option>
                  <option value="Inter">Inter</option>
                  <option value="Lato">Lato</option>
                  <option value="Lucida Console">Lucida Console</option>
                  <option value="Lucida Sans">Lucida Sans</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Palatino">Palatino</option>
                  <option value="Perpetua">Perpetua</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Segoe UI">Segoe UI</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Verdana">Verdana</option>
                </select>
                
                <div className="mt-4 p-4 border rounded-md h-[180px] overflow-y-auto">
                  <div className="mb-2 text-sm text-gray-500">Body Text Preview</div>
                  <p style={{ fontFamily: settings.font_settings!.body_font }} className="text-base">
                    This is an example of body text. The font you choose here will be used for paragraphs and general content throughout the site. It should be easy to read at small sizes and look good in longer blocks of text.
                  </p>
                  <p style={{ fontFamily: settings.font_settings!.body_font }} className="text-base mt-2">
                    At House of Grappling, we offer world-class martial arts training in a supportive environment for students of all levels.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-3">Heading Font</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Used for page titles, section headings, and important headlines throughout the site.
                </p>
                <select
                  value={settings.font_settings!.heading_font}
                  onChange={(e) => handleFontSettingsChange('heading_font', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Arial Black">Arial Black</option>
                  <option value="Bahnschrift">Bahnschrift</option>
                  <option value="Baskerville">Baskerville</option>
                  <option value="Bookman Old Style">Bookman Old Style</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Cambria">Cambria</option>
                  <option value="Candara">Candara</option>
                  <option value="Century Gothic">Century Gothic</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Consolas">Consolas</option>
                  <option value="Constantia">Constantia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Garamond">Garamond</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Impact">Impact</option>
                  <option value="Inter">Inter</option>
                  <option value="Lato">Lato</option>
                  <option value="Lucida Console">Lucida Console</option>
                  <option value="Lucida Sans">Lucida Sans</option>
                  <option value="Merriweather">Merriweather</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Palatino">Palatino</option>
                  <option value="Perpetua">Perpetua</option>
                  <option value="Playfair Display">Playfair Display</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Raleway">Raleway</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Segoe UI">Segoe UI</option>
                  <option value="Source Sans Pro">Source Sans Pro</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Verdana">Verdana</option>
                </select>
                
                <div className="mt-4 p-4 border rounded-md h-[180px]">
                  <div className="mb-2 text-sm text-gray-500">Heading Preview</div>
                  <h1 style={{ fontFamily: settings.font_settings!.heading_font }} className="text-2xl font-bold">
                    This is a Heading 1
                  </h1>
                  <h2 style={{ fontFamily: settings.font_settings!.heading_font }} className="text-xl font-semibold mt-2">
                    This is a Heading 2
                  </h2>
                  <h3 style={{ fontFamily: settings.font_settings!.heading_font }} className="text-lg font-medium mt-2">
                    This is a Heading 3
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Real-time Preview */}
            <div className="mt-6 p-4 bg-gray-50 border rounded-md">
              <h3 className="font-medium mb-3">Combined Preview</h3>
              <div className="border-b pb-3 mb-3">
                <h2 style={{ fontFamily: settings.font_settings!.heading_font }} className="text-xl font-bold mb-2">
                  House of Grappling
                </h2>
                <p style={{ fontFamily: settings.font_settings!.body_font }} className="text-base mb-4">
                  Welcome to House of Grappling, the premier training facility for Brazilian Jiu-Jitsu and submission grappling in the area. Our world-class instructors are dedicated to helping you achieve your martial arts goals.
                </p>
                <div className="flex gap-3">
                  <button
                    style={{
                      fontFamily: settings.font_settings!.primary_font,
                      backgroundColor: '#c81e1e',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem'
                    }}
                  >
                    Join Now
                  </button>
                  <button
                    style={{
                      fontFamily: settings.font_settings!.secondary_font,
                      border: '1px solid #c81e1e',
                      color: '#c81e1e',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'transparent'
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>This preview shows how your selected fonts work together:</p>
                <ul className="list-disc pl-5 mt-1">
                  <li><strong>Heading Font:</strong> Used for the page title "House of Grappling"</li>
                  <li><strong>Body Font:</strong> Used for the paragraph text</li>
                  <li><strong>Primary Font:</strong> Used for the "Join Now" button</li>
                  <li><strong>Secondary Font:</strong> Used for the "Learn More" button</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Color Palette Settings */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Color Palette Settings</h2>
            
            {/* Quick palette selection buttons */}
            <div className="mb-6">
              <h3 className="text-md font-medium mb-3">Quick Select Palette</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPaletteSelect('hog_brand')}
                  className={`px-3 py-2 border rounded-md flex items-center gap-2 transition ${
                    settings.color_palette_settings?.globalPaletteId === 'hog_brand'
                      ? 'bg-red-700 text-white border-red-800'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-[#B91C1C]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#0F172A]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#F1F5F9]"></div>
                  </div>
                  House of Grappling
                </button>
                
                <button
                  type="button"
                  onClick={() => handleQuickPaletteSelect('modern_contrast')}
                  className={`px-3 py-2 border rounded-md flex items-center gap-2 transition ${
                    settings.color_palette_settings?.globalPaletteId === 'modern_contrast'
                      ? 'bg-indigo-600 text-white border-indigo-700'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-gray-300"></div>
                    <div className="w-4 h-4 rounded-full bg-[#111827]"></div>
                    <div className="w-4 h-4 rounded-full bg-[#4F46E5]"></div>
                  </div>
                  Modern Contrast
                </button>
                
                <button
                  type="button"
                  onClick={() => handleQuickPaletteSelect('monochrome')}
                  className={`px-3 py-2 border rounded-md flex items-center gap-2 transition ${
                    settings.color_palette_settings?.globalPaletteId === 'monochrome'
                      ? 'bg-gray-800 text-white border-gray-900'
                      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-800"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                  </div>
                  Monochrome
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Color Palette
              </label>
              {/* Color palette selector temporarily disabled - will be reimplemented later
              <ColorPaletteSelector
                selectedPaletteId={settings.color_palette_settings?.globalPaletteId || 'monochrome'}
                onChange={handlePaletteChange}
                customPalettes={[]}
                allowCustomPalette={true}
                allowEditing={true}
              />
              */}
              <div className="p-3 bg-gray-100 rounded border border-gray-300 text-sm">
                <strong>Note:</strong> Color palette configuration is temporarily disabled. 
                The admin section now uses a fixed black, white, and grey color scheme.
              </div>
            </div>
            
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div 
                  className={`p-4 border rounded-md cursor-pointer ${
                    settings.color_palette_settings?.useUniformColors ? 'bg-neutral-50 border-neutral-800' : 'border-gray-200'
                  }`} 
                  onClick={() => handleColorModeChange('uniform')}
                >
                  <div className="mb-2 font-medium">Uniform Colors</div>
                  <div className="text-sm text-gray-600">All sections use the same color scheme for consistency</div>
                  <div className="mt-3 flex gap-1">
                    <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded"></div>
                  </div>
                </div>
                
                <div 
                  className={`p-4 border rounded-md cursor-pointer ${
                    settings.color_palette_settings?.useIntercalatedColors ? 'bg-neutral-50 border-neutral-800' : 'border-gray-200'
                  }`}
                  onClick={() => handleColorModeChange('intercalated')}
                >
                  <div className="mb-2 font-medium">Alternating Colors</div>
                  <div className="text-sm text-gray-600">Sections alternate between different colors for visual interest</div>
                  <div className="mt-3 flex gap-1">
                    <div className="w-8 h-8 bg-white border border-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-100 border border-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-white border border-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Global Button Settings - New Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Global Button Settings</h2>
            
            <div className="mb-4 pb-3 border-b">
              <p className="text-sm text-gray-600 mb-2">
                These settings provide default styles for buttons across the site. Individual components can choose whether to use these global styles or override them.
              </p>
            </div>

            {/* Live Button Preview */}
            <div className="mb-6 p-4 bg-gray-50 border rounded-md">
              <h3 className="font-medium mb-3">Live Preview</h3>
              <div className="flex flex-wrap gap-3 mb-2">
                <button 
                  style={{
                    background: settings.button_settings.primary_style === 'gradient' 
                      ? `linear-gradient(${settings.button_settings.gradient_direction && settings.button_settings.gradient_direction.replace ? settings.button_settings.gradient_direction.replace('to-', 'to ') : 'to right'}, ${settings.button_settings.gradient_from_color || '#000'}, ${settings.button_settings.gradient_to_color || '#333'})` 
                      : (settings.button_settings.primary_style === 'ghost' ? 'transparent' : settings.button_settings.bg_color),
                    color: settings.button_settings.text_color,
                    padding: `${settings.button_settings.padding_y} ${settings.button_settings.padding_x}`,
                    borderRadius: settings.button_settings.border_radius,
                    width: settings.button_settings.fixed_width ? settings.button_settings.width : 'auto',
                    height: settings.button_settings.fixed_width ? settings.button_settings.height : 'auto',
                    fontWeight: settings.button_settings.font_weight,
                    fontSize: getFontSizeValue(settings.button_settings.text_size || 'md'),
                    border: settings.button_settings.primary_style === 'outline' || settings.button_settings.primary_style === 'ghost' 
                      ? `${settings.button_settings.border_width} solid ${settings.button_settings.border_color}` 
                      : '0px solid transparent',
                    transition: `all ${settings.button_settings.transition_speed} ease`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className={`hover:opacity-90 ${settings.button_settings.primary_style === 'ghost' ? 'hover:bg-gray-100' : ''}`}
                  onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (settings.button_settings.primary_style !== 'gradient') {
                      e.currentTarget.style.backgroundColor = settings.button_settings.hover_color;
                    }
                    e.currentTarget.style.color = settings.button_settings.hover_text_color;
                  }}
                  onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (settings.button_settings.primary_style === 'solid') {
                      e.currentTarget.style.backgroundColor = settings.button_settings.bg_color;
                    } else if (settings.button_settings.primary_style === 'ghost' || settings.button_settings.primary_style === 'outline') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                    e.currentTarget.style.color = settings.button_settings.text_color;
                  }}
                >
                  Primary Button
                </button>
                <button 
                  style={{
                    background: settings.button_settings.secondary_style === 'gradient' 
                      ? `linear-gradient(${settings.button_settings.secondary_gradient_direction && settings.button_settings.secondary_gradient_direction.replace ? settings.button_settings.secondary_gradient_direction.replace('to-', 'to ') : 'to right'}, ${settings.button_settings.secondary_gradient_from_color || '#000'}, ${settings.button_settings.secondary_gradient_to_color || '#333'})` 
                      : (settings.button_settings.secondary_style === 'ghost' ? 'transparent' : settings.button_settings.secondary_bg_color),
                    color: settings.button_settings.secondary_text_color,
                    padding: `${settings.button_settings.padding_y} ${settings.button_settings.padding_x}`,
                    borderRadius: settings.button_settings.secondary_border_radius,
                    width: settings.button_settings.fixed_width ? settings.button_settings.secondary_width : 'auto',
                    height: settings.button_settings.fixed_width ? settings.button_settings.secondary_height : 'auto',
                    fontWeight: settings.button_settings.font_weight,
                    fontSize: getFontSizeValue(settings.button_settings.secondary_text_size || 'md'),
                    border: settings.button_settings.secondary_style === 'outline' || settings.button_settings.secondary_style === 'ghost' 
                      ? `${settings.button_settings.secondary_border_width} solid ${settings.button_settings.secondary_border_color}` 
                      : '0px solid transparent',
                    transition: `all ${settings.button_settings.transition_speed} ease`,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className={`hover:opacity-90 ${settings.button_settings.secondary_style === 'ghost' ? 'hover:bg-gray-100' : ''}`}
                  onMouseOver={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (settings.button_settings.secondary_style !== 'gradient') {
                      e.currentTarget.style.backgroundColor = settings.button_settings.secondary_hover_color;
                    }
                    e.currentTarget.style.color = settings.button_settings.secondary_hover_text_color;
                  }}
                  onMouseOut={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (settings.button_settings.secondary_style === 'solid') {
                      e.currentTarget.style.backgroundColor = settings.button_settings.secondary_bg_color;
                    } else if (settings.button_settings.secondary_style === 'ghost' || settings.button_settings.secondary_style === 'outline') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                    e.currentTarget.style.color = settings.button_settings.secondary_text_color;
                  }}
                >
                  Secondary Button
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Preview shows current button styles with hover effects. Try hovering to see changes.
              </div>
            </div>

            {/* Button Theme Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Button Themes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a predefined theme or customize your buttons below.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Solid button themes */}
                {[
                  { id: 'hogRed', name: 'HOG Red', primaryColor: '#c81e1e', secondaryColor: '#333333' },
                  { id: 'modernDark', name: 'Modern Dark', primaryColor: '#171717', secondaryColor: '#f5f5f5' },
                  { id: 'indigo', name: 'Indigo', primaryColor: '#4F46E5', secondaryColor: '#ffffff' },
                  { id: 'monochrome', name: 'Monochrome', primaryColor: '#1F2937', secondaryColor: '#6B7280' },
                  { id: 'blue', name: 'Blue', primaryColor: '#2563EB', secondaryColor: '#1E3A8A' },
                  { id: 'green', name: 'Green', primaryColor: '#059669', secondaryColor: '#10B981' },
                  { id: 'amber', name: 'Amber', primaryColor: '#D97706', secondaryColor: '#F59E0B' },
                  { id: 'purple', name: 'Purple', primaryColor: '#7C3AED', secondaryColor: '#8B5CF6' },
                  { id: 'pink', name: 'Pink', primaryColor: '#DB2777', secondaryColor: '#EC4899' },
                  { id: 'teal', name: 'Teal', primaryColor: '#0D9488', secondaryColor: '#14B8A6' }
                ].map(theme => {
                  // Check if this theme matches the selected button settings
                  const isSelected = settings.button_settings.bg_color.toLowerCase() === theme.primaryColor.toLowerCase();
                  
                  return (
                    <div 
                      key={theme.id}
                      className={`relative p-4 border rounded-md hover:border-gray-400 transition-all ${isSelected ? 'border-neutral-800 bg-neutral-50' : 'border-gray-200'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-background text-white text-xs px-2 py-0.5 rounded">
                          Selected
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{theme.name}</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded-full" style={{backgroundColor: theme.primaryColor}}></div>
                          <div className="w-4 h-4 rounded-full" style={{backgroundColor: theme.secondaryColor, border: theme.secondaryColor === '#ffffff' ? '1px solid #e5e5e5' : 'none'}}></div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <div className="rounded px-3 py-1 text-xs" style={{backgroundColor: theme.primaryColor, color: '#ffffff'}}>Primary</div>
                        <div className="rounded px-3 py-1 text-xs" style={{
                          backgroundColor: theme.id === 'indigo' ? 'transparent' : theme.secondaryColor, 
                          color: theme.id === 'indigo' ? theme.primaryColor : (theme.id === 'modernDark' ? '#171717' : '#ffffff'),
                          border: theme.id === 'indigo' ? `1px solid ${theme.primaryColor}` : 'none'
                        }}>Secondary</div>
                      </div>
                      
                      <div className="mt-3 flex justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyTheme(theme.id)}
                          className="flex-1 text-xs px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded transition-colors"
                        >
                          Select
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleApplyTheme(theme.id);
                            setEditingButtonTheme(true);
                          }}
                          className="flex-1 text-xs px-3 py-1 text-neutral-700 hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Gradient themes */}
                <div className="col-span-1 sm:col-span-2 md:col-span-3 mt-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-500">Gradient Themes</h4>
                </div>
                
                {[
                  { id: 'redGradient', name: 'Red Gradient', fromColor: '#991B1B', toColor: '#EA580C' },
                  { id: 'blueGradient', name: 'Blue Gradient', fromColor: '#1E40AF', toColor: '#4338CA' },
                  { id: 'greenGradient', name: 'Green Gradient', fromColor: '#047857', toColor: '#065F46' },
                  { id: 'purpleGradient', name: 'Purple Gradient', fromColor: '#6D28D9', toColor: '#DB2777' },
                  { id: 'darkGradient', name: 'Dark Gradient', fromColor: '#111827', toColor: '#374151' }
                ].map(theme => {
                  // Check if this theme matches the selected gradient
                  const isSelected = settings.button_settings.primary_style === 'gradient' && 
                                     settings.button_settings.gradient_from_color.toLowerCase() === theme.fromColor.toLowerCase() &&
                                     settings.button_settings.gradient_to_color.toLowerCase() === theme.toColor.toLowerCase();
                  
                  return (
                    <div 
                      key={theme.id}
                      className={`relative p-4 border rounded-md hover:border-gray-400 transition-all ${isSelected ? 'border-neutral-800 bg-neutral-50' : 'border-gray-200'}`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-background text-white text-xs px-2 py-0.5 rounded">
                          Selected
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{theme.name}</span>
                        <div className="w-12 h-4 rounded" style={{background: `linear-gradient(to right, ${theme.fromColor}, ${theme.toColor})`}}></div>
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <div className="rounded px-3 py-1 text-white text-xs" style={{background: `linear-gradient(to right, ${theme.fromColor}, ${theme.toColor})`}}>Primary</div>
                        <div className="rounded px-3 py-1 text-xs" style={{
                          backgroundColor: theme.id === 'blueGradient' ? '#EEF2FF' : 'transparent',
                          color: theme.id === 'darkGradient' ? '#E5E7EB' : (theme.id === 'blueGradient' ? '#1E40AF' : theme.fromColor),
                          border: theme.id !== 'blueGradient' ? `1px solid ${theme.id === 'darkGradient' ? '#E5E7EB' : theme.fromColor}` : 'none'
                        }}>Secondary</div>
                      </div>
                      
                      <div className="mt-3 flex justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyTheme(theme.id)}
                          className="flex-1 text-xs px-3 py-1 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded transition-colors"
                        >
                          Select
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleApplyTheme(theme.id);
                            setEditingButtonTheme(true);
                          }}
                          className="flex-1 text-xs px-3 py-1 text-neutral-700 hover:bg-neutral-100 border border-neutral-300 rounded transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                {/* Create custom button theme */}
                <div 
                  className="p-4 border border-dashed border-neutral-300 rounded-md hover:border-gray-400 transition-all"
                >
                  <div className="flex items-center justify-center h-full">
                    <button
                      type="button"
                      onClick={() => setEditingButtonTheme(true)}
                      className="text-center"
                    >
                      <div className="flex justify-center mb-2">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      </div>
                      <div className="font-medium">Create Custom</div>
                      <div className="text-xs text-gray-500 mt-1">Define your own button style</div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Button Settings - Only shown when editing */}
            {editingButtonTheme && (
            <div className="mb-6 p-6 border rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Primary Button Settings</h3>
                <button
                  type="button"
                  onClick={() => setEditingButtonTheme(false)}
                  className="text-sm text-neutral-600 hover:text-neutral-800"
                >
                  Hide Settings
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Button Style</label>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('primary_style', 'solid')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.primary_style === 'solid' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Solid
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('primary_style', 'outline')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.primary_style === 'outline' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Outline
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('primary_style', 'ghost')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.primary_style === 'ghost' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Ghost
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('primary_style', 'gradient')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.primary_style === 'gradient' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Gradient
                  </button>
                </div>
              </div>
              
              {/* Fixed Width Toggle */}
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="fixed-width-toggle"
                  checked={settings.button_settings.fixed_width}
                  onChange={(e) => handleButtonSettingsChange('fixed_width', e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="fixed-width-toggle" className="text-sm font-medium">
                  Use Fixed Width/Height
                </label>
              </div>
              
              {/* Width and Height Settings */}
              {settings.button_settings.fixed_width && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Width: {parseInt(settings.button_settings.width)}px
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="range"
                        min="100"
                        max="300"
                        value={parseInt(settings.button_settings.width)}
                        onChange={(e) => handleButtonSettingsChange('width', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Height: {parseInt(settings.button_settings.height)}px
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="range"
                        min="30"
                        max="100"
                        value={parseInt(settings.button_settings.height)}
                        onChange={(e) => handleButtonSettingsChange('height', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Text Size - Changed to dropdown */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Size</label>
                  <select
                    value={settings.button_settings.text_size}
                    onChange={(e) => handleButtonSettingsChange('text_size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="xs">Extra Small (XS)</option>
                    <option value="sm">Small (SM)</option>
                    <option value="md">Medium (MD)</option>
                    <option value="lg">Large (LG)</option>
                    <option value="xl">Extra Large (XL)</option>
                  </select>
                </div>
                
                {/* Border Radius - Changed to dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">Border Radius</label>
                  <select
                    value={settings.button_settings.border_radius_style}
                    onChange={(e) => {
                      const style = e.target.value as 'none' | 'small' | 'medium' | 'large' | 'full';
                      handleButtonSettingsChange('border_radius_style', style);
                      
                      // Set the appropriate border radius value based on the style
                      let radiusValue = '0px';
                      switch(style) {
                        case 'none': radiusValue = '0px'; break;
                        case 'small': radiusValue = '4px'; break;
                        case 'medium': radiusValue = '6px'; break;
                        case 'large': radiusValue = '8px'; break;
                        case 'full': radiusValue = '9999px'; break;
                      }
                      handleButtonSettingsChange('border_radius', radiusValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="none">None (0px)</option>
                    <option value="small">Small (4px)</option>
                    <option value="medium">Medium (6px)</option>
                    <option value="large">Large (8px)</option>
                    <option value="full">Full (Rounded)</option>
                  </select>
                </div>
              </div>

              {/* Color Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.text_color}
                    onChange={(e) => handleButtonSettingsChange('text_color', e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.bg_color}
                    onChange={(e) => handleButtonSettingsChange('bg_color', e.target.value)}
                    className="h-10 w-full"
                    disabled={settings.button_settings.primary_style === 'gradient' || settings.button_settings.primary_style === 'ghost'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hover Text Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.hover_text_color}
                    onChange={(e) => handleButtonSettingsChange('hover_text_color', e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hover Background Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.hover_color}
                    onChange={(e) => handleButtonSettingsChange('hover_color', e.target.value)}
                    className="h-10 w-full"
                    disabled={settings.button_settings.primary_style === 'gradient'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Border Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.border_color}
                    onChange={(e) => handleButtonSettingsChange('border_color', e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Border Width: {parseInt(settings.button_settings.border_width)}px
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={parseInt(settings.button_settings.border_width)}
                      onChange={(e) => handleButtonSettingsChange('border_width', `${e.target.value}px`)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Gradient Settings */}
              {settings.button_settings.primary_style === 'gradient' && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Gradient Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">From Color</label>
                      <input 
                        type="color"
                        value={settings.button_settings.gradient_from_color}
                        onChange={(e) => handleButtonSettingsChange('gradient_from_color', e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">To Color</label>
                      <input 
                        type="color"
                        value={settings.button_settings.gradient_to_color}
                        onChange={(e) => handleButtonSettingsChange('gradient_to_color', e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                  
                  <label className="block text-sm font-medium mb-1">Gradient Direction</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('gradient_direction', 'to-right')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.gradient_direction === 'to-right' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      →
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('gradient_direction', 'to-bottom')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.gradient_direction === 'to-bottom' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ↓
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('gradient_direction', 'to-br')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.gradient_direction === 'to-br' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ↘
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('gradient_direction', 'to-tr')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.gradient_direction === 'to-tr' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ↗
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Secondary Button Settings - Only shown when editing */}
            {editingButtonTheme && (
            <div className="mb-6 p-6 border rounded-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Secondary Button Settings</h3>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Button Style</label>
                <div className="grid grid-cols-4 gap-2">
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('secondary_style', 'solid')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.secondary_style === 'solid' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Solid
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('secondary_style', 'outline')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.secondary_style === 'outline' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Outline
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('secondary_style', 'ghost')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.secondary_style === 'ghost' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Ghost
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleButtonSettingsChange('secondary_style', 'gradient')}
                    className={`px-4 py-2 text-sm rounded ${
                      settings.button_settings.secondary_style === 'gradient' 
                        ? 'bg-neutral-800 text-white' 
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Gradient
                  </button>
                </div>
              </div>
              
              {/* Width and Height Settings (only shown when fixed_width is enabled) */}
              {settings.button_settings.fixed_width && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Width: {parseInt(settings.button_settings.secondary_width)}px
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="range"
                        min="100"
                        max="300"
                        value={parseInt(settings.button_settings.secondary_width)}
                        onChange={(e) => handleButtonSettingsChange('secondary_width', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Height: {parseInt(settings.button_settings.secondary_height)}px
                    </label>
                    <div className="flex items-center">
                      <input 
                        type="range"
                        min="30"
                        max="100"
                        value={parseInt(settings.button_settings.secondary_height)}
                        onChange={(e) => handleButtonSettingsChange('secondary_height', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Text Size - Changed to dropdown */}
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Size</label>
                  <select
                    value={settings.button_settings.secondary_text_size}
                    onChange={(e) => handleButtonSettingsChange('secondary_text_size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="xs">Extra Small (XS)</option>
                    <option value="sm">Small (SM)</option>
                    <option value="md">Medium (MD)</option>
                    <option value="lg">Large (LG)</option>
                    <option value="xl">Extra Large (XL)</option>
                  </select>
                </div>
                
                {/* Border Radius - Changed to dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-1">Border Radius</label>
                  <select
                    value={settings.button_settings.secondary_border_radius_style}
                    onChange={(e) => {
                      const style = e.target.value as 'none' | 'small' | 'medium' | 'large' | 'full';
                      handleButtonSettingsChange('secondary_border_radius_style', style);
                      
                      // Set the appropriate border radius value based on the style
                      let radiusValue = '0px';
                      switch(style) {
                        case 'none': radiusValue = '0px'; break;
                        case 'small': radiusValue = '4px'; break;
                        case 'medium': radiusValue = '6px'; break;
                        case 'large': radiusValue = '8px'; break;
                        case 'full': radiusValue = '9999px'; break;
                      }
                      handleButtonSettingsChange('secondary_border_radius', radiusValue);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500"
                  >
                    <option value="none">None (0px)</option>
                    <option value="small">Small (4px)</option>
                    <option value="medium">Medium (6px)</option>
                    <option value="large">Large (8px)</option>
                    <option value="full">Full (Rounded)</option>
                  </select>
                </div>
              </div>

              {/* Color Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Text Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.secondary_text_color}
                    onChange={(e) => handleButtonSettingsChange('secondary_text_color', e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Background Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.secondary_bg_color}
                    onChange={(e) => handleButtonSettingsChange('secondary_bg_color', e.target.value)}
                    className="h-10 w-full"
                    disabled={settings.button_settings.secondary_style === 'gradient' || settings.button_settings.secondary_style === 'ghost'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hover Text Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.secondary_hover_text_color}
                    onChange={(e) => handleButtonSettingsChange('secondary_hover_text_color', e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hover Background Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.secondary_hover_color}
                    onChange={(e) => handleButtonSettingsChange('secondary_hover_color', e.target.value)}
                    className="h-10 w-full"
                    disabled={settings.button_settings.secondary_style === 'gradient'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Border Color</label>
                  <input 
                    type="color"
                    value={settings.button_settings.secondary_border_color}
                    onChange={(e) => handleButtonSettingsChange('secondary_border_color', e.target.value)}
                    className="h-10 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Border Width: {parseInt(settings.button_settings.secondary_border_width)}px
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={parseInt(settings.button_settings.secondary_border_width)}
                      onChange={(e) => handleButtonSettingsChange('secondary_border_width', `${e.target.value}px`)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Gradient Settings */}
              {settings.button_settings.secondary_style === 'gradient' && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Gradient Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">From Color</label>
                      <input 
                        type="color"
                        value={settings.button_settings.secondary_gradient_from_color}
                        onChange={(e) => handleButtonSettingsChange('secondary_gradient_from_color', e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">To Color</label>
                      <input 
                        type="color"
                        value={settings.button_settings.secondary_gradient_to_color}
                        onChange={(e) => handleButtonSettingsChange('secondary_gradient_to_color', e.target.value)}
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                  
                  <label className="block text-sm font-medium mb-1">Gradient Direction</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('secondary_gradient_direction', 'to-right')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.secondary_gradient_direction === 'to-right' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      →
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('secondary_gradient_direction', 'to-bottom')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.secondary_gradient_direction === 'to-bottom' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ↓
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('secondary_gradient_direction', 'to-br')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.secondary_gradient_direction === 'to-br' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ↘
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleButtonSettingsChange('secondary_gradient_direction', 'to-tr')}
                      className={`px-3 py-2 text-sm rounded flex items-center justify-center ${
                        settings.button_settings.secondary_gradient_direction === 'to-tr' 
                          ? 'bg-neutral-800 text-white' 
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      ↗
                    </button>
                  </div>
                </div>
              )}
            </div>
            )}
          </div>
          {/* Wrap adjacent elements with a fragment */}
          <>
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="px-4 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 