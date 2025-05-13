# Global Styles Integration Guide

## Overview

The global styles system in HOG website has been updated to provide consistent styling across all components. This guide explains how to integrate these styles into your components.

## Key Components

1. **GlobalSettingsContext** - Provides settings to the entire app
2. **GlobalStylesApplier** - Applies CSS variables to document root 
3. **useComponentGlobalStyles** - Hook for components to use

## Quick Integration Steps

### 1. Import the Hook

```jsx
import { useComponentGlobalStyles } from '../lib/hooks/useComponentGlobalStyles';
```

### 2. Use the Hook in Your Component

```jsx
const YourComponent = () => {
  // Pass your component ID for logging
  const { buttonStyles, fontStyles, colorStyles, isLoading } = useComponentGlobalStyles('YourComponentName');
  
  // Use these styles in your component
  // ...
}
```

### 3. Apply Global Styles

#### Option A: Direct Style Objects (Recommended)

```jsx
// Create style objects
const containerStyle = {
  backgroundColor: `var(--color-palette-light, #FFFFFF)`,
  color: `var(--color-palette-text-dark, #0F172A)`,
  fontFamily: fontStyles.bodyFont,
};

const headingStyle = {
  fontFamily: fontStyles.headingFont,
  color: `var(--color-palette-primary, #0F172A)`,
};

const buttonStyle = {
  backgroundColor: isHovered ? buttonStyles.primary.hoverBackground : buttonStyles.primary.background,
  color: isHovered ? buttonStyles.primary.hoverTextColor : buttonStyles.primary.textColor,
  fontFamily: fontStyles.primaryFont,
  padding: `${buttonStyles.primary.paddingY} ${buttonStyles.primary.paddingX}`,
  borderRadius: buttonStyles.primary.borderRadius,
  border: `${buttonStyles.primary.borderWidth} solid ${buttonStyles.primary.borderColor}`,
  fontWeight: buttonStyles.primary.fontWeight,
  transition: `all ${buttonStyles.shared.transitionSpeed} ease`,
};

// Use in your JSX
return (
  <section style={containerStyle}>
    <h2 style={headingStyle}>Your Heading</h2>
    <button 
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Click Me
    </button>
  </section>
);
```

#### Option B: CSS Variables

```jsx
// In your CSS or styled-components
const StyledSection = styled.section`
  background-color: var(--color-palette-light);
  color: var(--color-palette-text-dark);
  font-family: var(--font-body);
  
  h2 {
    font-family: var(--font-heading);
    color: var(--color-palette-primary);
  }
  
  button {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border-radius: var(--btn-primary-border-radius);
    
    &:hover {
      background-color: var(--btn-primary-hover-bg);
      color: var(--btn-primary-hover-text);
    }
  }
`;
```

### 4. Listen for Global Settings Changes

```jsx
useEffect(() => {
  const handleSettingsChange = () => {
    console.log('Component: Global settings changed, refreshing');
    // Trigger re-render by updating some state
    setRefreshTrigger(prev => !prev); 
  };
  
  window.addEventListener('globalSettingsChanged', handleSettingsChange);
  
  return () => {
    window.removeEventListener('globalSettingsChanged', handleSettingsChange);
  };
}, []);
```

## Available Global Variables

### Color Theme Variables
- `--color-palette-primary` - Primary brand color
- `--color-palette-secondary` - Secondary color
- `--color-palette-accent` - Accent color
- `--color-palette-light` - Light background color
- `--color-palette-dark` - Dark background color 
- `--color-palette-text-dark` - Dark text color (for light backgrounds)
- `--color-palette-text-light` - Light text color (for dark backgrounds)
- `--color-palette-success` - Success/green color
- `--color-palette-warning` - Warning/amber color
- `--color-palette-error` - Error/red color
- `--color-palette-info` - Info/blue color

### Button Variables
- `--btn-primary-bg` - Primary button background
- `--btn-primary-text` - Primary button text color
- `--btn-primary-hover-bg` - Primary button hover background
- `--btn-primary-hover-text` - Primary button hover text
- `--btn-primary-border` - Primary button border color
- `--btn-primary-border-width` - Primary button border width
- `--btn-primary-border-radius` - Primary button border radius

- `--btn-secondary-bg` - Secondary button background
- `--btn-secondary-text` - Secondary button text
- `--btn-secondary-hover-bg` - Secondary button hover background
- `--btn-secondary-hover-text` - Secondary button hover text

### Font Variables
- `--font-primary` - Primary font family
- `--font-secondary` - Secondary font family
- `--font-body` - Body text font family
- `--font-heading` - Heading font family

## Example Implementation

See the `FeaturedPrograms.tsx` component for a complete example of how to implement global styles. This component demonstrates:

1. Using the `useComponentGlobalStyles` hook
2. Creating style objects based on global settings
3. Applying styles to different elements
4. Handling hover states for buttons
5. Listening for global settings changes

## Troubleshooting

If global styles aren't applying correctly:

1. Make sure `GlobalStylesApplier` is included in your layout component
2. Check that the component is using `useComponentGlobalStyles` correctly
3. Verify that global settings are being saved in the database
4. Look for console errors related to style application
5. Try using direct style objects instead of CSS variables 