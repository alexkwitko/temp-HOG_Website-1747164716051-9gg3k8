import { useEffect } from 'react';
import { useGlobalSettings } from '../../contexts/GlobalSettingsContext';

/**
 * A hook that allows components to easily integrate with global settings
 * Returns an object with the current global settings and a boolean indicating if they're still loading
 * 
 * Usage:
 * 
 * ```jsx
 * const { isLoading, buttonStyles, fontStyles, colorStyles } = useComponentGlobalStyles();
 * 
 * // Then in your component:
 * return (
 *   <button 
 *     style={{
 *       backgroundColor: buttonStyles.primary.background,
 *       color: buttonStyles.primary.textColor,
 *       fontFamily: fontStyles.primaryFont
 *     }}
 *   >
 *     Submit
 *   </button>
 * );
 * ```
 */
export const useComponentGlobalStyles = (componentId?: string) => {
  const { button_settings, font_settings, color_palette_settings, isLoading, refetch } = useGlobalSettings();
  
  // Log when the component uses this hook
  useEffect(() => {
    console.log(`Component ${componentId || 'unknown'} using global styles hook:`, {
      button_settings,
      font_settings,
      color_palette_settings,
      isLoading
    });
  }, [componentId, button_settings, font_settings, color_palette_settings, isLoading]);
  
  // Convert raw settings into more convenient format for components
  const buttonStyles = {
    primary: {
      background: button_settings?.bg_color || 'var(--color-text)',
      textColor: button_settings?.text_color || 'var(--color-background)',
      hoverBackground: button_settings?.hover_color || 'var(--color-secondary)',
      hoverTextColor: button_settings?.hover_text_color || 'var(--color-background)',
      borderColor: button_settings?.border_color || 'var(--color-text)',
      borderWidth: button_settings?.border_width || '0px',
      borderRadius: button_settings?.border_radius || '0.25rem',
      paddingX: button_settings?.padding_x || '1.5rem',
      paddingY: button_settings?.padding_y || '0.75rem',
      fontWeight: button_settings?.font_weight || '500',
      style: button_settings?.primary_style || 'solid'
    },
    secondary: {
      background: button_settings?.secondary_bg_color || '#666666',
      textColor: button_settings?.secondary_text_color || 'var(--color-background)',
      hoverBackground: button_settings?.secondary_hover_color || '#444444',
      hoverTextColor: button_settings?.secondary_hover_text_color || 'var(--color-background)',
      borderColor: button_settings?.secondary_border_color || '#666666',
      borderWidth: button_settings?.secondary_border_width || '1px',
      borderRadius: button_settings?.secondary_border_radius || '0.25rem',
      style: button_settings?.secondary_style || 'solid'
    },
    shared: {
      transitionSpeed: button_settings?.transition_speed || '300ms',
      fontSize: button_settings?.text_size || 'md',
      secondaryFontSize: button_settings?.secondary_text_size || 'md',
      fixedWidth: button_settings?.fixed_width || false,
      width: button_settings?.width || '180px',
      height: button_settings?.height || '48px'
    },
    gradient: {
      direction: button_settings?.gradient_direction || 'to-right',
      fromColor: button_settings?.gradient_from_color || 'var(--color-primary)',
      toColor: button_settings?.gradient_to_color || 'var(--color-secondary)',
      secondaryDirection: button_settings?.secondary_gradient_direction || 'to-right',
      secondaryFromColor: button_settings?.secondary_gradient_from_color || 'var(--color-secondary)',
      secondaryToColor: button_settings?.secondary_gradient_to_color || 'var(--color-primary)'
    }
  };
  
  const fontStyles = {
    primaryFont: font_settings?.primary_font || 'Verdana',
    secondaryFont: font_settings?.secondary_font || 'Verdana',
    bodyFont: font_settings?.body_font || 'Verdana',
    headingFont: font_settings?.heading_font || 'Verdana',
    enabled: font_settings?.enabled || false
  };
  
  const colorStyles = {
    paletteId: color_palette_settings?.globalPaletteId || 'monochrome',
    homePagePaletteId: color_palette_settings?.homePagePaletteId,
    useIntercalatedColors: color_palette_settings?.useIntercalatedColors || false,
    useUniformColors: color_palette_settings?.useUniformColors || true
  };
  
  return {
    isLoading,
    buttonStyles,
    fontStyles,
    colorStyles,
    refetch,
    rawSettings: {
      button_settings,
      font_settings,
      color_palette_settings
    }
  };
};

export default useComponentGlobalStyles; 