import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';

// Re-use the interface from SettingsPage (consider moving to a shared types file later)
interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  social_links: { [key: string]: string | undefined };
  business_hours: { [key: string]: string | undefined };
  color_palette_settings?: {
    globalPaletteId: string;
    homePagePaletteId?: string; // Consider if this is still needed globally
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
    border_radius_style: string;
    border_width: string;
    border_color: string;
    transition_speed: string;
    primary_style: string;
    secondary_text_color: string;
    secondary_bg_color: string;
    secondary_hover_color: string;
    secondary_hover_text_color: string;
    secondary_width: string;
    secondary_height: string;
    secondary_border_radius: string;
    secondary_border_radius_style: string;
    secondary_border_width: string;
    secondary_border_color: string;
    secondary_style: string;
    text_size: string;
    secondary_text_size: string;
    gradient_direction: string;
    gradient_from_color: string;
    gradient_to_color: string;
    secondary_gradient_direction: string;
    secondary_gradient_from_color: string;
    secondary_gradient_to_color: string;
  };
}

// Define a default state matching the structure but potentially empty or with sensible defaults
const defaultSettings: SiteSettings = {
  site_name: 'House of Grappling',
  site_description: 'Loading...',
  contact_email: '',
  social_links: {},
  business_hours: {},
  color_palette_settings: { globalPaletteId: 'monochrome', useUniformColors: true },
  font_settings: { enabled: true, primary_font: 'Verdana', secondary_font: 'Verdana', body_font: 'Verdana', heading_font: 'Verdana' },
  button_settings: { // Add sensible defaults for buttons
      enabled: true, fixed_width: false, width: 'auto', height: 'auto', text_color: '#FFFFFF', bg_color: '#000000',
      hover_color: '#333333', hover_text_color: '#FFFFFF', padding_x: '1rem', padding_y: '0.5rem', font_weight: '500',
      border_radius: '4px', border_radius_style: 'small', border_width: '0px', border_color: '#000000', transition_speed: '300ms',
      primary_style: 'solid', secondary_text_color: '#000000', secondary_bg_color: '#CCCCCC', secondary_hover_color: '#AAAAAA',
      secondary_hover_text_color: '#000000', secondary_width: 'auto', secondary_height: 'auto', secondary_border_radius: '4px',
      secondary_border_radius_style: 'small', secondary_border_width: '1px', secondary_border_color: '#AAAAAA', secondary_style: 'solid',
      text_size: 'md', secondary_text_size: 'md', gradient_direction: 'to-right', gradient_from_color: '#3B82F6', gradient_to_color: '#8B5CF6',
      secondary_gradient_direction: 'to-right', secondary_gradient_from_color: '#F59E0B', secondary_gradient_to_color: '#B91C1C'
  }
};

interface SiteSettingsContextProps {
  settings: SiteSettings;
  loading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>; // Allow refetching if needed
}

