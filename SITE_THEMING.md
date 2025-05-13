# Global Theming System

This document explains how the global theming system works in the House of Grappling website and how to use it effectively.

## Overview

We've implemented a global theming system that uses CSS variables to consistently apply fonts, colors, and button styles throughout the entire application. This ensures that when you make changes in the admin "Settings" page, those changes are immediately reflected across the entire site.

## Key Components

1. **SiteSettingsContext**: The context provider that fetches global settings from the database and applies them as CSS variables.
2. **Global CSS Classes**: We've defined `.btn`, `.btn-primary`, and `.btn-secondary` classes that automatically use the configured button styles.
3. **CSS Variables**: Variables like `--color-primary`, `--font-heading`, etc. that are applied to the `:root` element.
4. **Tailwind Integration**: Extended Tailwind theme configuration to reference these CSS variables.

## Automation Scripts

We've created two Node.js scripts to help update the codebase to use these global settings. Since your project is using ES modules, we've provided the scripts in ESM format.

### 1. `update-styles.mjs`

This script automatically updates components to use the global theme:

- Finds and replaces hardcoded colors with CSS variable references
- Updates font family references to use CSS variables
- Replaces custom button styles with our global button classes
- Adds the `useSiteSettings` hook where needed

To run:
```bash
node update-styles.mjs
```

### 2. `update-tailwind.mjs`

This script:

- Updates your Tailwind configuration to be aware of the CSS variables
- Allows you to use Tailwind classes like `bg-primary` or `text-secondary` that use the CSS variables
- Creates reusable Button components that leverage the global styles

To run:
```bash
node update-tailwind.mjs
```

## Using the Global Theme in Your Components

### Colors

Instead of using hardcoded colors like `#B91C1C`, use:

```jsx
// CSS
color: var(--color-primary);
background-color: var(--color-background);

// Tailwind classes (after running update-tailwind.mjs)
className="text-primary bg-background border-border"
```

### Fonts

Instead of specifying font families directly, use:

```jsx
// CSS
font-family: var(--font-heading);

// Tailwind classes (after running update-tailwind.mjs)
className="font-heading"
```

### Buttons

Use the global button classes instead of custom button styles:

```jsx
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
```

Or use the reusable Button component (created by `update-tailwind.mjs`):

```jsx
import { Button, ButtonLink } from '../components/common/ButtonComponents';

// In your component
<Button variant="primary" size="md">Click Me</Button>
<ButtonLink variant="secondary" href="/some-page">Visit Page</ButtonLink>
```

## Adding New Components

When creating new components:

1. Import the settings context:
   ```jsx
   import { useSiteSettings } from '../contexts/SiteSettingsContext';
   ```

2. Use the hook in your component:
   ```jsx
   const { settings } = useSiteSettings();
   ```

3. Use CSS variables or the global button classes for styling.

## Color Palette System

The default color palettes are defined in `SiteSettingsContext.tsx` and include:

- **monochrome**: Minimalist grayscale
- **hog_brand**: House of Grappling's signature red + dark blue
- **modern_contrast**: Indigo + dark gray
- **hogRed, modernDark, indigo, blue, green, amber, purple, pink, teal**: Solid color themes
- **redGradient, blueGradient, greenGradient, purpleGradient, darkGradient**: Gradient themes

Each palette defines variables for:
- `primary`: Main brand/accent color
- `secondary`: Secondary/complementary color
- `accent`: Tertiary color for highlights, borders, etc.
- `background`: Page background color
- `text`: Main text color
- `textSecondary`: Secondary text color
- `border`: Default border color

## Best Practices

1. **Always use the global theme variables** rather than hardcoded colors/fonts
2. **Use the button components/classes** for any clickable buttons
3. **Check the active palette** when testing to ensure your UI works with different color schemes
4. **Let users control the look** through the Settings page rather than hardcoding styles
5. **Update both scripts** if you add new style properties to the global settings

## Troubleshooting

If styles aren't applying correctly:

1. Check if `SiteSettingsProvider` is wrapping your component
2. Verify CSS variables are properly set in DevTools
3. Look for hardcoded styles that may be overriding the global theme
4. Check for typos in CSS variable names (e.g., `--color-primary` vs `--primary-color`)

## Manually Updating Components

If you prefer to update components manually instead of using the scripts:

1. Replace hardcoded color values with CSS variables:
   ```jsx
   // Before
   color: #B91C1C;
   
   // After
   color: var(--color-primary);
   ```

2. Replace font families:
   ```jsx
   // Before
   fontFamily: 'Roboto, sans-serif'
   
   // After
   fontFamily: 'var(--font-heading)'
   ```

3. Replace button styles:
   ```jsx
   // Before
   <button className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800">
   
   // After
   <button className="btn btn-primary">
   ```

## Future Improvements

- Add dark mode toggle that uses an alternative set of CSS variables
- Create a visual style guide/component library showing themed elements
- Add more configurable properties (animations, spacing, etc.) 