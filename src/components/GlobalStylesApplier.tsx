import { useEffect, useRef, useState } from 'react';
import { useGlobalSettings, FontSettings, ButtonSettings, ColorPaletteSettings } from '../contexts/GlobalSettingsContext';
import '../styles/global-overrides.css';

/**
 * This component doesn't render anything, but when included in a component
 * it will apply the global styles from the settings to the document.
 * Include this in the layout components to ensure global styles are applied.
 */
const GlobalStylesApplier = () => {
  const { font_settings, button_settings, color_palette_settings, isLoading } = useGlobalSettings();
  const [lastApplied, setLastApplied] = useState<number>(0);
  const prevSettingsRef = useRef<{
    font: FontSettings | undefined | null;
    button: ButtonSettings | undefined | null;
    color: ColorPaletteSettings | undefined | null;
  }>({
    font: null,
    button: null,
    color: null
  });

  // Force a reflow to ensure styles are properly applied
  const forceRender = () => {
    console.log('GlobalStylesApplier: Forcing document reflow to apply styles...');
    document.body.style.display = 'none';
    void document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    setLastApplied(Date.now());
    console.log('GlobalStylesApplier: Document reflow completed');
  };

  useEffect(() => {
    if (isLoading) return;
    
    // Check if settings have actually changed to avoid unnecessary re-renders
    const settingsChanged = 
      JSON.stringify(prevSettingsRef.current.font) !== JSON.stringify(font_settings) ||
      JSON.stringify(prevSettingsRef.current.button) !== JSON.stringify(button_settings) ||
      JSON.stringify(prevSettingsRef.current.color) !== JSON.stringify(color_palette_settings);
    
    if (!settingsChanged) {
      return; // Skip if nothing changed
    }
    
    console.log('GlobalStylesApplier applying styles with settings:', { 
      font_settings, 
      button_settings,
      color_palette_settings
    });

    // Update ref with current settings
    prevSettingsRef.current = {
      font: font_settings,
      button: button_settings,
      color: color_palette_settings
    };

    // Apply font settings
    if (font_settings) {
      console.log('GlobalStylesApplier: Applying font settings');
      document.documentElement.style.setProperty('--font-primary', font_settings.primary_font || 'Verdana');
      document.documentElement.style.setProperty('--font-secondary', font_settings.secondary_font || 'Verdana');
      document.documentElement.style.setProperty('--font-body', font_settings.body_font || 'Verdana');
      document.documentElement.style.setProperty('--font-heading', font_settings.heading_font || 'Verdana');
      
      // Additional variables for better integration
      document.documentElement.style.setProperty('--primary-font', font_settings.primary_font || 'Verdana');
      document.documentElement.style.setProperty('--secondary-font', font_settings.secondary_font || 'Verdana');
      document.documentElement.style.setProperty('--body-font', font_settings.body_font || 'Verdana');
      document.documentElement.style.setProperty('--heading-font', font_settings.heading_font || 'Verdana');
    }

    // Apply button settings
    if (button_settings) {
      console.log('GlobalStylesApplier: Applying button settings');
      // Primary button colors
      document.documentElement.style.setProperty('--btn-primary-bg', button_settings.bg_color || 'var(--color-text)');
      document.documentElement.style.setProperty('--btn-primary-text', button_settings.text_color || 'var(--color-background)');
      document.documentElement.style.setProperty('--btn-primary-hover-bg', button_settings.hover_color || 'var(--color-secondary)');
      document.documentElement.style.setProperty('--btn-primary-hover-text', button_settings.hover_text_color || 'var(--color-background)');
      document.documentElement.style.setProperty('--btn-primary-border', button_settings.border_color || 'var(--color-text)');
      document.documentElement.style.setProperty('--btn-primary-border-width', `${button_settings.border_width || '0px'}`);
      document.documentElement.style.setProperty('--btn-primary-border-radius', button_settings.border_radius || '0.25rem');
      
      // Secondary button colors
      document.documentElement.style.setProperty('--btn-secondary-bg', button_settings.secondary_bg_color || '#666666');
      document.documentElement.style.setProperty('--btn-secondary-text', button_settings.secondary_text_color || 'var(--color-background)');
      document.documentElement.style.setProperty('--btn-secondary-hover-bg', button_settings.secondary_hover_color || '#444444');
      document.documentElement.style.setProperty('--btn-secondary-hover-text', button_settings.secondary_hover_text_color || 'var(--color-background)');
      document.documentElement.style.setProperty('--btn-secondary-border', button_settings.secondary_border_color || '#666666');
      document.documentElement.style.setProperty('--btn-secondary-border-width', `${button_settings.secondary_border_width || '1px'}`);
      document.documentElement.style.setProperty('--btn-secondary-border-radius', button_settings.secondary_border_radius || '0.25rem');
      
      // Gradient colors
      document.documentElement.style.setProperty('--gradient-from', button_settings.gradient_from_color || 'var(--color-primary)');
      document.documentElement.style.setProperty('--gradient-to', button_settings.gradient_to_color || 'var(--color-secondary)');
      document.documentElement.style.setProperty('--gradient-direction', button_settings.gradient_direction || 'to-right');
      
      // Button padding and sizing
      document.documentElement.style.setProperty('--btn-padding-x', button_settings.padding_x || '1.5rem');
      document.documentElement.style.setProperty('--btn-padding-y', button_settings.padding_y || '0.75rem');
      document.documentElement.style.setProperty('--btn-transition', button_settings.transition_speed || '300ms');
      
      // Button style
      document.documentElement.style.setProperty('--btn-primary-style', button_settings.primary_style || 'solid');
      document.documentElement.style.setProperty('--btn-secondary-style', button_settings.secondary_style || 'solid');
      document.documentElement.style.setProperty('--btn-font-weight', button_settings.font_weight || '500');
      document.documentElement.style.setProperty('--btn-text-size', button_settings.text_size || 'md');
      document.documentElement.style.setProperty('--btn-secondary-text-size', button_settings.secondary_text_size || 'md');
      
      // Additional button variables for better integration
      document.documentElement.style.setProperty('--button-primary-bg', button_settings.bg_color || 'var(--color-text)');
      document.documentElement.style.setProperty('--button-primary-text', button_settings.text_color || 'var(--color-background)');
      document.documentElement.style.setProperty('--button-primary-hover-bg', button_settings.hover_color || 'var(--color-secondary)');
      document.documentElement.style.setProperty('--button-primary-hover-text', button_settings.hover_text_color || 'var(--color-background)');
      document.documentElement.style.setProperty('--button-secondary-bg', button_settings.secondary_bg_color || '#666666');
      document.documentElement.style.setProperty('--button-secondary-text', button_settings.secondary_text_color || 'var(--color-background)');
    }

    // Apply color palette settings
    if (color_palette_settings) {
      console.log('GlobalStylesApplier: Applying color palette settings', color_palette_settings);
      
      // Store the palette ID for use in classes and other settings
      const paletteId = color_palette_settings.globalPaletteId || 'monochrome';
      document.documentElement.style.setProperty('--color-palette-id', paletteId);
      
      // Add a class to the body for easier styling based on palette
      document.body.classList.remove('palette-monochrome', 'palette-red', 'palette-blue', 'palette-green', 'palette-purple', 'palette-hog_brand');
      document.body.classList.add(`palette-${paletteId}`);
      
      // Add data attribute for alternating or uniform colors
      if (color_palette_settings.useIntercalatedColors) {
        document.documentElement.setAttribute('data-color-mode', 'alternating');
      } else {
        document.documentElement.setAttribute('data-color-mode', 'uniform');
      }
      
      // Define color values based on palette ID
      let colors = {
        primary: '#334155',      // Default dark blue/slate
        secondary: '#64748B',    // Lighter slate 
        accent: '#0EA5E9',       // Sky blue
        background: '#ffffff',   // White
        text: '#0F172A',         // Dark slate for text
        light: '#F8FAFC',        // Very light slate
        dark: '#020617',         // Very dark slate
        lightText: '#F8FAFC',    // Light text on dark backgrounds
        darkText: '#0F172A',     // Dark text on light backgrounds
        success: '#10B981',      // Green
        warning: '#F59E0B',      // Amber
        error: '#EF4444',        // Red
        info: '#3B82F6',         // Blue
        alternating: [
          '#FFFFFF',             // White for even sections
          '#F8FAFC'              // Very light slate for odd sections
        ]
      };
      
      // Override with palette-specific colors
      switch (paletteId) {
        case 'hog_brand':
          colors = {
            primary: '#DC2626',    // HOG red
            secondary: '#0F172A',  // Dark slate
            accent: '#FCA5A5',     // Light red
            background: '#ffffff', // White
            text: '#0F172A',       // Dark slate for text
            light: '#FEF2F2',      // Light red bg
            dark: '#7F1D1D',       // Dark red
            lightText: '#F8FAFC',  // White text
            darkText: '#0F172A',   // Dark slate text
            success: '#10B981',    // Green
            warning: '#F59E0B',    // Amber
            error: '#DC2626',      // Red error is HOG brand red
            info: '#3B82F6',       // Blue
            alternating: [
              '#FFFFFF',           // White for even sections
              '#FEF2F2'            // Light red background for odd sections
            ]
          };
          break;
        case 'red':
          colors = {
            primary: '#B91C1C',    // Red-700
            secondary: '#991B1B',  // Red-800
            accent: '#FCA5A5',     // Red-300
            background: '#ffffff', // White
            text: '#450A0A',       // Red-950
            light: '#FEF2F2',      // Red-50
            dark: '#7F1D1D',       // Red-900
            lightText: '#FEFAFA',  // Light text
            darkText: '#450A0A',   // Red-950
            success: '#10B981',    // Green
            warning: '#F59E0B',    // Amber
            error: '#EF4444',      // Red
            info: '#3B82F6',       // Blue
            alternating: [
              '#FFFFFF',           // White for even sections
              '#FEF2F2'            // Very light red for odd sections
            ]
          };
          break;
        case 'blue':
          colors = {
            primary: '#1D4ED8',    // Blue-700
            secondary: '#1E40AF',  // Blue-800
            accent: '#93C5FD',     // Blue-300
            background: '#ffffff', // White
            text: '#172554',       // Blue-950
            light: '#EFF6FF',      // Blue-50
            dark: '#1E3A8A',       // Blue-900
            lightText: '#F8FAFC',  // Light text
            darkText: '#172554',   // Blue-950
            success: '#10B981',    // Green
            warning: '#F59E0B',    // Amber
            error: '#EF4444',      // Red
            info: '#3B82F6',       // Blue
            alternating: [
              '#FFFFFF',           // White for even sections
              '#EFF6FF'            // Very light blue for odd sections
            ]
          };
          break;
        case 'green':
          colors = {
            primary: '#15803D',    // Green-700
            secondary: '#166534',  // Green-800
            accent: '#86EFAC',     // Green-300
            background: '#ffffff', // White
            text: '#052E16',       // Green-950
            light: '#F0FDF4',      // Green-50
            dark: '#14532D',       // Green-900
            lightText: '#F8FAFC',  // Light text
            darkText: '#052E16',   // Green-950
            success: '#15803D',    // Green-700
            warning: '#F59E0B',    // Amber
            error: '#EF4444',      // Red
            info: '#3B82F6',       // Blue
            alternating: [
              '#FFFFFF',           // White for even sections
              '#F0FDF4'            // Very light green for odd sections
            ]
          };
          break;
      }
      
      // Apply both palette-specific and core CSS variables to ensure everything works
      
      // Core CSS variables - these are the foundation of the entire theme
      document.documentElement.style.setProperty('--color-primary', colors.primary);
      document.documentElement.style.setProperty('--color-secondary', colors.secondary);
      document.documentElement.style.setProperty('--color-accent', colors.accent);
      document.documentElement.style.setProperty('--color-background', colors.background);
      document.documentElement.style.setProperty('--color-text', colors.text);
      
      // Additional palette variables for components that use these directly
      document.documentElement.style.setProperty('--color-palette-primary', colors.primary);
      document.documentElement.style.setProperty('--color-palette-secondary', colors.secondary);
      document.documentElement.style.setProperty('--color-palette-accent', colors.accent);
      document.documentElement.style.setProperty('--color-palette-light', colors.light);
      document.documentElement.style.setProperty('--color-palette-dark', colors.dark);
      document.documentElement.style.setProperty('--color-palette-text-dark', colors.darkText);
      document.documentElement.style.setProperty('--color-palette-text-light', colors.lightText);
      document.documentElement.style.setProperty('--color-palette-success', colors.success);
      document.documentElement.style.setProperty('--color-palette-warning', colors.warning);
      document.documentElement.style.setProperty('--color-palette-error', colors.error);
      document.documentElement.style.setProperty('--color-palette-info', colors.info);
      
      // Add alternating section colors
      document.documentElement.style.setProperty('--color-section-even', colors.alternating[0]);
      document.documentElement.style.setProperty('--color-section-odd', colors.alternating[1]);
      
      // Set background and text colors directly on body for maximum compatibility
      document.body.style.backgroundColor = colors.background;
      document.body.style.color = colors.text;
      
      // Also create RGB versions of colors for rgba() usage
      const hexToRgb = (hex: string) => {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const expandedHex = hex.replace(shorthandRegex, (_m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(expandedHex);
        return result 
          ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
          : null;
      };
      
      document.documentElement.style.setProperty('--color-palette-primary-rgb', hexToRgb(colors.primary) || '15, 23, 42');
      document.documentElement.style.setProperty('--color-palette-accent-rgb', hexToRgb(colors.accent) || '14, 165, 233');
      
      console.log('Applied color palette:', paletteId, colors);
    }

    // Load Google Fonts
    if (font_settings) {
      const fonts = [
        font_settings.primary_font,
        font_settings.secondary_font,
        font_settings.body_font,
        font_settings.heading_font
      ].filter((font, index, self) => 
        font && self.indexOf(font) === index
      ); // remove duplicates and empty values
      
      if (fonts.length > 0) {
        const fontLink = document.getElementById('google-fonts');
        if (!fontLink) {
          console.log('Creating new Google Fonts link for:', fonts);
          const link = document.createElement('link');
          link.id = 'google-fonts';
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${fonts.join('&family=').replace(/ /g, '+')}`;
          document.head.appendChild(link);
        } else {
          console.log('Updating existing Google Fonts link for:', fonts);
          // Cast to HTMLLinkElement to access href property
          (fontLink as HTMLLinkElement).href = `https://fonts.googleapis.com/css2?family=${fonts.join('&family=').replace(/ /g, '+')}`;
        }
      }
    }
    
    // Force a reflow to ensure all styles apply properly across the site
    forceRender();
    
    console.log('Global styles applied successfully');
  }, [isLoading, font_settings, button_settings, color_palette_settings]);

  // Add an interval to regularly check and force reapplication if needed
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (lastApplied > 0 && Date.now() - lastApplied > 5000) {
        // If it's been more than 5 seconds since last application, force another reflow
        console.log('GlobalStylesApplier: Performing periodic style reapplication check');
        forceRender();
      }
    }, 5000);
    
    return () => clearInterval(checkInterval);
  }, [lastApplied]);

  // Listen for custom globalSettingsChanged events from SettingsPage
  useEffect(() => {
    const handleSettingsChanged = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log('GlobalStylesApplier: Received globalSettingsChanged event', customEvent.detail);
      
      if (customEvent.detail && customEvent.detail.settings) {
        const { button, font, color } = customEvent.detail.settings;
        
        // Force reapplication of styles
        if (button || font || color) {
          console.log('GlobalStylesApplier: Forcing style reapplication due to settings change event');
          forceRender();
        }
      }
    };
    
    // Add event listener
    window.addEventListener('globalSettingsChanged', handleSettingsChanged);
    
    // Clean up
    return () => {
      window.removeEventListener('globalSettingsChanged', handleSettingsChanged);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default GlobalStylesApplier; 