const SiteSettingsContext = createContext<SiteSettingsContextProps>({
  settings: defaultSettings,
  loading: true,
  error: null,
  fetchSettings: async () => {},
});

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    console.log("Fetching global site settings...");
    try {
      // Fetch all settings types in parallel
      const results = await Promise.all([
        supabase.from('site_settings').select('site_name, site_description, contact_email').eq('key', 'site_info').maybeSingle(),
        supabase.from('site_settings').select('social_links_json').eq('key', 'social_links').maybeSingle(),
        supabase.from('site_settings').select('business_hours_json').eq('key', 'business_hours').maybeSingle(),
        supabase.from('site_settings').select('color_palette_settings_json').eq('key', 'color_palette').maybeSingle(),
        supabase.from('site_settings').select('font_settings_json').eq('key', 'font_settings').maybeSingle(),
        supabase.from('site_settings').select('button_settings_json').eq('key', 'button_settings').maybeSingle(),
      ]);

      const [
        siteInfoResult, socialLinksResult, businessHoursResult,
        colorPaletteResult, fontSettingsResult, buttonSettingsResult
      ] = results;

      // Check for errors in each query
      const errors = results.map(r => r.error).filter(e => e && e.code !== 'PGRST116'); // Ignore "not found"
      if (errors.length > 0) {
        console.error('Error fetching some settings:', errors);
        // Decide if we should throw or partially load
      }

      const loadedSettings = {
        site_name: siteInfoResult.data?.site_name || defaultSettings.site_name,
        site_description: siteInfoResult.data?.site_description || defaultSettings.site_description,
        contact_email: siteInfoResult.data?.contact_email || defaultSettings.contact_email,
        social_links: socialLinksResult.data?.social_links_json || defaultSettings.social_links,
        business_hours: businessHoursResult.data?.business_hours_json || defaultSettings.business_hours,
        color_palette_settings: colorPaletteResult.data?.color_palette_settings_json || defaultSettings.color_palette_settings,
        font_settings: fontSettingsResult.data?.font_settings_json || defaultSettings.font_settings,
        button_settings: buttonSettingsResult.data?.button_settings_json || defaultSettings.button_settings,
      };

      console.log("Global settings loaded:", loadedSettings);
      setSettings(loadedSettings);

      // Apply styles after settings are loaded
      applyGlobalStyles(loadedSettings);

    } catch (err) {
      console.error('Failed to fetch site settings:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setSettings(defaultSettings); // Fallback to defaults on error
      applyGlobalStyles(defaultSettings); // Apply default styles
    } finally {
      setLoading(false);
      console.log("Finished fetching global settings.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []); // Fetch on initial mount

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, error, fetchSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

// Custom hook to use the SiteSettings context
export const useSiteSettings = () => useContext(SiteSettingsContext);

// --- Helper function to apply styles ---

// Define a simple structure for palettes (can be expanded)
interface ColorPalette {
  [key: string]: string; // e.g., primary: '#ff0000', background: '#ffffff'
}

// TODO: Define actual color palettes here or fetch them
const palettes: Record<string, ColorPalette> = {
  // Base Palettes (already partially defined, let's ensure consistency)
  monochrome: {
    primary: '#1F2937', // Dark Gray/Black
    secondary: '#6B7280', // Medium Gray
    accent: '#9CA3AF',   // Light Gray
    background: '#FFFFFF',
    text: '#111827',     // Dark Gray for text
    textSecondary: '#6B7280',
    border: '#E5E7EB'    // Very Light Gray
  },
  hog_brand: { // From SettingsPage quick select
    primary: '#B91C1C',    // HOG Red
    secondary: '#0F172A',  // Dark Blue/Black
    accent: '#F1F5F9',     // Very Light Gray/Off-white
    background: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569', // Slate
    border: '#E2E8F0'
  },
  modern_contrast: { // From SettingsPage quick select
    primary: '#4F46E5',    // Indigo
    secondary: '#111827',  // Almost Black
    accent: '#FFFFFF',     // White (can be tricky as accent, maybe a light gray like #E5E7EB instead for elements?)
    background: '#F9FAFB', // Off-white
    text: '#111827',
    textSecondary: '#6B7280',
    border: '#E5E7EB'
  },

  // Solid Themes from SettingsPage
  hogRed: { // This is effectively same as hog_brand's primary/secondary focus
    primary: '#c81e1e',    // HOG Red
    secondary: '#333333',  // Dark Gray
    accent: '#a51818',     // Darker Red (hover)
    background: '#FFFFFF',
    text: '#171717',       // Neutral Dark
    textSecondary: '#525252', // Neutral Medium
    border: '#D1D5DB'      // Gray 300
  },
  modernDark: {
    primary: '#171717',    // Neutral 900 (Almost Black)
    secondary: '#f5f5f5',  // Neutral 100 (Very Light Gray)
    accent: '#e5e5e5',     // Neutral 200 (Hover for secondary)
    background: '#FFFFFF', // Assuming light background with these button contrasts
    text: '#171717',
    textSecondary: '#525252',
    border: '#D1D5DB'
  },
  indigo: {
    primary: '#4F46E5',    // Indigo 600
    secondary: '#EEF2FF',  // Indigo 50 (Used as hover bg for outline, good as light accent/secondary bg)
    accent: '#4338CA',     // Indigo 700 (Hover for primary)
    background: '#FFFFFF',
    text: '#1E1B4B',       // Indigo 950 (Dark indigo for text)
    textSecondary: '#4338CA',
    border: '#C7D2FE'      // Indigo 200
  },
  blue: {
    primary: '#2563EB',    // Blue 600
    secondary: '#1E3A8A',  // Blue 900 (Darker Blue)
    accent: '#1D4ED8',     // Blue 700 (Hover for primary)
    background: '#EFF6FF', // Blue 50 (Light blue background)
    text: '#1E3A8A',       // Blue 900
    textSecondary: '#1D4ED8',
    border: '#BFDBFE'      // Blue 300
  },
  green: {
    primary: '#059669',    // Green 600
    secondary: '#10B981',  // Green 500 (Lighter Green)
    accent: '#047857',     // Green 700 (Hover for primary)
    background: '#ECFDF5', // Green 50 (Light green background)
    text: '#065F46',       // Green 800
    textSecondary: '#047857',
    border: '#A7F3D0'      // Green 300
  },
  amber: {
    primary: '#D97706',    // Amber 600
    secondary: '#F59E0B',  // Amber 500
    accent: '#B45309',     // Amber 700 (Hover for primary)
    background: '#FFFBEB', // Amber 50
    text: '#78350F',       // Amber 800 (text on secondary is #7C2D12)
    textSecondary: '#B45309',
    border: '#FDE68A'      // Amber 300
  },
  purple: {
    primary: '#7C3AED',    // Purple 600
    secondary: '#8B5CF6',  // Purple 500
    accent: '#4C1D95',     // Purple 900 (Border for secondary)
    background: '#F5F3FF', // Purple 50
    text: '#5B21B6',       // Purple 800
    textSecondary: '#6D28D9', // Purple 700
    border: '#DDD6FE'      // Purple 300
  },
  pink: {
    primary: '#DB2777',    // Pink 600
    secondary: '#EC4899',  // Pink 500 (Text for ghost secondary)
    accent: '#831843',     // Pink 900 (Border for secondary)
    background: '#FDF2F8', // Pink 50
    text: '#9D174D',       // Pink 800
    textSecondary: '#BE185D', // Pink 700
    border: '#FBCFE8'      // Pink 300
  },
  teal: {
    primary: '#0D9488',    // Teal 600
    secondary: '#14B8A6',  // Teal 500
    accent: '#0F766E',     // Teal 700 (Border/hover for primary)
    background: '#F0FDFA', // Teal 50
    text: '#134E4A',       // Teal 900
    textSecondary: '#0F766E',
    border: '#CCFBF1'      // Teal 200
  },

  // Gradient Themes (Represent with solid colors for the page palette)
  redGradient: {
    primary: '#991B1B',    // Red 800 (Gradient From)
    secondary: '#EA580C',  // Orange 600 (Gradient To)
    accent: '#7F1D1D',     // Red 900 (Darker accent for text/borders on light bg)
    background: '#FFF1F2', // Red 50
    text: '#7F1D1D',
    textSecondary: '#991B1B',
    border: '#FECACA'      // Red 200
  },
  blueGradient: {
    primary: '#1E40AF',    // Blue 800 (Gradient From)
    secondary: '#4338CA',  // Indigo 700 (Gradient To)
    accent: '#EEF2FF',     // Indigo 50 (Secondary button BG)
    background: '#E0E7FF', // Indigo 100 (Lighter background)
    text: '#1E3A8A',       // Blue 900 (Text on accent)
    textSecondary: '#312E81', // Indigo 900
    border: '#C7D2FE'      // Indigo 200
  },
  greenGradient: {
    primary: '#047857',    // Green 700 (Gradient From)
    secondary: '#065F46',  // Green 800 (Gradient To)
    accent: '#ECFDF5',     // Green 50 (Secondary hover)
    background: '#D1FAE5', // Green 100
    text: '#064E3B',       // Green 900
    textSecondary: '#059669', // Green 600 (Secondary text)
    border: '#6EE7B7'      // Green 300
  },
  purpleGradient: {
    primary: '#6D28D9',    // Purple 700 (Gradient From)
    secondary: '#DB2777',  // Pink 600 (Gradient To)
    accent: '#4C1D95',     // Purple 900 (Secondary Gradient From)
    background: '#F3E8FF', // Purple 100
    text: '#581C87',       // Purple 900
    textSecondary: '#86198F', // Fuchsia 800 (related to pink)
    border: '#E9D5FF'      // Purple 200
  },
  darkGradient: {
    primary: '#111827',    // Gray 900 (Gradient From)
    secondary: '#374151',  // Gray 700 (Gradient To)
    accent: '#E5E7EB',     // Gray 200 (Secondary text/border)
    background: '#030712', // Gray 950 (Very dark background for a "dark mode" feel)
    text: '#F3F4F6',       // Gray 100 (Light text)
    textSecondary: '#9CA3AF', // Gray 400
    border: '#374151'      // Gray 700 (Borders on dark bg)
  }
};

const applyGlobalStyles = (settings: SiteSettings) => {
  const root = document.documentElement;

  // 1. Apply Font Settings
  if (settings.font_settings?.enabled) {
    root.style.setProperty('--font-primary', settings.font_settings.primary_font || 'sans-serif');
    root.style.setProperty('--font-secondary', settings.font_settings.secondary_font || 'sans-serif');
    root.style.setProperty('--font-body', settings.font_settings.body_font || 'sans-serif');
    root.style.setProperty('--font-heading', settings.font_settings.heading_font || 'sans-serif');

    // Update Google Fonts link (ensure this logic doesn't conflict with SettingsPage)
    const fonts = [
      settings.font_settings.primary_font,
      settings.font_settings.secondary_font,
      settings.font_settings.body_font,
      settings.font_settings.heading_font
    ].filter((font, index, self) => font && self.indexOf(font) === index); // remove duplicates and nulls

    if (fonts.length > 0) {
      const fontLink = document.getElementById('google-fonts');
      const href = `https://fonts.googleapis.com/css2?family=${fonts.map(f => f.replace(/ /g, '+')).join('&family=')}&display=swap`;
      if (!fontLink) {
          const link = document.createElement('link');
          link.id = 'google-fonts';
          link.rel = 'stylesheet';
          link.href = href;
          document.head.appendChild(link);
      } else {
          (fontLink as HTMLLinkElement).href = href;
      }
    }
  } else {
      // Optionally clear fonts if disabled
      root.style.removeProperty('--font-primary');
      root.style.removeProperty('--font-secondary');
      root.style.removeProperty('--font-body');
      root.style.removeProperty('--font-heading');
  }

  // 2. Apply Color Palette Settings
  const paletteId = settings.color_palette_settings?.globalPaletteId || 'monochrome';
  const selectedPalette = palettes[paletteId] || palettes.monochrome; // Fallback

  for (const [key, value] of Object.entries(selectedPalette)) {
    root.style.setProperty(`--color-${key}`, value);
  }
  // Add specific color mode vars if needed?
  // root.style.setProperty('--color-mode', settings.color_palette_settings?.useUniformColors ? 'uniform' : 'intercalated');

  // 3. Apply Button Settings
  if (settings.button_settings?.enabled) {
    const btn = settings.button_settings;
    root.style.setProperty('--btn-padding-y', btn.padding_y || '0.5rem');
    root.style.setProperty('--btn-padding-x', btn.padding_x || '1rem');
    root.style.setProperty('--btn-font-weight', btn.font_weight || '500');
    root.style.setProperty('--btn-transition-speed', btn.transition_speed || '300ms');
    // Font size needs mapping
    const fontSizeMap: Record<string, string> = { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.25rem' };
    root.style.setProperty('--btn-text-size', fontSizeMap[btn.text_size] || '1rem');
    root.style.setProperty('--btn-secondary-text-size', fontSizeMap[btn.secondary_text_size] || '1rem');

    // Primary Button
    root.style.setProperty('--btn-primary-text', btn.text_color || '#FFFFFF');
    root.style.setProperty('--btn-primary-bg', btn.primary_style === 'gradient' ? 'transparent' : (btn.primary_style === 'ghost' ? 'transparent' : (btn.bg_color || '#000000')));
    root.style.setProperty('--btn-primary-border-radius', btn.border_radius || '4px');
    root.style.setProperty('--btn-primary-border-width', btn.primary_style === 'outline' || btn.primary_style === 'ghost' ? (btn.border_width || '1px') : '0px');
    root.style.setProperty('--btn-primary-border-color', btn.border_color || 'transparent');
    root.style.setProperty('--btn-primary-hover-text', btn.hover_text_color || btn.text_color || '#FFFFFF');
    root.style.setProperty('--btn-primary-hover-bg', btn.primary_style === 'gradient' ? 'transparent' : (btn.hover_color || '#333333')); // Handle gradient hover opacity/effect in CSS
    // Gradient specific
    if (btn.primary_style === 'gradient') {
        root.style.setProperty('--btn-primary-gradient', `linear-gradient(${btn.gradient_direction.replace('to-', 'to ')}, ${btn.gradient_from_color}, ${btn.gradient_to_color})`);
    } else {
        root.style.removeProperty('--btn-primary-gradient');
    }

    // Secondary Button
    root.style.setProperty('--btn-secondary-text', btn.secondary_text_color || '#000000');
    root.style.setProperty('--btn-secondary-bg', btn.secondary_style === 'gradient' ? 'transparent' : (btn.secondary_style === 'ghost' ? 'transparent' : (btn.secondary_bg_color || '#CCCCCC')));
    root.style.setProperty('--btn-secondary-border-radius', btn.secondary_border_radius || '4px');
    root.style.setProperty('--btn-secondary-border-width', btn.secondary_style === 'outline' || btn.secondary_style === 'ghost' ? (btn.secondary_border_width || '1px') : '0px');
    root.style.setProperty('--btn-secondary-border-color', btn.secondary_border_color || 'transparent');
    root.style.setProperty('--btn-secondary-hover-text', btn.secondary_hover_text_color || btn.secondary_text_color || '#000000');
    root.style.setProperty('--btn-secondary-hover-bg', btn.secondary_style === 'gradient' ? 'transparent' : (btn.secondary_hover_color || '#AAAAAA'));
    // Gradient specific
    if (btn.secondary_style === 'gradient') {
        root.style.setProperty('--btn-secondary-gradient', `linear-gradient(${btn.secondary_gradient_direction.replace('to-', 'to ')}, ${btn.secondary_gradient_from_color}, ${btn.secondary_gradient_to_color})`);
    } else {
        root.style.removeProperty('--btn-secondary-gradient');
    }

  } else {
      // Optionally clear button vars if disabled
      // (Consider if default browser/tailwind styles are preferred)
  }

  console.log("Applied global styles based on settings.");
}; 