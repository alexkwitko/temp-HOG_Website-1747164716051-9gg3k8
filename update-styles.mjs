/**
 * Script to update components to use global settings
 * Run with: node update-styles.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target files - these are the key pages and components to update
const targetPaths = [
  'src/pages/HomePage.tsx',
  'src/components/admin/home/HomePageConfig.tsx',
  'src/components/admin/hero/HeroConfig.tsx',
  'src/components/WhyChooseUs.tsx',
  'src/components/admin/why-choose/WhyChooseConfig.tsx',
  'src/components/TrainingMethodology.tsx',
  'src/components/admin/methodology/MethodologyConfig.tsx',
  'src/components/FeaturedProducts.tsx',
  'src/components/admin/products/FeaturedProductsConfig.tsx',
  'src/components/CallToAction.tsx',
  'src/components/admin/cta/CTAConfig.tsx',
  'src/components/Location.tsx',
  'src/components/admin/location/LocationConfig.tsx',
  'src/components/FeaturedPrograms.tsx',
  'src/components/admin/programs/FeaturedProgramsConfig.tsx'
];

// Colors to replace - map common hardcoded colors to CSS variables
const colorReplacements = {
  // Primary colors
  '#B91C1C': 'var(--color-primary)',
  '#c81e1e': 'var(--color-primary)',
  '#1F2937': 'var(--color-primary)',
  '#171717': 'var(--color-primary)',
  '#4F46E5': 'var(--color-primary)',
  '#2563EB': 'var(--color-primary)',
  '#059669': 'var(--color-primary)',
  '#D97706': 'var(--color-primary)',
  '#7C3AED': 'var(--color-primary)',
  '#DB2777': 'var(--color-primary)',
  '#0D9488': 'var(--color-primary)',
  
  // Secondary colors
  '#0F172A': 'var(--color-secondary)',
  '#333333': 'var(--color-secondary)',
  '#6B7280': 'var(--color-secondary)',
  '#f5f5f5': 'var(--color-secondary)',
  '#1E3A8A': 'var(--color-secondary)',
  '#10B981': 'var(--color-secondary)',
  '#F59E0B': 'var(--color-secondary)',
  '#8B5CF6': 'var(--color-secondary)',
  '#EC4899': 'var(--color-secondary)',
  '#14B8A6': 'var(--color-secondary)',
  
  // Accent colors - varies by theme
  '#9CA3AF': 'var(--color-accent)',
  '#F1F5F9': 'var(--color-accent)',
  '#a51818': 'var(--color-accent)',
  '#4338CA': 'var(--color-accent)',
  '#047857': 'var(--color-accent)',
  '#B45309': 'var(--color-accent)',
  '#4C1D95': 'var(--color-accent)',
  '#831843': 'var(--color-accent)',
  '#0F766E': 'var(--color-accent)',
  
  // Background colors
  '#FFFFFF': 'var(--color-background)',
  '#F9FAFB': 'var(--color-background)',
  '#EFF6FF': 'var(--color-background)',
  '#ECFDF5': 'var(--color-background)',
  '#FFFBEB': 'var(--color-background)',
  '#F5F3FF': 'var(--color-background)',
  '#FDF2F8': 'var(--color-background)',
  '#F0FDFA': 'var(--color-background)',
  
  // Text colors
  '#111827': 'var(--color-text)',
  '#000000': 'var(--color-text)',
  '#1E1B4B': 'var(--color-text)',
  '#065F46': 'var(--color-text)',
  '#78350F': 'var(--color-text)',
  '#5B21B6': 'var(--color-text)',
  '#9D174D': 'var(--color-text)',
  '#134E4A': 'var(--color-text)',
  
  // Secondary text colors
  '#6B7280': 'var(--color-textSecondary)',
  '#475569': 'var(--color-textSecondary)',
  '#525252': 'var(--color-textSecondary)',
  '#4338CA': 'var(--color-textSecondary)',
  '#047857': 'var(--color-textSecondary)',
  '#B45309': 'var(--color-textSecondary)',
  '#6D28D9': 'var(--color-textSecondary)',
  '#BE185D': 'var(--color-textSecondary)',
  '#0F766E': 'var(--color-textSecondary)',
  
  // Border colors
  '#E5E7EB': 'var(--color-border)',
  '#E2E8F0': 'var(--color-border)',
  '#D1D5DB': 'var(--color-border)',
  '#C7D2FE': 'var(--color-border)',
  '#BFDBFE': 'var(--color-border)',
  '#A7F3D0': 'var(--color-border)',
  '#FDE68A': 'var(--color-border)',
  '#DDD6FE': 'var(--color-border)',
  '#FBCFE8': 'var(--color-border)',
  '#CCFBF1': 'var(--color-border)'
};

// Font replacements
const fontReplacements = [
  { 
    regex: /fontFamily:.*?['"]([^'"]+)['"]/g,
    replacement: (match, fontName) => {
      // Map to appropriate font variable based on context
      if (match.includes('heading') || match.includes('title') || /h[1-6]/.test(match)) {
        return `fontFamily: 'var(--font-heading)'`;
      } else if (match.includes('primary') || match.includes('button')) {
        return `fontFamily: 'var(--font-primary)'`;
      } else if (match.includes('secondary')) {
        return `fontFamily: 'var(--font-secondary)'`;
      } else {
        return `fontFamily: 'var(--font-body)'`;
      }
    }
  },
  { 
    regex: /font-family:.*?['"]([^'"]+)['"]/g,
    replacement: (match, fontName) => {
      // Similar logic for CSS font-family
      if (match.includes('heading') || match.includes('title')) {
        return `font-family: var(--font-heading)`;
      } else if (match.includes('primary') || match.includes('button')) {
        return `font-family: var(--font-primary)`;
      } else if (match.includes('secondary')) {
        return `font-family: var(--font-secondary)`;
      } else {
        return `font-family: var(--font-body)`;
      }
    }
  },
  {
    // For Tailwind fontFamily classes
    regex: /(className=["'].*?)font-sans(.*?["'])/g,
    replacement: '$1font-body$2'
  }
];

// Button replacements
const buttonReplacements = [
  {
    // Replace common button classes with our global ones
    regex: /className=["'](.*?)(px-\d+ py-\d+ (?:bg-[a-z]+-\d+ )?(?:text-[a-z]+-\d+ )?(?:hover:bg-[a-z]+-\d+ )?(?:rounded(?:-md)? )?(?:border(?:-[a-z]+-\d+)? )?(?:shadow-sm )?transition)(.*?)["']/g,
    replacement: (match, prefix, buttonClasses, suffix) => {
      // Determine if it's more likely to be primary or secondary based on classes
      if (buttonClasses.includes('bg-red-') || buttonClasses.includes('bg-blue-') || 
          buttonClasses.includes('bg-indigo-') || buttonClasses.includes('bg-purple-') ||
          buttonClasses.includes('bg-green-') || 
          (!buttonClasses.includes('border') && !buttonClasses.includes('outline') && !buttonClasses.includes('ghost'))) {
        return `className="${prefix}btn btn-primary${suffix}"`;
      } else {
        return `className="${prefix}btn btn-secondary${suffix}"`;
      }
    }
  },
  {
    // Target simple CSS btn styles
    regex: /(style=["'](.*?))((background|background-color):\s*#[0-9a-fA-F]{3,6};.*?color:\s*#[0-9a-fA-F]{3,6};(.*?))["']/g,
    replacement: (match, prefix, middle, buttonStyles, bgProp, suffix) => {
      // Remove specific background/color styles as they'll come from the class
      return `className="btn btn-primary" ${prefix}${suffix.replace(/background(-color)?:\s*#[0-9a-fA-F]{3,6};/g, '').replace(/color:\s*#[0-9a-fA-F]{3,6};/g, '')}"`;
    }
  }
];

// Component import additions
const componentImportAdditions = {
  'useSiteSettings': "import { useSiteSettings } from '../contexts/SiteSettingsContext';",
  'SiteSettingsContext': "import { useSiteSettings } from '../../contexts/SiteSettingsContext';",
  'deepPath': "import { useSiteSettings } from '../../../contexts/SiteSettingsContext';"
};

// Process a file
function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return;
  }
  
  console.log(`Processing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if we need to add useSiteSettings hook
  if (!content.includes('useSiteSettings') && 
      (content.includes('#') || 
       content.includes('color:') || 
       content.includes('fontFamily') || 
       content.includes('font-family'))) {
    
    // Add the import based on file path depth
    const pathDepth = filePath.split('/').length;
    let importStatement;
    
    if (pathDepth > 4) {
      importStatement = componentImportAdditions.deepPath;
    } else if (pathDepth > 3) {
      importStatement = componentImportAdditions.SiteSettingsContext;
    } else {
      importStatement = componentImportAdditions.useSiteSettings;
    }
    
    // Add import after existing imports
    const lastImportIndex = content.lastIndexOf('import');
    if (lastImportIndex !== -1) {
      const endOfImportLine = content.indexOf('\n', lastImportIndex);
      if (endOfImportLine !== -1) {
        content = 
          content.substring(0, endOfImportLine + 1) +
          importStatement + '\n' +
          content.substring(endOfImportLine + 1);
        modified = true;
      }
    }
    
    // Add the hook usage in the component
    const functionComponentMatch = content.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
    const arrowFunctionMatch = content.match(/const\s+([A-Za-z0-9_]+)\s*:\s*React\.FC.*?=/);
    
    if (functionComponentMatch || arrowFunctionMatch) {
      // Find the opening of the component body
      const componentName = (functionComponentMatch?.[1] || arrowFunctionMatch?.[1]);
      let bodyStartIndex;
      
      if (functionComponentMatch) {
        // For function Component() { ... }
        bodyStartIndex = content.indexOf('{', content.indexOf(functionComponentMatch[0]));
      } else {
        // For const Component: React.FC = () => { ... }
        const arrowIndex = content.indexOf('=>', content.indexOf(arrowFunctionMatch[0]));
        bodyStartIndex = content.indexOf('{', arrowIndex);
      }
      
      if (bodyStartIndex !== -1) {
        // Insert the hook after the opening brace
        content = 
          content.substring(0, bodyStartIndex + 1) +
          '\n  // Access global settings\n  const { settings } = useSiteSettings();\n' +
          content.substring(bodyStartIndex + 1);
        modified = true;
      }
    }
  }
  
  // Replace color values
  for (const [color, variable] of Object.entries(colorReplacements)) {
    const colorRegex = new RegExp(color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    if (content.match(colorRegex)) {
      content = content.replace(colorRegex, variable);
      modified = true;
    }
  }
  
  // Replace font styles
  for (const { regex, replacement } of fontReplacements) {
    if (content.match(regex)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
  }
  
  // Replace button styles
  for (const { regex, replacement } of buttonReplacements) {
    if (content.match(regex)) {
      content = content.replace(regex, replacement);
      modified = true;
    }
  }
  
  // Save changes if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  } else {
    console.log(`ℹ️ No changes needed for ${filePath}`);
  }
}

// Process all target files
targetPaths.forEach(targetPath => {
  try {
    processFile(targetPath);
  } catch (error) {
    console.error(`Error processing ${targetPath}:`, error);
  }
});

console.log('Finished updating all components. Please review the changes manually.'); 