export interface PaletteColor {
  name: string;
  background: string;
  text: string;
  accent: string;
  border?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
  isCustom?: boolean;
  colors: PaletteColor[];
}

export interface ColorPaletteSettings {
  globalPaletteId: string;
  homePagePaletteId?: string; // Optional override for the home page
  useIntercalatedColors?: boolean;
  useUniformColors?: boolean;
}

// Type for components that can have colors applied
export interface ColorableComponent {
  id: string;
  name: string;
  order: number;
  background_color: string;
  text_color: string;
  border_color: string;
  border_width?: number;
  border_radius?: number;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  vertical_align?: string;
  horizontal_align?: string;
  is_active?: boolean;
}

// Predefined palettes
export const DEFAULT_PALETTES: ColorPalette[] = [
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Clean black, white, and gray color scheme',
    isDefault: true,
    colors: [
      {
        name: 'Light',
        background: '#FFFFFF',
        text: '#000000',
        accent: '#333333',
        border: 'transparent'
      },
      {
        name: 'Dark',
        background: '#1A1A1A',
        text: '#FFFFFF',
        accent: '#CCCCCC',
        border: 'transparent'
      },
      {
        name: 'Gray',
        background: '#F5F5F5',
        text: '#333333',
        accent: '#000000',
        border: 'transparent'
      }
    ]
  },
  {
    id: 'hog_brand',
    name: 'House of Grappling',
    description: 'Professional martial arts brand colors',
    colors: [
      {
        name: 'Red',
        background: '#B91C1C',
        text: '#FFFFFF',
        accent: '#0F172A',
        border: '#000000'
      },
      {
        name: 'Black',
        background: '#0F172A',
        text: '#FFFFFF',
        accent: '#B91C1C',
        border: '#B91C1C'
      },
      {
        name: 'Gray',
        background: '#F1F5F9',
        text: '#0F172A',
        accent: '#B91C1C',
        border: 'transparent'
      }
    ]
  },
  {
    id: 'modern_contrast',
    name: 'Modern Contrast',
    description: 'Bold high-contrast design with attractive accent colors',
    colors: [
      {
        name: 'White',
        background: '#FFFFFF',
        text: '#111827',
        accent: '#4F46E5',
        border: '#E5E7EB'
      },
      {
        name: 'Dark',
        background: '#111827',
        text: '#F9FAFB',
        accent: '#4F46E5',
        border: '#374151'
      },
      {
        name: 'Accent',
        background: '#4F46E5',
        text: '#FFFFFF',
        accent: '#111827',
        border: 'transparent'
      },
      {
        name: 'Light Gray',
        background: '#F3F4F6',
        text: '#111827',
        accent: '#4F46E5',
        border: '#E5E7EB'
      }
    ]
  },
  {
    id: 'blue_theme',
    name: 'Blue Theme',
    description: 'Professional blue-based color scheme',
    colors: [
      {
        name: 'Light Blue',
        background: '#F0F8FF',
        text: '#333333',
        accent: '#1E90FF',
        border: 'transparent'
      },
      {
        name: 'Dark Blue',
        background: '#1E3A8A',
        text: '#FFFFFF',
        accent: '#38BDF8',
        border: 'transparent'
      },
      {
        name: 'Navy',
        background: '#0F172A',
        text: '#FFFFFF',
        accent: '#60A5FA',
        border: 'transparent'
      }
    ]
  },
  {
    id: 'martial_arts',
    name: 'Martial Arts',
    description: 'Traditional martial arts inspired colors',
    colors: [
      {
        name: 'Black Belt',
        background: '#121212',
        text: '#FFFFFF',
        accent: '#DC2626',
        border: 'transparent'
      },
      {
        name: 'Wood',
        background: '#8B4513',
        text: '#F5F5DC',
        accent: '#D4A76A',
        border: 'transparent'
      },
      {
        name: 'Tatami',
        background: '#4F7942',
        text: '#FFFFFF',
        accent: '#8FC93A',
        border: 'transparent'
      }
    ]
  },
  {
    id: 'colorful',
    name: 'Colorful',
    description: 'Vibrant and diverse color options',
    colors: [
      {
        name: 'Red',
        background: '#FFE5E5',
        text: '#7F1D1D',
        accent: '#EF4444',
        border: 'transparent'
      },
      {
        name: 'Blue',
        background: '#EFF6FF',
        text: '#1E3A8A',
        accent: '#3B82F6',
        border: 'transparent'
      },
      {
        name: 'Green',
        background: '#ECFDF5',
        text: '#065F46',
        accent: '#10B981',
        border: 'transparent'
      },
      {
        name: 'Purple',
        background: '#F5F3FF',
        text: '#5B21B6',
        accent: '#8B5CF6',
        border: 'transparent'
      },
      {
        name: 'Orange',
        background: '#FFF7ED',
        text: '#9A3412',
        accent: '#F97316',
        border: 'transparent'
      }
    ]
  },
  // New palettes below
  {
    id: 'dark_mode',
    name: 'Dark Mode',
    description: 'Sleek dark color scheme for modern websites',
    colors: [
      {
        name: 'Dark Background',
        background: '#121212',
        text: '#FFFFFF',
        accent: '#BB86FC',
        border: '#333333'
      },
      {
        name: 'Surface',
        background: '#1E1E1E',
        text: '#E1E1E1',
        accent: '#03DAC6',
        border: '#333333'
      },
      {
        name: 'Accent',
        background: '#3700B3',
        text: '#FFFFFF',
        accent: '#BB86FC',
        border: '#333333'
      }
    ]
  },
  {
    id: 'earthy',
    name: 'Earthy Tones',
    description: 'Natural earth-inspired colors',
    colors: [
      {
        name: 'Sand',
        background: '#E0C9A6',
        text: '#3A3845',
        accent: '#78350F',
        border: '#78350F'
      },
      {
        name: 'Clay',
        background: '#A75D5D',
        text: '#FFFBF5',
        accent: '#FFEDD5',
        border: 'transparent'
      },
      {
        name: 'Forest',
        background: '#3F4E4F',
        text: '#FFFFFF',
        accent: '#A27B5C',
        border: 'transparent'
      }
    ]
  },
  {
    id: 'sunset',
    name: 'Sunset Gradient',
    description: 'Warm gradient colors inspired by sunsets',
    colors: [
      {
        name: 'Horizon',
        background: '#FF5F6D',
        text: '#FFFFFF',
        accent: '#FFC371',
        border: 'transparent'
      },
      {
        name: 'Sky',
        background: '#FFC371',
        text: '#7E2E3B',
        accent: '#FF5F6D',
        border: 'transparent'
      },
      {
        name: 'Dusk',
        background: '#7F5A83',
        text: '#FFFFFF',
        accent: '#FFC371',
        border: 'transparent'
      }
    ]
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    description: 'Professional grayscale for minimalist designs',
    colors: [
      {
        name: 'White',
        background: '#FFFFFF',
        text: '#333333',
        accent: '#000000',
        border: '#EEEEEE'
      },
      {
        name: 'Light Gray',
        background: '#F7F7F7',
        text: '#333333',
        accent: '#666666',
        border: '#DDDDDD'
      },
      {
        name: 'Medium Gray',
        background: '#AAAAAA',
        text: '#FFFFFF',
        accent: '#333333',
        border: '#999999'
      },
      {
        name: 'Dark Gray',
        background: '#333333',
        text: '#FFFFFF',
        accent: '#AAAAAA',
        border: '#444444'
      }
    ]
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Cool blue and teal tones of the ocean',
    colors: [
      {
        name: 'Surface',
        background: '#AEE2FF',
        text: '#112B3C',
        accent: '#1B262C',
        border: 'transparent'
      },
      {
        name: 'Shallow',
        background: '#3498DB',
        text: '#FFFFFF',
        accent: '#1ABC9C',
        border: 'transparent'
      },
      {
        name: 'Deep',
        background: '#112B3C',
        text: '#FFFFFF',
        accent: '#3498DB',
        border: 'transparent'
      }
    ]
  },
  {
    id: 'combat_sports',
    name: 'Combat Sports',
    description: 'Bold colors inspired by combat sports',
    colors: [
      {
        name: 'Ring Canvas',
        background: '#F1F1F1',
        text: '#111111',
        accent: '#B91C1C',
        border: '#CCCCCC'
      },
      {
        name: 'Mat',
        background: '#1A365D',
        text: '#FFFFFF',
        accent: '#C53030',
        border: '#2C5282'
      },
      {
        name: 'Boxing Red',
        background: '#B91C1C',
        text: '#FFFFFF',
        accent: '#000000',
        border: '#9B2C2C'
      },
      {
        name: 'Boxing Blue',
        background: '#2B6CB0',
        text: '#FFFFFF',
        accent: '#000000',
        border: '#2C5282'
      }
    ]
  }
];

// Helper function to get a palette by ID
export function getPaletteById(paletteId: string, customPalettes: ColorPalette[] = []): ColorPalette | undefined {
  const allPalettes = [...DEFAULT_PALETTES, ...customPalettes];
  return allPalettes.find(palette => palette.id === paletteId);
}

// Helper to apply a palette color to a component
export function applyPaletteToComponent(
  component: ColorableComponent, 
  paletteId: string, 
  colorIndex: number, 
  customPalettes: ColorPalette[] = []
): ColorableComponent {
  const palette = getPaletteById(paletteId, customPalettes);
  if (!palette || palette.colors.length === 0) return component;
  
  // Ensure the color index is within bounds using modulo
  const colorIdx = colorIndex % palette.colors.length;
  const color = palette.colors[colorIdx];
  
  return {
    ...component,
    background_color: color.background,
    text_color: color.text,
    border_color: color.border || 'transparent'
  };
} 