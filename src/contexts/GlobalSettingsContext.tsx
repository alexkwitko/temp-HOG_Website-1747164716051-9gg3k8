import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';

// Define types for the settings
export type ButtonSettings = {
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

export type FontSettings = {
  enabled: boolean;
  primary_font: string;
  secondary_font: string;
  body_font: string;
  heading_font: string;
};

export type ColorPaletteSettings = {
  globalPaletteId: string;
  homePagePaletteId?: string;
  useIntercalatedColors?: boolean;
  useUniformColors?: boolean;
};

export type GlobalSettings = {
  button_settings?: ButtonSettings;
  font_settings?: FontSettings;
  color_palette_settings?: ColorPaletteSettings;
  isLoading: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
};

// Default settings that will be used if there's an error or while loading
const defaultButtonSettings: ButtonSettings = {
  enabled: true,
  fixed_width: false,
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
  border_radius_style: 'small',
  border_width: '0px',
  border_color: 'var(--color-text)',
  transition_speed: '300ms',
  primary_style: 'solid',
  secondary_text_color: 'var(--color-background)',
  secondary_bg_color: '#666666',
  secondary_hover_color: '#444444',
  secondary_hover_text_color: 'var(--color-background)',
  secondary_width: '180px',
  secondary_height: '48px',
  secondary_border_radius: '0.25rem',
  secondary_border_radius_style: 'small',
  secondary_border_width: '1px',
  secondary_border_color: 'var(--color-background)',
  secondary_style: 'solid',
  text_size: 'md',
  secondary_text_size: 'md',
  gradient_direction: 'to-right',
  gradient_from_color: 'var(--color-primary)',
  gradient_to_color: 'var(--color-secondary)',
  secondary_gradient_direction: 'to-right',
  secondary_gradient_from_color: 'var(--color-secondary)',
  secondary_gradient_to_color: 'var(--color-primary)'
};

const defaultFontSettings: FontSettings = {
  enabled: true,
  primary_font: 'Verdana',
  secondary_font: 'Verdana',
  body_font: 'Verdana',
  heading_font: 'Verdana'
};

const defaultColorPaletteSettings: ColorPaletteSettings = {
  globalPaletteId: 'monochrome',
  useUniformColors: true
};

// Create the context
const GlobalSettingsContext = createContext<GlobalSettings>({
  button_settings: defaultButtonSettings,
  font_settings: defaultFontSettings,
  color_palette_settings: defaultColorPaletteSettings,
  isLoading: true,
  isError: false,
  refetch: async () => {}
});

// Custom hook to use the settings
export const useGlobalSettings = () => useContext(GlobalSettingsContext);

// Provider component
export const GlobalSettingsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const isLoadingRef = useRef(false);
  const [settings, setSettings] = useState<GlobalSettings>({
    button_settings: defaultButtonSettings,
    font_settings: defaultFontSettings,
    color_palette_settings: defaultColorPaletteSettings,
    isLoading: true,
    isError: false,
    refetch: async (): Promise<void> => { await fetchSettings(); }
  });

  // Function to fetch settings from database
  const fetchSettings = useCallback(async (): Promise<void> => {
    console.log('Fetching global settings...');
    
    // Use ref to prevent multiple concurrent fetch requests
    if (isLoadingRef.current) {
      console.log('Already loading settings, skipping duplicate fetch');
      return;
    }
    
    isLoadingRef.current = true;
    setSettings(prev => ({ ...prev, isLoading: true, isError: false }));
    try {
      // Get button settings
      const { data: buttonData, error: buttonError } = await supabase
        .from('site_settings')
        .select('button_settings_json')
        .eq('key', 'button_settings')
        .single();
      
      if (buttonError && buttonError.code !== 'PGRST116') {
        console.error('Error fetching button settings:', buttonError);
        throw buttonError;
      }
      
      // Get font settings
      const { data: fontData, error: fontError } = await supabase
        .from('site_settings')
        .select('font_settings_json')
        .eq('key', 'font_settings')
        .single();
      
      if (fontError && fontError.code !== 'PGRST116') {
        console.error('Error fetching font settings:', fontError);
        throw fontError;
      }
      
      // Get color palette settings
      const { data: colorPaletteData, error: colorPaletteError } = await supabase
        .from('site_settings')
        .select('color_palette_settings_json')
        .eq('key', 'color_palette')
        .single();
      
      if (colorPaletteError && colorPaletteError.code !== 'PGRST116') {
        console.error('Error fetching color palette settings:', colorPaletteError);
        throw colorPaletteError;
      }
      
      console.log('Global settings loaded successfully:', {
        button: buttonData?.button_settings_json,
        font: fontData?.font_settings_json,
        color: colorPaletteData?.color_palette_settings_json
      });
      
      // Update state with fetched settings
      setSettings({
        button_settings: buttonData?.button_settings_json || defaultButtonSettings,
        font_settings: fontData?.font_settings_json || defaultFontSettings,
        color_palette_settings: colorPaletteData?.color_palette_settings_json || defaultColorPaletteSettings,
        isLoading: false,
        isError: false,
        refetch: async (): Promise<void> => { await fetchSettings(); }
      });
      
      // Dispatch a custom event that all components can listen for
      const settingsChangedEvent = new CustomEvent('globalSettingsChanged', {
        detail: {
          timestamp: Date.now(),
          settings: {
            button: buttonData?.button_settings_json || defaultButtonSettings,
            font: fontData?.font_settings_json || defaultFontSettings,
            color: colorPaletteData?.color_palette_settings_json || defaultColorPaletteSettings
          }
        }
      });
      window.dispatchEvent(settingsChangedEvent);
    } catch (err) {
      console.error('Error in GlobalSettingsContext:', err);
      setSettings(prev => ({
        ...prev,
        isLoading: false,
        isError: true
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  // Listen for realtime changes to the site_settings table
  useEffect(() => {
    console.log('Setting up real-time subscription to site_settings table');
    
    const subscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'site_settings' }, 
        (payload) => {
          console.log('Site settings changed, refreshing data...', payload);
          fetchSettings();
        }
      )
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'site_settings' },
        (payload) => {
          console.log('New site setting added, refreshing data...', payload);
          fetchSettings();
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });
    
    // Also set up a regular polling refresh as a fallback
    const refreshInterval = setInterval(() => {
      console.log('Performing scheduled refresh of global settings');
      fetchSettings();
    }, 60000); // Refresh every minute
    
    // Handle visibility changes (when user returns to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Tab became visible, refreshing global settings');
        fetchSettings();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
      
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(subscription);
      clearInterval(refreshInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchSettings]);

  // Fetch settings on component mount
  useEffect(() => {
    console.log('GlobalSettingsContext mounted, fetching initial settings');
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    // Refetch when Supabase auth state changes (e.g., user logs in/out)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed, refetching settings. New session:", session);
      fetchSettings(); 
    });
    return () => authListener.subscription.unsubscribe();
  }, [fetchSettings]);

  return (
    <GlobalSettingsContext.Provider value={settings}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export default GlobalSettingsContext; 