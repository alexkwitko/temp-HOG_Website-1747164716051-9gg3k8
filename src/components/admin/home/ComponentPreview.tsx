import React from 'react';
import { Award, Users, Calendar, ShieldCheck, Shield, Target, Brain, Dumbbell, ShoppingBag } from 'lucide-react';
import { supabase } from '../../../lib/supabase/supabaseClient';
import { useEffect, useState } from 'react';
import { DEFAULT_PALETTES, getPaletteById } from '../../../types/ColorPalette';
import { useSiteSettings } from '../../../contexts/SiteSettingsContext';

// Interface for the component properties
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
  width?: string;
  height?: string;
  vertical_align?: string;
  horizontal_align?: string;
  palette_override?: string;
  text_background_enabled?: boolean;
  text_background_color?: string;
  text_background_opacity?: number;
}

// Interface for Methodology item
interface Methodology {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  order: number;
  is_active: boolean;
}

// Interface for featured programs config
interface FeaturedProgramsConfig {
  heading: string;
  subheading: string;
  featured_program_ids: string[];
}

// Interface for program
interface ProgramType {
  id: string;
  title: string;
  description: string;
  image_url: string;
  level: string;
  duration: number;
  instructor?: string;
  is_featured: boolean;
  order: number;
  slug?: string;
}

// Interface for CTA config
interface CTAConfig {
  heading: string;
  subheading: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
}

// Interface for featured products config
// interface FeaturedProductsConfig {
//   heading: string;
//   subheading: string;
//   featured_product_ids: string[];
// }

// Interface for product
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  text_color?: string;
  image_url?: string;
  image_id?: string;
  image_opacity?: number;
  text_background?: {
    enabled: boolean;
    color: string;
    opacity: number;
    size: string; // 'sm', 'md', 'lg', 'full'
    padding: string;
  };
  text_position?: {
    horizontal: 'left' | 'center' | 'right';
    vertical: 'top' | 'center' | 'bottom';
  };
  button_text?: string;
  button_url?: string;
  button_active?: boolean;
  button_bg?: string;
  button_text_color?: string;
  button_hover?: string;
  button_padding_x?: string;
  button_padding_y?: string;
  button_font?: string;
  button_mobile_width?: string;
  button_desktop_width?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  secondary_button_active?: boolean;
  secondary_button_bg?: string;
  secondary_button_text_color?: string;
  secondary_button_hover?: string;
  secondary_button_padding_x?: string;
  secondary_button_padding_y?: string;
  secondary_button_font?: string;
  secondary_button_mobile_width?: string;
  secondary_button_desktop_width?: string;
  order: number;
  is_active?: boolean;
}

// Define WhyChooseCard interface at the top of the file, after other interfaces
interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
  icon_color?: string;
  image_url?: string;
  image_id?: string;
  button_text?: string;
  button_url?: string;
  button_bg?: string;
  button_text_color?: string;
  card_bg?: string;
  card_text_color?: string;
  use_icon: boolean;
  order: number;
  is_active: boolean;
}

// Define enhanced featured products config interface
interface EnhancedFeaturedProductsConfig {
  heading: string;
  subheading: string;
  featured_product_ids: string[];
  button_text: string;
  button_url: string;
  button_bg_color: string;
  button_text_color: string;
  button_hover_color: string;
  button_alignment: string;
  columns_layout: string;
  enable_special_promotion: boolean;
  promoted_product_id: string | null;
  promotion_badge_text: string;
  promotion_badge_color: string;
  promotion_badge_text_color: string;
}

