import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { Save, Move, Edit, Eye, EyeOff, ChevronRight, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { StrictModeDroppable } from '../../../components/StrictModeDroppable';
import ComponentPreview from './ComponentPreview';
import ColorPaletteSelector from '../../admin/ColorPaletteSelector';

// Component types
interface HomePageComponent {
  id: string;
  name: string;
  order: number;
  is_active: boolean;
  background_color: string;
  text_color: string;
  border_color: string;
  border_width: number;
  border_radius: number;
  padding: string;
  margin: string;
  width: string;
  height: string;
  vertical_align: string;
  horizontal_align: string;
  palette_override?: string;
  text_background_enabled?: boolean;
  text_background_color?: string;
  text_background_opacity?: number;
}

// Add interface for HomePage configuration
interface HomePageConfig {
  palette_id?: string; // Optional override for the page level
  color_mode?: string; // Whether to use uniform or alternating colors
  components: HomePageComponent[];
}

// Default components for the home page
const DEFAULT_COMPONENTS: HomePageComponent[] = [
  {
    id: 'hero',
    name: 'Hero Section',
    order: 1,
    is_active: true,
    background_color: 'transparent',
    text_color: '#FFFFFF',
    border_color: 'transparent',
    border_width: 0,
    border_radius: 0,
    padding: '0px',
    margin: '0px',
    width: '100%',
    height: 'auto',
    vertical_align: 'center',
    horizontal_align: 'center',
    text_background_enabled: false,
    text_background_color: 'rgba(0,0,0,0.7)',
    text_background_opacity: 70
  },
  {
    id: 'why_choose',
    name: 'Why Choose Section',
    order: 2,
    is_active: true,
    background_color: '#FFFFFF',
    text_color: '#000000',
    border_color: 'transparent',
    border_width: 0,
    border_radius: 0,
    padding: '80px 0',
    margin: '0px',
    width: '100%',
    height: 'auto',
    vertical_align: 'center',
    horizontal_align: 'center'
  },
  {
    id: 'location',
    name: 'Location Section',
    order: 3,
    is_active: true,
    background_color: '#F5F5F5',
    text_color: '#000000',
    border_color: 'transparent',
    border_width: 0,
    border_radius: 0,
    padding: '80px 0',
    margin: '0px',
    width: '100%',
    height: 'auto',
    vertical_align: 'center',
    horizontal_align: 'center'
  },
  {
    id: 'featured_programs',
    name: 'Featured Programs',
    order: 4,
    is_active: true,
    background_color: '#FFFFFF',
    text_color: '#000000',
    border_color: 'transparent',
    border_width: 0,
    border_radius: 0,
    padding: '80px 0',
    margin: '0px',
    width: '100%',
    height: 'auto',
    vertical_align: 'center',
    horizontal_align: 'center'
  },
  {
    id: 'methodology',
    name: 'Training Methodology',
    order: 5,
    is_active: true,
    background_color: '#1A1A1A',
    text_color: '#FFFFFF',
    border_color: 'transparent',
    border_width: 0,
    border_radius: 0,
    padding: '80px 0',
    margin: '0px',
    width: '100%',
    height: 'auto',
    vertical_align: 'center',
    horizontal_align: 'center'
  },
  {
    id: 'featured_products',
    name: 'Featured Products',
    order: 6,
    is_active: true,
    background_color: '#F5F5F5',
    text_color: '#000000',
    border_color: 'transparent',
    border_width: 0,
    border_radius: 0,
    padding: '80px 0',
    margin: '0px',
    width: '100%',
    height: 'auto',
    vertical_align: 'center',
    horizontal_align: 'center'
  },
  {
    id: 'cta',
    name: 'Call to Action',
    order: 7,
    is_active: true,
    background_color: '#1A1A1A',
    text_color: '#FFFFFF',
    border_color: 'transparent',
    border_width: 0,
    border_radius: 0,
    padding: '80px 0',
    margin: '0px',
    width: '100%',
    height: 'auto',
    vertical_align: 'center',
    horizontal_align: 'center'
  }
];

// Add a utility function to parse padding/margin values
const parseCssValue = (value: string): { top: number, right: number, bottom: number, left: number } => {
  const defaultValue = { top: 0, right: 0, bottom: 0, left: 0 };
  
  if (!value) return defaultValue;
  
  // Split the value by spaces
  const parts = value.trim().split(/\s+/);
  
  // Remove any non-numeric characters except '.'
  const parseValue = (val: string): number => {
    const numericValue = val.replace(/[^0-9.]/g, '');
    return parseFloat(numericValue) || 0;
  };
  
  // Apply CSS shorthand rules: 1, 2, 3, or 4 values
  if (parts.length === 1) {
    const val = parseValue(parts[0]);
    return { top: val, right: val, bottom: val, left: val };
  } else if (parts.length === 2) {
    const valY = parseValue(parts[0]);
    const valX = parseValue(parts[1]);
    return { top: valY, right: valX, bottom: valY, left: valX };
  } else if (parts.length === 3) {
    const valTop = parseValue(parts[0]);
    const valX = parseValue(parts[1]);
    const valBottom = parseValue(parts[2]);
    return { top: valTop, right: valX, bottom: valBottom, left: valX };
  } else if (parts.length === 4) {
    return {
      top: parseValue(parts[0]),
      right: parseValue(parts[1]),
      bottom: parseValue(parts[2]),
      left: parseValue(parts[3])
    };
  }
  
  return defaultValue;
};

// Add a utility function to format padding/margin values
const formatCssValue = (values: { top: number, right: number, bottom: number, left: number }): string => {
  const { top, right, bottom, left } = values;
  
  // Simplify based on CSS shorthand rules
  if (top === right && top === bottom && top === left) {
    return `${top}px`;
  } else if (top === bottom && right === left) {
    return `${top}px ${right}px`;
  } else if (right === left) {
    return `${top}px ${right}px ${bottom}px`;
  } else {
    return `${top}px ${right}px ${bottom}px ${left}px`;
  }
};

// Define reference dimensions for % to px and px to % conversions
const PREVIEW_REFERENCE_WIDTH_FOR_PERCENT_CONVERSION = 1000; // Target width in px for 100%
const PREVIEW_REFERENCE_HEIGHT_FOR_PERCENT_CONVERSION = 600;  // Target height in px for 100%

/**
 * HomePageConfig Component
 * 
 * This component provides global configuration for the homepage layout:
 * - Drag and drop to reorder components
 * - Toggle components active/inactive
 * - Configure container-level styling for each component
 * - Configure color palette inheritance (site > page > component)
 * 
 * Note: Content-specific configuration should be done in the individual component 
 * configuration pages accessible via the "Configure Content" button. This page
 * only configures the container styles and order of components.
 */
const HomePageConfig: React.FC = () => {
  const [components, setComponents] = useState<HomePageComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());
  const [panelSplit, setPanelSplit] = useState({ options: 35, preview: 65 }); // Default split 35/65
  const resizeStartRef = useRef<{ x: number, split: { options: number, preview: number } } | null>(null);
  const [previewZoom, setPreviewZoom] = useState(100); // Default zoom 100%
  const [widthUnit, setWidthUnit] = useState<'px' | '%'>('%'); // Default unit %
  const [heightUnit, setHeightUnit] = useState<'px' | '%' | 'auto'>('auto'); // Default unit auto
  const navigate = useNavigate();
  
  // Add new state for page-level color palette settings
  const [globalPalette, setGlobalPalette] = useState<string>('monochrome');
  const [pageColorPalette, setPageColorPalette] = useState<string | undefined>(undefined);
  const [componentPaletteOverrides, setComponentPaletteOverrides] = useState<Record<string, string>>({});

  // Modify the state to include color mode
  const [colorMode, setColorMode] = useState<'uniform' | 'alternating'>('uniform');

  // Move ensureDatabaseColumns to the beginning
  const ensureDatabaseColumns = async () => {
    try {
      console.log('Ensuring database columns exist...');
      
      // First, try to create the home_page_config table directly with proper fields
      const { error: createTableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.home_page_config (
            id serial primary key, 
            palette_id text, 
            color_mode text default 'uniform'
          );
          -- Insert default row to ensure there's always at least one entry
          INSERT INTO public.home_page_config (id, palette_id, color_mode)
          VALUES (1, 'monochrome', 'uniform')
          ON CONFLICT (id) DO NOTHING;
          
          -- Remove the use_site_palette column if it exists
          DO $$
          BEGIN
            IF EXISTS (
              SELECT 1 FROM information_schema.columns 
              WHERE table_name = 'home_page_config' AND column_name = 'use_site_palette'
            ) THEN
              ALTER TABLE public.home_page_config DROP COLUMN use_site_palette;
            END IF;
          END $$;
        `
      });
      
      if (createTableError) {
        console.error('Error creating home_page_config table:', createTableError);
        // For now we'll continue even if there's an error, as we can still try to use the table if it exists
      }
      
      // Try to add palette_override column to home_page_components
      const { error: addColumnError } = await supabase.rpc('exec_sql', {
        sql: `
          ALTER TABLE IF EXISTS public.home_page_components 
          ADD COLUMN IF NOT EXISTS palette_override TEXT,
          ADD COLUMN IF NOT EXISTS text_background_enabled BOOLEAN DEFAULT FALSE,
          ADD COLUMN IF NOT EXISTS text_background_color TEXT DEFAULT 'rgba(0,0,0,0.7)',
          ADD COLUMN IF NOT EXISTS text_background_opacity INTEGER DEFAULT 70;
        `
      });
      
      if (addColumnError) {
        console.error('Error adding columns to home_page_components:', addColumnError);
        // Continue anyway as the UI will still work, just might not save all settings
      }
      
      return true;
    } catch (err) {
      console.error('Error in ensureDatabaseColumns:', err);
      return false;
    }
  };

  // Add function to fetch site-wide color palette settings
  const fetchGlobalPaletteSettings = useCallback(async () => {
    try {
      // Create database tables if needed
      await ensureDatabaseColumns();
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('color_palette_settings_json')
        .eq('key', 'color_palette')
        .single();
      
      if (error) {
        console.error('Error fetching global color palette settings:', error);
        return;
      }
      
      if (data?.color_palette_settings_json?.globalPaletteId) {
        setGlobalPalette(data.color_palette_settings_json.globalPaletteId);
      }

      // Set color mode based on settings
      if (data?.color_palette_settings_json?.useIntercalatedColors) {
        setColorMode('alternating');
      } else {
        setColorMode('uniform');
      }

      // Also check if there's a saved home page color palette override
      try {
        const { data: homePageData, error: homePageError } = await supabase
          .from('home_page_config')
          .select('palette_id, color_mode')
          .single();
          
        if (homePageError) {
          if (homePageError.code === 'PGRST116') {
            console.log('No home_page_config found, will use defaults');
          } else {
            console.error('Error fetching home page palette settings:', homePageError);
          }
          return;
        }
        
        if (homePageData) {
          setPageColorPalette(homePageData.palette_id || globalPalette);
          if (homePageData.color_mode) {
            setColorMode(homePageData.color_mode as 'uniform' | 'alternating');
          }
        }
      } catch (error) {
        console.warn('Error getting home_page_config:', error);
      }
      
    } catch (error) {
      console.error('Error in fetchGlobalPaletteSettings:', error);
    }
  }, []);

  // Move createComponentsTable and insertDefaultComponents here, before fetchComponents
  const createComponentsTable = useCallback(async () => {
    try {
      // Create the table using SQL
      const { error } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.home_page_components (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            "order" INTEGER NOT NULL,
            is_active BOOLEAN DEFAULT true,
            background_color TEXT DEFAULT '#FFFFFF',
            text_color TEXT DEFAULT '#000000',
            border_color TEXT DEFAULT 'transparent',
            border_width INTEGER DEFAULT 0,
            border_radius INTEGER DEFAULT 0,
            padding TEXT DEFAULT '0px',
            margin TEXT DEFAULT '0px',
            width TEXT DEFAULT '100%',
            height TEXT DEFAULT 'auto',
            vertical_align TEXT DEFAULT 'center',
            horizontal_align TEXT DEFAULT 'center',
            palette_override TEXT,
            text_background_enabled BOOLEAN DEFAULT false,
            text_background_color TEXT DEFAULT 'rgba(0,0,0,0.7)',
            text_background_opacity INTEGER DEFAULT 70,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      });
      
      if (error) {
        console.error('Error creating table:', error);
        throw error;
      }
      
      // Insert default components after table creation
      await insertDefaultComponents();
    } catch (err) {
      console.error('Error in createComponentsTable:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  }, []);

  const insertDefaultComponents = async () => {
    try {
      // First check if any components already exist
      const { data: existingComponents, error: checkError } = await supabase
        .from('home_page_components')
        .select('id')
        .limit(1);
      
      // If components already exist, don't insert defaults
      if (!checkError && existingComponents && existingComponents.length > 0) {
        console.log('Components already exist, skipping insertion of defaults');
        return;
      }
      
      // If no components exist, insert defaults
      const { error } = await supabase
        .from('home_page_components')
        .insert(DEFAULT_COMPONENTS);
      
      if (error) {
        console.error('Error inserting default components:', error);
        throw error;
      }
      
      // Fetch the components again after insertion
      const { data, error: fetchError } = await supabase
        .from('home_page_components')
        .select('*')
        .order('"order"');
      
      if (fetchError) {
        console.error('Error fetching components after insertion:', fetchError);
        throw fetchError;
      }
      
      if (data) {
        setComponents(data);
      }
    } catch (err) {
      console.error('Error in insertDefaultComponents:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  const fetchComponents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('home_page_components')
        .select('*')
        .order('"order"');
      
      if (error) {
        console.error('Error fetching components:', error);
        // If the table doesn't exist, create it and insert default components
        if (error.code === '42P01') { // relation does not exist
          await createComponentsTable();
          await insertDefaultComponents();
          await fetchComponents(); // Try fetching again after creating
          return;
        }
        throw error;
      }
      
      if (data && data.length > 0) {
        // Extract component palette overrides if they exist
        const overrides: Record<string, string> = {};
        data.forEach(component => {
          if (component.palette_override) {
            overrides[component.id] = component.palette_override;
          }
        });
        setComponentPaletteOverrides(overrides);
        
        // Also fetch component-specific settings and merge them
        await syncComponentSpecificSettings(data);
        
        setComponents(data);
      } else {
        await insertDefaultComponents();
        await fetchComponents(); // Try fetching again after inserting defaults
      }
    } catch (err) {
      console.error('Error fetching home page components:', err);
      setError('Failed to load components');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a function to synchronize component-specific settings
  const syncComponentSpecificSettings = async (homeComponents: HomePageComponent[]) => {
    try {
      // Find the hero component
      const heroComponent = homeComponents.find(c => c.id === 'hero');
      if (heroComponent) {
        // Fetch hero-specific settings
        const { data: heroSettings, error: heroError } = await supabase
          .from('hero_config')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();
        
        if (!heroError && heroSettings && heroSettings.text_background_settings) {
          // Apply hero-specific text background settings to the home component
          heroComponent.text_background_enabled = heroSettings.text_background_settings.enabled || heroComponent.text_background_enabled;
          heroComponent.text_background_color = heroSettings.text_background_settings.color || heroComponent.text_background_color;
          heroComponent.text_background_opacity = heroSettings.text_background_settings.opacity || heroComponent.text_background_opacity;
        }
      }
    } catch (err) {
      console.warn('Error syncing component-specific settings:', err);
      // Continue anyway, as this is not critical
    }
  };

  // Add this to the togglePreviewMode and handleSave functions to ensure sync before saving
  const syncAllComponentSettings = async () => {
    // Force a sync of component-specific settings before preview/save
    const updatedComponents = [...components];
    await syncComponentSpecificSettings(updatedComponents);
    setComponents(updatedComponents);
    return updatedComponents;
  };

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing HomePageConfig...');
        // Create home_page_components table if it doesn't exist
        await createComponentsTable();
        
        // Insert default components if the table is empty
        await insertDefaultComponents();
        
        console.log('Fetching home page components...');
        const { data: components, error } = await supabase
          .from('home_page_components')
          .select('*')
          .order('order');
          
        if (error) {
          console.error('Error fetching home page components:', error);
          setError('Failed to load home page components. Please check the console for details.');
          return;
        }
        
        console.log('Fetched home page components:', components);
        if (!components || components.length === 0) {
          console.warn('No home page components found in database. Reinserting defaults...');
          await insertDefaultComponents();
          const { data: refreshedComponents, error: refreshError } = await supabase
            .from('home_page_components')
            .select('*')
            .order('order');
            
          if (refreshError) {
            console.error('Error fetching components after reinsertion:', refreshError);
            return;
          }
          
          if (!refreshedComponents || refreshedComponents.length === 0) {
            console.error('Still no components after reinsertion! Check database permissions and schema.');
            setError('Failed to initialize home page components. The database may be inaccessible.');
            return;
          }
          
          setComponents(refreshedComponents);
        } else {
          setComponents(components);
        }
        
        await fetchGlobalPaletteSettings();
        await syncComponentSpecificSettings(components || []);
        setLoading(false);
      } catch (err) {
        console.error('Initialization error in HomePageConfig:', err);
        setError('Failed to initialize home page configuration. See console for details.');
        setLoading(false);
      }
    };

    init();
  }, [createComponentsTable, fetchGlobalPaletteSettings]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order property for each item
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setComponents(updatedItems);
  };

  const toggleComponentActive = (id: string) => {
    setComponents(prev => 
      prev.map(component => 
        component.id === id 
          ? { ...component, is_active: !component.is_active } 
          : component
      )
    );
  };

  const toggleEditComponent = (id: string) => {
    setEditingComponent(editingComponent === id ? null : id);
  };

  const updateComponentStyle = (id: string, field: keyof HomePageComponent, value: string | number | boolean) => {
    setComponents(prev => 
      prev.map(component => 
        component.id === id 
          ? { ...component, [field]: value } 
          : component
      )
    );
  };

  // Add function to update padding/margin with sliders
  const updateSpacing = (id: string, field: 'padding' | 'margin', direction: 'top' | 'right' | 'bottom' | 'left', value: number) => {
    setComponents(prev => 
      prev.map(component => {
        if (component.id !== id) return component;
        
        const currentValue = parseCssValue(component[field]);
        currentValue[direction] = value;
        
        return {
          ...component,
          [field]: formatCssValue(currentValue)
        };
      })
    );
  };

  // Function to update width/height with units
  const updateDimension = (id: string, field: 'width' | 'height', value: number) => {
    const unit = field === 'width' ? widthUnit : heightUnit;
    const formattedValue = unit === 'auto' ? 'auto' : `${value}${unit}`;
    
    console.log(`Setting ${field} to:`, formattedValue);
    
    setComponents(prev => 
      prev.map(component => 
        component.id === id 
          ? { ...component, [field]: formattedValue } 
          : component
      )
    );
  };
  
  // Helper to parse numeric value and identify unit from a CSS string like "100px" or "50%"
  const getNumericValueAndUnit = (valueStr: string | undefined, defaultForAuto: {val: number, unit: string}): { num: number, unit: string } => {
    if (!valueStr || valueStr === 'auto') {
      return { num: defaultForAuto.val, unit: defaultForAuto.unit };
    }
    const num = parseInt(valueStr.replace(/[^0-9.]/g, '') || '0');
    const unit = valueStr.endsWith('%') ? '%' : 'px';
    return { num, unit };
  };

  // New robust function to convert dimension values
  const convertDimension = (currentValueStr: string | undefined, newUnit: 'px' | '%' | 'auto', dimensionType: 'width' | 'height'): string => {
    const defaultPx = dimensionType === 'width' ? PREVIEW_REFERENCE_WIDTH_FOR_PERCENT_CONVERSION : PREVIEW_REFERENCE_HEIGHT_FOR_PERCENT_CONVERSION;
    const defaultForAuto = { val: dimensionType === 'width' ? 100 : 50, unit: '%'}; // Default to % if coming from auto
    
    // Handle 'auto' target specially
    if (newUnit === 'auto') return 'auto';
    
    // Get current numeric value and unit
    const { num: currentNum, unit: currentUnit } = getNumericValueAndUnit(currentValueStr, defaultForAuto);
    
    // Same unit, no conversion needed (unless it was auto)
    if (currentUnit === newUnit && currentValueStr !== 'auto') return currentValueStr || (newUnit === '%' ? '100%' : `${defaultPx}px`);

    // Conversion logic
    if (currentUnit === 'auto') {
      // When converting from auto, use sensible defaults for better UX
      if (newUnit === '%') {
        return dimensionType === 'width' ? '100%' : '60%';  // More reasonable default height %
      } else if (newUnit === 'px') {
        return dimensionType === 'width' ? `${defaultPx}px` : `${Math.round(defaultPx * 0.6)}px`;
      }
    }
    
    // % to px conversion
    if (currentUnit === '%' && newUnit === 'px') {
      const ref = dimensionType === 'width' ? PREVIEW_REFERENCE_WIDTH_FOR_PERCENT_CONVERSION : PREVIEW_REFERENCE_HEIGHT_FOR_PERCENT_CONVERSION;
      const px = Math.round((currentNum / 100) * ref);
      return `${Math.max(10, px)}px`; // Ensure min 10px
    }
    
    // px to % conversion
    if (currentUnit === 'px' && newUnit === '%') {
      const ref = dimensionType === 'width' ? PREVIEW_REFERENCE_WIDTH_FOR_PERCENT_CONVERSION : PREVIEW_REFERENCE_HEIGHT_FOR_PERCENT_CONVERSION;
      const perc = Math.round((currentNum / ref) * 100);
      return `${Math.min(100, Math.max(1, perc))}%`; // Clamp 1-100%
    }
    
    // Fallback (shouldn't reach here)
    return newUnit === 'px' ? `${currentNum}px` : `${currentNum}%`;
  };

  const switchWidthUnit = (componentId: string, newUnit: 'px' | '%') => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;
    const newValue = convertDimension(component.width, newUnit, 'width');
    setWidthUnit(newUnit); // Update the radio button state
    updateComponentStyle(componentId, 'width', newValue);
  };

  const switchHeightUnit = (componentId: string, newUnit: 'px' | '%' | 'auto') => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    // Force update preview key to refresh the preview when switching units
    setPreviewKey(Date.now());
    
    const newValue = convertDimension(component.height, newUnit, 'height');
    setHeightUnit(newUnit); // Update the radio button state
    
    // Update the component with new height value
    setComponents(prev => 
      prev.map(comp => 
        comp.id === componentId 
          ? { ...comp, height: newValue } 
          : comp
      )
    );
  };

  // Function to parse dimension values for sliders
  const parseDimension = (value: string, defaultValue: number): number => {
    if (!value || value === 'auto') return defaultValue;
    
    // Extract the numeric part
    const numeric = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(numeric) ? defaultValue : numeric;
  };

  // Function to update height with proper units (no additional constraints)
  const updateHeightWithConstraints = (id: string, value: number) => {
    const unit = heightUnit;
    
    // No constraints, just use the provided value with the current unit
    const formattedValue = unit === 'auto' ? 'auto' : `${value}${unit}`;
    console.log(`Setting height to:`, formattedValue);
    
    setComponents(prev => 
      prev.map(component => 
        component.id === id 
          ? { ...component, height: formattedValue } 
          : component
      )
    );
  };

  // Add a function to toggle color mode
  const toggleColorMode = (mode: 'uniform' | 'alternating') => {
    setColorMode(mode);
  };

  // Modify handleSave to remove useGlobalPalette
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      // Ensure all required columns exist
      await ensureDatabaseColumns();
      
      // Sync component settings before saving
      const updatedComponents = await syncAllComponentSettings();
      
      // Save all component data
      for (const component of updatedComponents) {
        const { error } = await supabase
          .from('home_page_components')
          .upsert(component, { onConflict: 'id' });
        
        if (error) {
          console.error(`Error saving component ${component.id}:`, error);
          throw new Error(`Failed to save component ${component.name}`);
        }
      }
      
      // Try to save page-level palette settings
      try {
        const { error: configError } = await supabase
          .from('home_page_config')
          .upsert({
            id: 1, // Use a single row for the configuration
            palette_id: pageColorPalette || globalPalette,
            color_mode: colorMode
          }, { onConflict: 'id' });
        
        if (configError) {
          console.error('Error saving home page config:', configError);
          // Continue anyway, as this is not critical
        }
      } catch (err) {
        // If the table doesn't exist, we'll just continue
        console.warn('Could not save to home_page_config, may not exist:', err);
      }
      
      // Also save to site_settings as a fallback
      try {
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('color_palette_settings_json')
          .eq('key', 'color_palette')
          .single();
        
        if (settingsData) {
          const existingSettings = settingsData.color_palette_settings_json || {};
          const updatedSettings = {
            ...existingSettings,
            homePagePaletteId: pageColorPalette,
            useIntercalatedColors: colorMode === 'alternating',
            useUniformColors: colorMode === 'uniform'
          };
          
          const { error: updateError } = await supabase
            .from('site_settings')
            .update({ color_palette_settings_json: updatedSettings })
            .eq('key', 'color_palette');
          
          if (updateError) {
            console.error('Error updating site_settings:', updateError);
          }
        }
      } catch (err) {
        console.warn('Could not update site_settings:', err);
      }
      
      setSuccessMessage('Changes saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Refresh the preview
      setPreviewKey(Date.now());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error in handleSave:', err);
    } finally {
      setSaving(false);
    }
  };

  const navigateToComponentConfig = (id: string) => {
    const routes: Record<string, string> = {
      'hero': '/admin/hero-config',
      'why_choose': '/admin/why-choose',
      'location': '/admin/location-config',
      'featured_programs': '/admin/featured-programs',
      'methodology': '/admin/methodology-config',
      'featured_products': '/admin/featured-products-config',
      'cta': '/admin/cta-config'
    };
    
    if (routes[id]) {
      navigate(routes[id]);
    } else {
      setError(`Configuration page for "${id}" component is not available yet.`);
    }
  };

  const togglePreviewMode = async () => {
    // If turning on preview mode, save the current configuration first
    if (!previewMode) {
      // Save changes to database before showing preview
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      try {
        // Sync component settings before preview
        const updatedComponents = await syncAllComponentSettings();
        
        console.log("Saving components for preview:", updatedComponents);
        
        const { error } = await supabase
          .from('home_page_components')
          .upsert(updatedComponents);
        
        if (error) {
          console.error('Error saving components for preview:', error);
          setError('Failed to update preview. Please try again.');
          return;
        }
        
        // Wait a moment for database to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update the preview key to ensure fresh content
        setPreviewKey(Date.now());
        setSuccessMessage('Changes applied to preview');
      } catch (err) {
        console.error('Error in preview update:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        return;
      } finally {
        setSaving(false);
      }
    } else {
      // When exiting preview mode, clear any success messages
      setSuccessMessage(null);
    }
    
    setPreviewMode(!previewMode);
  };

  // Function to handle panel resize
  const startResize = (e: React.MouseEvent) => {
    resizeStartRef.current = {
      x: e.clientX,
      split: { ...panelSplit }
    };
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
  };

  const handleResize = (e: MouseEvent) => {
    if (!resizeStartRef.current) return;
    
    const containerWidth = document.querySelector('.flex')?.clientWidth || 1200;
    const deltaX = e.clientX - resizeStartRef.current.x;
    const deltaPercent = (deltaX / containerWidth) * 100;
    
    const newOptionWidth = Math.min(80, Math.max(20, resizeStartRef.current.split.options + deltaPercent));
    const newPreviewWidth = 100 - newOptionWidth;
    
    setPanelSplit({ 
      options: newOptionWidth, 
      preview: newPreviewWidth 
    });
  };

  const stopResize = () => {
    resizeStartRef.current = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  };

  // Add new function to handle page palette change
  const handlePagePaletteChange = (paletteId: string) => {
    setPageColorPalette(paletteId);
  };

  // Add new function to set component palette override
  const setComponentPalette = (componentId: string, paletteId: string | null) => {
    const updatedOverrides = { ...componentPaletteOverrides };
    
    if (paletteId) {
      updatedOverrides[componentId] = paletteId;
    } else {
      delete updatedOverrides[componentId];
    }
    
    setComponentPaletteOverrides(updatedOverrides);
    
    // Also update the component in state to include the override
    setComponents(prevComponents => 
      prevComponents.map(component => 
        component.id === componentId 
          ? { ...component, palette_override: paletteId || undefined } 
          : component
      )
    );
  };

  // Add palette quick selection helper
  const handleQuickPaletteSelect = (paletteId: string) => {
    setPageColorPalette(paletteId);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 rounded w-1/4"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
          <div className="h-32 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Add palette configuration section to the UI
  const renderPaletteSettings = () => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">Color Palette Settings</h3>
      
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Color Application</h4>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div 
            className={`p-3 border rounded-md cursor-pointer ${
              colorMode === 'uniform' ? 'bg-neutral-50 border-neutral-800' : 'border-gray-200'
            }`} 
            onClick={() => toggleColorMode('uniform')}
          >
            <div className="font-medium text-sm">Uniform Colors</div>
            <div className="text-xs text-gray-600 mb-2">All sections use the same colors</div>
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
            </div>
          </div>
          
          <div 
            className={`p-3 border rounded-md cursor-pointer ${
              colorMode === 'alternating' ? 'bg-neutral-50 border-neutral-800' : 'border-gray-200'
            }`}
            onClick={() => toggleColorMode('alternating')}
          >
            <div className="font-medium text-sm">Alternating Colors</div>
            <div className="text-xs text-gray-600 mb-2">Sections alternate colors</div>
            <div className="flex gap-1">
              <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-white border border-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick palette selection buttons */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Quick Select Palette</h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleQuickPaletteSelect('hog_brand')}
            className={`px-3 py-2 border rounded-md flex items-center gap-2 transition ${
              pageColorPalette === 'hog_brand'
                ? 'bg-red-700 text-white border-red-800'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-[#B91C1C]"></div>
              <div className="w-3 h-3 rounded-full bg-[#0F172A]"></div>
              <div className="w-3 h-3 rounded-full bg-[#F1F5F9]"></div>
            </div>
            <span className="text-xs">HOG Brand</span>
          </button>
          
          <button
            type="button"
            onClick={() => handleQuickPaletteSelect('modern_contrast')}
            className={`px-3 py-2 border rounded-md flex items-center gap-2 transition ${
              pageColorPalette === 'modern_contrast'
                ? 'bg-indigo-600 text-white border-indigo-700'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-white border border-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-[#111827]"></div>
              <div className="w-3 h-3 rounded-full bg-[#4F46E5]"></div>
            </div>
            <span className="text-xs">Modern</span>
          </button>
        </div>
      </div>
    
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Select Home Page Palette:
        </label>
        <ColorPaletteSelector
          selectedPaletteId={pageColorPalette || globalPalette}
          onChange={handlePagePaletteChange}
          customPalettes={[]}
        />
      </div>
      
      <div className="text-sm text-gray-600 mt-2">
        <p>This palette will be applied to all components unless overridden</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Control panel header */}
      <div className="bg-white p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Home Page Layout</h2>
        <div className="flex space-x-2">
          <button
            onClick={togglePreviewMode}
            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded flex items-center text-sm"
          >
            {previewMode ? <Edit className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center text-sm"
          >
            <Save className="w-4 h-4 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Error/success messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Split panel container */}
      <div className="flex flex-1 relative">
        {/* Options panel */}
        {!previewMode && (
          <div 
            className="bg-gray-50 p-4 overflow-y-auto"
            style={{ width: `${panelSplit.options}%` }}
          >
            {/* Add palette settings at the top */}
            {renderPaletteSettings()}
            
            {/* Rest of the component settings */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <StrictModeDroppable droppableId="home-components">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {components.map((component, index) => (
                      <Draggable key={component.id} draggableId={component.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white p-3 rounded-lg shadow-sm border-l-4 ${
                              component.is_active ? 'border-blue-500' : 'border-gray-300'
                            } ${editingComponent === component.id ? 'ring-2 ring-blue-400' : ''}`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                  <Move className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{component.name}</h3>
                                  <span className="text-xs text-gray-500">Order: {component.order}</span>
                                </div>
                              </div>
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => toggleComponentActive(component.id)}
                                  className={component.is_active ? "text-green-600" : "text-gray-400"}
                                  title={component.is_active ? 'Disable component' : 'Enable component'}
                                >
                                  {component.is_active ? (
                                    <Eye className="w-5 h-5" />
                                  ) : (
                                    <EyeOff className="w-5 h-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => navigateToComponentConfig(component.id)}
                                  className="text-neutral-800 hover:underline"
                                  title="Configure component content"
                                >
                                  Configure Content
                                </button>
                                <button
                                  onClick={() => toggleEditComponent(component.id)}
                                  className="text-neutral-800"
                                >
                                  {editingComponent === component.id ? (
                                    <X className="w-5 h-5" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5" />
                                  )}
                                </button>
                              </div>
                            </div>
                            
                            {/* Component styling options */}
                            {editingComponent === component.id && (
                              <div className="mt-3 border-t pt-3">
                                <h4 className="font-medium text-sm mb-2">Styling Options</h4>
                                
                                {/* Add component palette override */}
                                <div className="mb-4">
                                  <h5 className="text-xs font-medium mb-1">Color Palette Override</h5>
                                  
                                  <div className="flex items-center mb-2">
                                    <input
                                      type="checkbox"
                                      id={`override-palette-${component.id}`}
                                      checked={!!componentPaletteOverrides[component.id]}
                                      onChange={(e) => {
                                        if (!e.target.checked) {
                                          setComponentPalette(component.id, null);
                                        } else {
                                          // Default to page palette or global palette
                                          setComponentPalette(
                                            component.id, 
                                            pageColorPalette || globalPalette
                                          );
                                        }
                                      }}
                                      className="mr-2"
                                    />
                                    <label htmlFor={`override-palette-${component.id}`} className="text-sm text-neutral-800">
                                      Override parent palette
                                    </label>
                                  </div>
                                  
                                  {componentPaletteOverrides[component.id] && (
                                    <div className="mb-2">
                                      <ColorPaletteSelector
                                        selectedPaletteId={componentPaletteOverrides[component.id]}
                                        onChange={(paletteId) => setComponentPalette(component.id, paletteId)}
                                        customPalettes={[]}
                                      />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Colors & Borders */}
                                <div className="border rounded-lg p-4 mb-4" style={{ 
                                  backgroundColor: component.background_color, 
                                  color: component.text_color 
                                }}>
                                  <h5 className="font-medium text-sm mb-3">Colors & Borders</h5>
                                  <div className="p-3 bg-white rounded text-neutral-800">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                                          Background Color
                                        </label>
                                        <div className="flex items-center">
                                          <input
                                            type="color"
                                            value={component.background_color}
                                            onChange={(e) => updateComponentStyle(component.id, 'background_color', e.target.value)}
                                            className="w-10 h-10 rounded mr-2"
                                          />
                                          <input
                                            type="text"
                                            value={component.background_color}
                                            onChange={(e) => updateComponentStyle(component.id, 'background_color', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                                          Text Color
                                        </label>
                                        <div className="flex items-center">
                                          <input
                                            type="color"
                                            value={component.text_color}
                                            onChange={(e) => updateComponentStyle(component.id, 'text_color', e.target.value)}
                                            className="w-10 h-10 rounded mr-2"
                                          />
                                          <input
                                            type="text"
                                            value={component.text_color}
                                            onChange={(e) => updateComponentStyle(component.id, 'text_color', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                                          Border Color
                                        </label>
                                        <div className="flex items-center">
                                          <input
                                            type="color"
                                            value={component.border_color}
                                            onChange={(e) => updateComponentStyle(component.id, 'border_color', e.target.value)}
                                            className="w-10 h-10 rounded mr-2"
                                          />
                                          <input
                                            type="text"
                                            value={component.border_color}
                                            onChange={(e) => updateComponentStyle(component.id, 'border_color', e.target.value)}
                                            className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                                          Border Width (px)
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="20"
                                          value={component.border_width}
                                          onChange={(e) => updateComponentStyle(component.id, 'border_width', parseInt(e.target.value))}
                                          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                                          Border Radius (px)
                                        </label>
                                        <input
                                          type="number"
                                          min="0"
                                          max="50"
                                          value={component.border_radius}
                                          onChange={(e) => updateComponentStyle(component.id, 'border_radius', parseInt(e.target.value))}
                                          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                        />
                                      </div>
                                      
                                      {/* Add Hero Text Background Controls */}
                                      {component.id === 'hero' && (
                                        <>
                                          <div className="col-span-2 border-t pt-3 mt-2">
                                            <h6 className="font-medium text-sm mb-2">Hero Text Background</h6>
                                            
                                            <div className="flex items-center mb-3">
                                              <input
                                                type="checkbox"
                                                id={`text-bg-enabled-${component.id}`}
                                                checked={component.text_background_enabled || false}
                                                onChange={(e) => updateComponentStyle(component.id, 'text_background_enabled', e.target.checked)}
                                                className="mr-2"
                                              />
                                              <label htmlFor={`text-bg-enabled-${component.id}`} className="text-sm">
                                                Enable text background rectangle
                                              </label>
                                            </div>
                                            
                                            {component.text_background_enabled && (
                                              <>
                                                <div className="mb-3">
                                                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                                                    Background Color
                                                  </label>
                                                  <div className="flex items-center">
                                                    <input
                                                      type="color"
                                                      value={component.text_background_color?.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)/, ')')}
                                                      onChange={(e) => {
                                                        // Convert hex to rgba
                                                        const hex = e.target.value;
                                                        const r = parseInt(hex.slice(1, 3), 16);
                                                        const g = parseInt(hex.slice(3, 5), 16);
                                                        const b = parseInt(hex.slice(5, 7), 16);
                                                        const a = component.text_background_opacity || 70;
                                                        updateComponentStyle(component.id, 'text_background_color', `rgba(${r},${g},${b},${a/100})`);
                                                      }}
                                                      className="w-10 h-10 rounded mr-2"
                                                    />
                                                    <input
                                                      type="text"
                                                      value={component.text_background_color || 'rgba(0,0,0,0.7)'}
                                                      onChange={(e) => updateComponentStyle(component.id, 'text_background_color', e.target.value)}
                                                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                                      placeholder="rgba(0,0,0,0.7)"
                                                    />
                                                  </div>
                                                </div>
                                                
                                                <div className="mb-3">
                                                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                                                    Background Opacity: {component.text_background_opacity || 70}%
                                                  </label>
                                                  <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={component.text_background_opacity || 70}
                                                    onChange={(e) => {
                                                      const opacity = parseInt(e.target.value);
                                                      updateComponentStyle(component.id, 'text_background_opacity', opacity);
                                                      
                                                      // Also update the rgba color value to reflect the new opacity
                                                      if (component.text_background_color) {
                                                        const rgbaMatch = component.text_background_color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
                                                        if (rgbaMatch) {
                                                          const [, r, g, b] = rgbaMatch;
                                                          updateComponentStyle(component.id, 'text_background_color', `rgba(${r},${g},${b},${opacity/100})`);
                                                        }
                                                      }
                                                    }}
                                                    className="w-full"
                                                  />
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Dimensions & Alignment */}
                                <div className="border rounded-lg bg-white p-4 mb-4">
                                  <h5 className="font-medium text-sm mb-3">Dimensions & Alignment</h5>
                                  
                                  <div className="mb-4">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                      Width
                                    </label>
                                    
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="2000"
                                        value={parseDimension(component.width || '100%', 100)}
                                        onChange={(e) => updateDimension(component.id, 'width', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                      />
                                      <div className="flex border rounded-md overflow-hidden">
                                        <button
                                          type="button"
                                          onClick={() => switchWidthUnit(component.id, 'px')}
                                          className={`px-2 py-1 text-sm ${(component.width || '').includes('px') ? 'bg-neutral-800 text-white' : 'bg-neutral-200'}`}
                                        >
                                          px
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => switchWidthUnit(component.id, '%')}
                                          className={`px-2 py-1 text-sm ${(component.width || '').includes('%') ? 'bg-neutral-800 text-white' : 'bg-neutral-200'}`}
                                        >
                                          %
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                      Height
                                    </label>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        min="0"
                                        max="2000"
                                        value={parseDimension(component.height || 'auto', 300)}
                                        onChange={(e) => updateHeightWithConstraints(component.id, parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                                        disabled={component.height === 'auto'}
                                      />
                                      <div className="flex border rounded-md overflow-hidden">
                                        <button
                                          type="button"
                                          onClick={() => switchHeightUnit(component.id, 'px')}
                                          className={`px-2 py-1 text-sm ${(component.height || '').includes('px') ? 'bg-neutral-800 text-white' : 'bg-neutral-200'}`}
                                        >
                                          px
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => switchHeightUnit(component.id, '%')}
                                          className={`px-2 py-1 text-sm ${(component.height || '').includes('%') ? 'bg-neutral-800 text-white' : 'bg-neutral-200'}`}
                                        >
                                          %
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => switchHeightUnit(component.id, 'auto')}
                                          className={`px-2 py-1 text-sm ${component.height === 'auto' ? 'bg-neutral-800 text-white' : 'bg-neutral-200'}`}
                                        >
                                          auto
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                                      Margin
                                    </label>
                                    
                                    {/* Margin sliders */}
                                    <div className="p-4 border border-neutral-200 rounded-md bg-neutral-50">
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-neutral-600">Top</span>
                                          <span className="text-xs font-mono">{parseCssValue(component.margin || '0px').top}px</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="120"
                                          value={parseCssValue(component.margin || '0px').top}
                                          onChange={(e) => updateSpacing(component.id, 'margin', 'top', parseInt(e.target.value))}
                                          className="w-full"
                                        />
                                      </div>
                                      
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-neutral-600">Right</span>
                                          <span className="text-xs font-mono">{parseCssValue(component.margin || '0px').right}px</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="120"
                                          value={parseCssValue(component.margin || '0px').right}
                                          onChange={(e) => updateSpacing(component.id, 'margin', 'right', parseInt(e.target.value))}
                                          className="w-full"
                                        />
                                      </div>
                                      
                                      <div className="mb-4">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-neutral-600">Bottom</span>
                                          <span className="text-xs font-mono">{parseCssValue(component.margin || '0px').bottom}px</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="120"
                                          value={parseCssValue(component.margin || '0px').bottom}
                                          onChange={(e) => updateSpacing(component.id, 'margin', 'bottom', parseInt(e.target.value))}
                                          className="w-full"
                                        />
                                      </div>
                                      
                                      <div>
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-neutral-600">Left</span>
                                          <span className="text-xs font-mono">{parseCssValue(component.margin || '0px').left}px</span>
                                        </div>
                                        <input
                                          type="range"
                                          min="0"
                                          max="120"
                                          value={parseCssValue(component.margin || '0px').left}
                                          onChange={(e) => updateSpacing(component.id, 'margin', 'left', parseInt(e.target.value))}
                                          className="w-full"
                                        />
                                      </div>
                                      
                                      <div className="mt-2 pt-2 border-t border-neutral-200">
                                        <div className="text-neutral-500 text-xs mb-1">Current value:</div>
                                        <input
                                          type="text"
                                          value={component.margin || '0px'}
                                          onChange={(e) => updateComponentStyle(component.id, 'margin', e.target.value)}
                                          className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 text-sm font-mono"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </DragDropContext>
          </div>
        )}
        
        {/* Resize handle */}
        {!previewMode && (
          <div
            className="w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize"
            onMouseDown={startResize}
          ></div>
        )}
        
        {/* Preview panel */}
        <div 
          className="bg-gray-100 flex-1 overflow-hidden relative"
          style={{ width: previewMode ? '100%' : `${panelSplit.preview}%` }}
        >
          {/* Preview controls */}
          <div className="absolute top-2 right-2 z-10 flex space-x-2 bg-white shadow-md rounded p-1">
            <div className="flex items-center">
              <button
                onClick={() => setPreviewZoom(Math.max(50, previewZoom - 10))}
                className="px-2 py-1 text-sm bg-gray-200 rounded-l"
                disabled={previewZoom <= 50}
              >
                -
              </button>
              <span className="px-2 text-sm">{previewZoom}%</span>
              <button
                onClick={() => setPreviewZoom(Math.min(150, previewZoom + 10))}
                className="px-2 py-1 text-sm bg-gray-200 rounded-r"
                disabled={previewZoom >= 150}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Preview iframe */}
          <div 
            className="w-full h-full overflow-auto"
            style={{ 
              padding: '20px',
              backgroundColor: '#f0f0f0' 
            }}
          >
            <div 
              style={{ 
                transform: `scale(${previewZoom / 100})`,
                transformOrigin: 'top center',
                width: `${10000 / previewZoom}%`, // Adjust width to maintain layout with zoom
                margin: '0 auto'
              }}
            >
              <ComponentPreview 
                key={previewKey}
                components={components} 
                globalPaletteId={globalPalette}
                pagePaletteId={pageColorPalette}
                componentPaletteOverrides={componentPaletteOverrides}
                colorMode={colorMode}
                singleComponentId={editingComponent || undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageConfig; 