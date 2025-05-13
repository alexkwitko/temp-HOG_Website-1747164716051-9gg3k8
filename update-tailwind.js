/**
 * Script to update Tailwind configuration to use our CSS variables
 * Run with: node update-tailwind.js
 */

const fs = require('fs');
const path = require('path');

const tailwindConfigPath = 'tailwind.config.js';

// Check if tailwind config exists
if (!fs.existsSync(tailwindConfigPath)) {
  console.error(`❌ Could not find Tailwind config at ${tailwindConfigPath}`);
  process.exit(1);
}

console.log(`Updating Tailwind config at ${tailwindConfigPath}...`);

// Read the current config
let content = fs.readFileSync(tailwindConfigPath, 'utf8');

// Define the theme extension section for CSS variables
const themeExtension = `
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-textSecondary)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        primary: ['var(--font-primary)'],
        secondary: ['var(--font-secondary)'],
        body: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
      },
      borderRadius: {
        'btn-primary': 'var(--btn-primary-border-radius)',
        'btn-secondary': 'var(--btn-secondary-border-radius)',
      },
      borderWidth: {
        'btn-primary': 'var(--btn-primary-border-width)',
        'btn-secondary': 'var(--btn-secondary-border-width)',
      },
      borderColor: {
        'btn-primary': 'var(--btn-primary-border-color)',
        'btn-secondary': 'var(--btn-secondary-border-color)',
      },
      backgroundColor: {
        'btn-primary': 'var(--btn-primary-bg)',
        'btn-primary-hover': 'var(--btn-primary-hover-bg)',
        'btn-secondary': 'var(--btn-secondary-bg)',
        'btn-secondary-hover': 'var(--btn-secondary-hover-bg)',
      },
      textColor: {
        'btn-primary': 'var(--btn-primary-text)',
        'btn-primary-hover': 'var(--btn-primary-hover-text)',
        'btn-secondary': 'var(--btn-secondary-text)',
        'btn-secondary-hover': 'var(--btn-secondary-hover-text)',
      },
    },`;

// Check if theme section exists
if (content.includes('theme:')) {
  // Check if extend already exists within theme
  if (content.includes('theme: {') && content.includes('extend: {')) {
    // Add our values to the extend section
    const extendPattern = /extend:\s*{/;
    const match = content.match(extendPattern);
    
    if (match) {
      // Get the position right after the opening bracket of extend
      const position = match.index + match[0].length;
      
      // Add our theme extensions after the opening bracket
      content = content.substring(0, position) + `
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-textSecondary)',
        border: 'var(--color-border)',
      },
      fontFamily: {
        primary: ['var(--font-primary)'],
        secondary: ['var(--font-secondary)'],
        body: ['var(--font-body)'],
        heading: ['var(--font-heading)'],
      },` + content.substring(position);
    } else {
      console.error('❌ Could not find the right position to extend the theme');
    }
  } else {
    // Add extend section to theme
    const themePattern = /theme:\s*{/;
    const match = content.match(themePattern);
    
    if (match) {
      const position = match.index + match[0].length;
      content = content.substring(0, position) + themeExtension + content.substring(position);
    } else {
      console.error('❌ Could not find the theme section');
    }
  }
} else {
  // Add entire theme section if it doesn't exist
  const moduleExportsPattern = /module\.exports\s*=\s*{/;
  const match = content.match(moduleExportsPattern);
  
  if (match) {
    const position = match.index + match[0].length;
    content = content.substring(0, position) + `
  theme: {
    ${themeExtension.trim()}
  },` + content.substring(position);
  } else {
    console.error('❌ Could not find module.exports in the Tailwind config');
  }
}

// Write the updated content
fs.writeFileSync(tailwindConfigPath, content, 'utf8');
console.log('✅ Tailwind config updated successfully. CSS variables have been added to the theme configuration.');

// Create a ButtonComponents.tsx file with reusable button components
const buttonComponentsPath = 'src/components/common/ButtonComponents.tsx';
const buttonComponentsDir = path.dirname(buttonComponentsPath);

// Make sure the directory exists
if (!fs.existsSync(buttonComponentsDir)) {
  fs.mkdirSync(buttonComponentsDir, { recursive: true });
}

// Create the button components file
const buttonComponentsContent = `import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

/**
 * Button component that uses the global button styles from SiteSettingsContext
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  ...props
}) => {
  // Base classes from our global CSS
  const baseClasses = 'btn';
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Additional classes for when an icon is present
  const iconClasses = icon ? 'inline-flex items-center justify-center' : '';
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses} \${sizeClasses} \${widthClasses} \${iconClasses} \${className}\`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

/**
 * Link styled as a button, using the global button styles
 */
export const ButtonLink: React.FC<ButtonProps & { href: string }> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  className = '',
  href,
  ...props
}) => {
  // Base classes from our global CSS
  const baseClasses = 'btn';
  const variantClasses = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }[size];
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Additional classes for when an icon is present
  const iconClasses = icon ? 'inline-flex items-center justify-center' : '';
  
  return (
    <a
      href={href}
      className={\`\${baseClasses} \${variantClasses} \${sizeClasses} \${widthClasses} \${iconClasses} \${className}\`}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </a>
  );
};
`;

fs.writeFileSync(buttonComponentsPath, buttonComponentsContent, 'utf8');
console.log(`✅ Created reusable Button components at ${buttonComponentsPath}`);

console.log('All configuration updates complete! Please rebuild your app with the new configuration.'); 