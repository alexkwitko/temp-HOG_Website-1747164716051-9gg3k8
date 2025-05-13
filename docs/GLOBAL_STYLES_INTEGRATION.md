# Global Styles Integration Guide

This guide explains how to integrate the global styles system into components in the House of Grappling website.

## Overview

The HOG website uses a global styles system that allows consistent styling across components. This system is managed through the `GlobalSettingsContext` and applied via CSS variables and direct style objects.

## Key Components

1. **GlobalSettingsContext** - Manages and provides style settings to the entire app
2. **GlobalStylesApplier** - Applies CSS variables to the document root
3. **useComponentGlobalStyles** - Hook for components to easily access and use global styles

## Integration Steps

Follow these steps to integrate global styles into any component:

### Step 1: Import the Hook

```tsx
import { useComponentGlobalStyles } from '../lib/hooks/useComponentGlobalStyles';
```

### Step 2: Use the Hook in Your Component

```tsx
const YourComponent = () => {
  // Pass a component ID for better logging and debugging
  const { buttonStyles, fontStyles, colorStyles, isLoading } = useComponentGlobalStyles('YourComponentName');
  
  // Component implementation...
}
```

### Step 3: Apply the Styles

You can use the styles in your component in two ways:

#### Option 1: Direct Style Objects

```tsx
// Example for a button component
const [isHovered, setIsHovered] = useState(false);

const buttonStyle = {
  backgroundColor: isHovered ? buttonStyles.primary.hoverBackground : buttonStyles.primary.background,
  color: isHovered ? buttonStyles.primary.hoverTextColor : buttonStyles.primary.textColor,
  fontFamily: fontStyles.primaryFont,
  padding: `${buttonStyles.primary.paddingY} ${buttonStyles.primary.paddingX}`,
  borderRadius: buttonStyles.primary.borderRadius,
  border: `${buttonStyles.primary.borderWidth} solid ${buttonStyles.primary.borderColor}`,
  fontWeight: buttonStyles.primary.fontWeight as string,
  transition: `all ${buttonStyles.shared.transitionSpeed} ease`,
};

return (
  <button 
    style={buttonStyle}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    Click me
  </button>
);
```

#### Option 2: CSS Variables

The global styles are also applied as CSS variables, which you can use in your CSS:

```tsx
// In your component
return (
  <div className="your-component">
    <h2 className="uses-global-font">Heading</h2>
    <button className="global-button">Click me</button>
  </div>
);

// In your CSS/SCSS
.your-component {
  .uses-global-font {
    font-family: var(--font-heading);
  }
  
  .global-button {
    background-color: var(--btn-primary-bg);
    color: var(--btn-primary-text);
    border-radius: var(--btn-primary-border-radius);
    
    &:hover {
      background-color: var(--btn-primary-hover-bg);
      color: var(--btn-primary-hover-text);
    }
  }
}
```

### Step 4: Listen for Global Setting Changes

To ensure your component updates when global settings change, add an event listener:

```tsx
useEffect(() => {
  // Listen for global settings changes
  const handleSettingsChange = () => {
    console.log('YourComponent: Global settings changed, refreshing component');
    // Force a re-render or reload data if needed
    setRefreshTrigger(prev => !prev);
  };
  
  window.addEventListener('globalSettingsChanged', handleSettingsChange);
  
  return () => {
    window.removeEventListener('globalSettingsChanged', handleSettingsChange);
  };
}, []);
```

## Available Style Properties

### Button Styles

```tsx
buttonStyles.primary.background           // Primary button background color
buttonStyles.primary.textColor            // Primary button text color
buttonStyles.primary.hoverBackground      // Primary button hover background
buttonStyles.primary.hoverTextColor       // Primary button hover text color
buttonStyles.primary.borderColor          // Primary button border color
buttonStyles.primary.borderWidth          // Primary button border width
buttonStyles.primary.borderRadius         // Primary button border radius
buttonStyles.primary.paddingX             // Primary button horizontal padding
buttonStyles.primary.paddingY             // Primary button vertical padding
buttonStyles.primary.fontWeight           // Primary button font weight
buttonStyles.primary.style                // Primary button style (solid, outline, ghost, gradient)

buttonStyles.secondary                    // Same properties for secondary buttons

buttonStyles.shared.transitionSpeed       // Transition speed for hover effects
buttonStyles.shared.fontSize              // Primary button font size
buttonStyles.shared.secondaryFontSize     // Secondary button font size
buttonStyles.shared.fixedWidth            // Whether buttons use fixed width
buttonStyles.shared.width                 // Fixed width value
buttonStyles.shared.height                // Fixed height value

buttonStyles.gradient.direction           // Gradient direction
buttonStyles.gradient.fromColor           // Gradient start color
buttonStyles.gradient.toColor             // Gradient end color
// ... also has secondary gradient properties
```

### Font Styles

```tsx
fontStyles.primaryFont      // Primary font family
fontStyles.secondaryFont    // Secondary font family
fontStyles.bodyFont         // Body text font family
fontStyles.headingFont      // Heading font family
fontStyles.enabled          // Whether custom fonts are enabled
```

### Color Styles

```tsx
colorStyles.paletteId               // Global color palette ID
colorStyles.homePagePaletteId       // Specific palette for homepage
colorStyles.useIntercalatedColors   // Whether to alternate section colors
colorStyles.useUniformColors        // Whether to use uniform colors
```

## Example Component: Location Section

See `src/components/LocationSection.tsx` for a complete example implementation.

## Troubleshooting

If global styles aren't applying properly:

1. Check if the component is properly using the `useComponentGlobalStyles` hook
2. Make sure `GlobalStylesApplier` is included in your layout component
3. Verify that the settings are being saved correctly in the database
4. Check browser console for any errors in style application
5. Try forcing a refresh of the component when settings change

## CSS Variables Reference

The global styles system also sets these CSS variables that you can use directly in your CSS:

```css
/* Font Variables */
--font-primary: 'Font Name';
--font-secondary: 'Font Name';
--font-body: 'Font Name';
--font-heading: 'Font Name';

/* Button Variables */
--btn-primary-bg: #color;
--btn-primary-text: #color;
--btn-primary-hover-bg: #color;
--btn-primary-hover-text: #color;
--btn-primary-border: #color;
--btn-primary-border-width: 0px;
--btn-primary-border-radius: 0.25rem;

--btn-secondary-bg: #color;
--btn-secondary-text: #color;
--btn-secondary-hover-bg: #color;
--btn-secondary-hover-text: #color;
--btn-secondary-border: #color;
--btn-secondary-border-width: 1px;
--btn-secondary-border-radius: 0.25rem;

/* Gradient Variables */
--gradient-from: #color;
--gradient-to: #color;
--gradient-direction: to-right;

/* Button Sizing/Spacing */
--btn-padding-x: 1.5rem;
--btn-padding-y: 0.75rem;
--btn-transition: 300ms;

/* Button Style */
--btn-primary-style: solid;
--btn-secondary-style: solid;
--btn-font-weight: 500;
--btn-text-size: md;
--btn-secondary-text-size: md;
``` 