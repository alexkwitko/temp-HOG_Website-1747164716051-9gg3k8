import React, { useState } from 'react';
import { useGlobalSettings } from '../../contexts/GlobalSettingsContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { useLocation } from 'react-router-dom';

// Define types for the button props
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  buttonSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  buttonStyle?: 'solid' | 'outline' | 'ghost' | 'gradient';
  fullWidth?: boolean;
  // Component-specific overrides
  textColor?: string;
  bgColor?: string;
  hoverColor?: string;
  hoverTextColor?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  // Gradient specific
  gradientDirection?: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
  gradientFromColor?: string;
  gradientToColor?: string;
  // Page-specific overrides
  pageSettings?: {
    textColor?: string;
    bgColor?: string;
    hoverColor?: string;
    hoverTextColor?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    gradientDirection?: 'to-right' | 'to-left' | 'to-bottom' | 'to-top' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl';
    gradientFromColor?: string;
    gradientToColor?: string;
  };
  // Add style prop to fix linter error
  style?: React.CSSProperties;
}

// Admin section fixed colors
const ADMIN_BUTTON_COLORS = {
  primary: {
    bg: '#000000',             // Pure black
    text: '#FFFFFF',           // White text
    hover: '#333333',          // Dark grey hover
    hoverText: '#FFFFFF',      // White text on hover
    border: '#000000',         // Black border
    focusRing: 'rgba(0, 0, 0, 0.2)'
  },
  secondary: {
    bg: '#FFFFFF',             // White
    text: '#000000',           // Black text
    hover: '#F5F5F5',          // Light grey hover
    hoverText: '#000000',      // Black text on hover
    border: '#E0E0E0',         // Light grey border
    focusRing: 'rgba(0, 0, 0, 0.1)'
  },
  success: {
    bg: '#10B981',             // Green
    text: '#FFFFFF',           // White text
    hover: '#059669',          // Darker green hover
    hoverText: '#FFFFFF',      // White text on hover
    border: '#059669',         // Green border
    focusRing: 'rgba(16, 185, 129, 0.4)'
  },
  danger: {
    bg: '#EF4444',             // Red
    text: '#FFFFFF',           // White text
    hover: '#B91C1C',          // Darker red hover
    hoverText: '#FFFFFF',      // White text on hover
    border: '#B91C1C',         // Red border
    focusRing: 'rgba(239, 68, 68, 0.4)'
  }
};

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

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  // We'll actually use buttonSize to set a custom size class
  buttonSize,
  buttonStyle,
  fullWidth = false,
  textColor,
  bgColor,
  hoverColor,
  hoverTextColor,
  borderRadius,
  borderWidth,
  borderColor,
  gradientDirection,
  gradientFromColor,
  gradientToColor,
  pageSettings,
  children,
  className = '',
  style = {},
  ...props
}) => {
  // Access global settings
  useSiteSettings(); // We might need this hook for other settings in the future, so let's keep the call.

  const { button_settings, font_settings, isLoading } = useGlobalSettings();
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();
  
  // Check if we're in the admin section
  const isAdminRoute = location.pathname.startsWith('/admin');

  // If settings are still loading, show a basic button
  if (isLoading) {
    return (
      <button
        {...props}
        className={`btn ${className} ${fullWidth ? 'w-full' : ''} ${buttonSize ? `btn-${buttonSize}` : ''}`}
        style={{
          ...style,
          background: variant === 'primary' ? 'var(--color-text)' : '#666666',
          color: 'var(--color-background)',
          borderRadius: '0.25rem',
          padding: '0.75rem 1.5rem',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </button>
    );
  }

  // For admin routes, use fixed black/white/grey color scheme
  if (isAdminRoute) {
    // Use the appropriate color scheme based on variant
    let adminColors;
    switch(variant) {
      case 'success':
        adminColors = ADMIN_BUTTON_COLORS.success;
        break;
      case 'danger':
        adminColors = ADMIN_BUTTON_COLORS.danger;
        break;
      case 'secondary':
        adminColors = ADMIN_BUTTON_COLORS.secondary;
        break;
      default:
        adminColors = ADMIN_BUTTON_COLORS.primary;
    }
    
    const adminButtonStyle = buttonStyle || 'solid';
    
    // Generate background style based on button style
    let backgroundStyle = '';
    if (adminButtonStyle === 'gradient') {
      backgroundStyle = `linear-gradient(to right, ${adminColors.bg}, ${adminColors.hover})`;
    } else if (adminButtonStyle === 'ghost') {
      backgroundStyle = 'transparent';
    } else if (adminButtonStyle === 'outline') {
      backgroundStyle = 'transparent';
    } else {
      backgroundStyle = isHovered ? adminColors.hover : adminColors.bg;
    }
    
    // Generate border style based on button style
    let borderStyle = '0px solid transparent';
    if (adminButtonStyle === 'outline') {
      borderStyle = `1px solid ${adminColors.border}`;
    } else if (adminButtonStyle === 'ghost') {
      borderStyle = isHovered ? `1px solid ${adminColors.border}` : '1px solid transparent';
    }
    
    // Determine size and padding
    let paddingY = '0.5rem';
    let paddingX = '1rem';
    let fontSize = '0.875rem';
    
    if (buttonSize) {
      switch(buttonSize) {
        case 'xs':
          paddingY = '0.25rem';
          paddingX = '0.5rem';
          fontSize = '0.75rem';
          break;
        case 'sm':
          paddingY = '0.375rem';
          paddingX = '0.75rem';
          fontSize = '0.875rem';
          break;
        case 'lg':
          paddingY = '0.625rem';
          paddingX = '1.25rem';
          fontSize = '1rem';
          break;
        case 'xl':
          paddingY = '0.75rem';
          paddingX = '1.5rem';
          fontSize = '1.125rem';
          break;
        default:
          // md is the default
          break;
      }
    }
    
    const buttonColor = adminButtonStyle === 'outline' || adminButtonStyle === 'ghost' 
      ? (isHovered ? adminColors.hover : adminColors.text)
      : (isHovered ? adminColors.hoverText : adminColors.text);
    
    return (
      <button
        {...props}
        className={`btn ${className} ${fullWidth ? 'w-full' : ''}`}
        style={{
          ...style,
          background: backgroundStyle,
          color: buttonColor,
          borderRadius: '0.25rem',
          border: borderStyle,
          fontWeight: '500',
          fontSize: fontSize,
          padding: `${paddingY} ${paddingX}`,
          transition: 'all 200ms ease',
          boxShadow: adminButtonStyle !== 'ghost' && adminButtonStyle !== 'outline' 
            ? (isHovered ? '0 4px 6px rgba(0, 0, 0, 0.12)' : '0 1px 3px rgba(0, 0, 0, 0.08)')
            : 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textDecoration: 'none',
          position: 'relative',
          letterSpacing: '0.015em',
          outline: 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={(e) => {
          // Add focus ring style
          e.currentTarget.style.boxShadow = `0 0 0 3px ${adminColors.focusRing}`;
        }}
        onBlur={(e) => {
          // Reset shadow to hover/default state on blur
          if (isHovered && adminButtonStyle !== 'ghost' && adminButtonStyle !== 'outline') {
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.12)';
          } else if (adminButtonStyle !== 'ghost' && adminButtonStyle !== 'outline') {
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
          } else {
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {children}
      </button>
    );
  }

  // Get settings based on hierarchy: component props > page settings > global settings
  const isPrimary = variant === 'primary';
  
  // Apply hierarchy for button style
  const determinedStyle = buttonStyle || 
    (pageSettings && (isPrimary ? pageSettings.gradientFromColor : undefined) ? 'gradient' : undefined) ||
    (isPrimary 
      ? button_settings?.primary_style 
      : button_settings?.secondary_style) || 
    'solid';
  
  // Apply hierarchy for text color
  const determinedTextColor = textColor || 
    (pageSettings && pageSettings.textColor) ||
    (isPrimary 
      ? button_settings?.text_color 
      : button_settings?.secondary_text_color) || 
    'var(--color-background)';
  
  // Apply hierarchy for background color
  const determinedBgColor = bgColor || 
    (pageSettings && pageSettings.bgColor) ||
    (isPrimary 
      ? button_settings?.bg_color 
      : button_settings?.secondary_bg_color) || 
    (isPrimary ? 'var(--color-text)' : '#666666');
  
  // Apply hierarchy for hover color
  const determinedHoverColor = hoverColor || 
    (pageSettings && pageSettings.hoverColor) ||
    (isPrimary 
      ? button_settings?.hover_color 
      : button_settings?.secondary_hover_color) || 
    (isPrimary ? 'var(--color-secondary)' : '#444444');
  
  // Apply hierarchy for hover text color
  const determinedHoverTextColor = hoverTextColor || 
    (pageSettings && pageSettings.hoverTextColor) ||
    (isPrimary 
      ? button_settings?.hover_text_color 
      : button_settings?.secondary_hover_text_color) || 
    'var(--color-background)';
  
  // Apply hierarchy for border radius
  const determinedBorderRadius = borderRadius || 
    (pageSettings && pageSettings.borderRadius) ||
    (isPrimary 
      ? button_settings?.border_radius 
      : button_settings?.secondary_border_radius) || 
    '0.25rem';
  
  // Apply hierarchy for border width
  const determinedBorderWidth = borderWidth || 
    (pageSettings && pageSettings.borderWidth) ||
    (isPrimary 
      ? button_settings?.border_width 
      : button_settings?.secondary_border_width) || 
    (isPrimary ? '0px' : '1px');
  
  // Apply hierarchy for border color
  const determinedBorderColor = borderColor || 
    (pageSettings && pageSettings.borderColor) ||
    (isPrimary 
      ? button_settings?.border_color 
      : button_settings?.secondary_border_color) || 
    (isPrimary ? 'var(--color-text)' : 'var(--color-background)');
  
  // Apply hierarchy for gradient direction
  const determinedGradientDirection = gradientDirection || 
    (pageSettings && pageSettings.gradientDirection) ||
    (isPrimary 
      ? button_settings?.gradient_direction 
      : button_settings?.secondary_gradient_direction) || 
    'to-right';
  
  // Apply hierarchy for gradient from color
  const determinedGradientFromColor = gradientFromColor || 
    (pageSettings && pageSettings.gradientFromColor) ||
    (isPrimary 
      ? button_settings?.gradient_from_color 
      : button_settings?.secondary_gradient_from_color) || 
    (isPrimary ? 'var(--color-primary)' : 'var(--color-secondary)');
  
  // Apply hierarchy for gradient to color
  const determinedGradientToColor = gradientToColor || 
    (pageSettings && pageSettings.gradientToColor) ||
    (isPrimary 
      ? button_settings?.gradient_to_color 
      : button_settings?.secondary_gradient_to_color) || 
    (isPrimary ? 'var(--color-secondary)' : 'var(--color-primary)');
  
  // Determine text size - use buttonSize prop if set
  const textSizeKey = buttonSize || 
    (isPrimary 
      ? button_settings?.text_size 
      : button_settings?.secondary_text_size) || 
    'md';
  
  const determinedTextSize = getFontSizeValue(textSizeKey);
  
  // Determine font family
  const determinedFontFamily = font_settings?.enabled
    ? font_settings?.primary_font || 'Verdana'
    : 'inherit';
  
  // Determine fixed width settings  
  const isFixedWidth = button_settings?.fixed_width || false;
  const determinedWidth = isFixedWidth 
    ? (isPrimary 
      ? button_settings?.width 
      : button_settings?.secondary_width)
    : 'auto';
  
  const determinedHeight = isFixedWidth 
    ? (isPrimary 
      ? button_settings?.height 
      : button_settings?.secondary_height)
    : 'auto';
  
  // Generate background style based on button style
  let backgroundStyle = '';
  if (determinedStyle === 'gradient') {
    const direction = (determinedGradientDirection as string).replace('to-', 'to ');
    backgroundStyle = `linear-gradient(${direction}, ${determinedGradientFromColor}, ${determinedGradientToColor})`;
  } else if (determinedStyle === 'ghost') {
    backgroundStyle = 'transparent';
  } else {
    backgroundStyle = isHovered ? determinedHoverColor : determinedBgColor;
  }
  
  // Generate border style based on button style
  const borderStyle = (determinedStyle === 'outline' || determinedStyle === 'ghost')
    ? `${determinedBorderWidth} solid ${determinedBorderColor}`
    : '0px solid transparent';
  
  // Generate common style object
  const buttonStyles: React.CSSProperties = {
    ...style,
    background: backgroundStyle,
    color: isHovered ? determinedHoverTextColor : determinedTextColor,
    borderRadius: determinedBorderRadius,
    border: borderStyle,
    width: fullWidth ? '100%' : determinedWidth,
    height: determinedHeight,
    fontWeight: button_settings?.font_weight || '500',
    fontSize: determinedTextSize,
    padding: `${button_settings?.padding_y || '0.75rem'} ${button_settings?.padding_x || '1.5rem'}`,
    transition: `all ${button_settings?.transition_speed || '300ms'} ease`,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: determinedFontFamily,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <button
      {...props}
      className={`btn ${className} ${fullWidth ? 'w-full' : ''} ${buttonSize ? `btn-${buttonSize}` : ''}`}
      style={buttonStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button; 