interface ComponentPreviewProps {
  components: HomePageComponent[];
  globalPaletteId: string;
  pagePaletteId?: string;
  componentPaletteOverrides: Record<string, string>;
  triggerRefresh?: number;
  zoom?: number;
  colorMode?: 'uniform' | 'alternating';
  singleComponentId?: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ 
  components, 
  globalPaletteId, 
  pagePaletteId, 
  componentPaletteOverrides,
  triggerRefresh, 
  zoom = 1,
  colorMode = 'uniform',
  singleComponentId
}) => {
  // Access global settings if needed in the future
  useSiteSettings();

  const [whyChooseData, setWhyChooseData] = useState<{
    heading: string;
    subheading: string;
    cards: WhyChooseCard[];
    columnsLayout: string;
  }>({
    heading: 'Why Choose House of Grappling?',
    subheading: 'We offer a world-class training environment focused on technical excellence, personal growth, and community.',
    cards: [],
    columnsLayout: '3'
  });
  const [methodology, setMethodology] = useState<Methodology[]>([]);
  const [featuredProgramsConfig, setFeaturedProgramsConfig] = useState<FeaturedProgramsConfig>({
    heading: 'Featured Programs',
    subheading: 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.',
    featured_program_ids: []
  });
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [ctaConfig, setCTAConfig] = useState<CTAConfig>({
    heading: 'Start Your Journey Today',
    subheading: 'Join House of Grappling and experience the most effective martial art in the world.',
    primary_button_text: 'Get Started',
    primary_button_url: '/contact',
    secondary_button_text: 'View Schedule',
    secondary_button_url: '/schedule'
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [columnsConfig, setColumnsConfig] = useState<Record<string, string>>({
    why_choose: '3',
    methodology: '4'
  });

  // Component-specific stylings can be defined in a separate CSS file as well
  const containerStyle = (component: HomePageComponent, paletteStyles: { 
    backgroundColor: string; 
    color: string; 
    borderColor: string;
  }) => {
    // Convert vertical and horizontal alignment to flexbox values
    const getFlexValue = (alignment: string | undefined, defaultValue: string): string => {
      if (!alignment) return defaultValue;
      
      // Map alignment to flexbox properties
      const alignmentMap: Record<string, string> = {
        'start': 'flex-start',
        'center': 'center',
        'end': 'flex-end',
        'top': 'flex-start',
        'middle': 'center',
        'bottom': 'flex-end',
        'left': 'flex-start',
        'right': 'flex-end'
      };
      
      return alignmentMap[alignment] || defaultValue;
    };
    
    return {
      backgroundColor: paletteStyles.backgroundColor,
      color: paletteStyles.color,
      borderColor: paletteStyles.borderColor,
      borderWidth: `${component.border_width}px`,
      borderRadius: `${component.border_radius}px`,
      padding: component.padding,
      margin: component.margin,
      width: component.width || '100%',
      minHeight: component.height,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: getFlexValue(component.vertical_align, 'center'),
      alignItems: getFlexValue(component.horizontal_align, 'center'),
      overflow: 'hidden',
    };
  };

  // Define list of implemented components
  const IMPLEMENTED_COMPONENTS = [
    'hero', 
    'why_choose', 
    'location', 
    'featured_programs', 
    'methodology', 
    'featured_products', 
    'cta'
  ];

  // Add enhanced featured products config state
  const [enhancedFeaturedProductsConfig, setEnhancedFeaturedProductsConfig] = useState<EnhancedFeaturedProductsConfig>({
    heading: 'Featured Products',
    subheading: 'Premium gear designed for serious practitioners. Quality you can trust.',
    featured_product_ids: [],
    button_text: 'View Product',
    button_url: '/shop',
    button_bg_color: 'var(--color-text)',
    button_text_color: '#ffffff',
    button_hover_color: '#222222',
    button_alignment: 'center',
    columns_layout: '3',
    enable_special_promotion: false,
    promoted_product_id: null,
    promotion_badge_text: 'Featured',
    promotion_badge_color: '#ff0000',
    promotion_badge_text_color: '#ffffff'
  });

  // Get the effective palette ID for a component (component -> page -> global)
  const getEffectivePaletteId = (component: HomePageComponent, componentPaletteOverrides: Record<string, string>, pagePaletteId?: string, globalPaletteId?: string): string => {
    // Check if component has a palette override
    if (component.palette_override && componentPaletteOverrides[component.id]) {
      return componentPaletteOverrides[component.id];
    }
    
    // Check if page has a palette override
    if (pagePaletteId) {
      return pagePaletteId;
    }
    
    // Fall back to global palette
    return globalPaletteId || 'monochrome';
  };

  // Simplified palette application function to fix TypeScript errors
  const applyPaletteToComponentStyles = (
    component: HomePageComponent, 
    componentPaletteOverrides: Record<string, string>, 
    pagePaletteId?: string, 
    globalPaletteId?: string
  ): { 
    backgroundColor: string; 
    color: string; 
    borderColor: string;
  } => {
    // Just use the component's own colors directly
    return {
      backgroundColor: component.background_color || '#FFFFFF',
      color: component.text_color || '#000000',
      borderColor: component.border_color || 'transparent'
    };
  };

  // Get a consistent palette index based on component ID for alternating colors
  const getComponentPaletteIndex = (componentId: string): number => {
    // Map component IDs to consistent indexes for palette color alternation
    const componentIndexMap: Record<string, number> = {
      'hero': 0,
      'why_choose': 1,
      'location': 2,
      'featured_programs': 3,
      'methodology': 4,
      'featured_products': 5,
      'cta': 6
    };
    
    return componentIndexMap[componentId] || 0;
  };

  useEffect(() => {
    // Reset image index when hero slides change or on refresh
    setCurrentImageIndex(0);
    
    // Start slider for hero component if needed
    const activeComponents = components.filter(c => c.is_active);
    const heroComponent = activeComponents.find(c => c.id === 'hero');
    
    if (heroComponent && heroSlides.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % heroSlides.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [components, heroSlides, triggerRefresh]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [components, heroSlides, methodology, programs, products]);

  // Helper function to render icon based on icon_name and color
  const renderIcon = (iconName: string, size: number = 24, iconColor: string | undefined = undefined) => {
    // Ensure iconColor is always a string
    const color = iconColor || "var(--color-text)";
    const iconStyle = { color };
    
    switch (iconName) {
      case 'Award':
        return <Award size={size} style={iconStyle} />;
      case 'Users':
        return <Users size={size} style={iconStyle} />;
      case 'Calendar':
        return <Calendar size={size} style={iconStyle} />;
      case 'ShieldCheck':
        return <ShieldCheck size={size} style={iconStyle} />;
      case 'Shield':
        return <Shield size={size} style={iconStyle} />;
      case 'Target':
        return <Target size={size} style={iconStyle} />;
      case 'Brain':
        return <Brain size={size} style={iconStyle} />;
      case 'Dumbbell':
        return <Dumbbell size={size} style={iconStyle} />;
      default:
        return <Award size={size} style={iconStyle} />;
    }
  };

  // Fetch data for all components rather than just the selected one
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Check if we have a hero component
        if (components.some(c => c.id === 'hero' && c.is_active)) {
          const { data, error } = await supabase.from('hero_slides').select('*').order('order');
          if (!error && data && data.length > 0) {
            setHeroSlides(data.filter(slide => slide.is_active !== false));
          } else {
            setHeroSlides([
              { id: '1', title: 'Welcome to House of Grappling', subtitle: 'Join HOG for world-class training in a supportive community', image_url: 'https://images.pexels.com/photos/8989428/pexels-photo-8989428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', button_text: 'Start Your Journey', button_url: '/contact', order: 1, is_active: true }
            ]);
          }
        }
        
        // Check if we have a methodology component
        if (components.some(c => c.id === 'methodology' && c.is_active)) {
          const { data, error } = await supabase.from('methodology').select('*').order('order');
          if (!error && data) setMethodology(data.filter(item => item.is_active));
        }
        
        // Check if we have a featured programs component
        if (components.some(c => c.id === 'featured_programs' && c.is_active)) {
          const { data: configData, error: configError } = await supabase.from('featured_programs_config').select('*').eq('id', '00000000-0000-0000-0000-000000000001').single();
          if (!configError && configData) setFeaturedProgramsConfig(configData);
          const { data: programsData, error: programsError } = await supabase.from('programs').select('*').order('order');
          if (!programsError && programsData) setPrograms(programsData);
        }
        
        // Check if we have a CTA component
        if (components.some(c => c.id === 'cta' && c.is_active)) {
          const { data, error } = await supabase.from('cta_config').select('*').eq('id', '00000000-0000-0000-0000-000000000003').single();
          if (!error && data) setCTAConfig(data);
        }
        
        // Check if we have a featured products component
        if (components.some(c => c.id === 'featured_products' && c.is_active)) {
          // Fetch the featured products configuration
          const { data: configData, error: configError } = await supabase
            .from('featured_products_config')
            .select('*')
            .eq('id', '00000000-0000-0000-0000-000000000002')
            .single();
          
          if (!configError && configData) {
            setEnhancedFeaturedProductsConfig(configData);
            
            // Fetch the actual products from the database based on the featured_product_ids
            if (configData.featured_product_ids && configData.featured_product_ids.length > 0) {
              const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .in('id', configData.featured_product_ids)
                .order('name');
              
              if (!productsError && productsData) {
                // Transform database products to match the Product interface
                const formattedProducts = productsData.map(product => ({
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  images: [product.image_url] // Wrap the image URL in an array to match the Product interface
                }));
                
                console.log('Fetched actual products from database:', formattedProducts);
                setProducts(formattedProducts);
              } else {
                console.warn('Error fetching products:', productsError);
                // Fallback to default products if there's an error
                setProducts([
                  { id: '1', name: 'HOG Gi', description: 'Premium competition gi with reinforced stitching', price: 159.99, images: ['https://images.unsplash.com/photo-1634733571357-847cb4759190?q=80&w=3000&auto=format&fit=crop'] },
                  { id: '2', name: 'Academy Rashguard', description: 'Long sleeve performance rashguard with team logo', price: 49.99, images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop'] },
                  { id: '3', name: 'Competition Shorts', description: 'Lightweight nylon competition shorts', price: 39.99, images: ['https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop'] }
                ]);
              }
            } else {
              // No featured products selected, use default products
              setProducts([
                { id: '1', name: 'HOG Gi', description: 'Premium competition gi with reinforced stitching', price: 159.99, images: ['https://images.unsplash.com/photo-1634733571357-847cb4759190?q=80&w=3000&auto=format&fit=crop'] },
                { id: '2', name: 'Academy Rashguard', description: 'Long sleeve performance rashguard with team logo', price: 49.99, images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop'] },
                { id: '3', name: 'Competition Shorts', description: 'Lightweight nylon competition shorts', price: 39.99, images: ['https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop'] }
              ]);
            }
          } else {
            // If we can't fetch the config, use default products
            setProducts([
              { id: '1', name: 'HOG Gi', description: 'Premium competition gi with reinforced stitching', price: 159.99, images: ['https://images.unsplash.com/photo-1634733571357-847cb4759190?q=80&w=3000&auto=format&fit=crop'] },
              { id: '2', name: 'Academy Rashguard', description: 'Long sleeve performance rashguard with team logo', price: 49.99, images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop'] },
              { id: '3', name: 'Competition Shorts', description: 'Lightweight nylon competition shorts', price: 39.99, images: ['https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop'] }
            ]);
          }
        } else {
          // For completeness, set default products anyway
          setProducts([
            { id: '1', name: 'HOG Gi', description: 'Premium competition gi with reinforced stitching', price: 159.99, images: ['https://images.unsplash.com/photo-1634733571357-847cb4759190?q=80&w=3000&auto=format&fit=crop'] },
            { id: '2', name: 'Academy Rashguard', description: 'Long sleeve performance rashguard with team logo', price: 49.99, images: ['https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2576&auto=format&fit=crop'] },
            { id: '3', name: 'Competition Shorts', description: 'Lightweight nylon competition shorts', price: 39.99, images: ['https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=2940&auto=format&fit=crop'] }
          ]);
        }
        
        // Fetch columns layout configuration
        const { data: columnsConfigData, error: columnsConfigError } = await supabase
          .from('site_config')
          .select('*')
          .in('key', ['why_choose_columns_layout', 'methodology_columns_layout']);

        if (!columnsConfigError && columnsConfigData) {
          const newColumnsConfig = { ...columnsConfig };
          
          columnsConfigData.forEach((item: {key: string, value: string}) => {
            if (item.key === 'why_choose_columns_layout') {
              newColumnsConfig.why_choose = item.value;
            } else if (item.key === 'methodology_columns_layout') {
              newColumnsConfig.methodology = item.value;
            }
          });
          
          setColumnsConfig(newColumnsConfig);
        } else {
          console.warn('Error fetching columns config:', columnsConfigError);
        }

        // Check if we have a why_choose component
        if (components.some(c => c.id === 'why_choose' && c.is_active)) {
          // Fetch why choose section config
          const { data: configData, error: configError } = await supabase
            .from('site_config')
            .select('*')
            .in('key', ['why_choose_heading', 'why_choose_subheading', 'why_choose_columns_layout']);
          
          if (configError) {
            console.warn('Error fetching why_choose config:', configError);
          }
          
          // Fetch why choose cards
          const { data: cardsData, error: cardsError } = await supabase
            .from('why_choose_cards')
            .select('*')
            .order('order');
          
          if (cardsError) {
            console.warn('Error fetching why_choose cards:', cardsError);
          }

          // Get columns layout value
          const columnsLayout = configData?.find((item: {key: string}) => item.key === 'why_choose_columns_layout')?.value || '3';
          
          setWhyChooseData({
            heading: configData?.find((item: {key: string}) => item.key === 'why_choose_heading')?.value || 'Why Choose House of Grappling',
            subheading: configData?.find((item: {key: string}) => item.key === 'why_choose_subheading')?.value || 'We offer a world-class training environment focused on technical excellence, personal growth, and community.',
            cards: cardsData || [],
            columnsLayout
          });
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [components, triggerRefresh, singleComponentId]);

  // Add an effect to fetch enhanced featured products config
  useEffect(() => {
    const fetchEnhancedFeaturedProductsConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('featured_products_config')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000002')
          .single();
          
        if (!error && data) {
          setEnhancedFeaturedProductsConfig({
            heading: data.heading || 'Featured Products',
            subheading: data.subheading || 'Premium gear designed for serious practitioners.',
            featured_product_ids: data.featured_product_ids || [],
            button_text: data.button_text || 'View Product',
            button_url: data.button_url || '/shop',
            button_bg_color: data.button_bg_color || 'var(--color-text)',
            button_text_color: data.button_text_color || '#ffffff',
            button_hover_color: data.button_hover_color || '#222222',
            button_alignment: data.button_alignment || 'center',
            columns_layout: data.columns_layout || '3',
            enable_special_promotion: data.enable_special_promotion || false,
            promoted_product_id: data.promoted_product_id,
            promotion_badge_text: data.promotion_badge_text || 'Featured',
            promotion_badge_color: data.promotion_badge_color || '#ff0000',
            promotion_badge_text_color: data.promotion_badge_text_color || '#ffffff'
          });
        }
      } catch (err) {
        console.error('Error fetching enhanced featured products config:', err);
      }
    };
    
    fetchEnhancedFeaturedProductsConfig();
  }, [triggerRefresh]);

  // Render a single component
  const renderComponentContent = (component: HomePageComponent) => {
    const { id } = component;
    
    // Apply palette colors based on hierarchy
    const paletteStyles = applyPaletteToComponentStyles(component, componentPaletteOverrides, pagePaletteId, globalPaletteId);
    
    // Use palette colors or fall back to component's original colors
    const backgroundColor = paletteStyles.backgroundColor || component.background_color;
    const textColor = paletteStyles.color || component.text_color;

    // Hero component
    if (id === 'hero') {
      const slide = heroSlides[currentImageIndex] || heroSlides[0] || {
        title: 'Welcome to House of Grappling',
        subtitle: 'Join HOG for world-class training in a supportive community',
        image_url: 'https://images.pexels.com/photos/8989428/pexels-photo-8989428.jpeg'
      };
      
      return (
        <div 
          className="w-full relative bg-background overflow-hidden"
          style={{ height: '600px', width: component.width || '100%' }}
        >
          {/* Background image */}
          {slide.image_url && (
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ 
                backgroundImage: `url(${slide.image_url})`,
                opacity: (slide.image_opacity || 100) / 100 
              }}
            />
          )}
          
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="absolute inset-0 flex"
              style={{
                justifyContent: (slide.text_position?.horizontal || 'center') === 'left' 
                  ? 'flex-start' 
                  : (slide.text_position?.horizontal || 'center') === 'right' 
                    ? 'flex-end' 
                    : 'center',
                alignItems: (slide.text_position?.vertical || 'center') === 'top' 
                  ? 'flex-start' 
                  : (slide.text_position?.vertical || 'center') === 'bottom' 
                    ? 'flex-end' 
                    : 'center'
              }}
            >
              <div 
                className={`
                  ${slide.text_background?.size === 'sm' ? 'max-w-md' : 
                    slide.text_background?.size === 'md' ? 'max-w-xl' : 
                    slide.text_background?.size === 'lg' ? 'max-w-3xl' : 
                    'w-full'}
                  ${(slide.text_position?.horizontal || 'center') === 'left' ? 'ml-4' : ''}
                  ${(slide.text_position?.horizontal || 'center') === 'right' ? 'mr-4' : ''}
                  ${(slide.text_position?.vertical || 'center') === 'top' ? 'mt-4' : ''}
                  ${(slide.text_position?.vertical || 'center') === 'bottom' ? 'mb-4' : ''}
                  relative
                `}
              >
                {slide.text_background?.enabled && (
                  <div 
                    className="absolute inset-0 rounded-lg" 
                    style={{
                      backgroundColor: slide.text_background?.color || 'rgba(0,0,0,0.7)',
                      opacity: (slide.text_background?.opacity || 70) / 100
                    }}
                  />
                )}
                
                <div 
                  className={`relative ${slide.text_background?.enabled ? 'p-8 rounded-lg' : ''}`}
                  style={{
                    padding: slide.text_background?.enabled ? slide.text_background?.padding || '16px' : '8px',
                    textAlign: (slide.text_position?.horizontal || 'center') as 'left' | 'center' | 'right'
                  }}
                >
                  <h2 
                    className="text-4xl md:text-6xl font-display font-bold mb-6"
                    style={{ color: slide.text_color || 'var(--color-background)' }}
                  >
                    {slide.title}
                  </h2>
                  <p 
                    className="text-xl mb-8"
                    style={{ color: slide.text_color || 'var(--color-background)' }}
                  >
                    {slide.subtitle}
                  </p>
                  
                  <div 
                    className="flex flex-wrap gap-4"
                    style={{
                      justifyContent: (slide.text_position?.horizontal || 'center') === 'left' 
                        ? 'flex-start' 
                        : (slide.text_position?.horizontal || 'center') === 'right' 
                          ? 'flex-end' 
                          : 'center'
                    }}
                  >
                    {slide.button_active !== false && slide.button_text && (
                      <button 
                        className="text-sm"
                        style={{
                          backgroundColor: slide.button_bg || 'var(--color-text)',
                          color: slide.button_text_color || 'var(--color-background)',
                          padding: `${(slide.button_padding_y || 'py-2').replace('py-', '').replace('rem', '')}rem ${(slide.button_padding_x || 'px-4').replace('px-', '').replace('rem', '')}rem`,
                          fontWeight: (slide.button_font || 'font-medium').includes('bold') ? 'bold' : 
                                    (slide.button_font || 'font-medium').includes('medium') ? '500' : 'normal',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1.2,
                          verticalAlign: 'middle'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = slide.button_hover || 
                            (slide.button_bg === 'var(--color-background)' || slide.button_bg === 'white' ? '#f3f3f3' : 
                             slide.button_bg === 'var(--color-text)' || slide.button_bg === 'black' ? 'var(--color-secondary)' : 
                             adjustColor(slide.button_bg || 'var(--color-text)', -20));
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = slide.button_bg || 'var(--color-text)';
                        }}
                      >
                        {slide.button_text}
                      </button>
                    )}
                    
                    {slide.secondary_button_active !== false && slide.secondary_button_text && (
                      <button 
                        className="text-sm"
                        style={{
                          backgroundColor: slide.secondary_button_bg || 'rgba(0,0,0,0.5)',
                          color: slide.secondary_button_text_color || 'var(--color-background)',
                          padding: `${(slide.secondary_button_padding_y || 'py-2').replace('py-', '').replace('rem', '')}rem ${(slide.secondary_button_padding_x || 'px-4').replace('px-', '').replace('rem', '')}rem`,
                          fontWeight: (slide.secondary_button_font || 'font-medium').includes('bold') ? 'bold' : 
                                    (slide.secondary_button_font || 'font-medium').includes('medium') ? '500' : 'normal',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1.2,
                          verticalAlign: 'middle'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = slide.secondary_button_hover || 
                            (slide.secondary_button_bg === 'var(--color-background)' || slide.secondary_button_bg === 'white' ? '#f3f3f3' : 
                             slide.secondary_button_bg === 'var(--color-text)' || slide.secondary_button_bg === 'black' ? 'var(--color-secondary)' : 
                             adjustColor(slide.secondary_button_bg || 'rgba(0,0,0,0.5)', -20));
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = slide.secondary_button_bg || 'rgba(0,0,0,0.5)';
                        }}
                      >
                        {slide.secondary_button_text}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image navigation dots */}
          {heroSlides.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-50'}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Why Choose section
    else if (id === 'why_choose') {
      // Use actual data from the database instead of hardcoded values
      const displayCards = whyChooseData.cards.length > 0 
        ? whyChooseData.cards
        : [
            {
              id: '1',
              title: 'Expert Instructors',
              description: 'Learn from certified black belts with years of competition experience.',
              icon_name: 'Award',
              use_icon: true,
              order: 1,
              is_active: true,
              icon_color: textColor,
              image_url: '',
              image_id: '',
              button_text: '',
              button_url: '',
              button_bg: '',
              button_text_color: '',
              card_bg: '',
              card_text_color: ''
            },
            {
              id: '2',
              title: 'Supportive Community',
              description: 'Join a friendly and supportive environment where everyone helps each other improve.',
              icon_name: 'Users',
              use_icon: true,
              order: 2,
              is_active: true,
              icon_color: textColor,
              image_url: '',
              image_id: '',
              button_text: '',
              button_url: '',
              button_bg: '',
              button_text_color: '',
              card_bg: '',
              card_text_color: ''
            },
            {
              id: '3',
              title: 'Structured Curriculum',
              description: 'Follow a proven path from beginner to advanced techniques.',
              icon_name: 'Calendar',
              use_icon: true,
              order: 3,
              is_active: true,
              icon_color: textColor,
              image_url: '',
              image_id: '',
              button_text: '',
              button_url: '',
              button_bg: '',
              button_text_color: '',
              card_bg: '',
              card_text_color: ''
            }
          ];
      
      // Determine column classes based on columnsLayout
      let columnClasses = 'grid-cols-1 md:grid-cols-3';
      
      switch (whyChooseData.columnsLayout) {
        case '1':
          columnClasses = 'grid-cols-1';
          break;
        case '2':
          columnClasses = 'grid-cols-1 md:grid-cols-2';
          break;
        case '3':
          columnClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
          break;
        case '4':
          columnClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
          break;
        default:
          columnClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      }
      
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>
              {whyChooseData.heading}
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: textColor }}>
              {whyChooseData.subheading}
            </p>
          </div>
          
          <div className={`grid ${columnClasses} gap-8`}>
            {displayCards.map((card, index) => (
              <div key={card.id || index} 
                className="flex flex-col p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all"
                style={{
                  backgroundColor: card.card_bg || 'white',
                  color: card.card_text_color || textColor
                }}
              >
                <div className="flex items-center mb-4">
                  {card.use_icon && card.icon_name ? (
                    <div className="mr-4">
                      {renderIcon(card.icon_name, 30, card.icon_color || textColor || "var(--color-text)")}
                    </div>
                  ) : card.image_url ? (
                    <div className="mr-4 h-16 w-16 overflow-hidden rounded-full">
                      <img 
                        src={card.image_url} 
                        alt={card.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-xl font-bold" style={{ color: card.card_text_color || textColor }}>
                    {card.title}
                  </h3>
                </div>
                
                <p className="text-text mb-4">{card.description}</p>
                
                {card.button_text && (
                  <a
                    href={card.button_url || '#'}
                    className="mt-auto inline-flex px-4 py-2 rounded text-center font-medium transition-colors"
                    style={{
                      backgroundColor: card.button_bg || '#cec0c0',
                      color: card.button_text_color || 'var(--color-text)',
                    }}
                  >
                    {card.button_text}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Location section
    else if (id === 'location') {
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
                Our Location
              </h2>
              <p className="text-lg mb-4" style={{ color: textColor }}>
                House of Grappling is centrally located with easy access and ample parking.
              </p>
              <div className="mb-6">
                <h3 className="font-semibold mb-2" style={{ color: textColor }}>Address:</h3>
                <p className="text-text">
                  123 Martial Arts Way<br />
                  San Diego, CA 92101
                </p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2" style={{ color: textColor }}>Hours:</h3>
                <ul className="text-text space-y-1">
                  <li>Monday - Friday: 6:00 AM - 9:00 PM</li>
                  <li>Saturday: 8:00 AM - 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
              <a
                href="/contact"
                className="inline-block px-6 py-3 bg-background text-white font-semibold rounded-md transition hover:bg-red-800"
              >
                Contact Us
              </a>
            </div>
            <div className="md:w-1/2">
              <div className="bg-background rounded-lg overflow-hidden" style={{ height: '400px' }}>
                <div className="text-center p-4 bg-background">
                  [Google Map would display here]
                </div>
                <div className="p-8 flex items-center justify-center h-full">
                  <img 
                    src="https://images.unsplash.com/photo-1579761448036-8460995d2335?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Academy" 
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Featured Programs section
    else if (id === 'featured_programs') {
      const displayPrograms = programs.length > 0 
        ? programs.filter(p => p.is_featured).slice(0, 3)
        : [
            { id: '1', title: 'Fundamentals', description: 'Perfect for beginners with no experience', image_url: 'https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', level: 'Beginner', duration: 60 },
            { id: '2', title: 'Competition Team', description: 'For experienced practitioners preparing for tournaments', image_url: 'https://images.unsplash.com/photo-1613312980234-115beb40f8f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', level: 'Advanced', duration: 90 },
            { id: '3', title: 'No-Gi Training', description: 'Grappling without the traditional gi uniform', image_url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', level: 'All Levels', duration: 75 },
          ];
      
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
              {featuredProgramsConfig.heading || 'Featured Programs'}
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: textColor }}>
              {featuredProgramsConfig.subheading || 'From beginner-friendly fundamentals to advanced competition training.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayPrograms.map((program) => (
              <div key={program.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden">
                  <img
                    src={program.image_url || 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="px-3 py-1 bg-background text-text rounded-full text-xs font-semibold">
                      {program.level}
                    </span>
                    <span className="text-text text-sm">
                      {program.duration} min
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>{program.title}</h3>
                  <p className="text-text mb-4">{program.description}</p>
                  <a
                    href={`/programs/${program.id}`}
                    className="inline-block px-4 py-2 border border-red-700 text-text rounded hover:bg-background hover:text-white transition"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a
              href="/programs"
              className="inline-block px-6 py-3 bg-background text-white font-semibold rounded-md transition hover:bg-red-800"
            >
              View All Programs
            </a>
          </div>
        </div>
      );
    }
    
    // Methodology section
    else if (id === 'methodology') {
      const displayMethodology = methodology.length > 0 
        ? methodology.filter(m => m.is_active).slice(0, 4)
        : [
            { id: '1', title: 'Fundamentals First', description: 'Master the basics before advancing to more complex techniques', icon_name: 'Shield', order: 1, is_active: true },
            { id: '2', title: 'Progressive Training', description: 'Build skills through carefully sequenced lessons and drills', icon_name: 'Target', order: 2, is_active: true },
            { id: '3', title: 'Practical Application', description: 'Learn techniques that work in real situations through live training', icon_name: 'Brain', order: 3, is_active: true },
            { id: '4', title: 'Intelligent Conditioning', description: 'Develop the specific strength and endurance needed for grappling', icon_name: 'Dumbbell', order: 4, is_active: true }
          ];
      
      // Determine column classes based on columnsConfig
      let columnClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      
      switch (columnsConfig.methodology) {
        case '1':
          columnClasses = 'grid-cols-1';
          break;
        case '2':
          columnClasses = 'grid-cols-1 md:grid-cols-2';
          break;
        case '3':
          columnClasses = 'grid-cols-1 md:grid-cols-3';
          break;
        case '4':
          columnClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
          break;
        default:
          columnClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      }
      
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
              Our Training Methodology
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: textColor }}>
              We follow a proven approach to help students progress efficiently and safely.
            </p>
          </div>
          
          <div className={`grid ${columnClasses} gap-8`}>
            {displayMethodology.map((item) => (
              <div key={item.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 flex items-center justify-center rounded-full mb-4" style={{ backgroundColor: backgroundColor }}>
                  {renderIcon(item.icon_name, 24, textColor)}
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: textColor }}>
                  {item.title}
                </h3>
                <p className="text-text">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    // Featured Products section
    else if (id === 'featured_products') {
      // Function to determine if product should have special styling
      const isPromotedProduct = (productId: string) => {
        return enhancedFeaturedProductsConfig.enable_special_promotion && 
               enhancedFeaturedProductsConfig.promoted_product_id === productId;
      };
      
      // Determine column classes based on featuredProductsConfig.columns_layout
      let columnClasses = 'grid-cols-1 md:grid-cols-3 gap-8';
      
      switch (enhancedFeaturedProductsConfig.columns_layout) {
        case '1':
          columnClasses = 'grid-cols-1 gap-8';
          break;
        case '2':
          columnClasses = 'grid-cols-1 md:grid-cols-2 gap-8';
          break;
        case '3':
          columnClasses = 'grid-cols-1 md:grid-cols-3 gap-8';
          break;
        case '4':
          columnClasses = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8';
          break;
        default:
          columnClasses = 'grid-cols-1 md:grid-cols-3 gap-8';
      }

      // Filter products to only show those in the featured_product_ids array
      const featuredProducts = products.filter(product => 
        enhancedFeaturedProductsConfig.featured_product_ids.includes(product.id)
      );

      // If no products are selected, show a placeholder message
      if (featuredProducts.length === 0) {
        return (
          <div className="container mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
                {enhancedFeaturedProductsConfig.heading}
              </h2>
              <p className="text-lg max-w-3xl mx-auto" style={{ color: textColor }}>
                {enhancedFeaturedProductsConfig.subheading}
              </p>
            </div>
            
            <div className="bg-background border border-gray-200 rounded-lg p-8 text-center">
              <ShoppingBag size={48} className="mx-auto mb-4 text-text" />
              <h3 className="text-xl font-medium mb-2 text-text">No products selected</h3>
              <p className="text-text mb-4">Select products to display in the featured products section.</p>
            </div>
          </div>
        );
      }
      
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
              {enhancedFeaturedProductsConfig.heading}
            </h2>
            <p className="text-lg max-w-3xl mx-auto" style={{ color: textColor }}>
              {enhancedFeaturedProductsConfig.subheading}
            </p>
          </div>
          
          <div className={`grid ${columnClasses}`}>
            {featuredProducts.map((product) => {
              const promoted = isPromotedProduct(product.id);
              
              return (
                <div 
                  key={product.id} 
                  className={`bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg ${
                    promoted ? 'ring-2 ring-offset-2' : ''
                  }`}
                  style={promoted ? { 
                    borderColor: enhancedFeaturedProductsConfig.promotion_badge_color,
                    boxShadow: `0 0 0 2px ${enhancedFeaturedProductsConfig.promotion_badge_color}`
                  } : {}}
                >
                  <div className="relative h-48 overflow-hidden">
                    {promoted && (
                      <div 
                        className="absolute top-0 right-0 z-10 px-3 py-1 text-sm font-medium"
                        style={{
                          backgroundColor: enhancedFeaturedProductsConfig.promotion_badge_color,
                          color: enhancedFeaturedProductsConfig.promotion_badge_text_color
                        }}
                      >
                        {enhancedFeaturedProductsConfig.promotion_badge_text}
                      </div>
                    )}
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1634733571357-847cb4759190?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>{product.name}</h3>
                    <p className="text-text mb-4">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold" style={{ color: textColor }}>
                        ${product.price.toFixed(2)}
                      </span>
                    </div>
                    <div className={`flex ${
                      enhancedFeaturedProductsConfig.button_alignment === 'center' ? 'justify-center' : 
                      enhancedFeaturedProductsConfig.button_alignment === 'right' ? 'justify-end' : 
                      'justify-start'
                    }`}>
                      <a
                        href={`/shop/products/${product.id}`}
                        className="inline-block px-4 py-2 rounded font-medium transition-colors"
                        style={{
                          backgroundColor: enhancedFeaturedProductsConfig.button_bg_color,
                          color: enhancedFeaturedProductsConfig.button_text_color,
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = enhancedFeaturedProductsConfig.button_hover_color;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = enhancedFeaturedProductsConfig.button_bg_color;
                        }}
                      >
                        {enhancedFeaturedProductsConfig.button_text}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-10">
            <a
              href={enhancedFeaturedProductsConfig.button_url || '/shop'}
              className="inline-block px-6 py-3 font-semibold rounded-md transition-colors"
              style={{
                backgroundColor: enhancedFeaturedProductsConfig.button_bg_color,
                color: enhancedFeaturedProductsConfig.button_text_color,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = enhancedFeaturedProductsConfig.button_hover_color;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = enhancedFeaturedProductsConfig.button_bg_color;
              }}
            >
              View All Products
            </a>
          </div>
        </div>
      );
    }
    
    // CTA section
    else if (id === 'cta') {
      return (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
              {ctaConfig.heading || 'Start Your Journey Today'}
            </h2>
            <p className="text-xl mb-8" style={{ color: textColor }}>
              {ctaConfig.subheading || 'Join House of Grappling and experience the most effective martial art in the world.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={ctaConfig.primary_button_url || '/contact'}
                className="px-8 py-3 bg-background text-white font-semibold rounded-md transition hover:bg-red-800"
              >
                {ctaConfig.primary_button_text || 'Get Started'}
              </a>
              <a
                href={ctaConfig.secondary_button_url || '/schedule'}
                className="px-8 py-3 border border-gray-300 text-text font-semibold rounded-md transition hover:bg-background"
              >
                {ctaConfig.secondary_button_text || 'View Schedule'}
              </a>
            </div>
          </div>
        </div>
      );
    }
    
    // Default case - empty component
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
          {component.name}
        </h2>
        <p className="text-lg" style={{ color: textColor }}>
          This is a preview of the {component.name} component.
        </p>
      </div>
    );
  };

  // Updated renderAllActiveComponents to use zoom parameter
  const renderAllActiveComponents = () => {
    // First ensure components are ordered correctly
    const sortedComponents = [...components].sort((a, b) => a.order - b.order);
    
    // Filter active components and the selected component if in single component mode
    const activeComponents = sortedComponents.filter(comp => {
      if (singleComponentId) {
        return comp.id === singleComponentId;
      }
      return comp.is_active;
    });
    
    if (activeComponents.length === 0) {
      return (
        <div className="py-4 px-6 bg-gray-100 rounded-lg text-center">
          <p className="text-lg text-gray-500">No active components to display.</p>
          <p className="text-sm text-gray-400 mt-2">Enable components or add new ones to see them here.</p>
        </div>
      );
    }
    
    return activeComponents.map(component => {
      // Get palette styles for this component
      const paletteStyles = applyPaletteToComponentStyles(
        component,
        componentPaletteOverrides,
        pagePaletteId,
        globalPaletteId
      );
      
      // Apply component container styles
      const styles = containerStyle(component, paletteStyles);
      
      // Add debug indicator for component visibility in edit mode
      const debugStyle = singleComponentId ? {
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
      } : {};
      
      return (
        <div
          key={component.id}
          className="relative component-preview"
          style={{
            ...styles,
            ...debugStyle,
            transform: zoom !== 1 ? `scale(${zoom})` : undefined,
            transformOrigin: 'top center'
          }}
        >
          {singleComponentId && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-bl-md">
              {component.name}
            </div>
          )}
          {renderComponentContent(component)}
        </div>
      );
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="preview-container">
      {renderAllActiveComponents()}
    </div>
  );
};

// Add this helper function at the bottom of the file before the export
// Function to adjust a color by a percentage
const adjustColor = (color: string, percent: number): string => {
  // Handle empty color or non-hex colors
  if (!color || color.charAt(0) !== '#') {
    return color;
  }

  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor(R * (100 + percent) / 100);
  G = Math.floor(G * (100 + percent) / 100);
  B = Math.floor(B * (100 + percent) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  R = R > 0 ? R : 0;
  G = G > 0 ? G : 0;
  B = B > 0 ? B : 0;

  const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
  const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
  const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

  return "#" + RR + GG + BB;
};

export default ComponentPreview; 