import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight, Award, Users, Calendar, ShieldCheck, Shield, Target, Brain, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
// Comment out unused import
// import { products } from '../data/products';
import { supabase } from '../lib/supabase/supabaseClient';
// Remove imports of deleted components
// import WhyChooseSection from '../components/WhyChooseSection';
// import LocationSection from '../components/LocationSection';
// import ShopSection from '../components/ShopSection';

// Hero slide interface
interface TextBackgroundSettings {
  enabled: boolean;
  color: string;
  opacity: number;
  size: string; // 'sm', 'md', 'lg', 'full'
  padding: string;
}

interface TextPosition {
  horizontal: 'left' | 'center' | 'right';
  vertical: 'top' | 'center' | 'bottom';
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
  text_background?: TextBackgroundSettings;
  text_position?: TextPosition;
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

// Add feature and methodology interfaces
interface Methodology {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  order: number;
  is_active: boolean;
}

// Add FeaturedClassesConfig interface
interface FeaturedProgramsConfig {
  heading: string;
  subheading: string;
  featured_program_ids: string[];
}

/* Commenting out unused interface
// Add FeaturedProductsConfig interface
interface FeaturedProductsConfig {
  heading: string;
  subheading: string;
  featured_product_ids: string[];
}
*/

// Add CTAConfig interface
interface CTAConfig {
  heading: string;
  subheading: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
}

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

// Home page component configuration interface
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
}

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

const HomePage: React.FC = () => {
  // const { settings } = useSiteSettings(); // Removed as unused

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loadingHeroSlides, setLoadingHeroSlides] = useState(true);
  const [methodology, setMethodology] = useState<Methodology[]>([]);
  const [loadingMethodology, setLoadingMethodology] = useState(true);
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [featuredProgramsConfig, setFeaturedProgramsConfig] = useState<FeaturedProgramsConfig>({
    heading: 'Featured Programs',
    subheading: 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.',
    featured_program_ids: []
  });
  const [loadingFeaturedConfig, setLoadingFeaturedConfig] = useState(true);
  const [homeComponents, setHomeComponents] = useState<HomePageComponent[]>([]);
  const [CTAConfig, setCTAConfig] = useState<CTAConfig>({
    heading: 'Start Your Journey Today',
    subheading: 'Join House of Grappling and experience the most effective martial art in the world.',
    primary_button_text: 'Get Started',
    primary_button_url: '/contact',
    secondary_button_text: 'View Schedule',
    secondary_button_url: '/schedule'
  });
  /* Commenting out unused featuredProductsConfig state
  const [featuredProductsConfig, setFeaturedProductsConfig] = useState<FeaturedProductsConfig>({
    heading: 'Featured Products',
    subheading: 'Premium gear designed for serious practitioners. Quality you can trust.',
    featured_product_ids: []
  });
  */
  // Comment out unused variable
  // const featuredProducts = products.filter(product => product.featured).slice(0, 3);

  // Fallback images in case no hero slides are found in the database
  const fallbackHeroImages = [
  'https://images.pexels.com/photos/8989428/pexels-photo-8989428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/7045511/pexels-photo-7045511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/7991575/pexels-photo-7991575.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'https://images.pexels.com/photos/8534469/pexels-photo-8534469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
];

  useEffect(() => {
    // Fetch hero slides from database
    const fetchHeroSlides = async () => {
      setLoadingHeroSlides(true);
      try {
        const { data, error } = await supabase
          .from('hero_slides')
          .select('*')
          .order('order');
        
        if (error) {
          console.error('Error fetching hero slides:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Filter active slides if is_active column exists
          const activeSlides = data.filter(slide => slide.is_active !== false);
          setHeroSlides(activeSlides);
        } else {
          console.log('No hero slides found in database, using fallback images');
        }
      } catch (err) {
        console.error('Error in hero slides fetch:', err);
      } finally {
        setLoadingHeroSlides(false);
      }
    };

    fetchHeroSlides();
  }, []);

  useEffect(() => {
    // Rotate through hero slides every 5 seconds
    if (heroSlides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides]);

  useEffect(() => {
    const fetchMethodology = async () => {
      setLoadingMethodology(true);
      try {
        const { data, error } = await supabase
          .from('methodology')
          .select('*')
          .order('order');
        
        if (error) {
          // Display a more informative message if the table doesn't exist
          if (error.message && error.message.includes('relation "methodology" does not exist')) {
            console.error('The methodology table does not exist. Please run the database setup script.');
          } else {
            console.error('Error fetching methodology:', error);
          }
          throw error;
        }
        
        if (data && data.length > 0) {
          // Filter active methodology if is_active column exists
          const activeMethodology = data.filter(method => method.is_active !== false);
          setMethodology(activeMethodology);
        } else {
          console.log('No methodology found in database');
        }
      } catch (err) {
        console.error('Error in methodology fetch:', err);
        // Don't treat this as a fatal error - the component can render with empty data
      } finally {
        setLoadingMethodology(false);
      }
    };

    fetchMethodology();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from('programs')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          console.error('Error fetching programs:', error);
          return;
        }
        
        if (data) {
          setPrograms(data);
        }
      } catch (err) {
        console.error('Failed to fetch programs:', err);
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchFeaturedProgramsConfig = async () => {
      setLoadingFeaturedConfig(true);
      try {
        const { data, error } = await supabase
          .from('featured_programs_config')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000001')
          .single();
        
        if (error) {
          if (error.code === 'PGRST116' || error.code === 'PGRST104') {
            console.error('No featured programs config found, using default');
          } else {
            console.error('Error fetching featured programs config:', error);
          }
          return;
        }
        
        if (data) {
          setFeaturedProgramsConfig(data);
        }
      } catch (err) {
        console.error('Error in featured programs config fetch:', err);
      } finally {
        setLoadingFeaturedConfig(false);
      }
    };
    
    fetchFeaturedProgramsConfig();
  }, []);

  useEffect(() => {
    const fetchHomeComponents = async () => {
      try {
        const { data, error } = await supabase
          .from('home_page_components')
          .select('*')
          .order('"order"');
        
        if (error) {
          console.error('Error fetching home page components:', error);
          return;
        }
        
        if (data && data.length > 0) {
          // Filter active components
          const activeComponents = data.filter(component => component.is_active);
          setHomeComponents(activeComponents);
        }
      } catch (err) {
        console.error('Error in home components fetch:', err);
      }
    };
    
    fetchHomeComponents();
  }, []);

  // Add effect to fetch CTA config
  useEffect(() => {
    const fetchCTAConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('cta_config')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000003')
          .single();
        
        if (error && !(error.code === 'PGRST116' || error.code === 'PGRST104')) {
          console.error('Error fetching CTA config:', error);
        }
        
        if (data) {
          setCTAConfig(data);
        }
      } catch (err) {
        console.error('Error in CTA config fetch:', err);
      }
    };
    
    fetchCTAConfig();
  }, []);

  /* Commenting out unused useEffect for featuredProductsConfig
  useEffect(() => {
    const fetchFeaturedProductsConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('featured_products_config')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000002')
          .single();
        
        if (error && !(error.code === 'PGRST116' || error.code === 'PGRST104')) {
          console.error('Error fetching featured products config:', error);
        }
        
        if (data) {
          setFeaturedProductsConfig(data);
        }
      } catch (err) {
        console.error('Error in featured products config fetch:', err);
      }
    };
    
    fetchFeaturedProductsConfig();
  }, []);
  */

  // If we have no hero slides from database, use fallback images
  const displayImages = heroSlides.length > 0 
    ? heroSlides.map(slide => slide.image_url)
    : fallbackHeroImages;

  // Helper function to render icon based on icon_name
  const renderIcon = (iconName: string, size: number = 48, className: string = "text-neutral-500") => {
    switch (iconName) {
      case 'Award':
        return <Award size={size} className={className} />;
      case 'Users':
        return <Users size={size} className={className} />;
      case 'Calendar':
        return <Calendar size={size} className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck size={size} className={className} />;
      case 'Shield':
        return <Shield size={size} className={className} />;
      case 'Target':
        return <Target size={size} className={className} />;
      case 'Brain':
        return <Brain size={size} className={className} />;
      case 'Dumbbell':
        return <Dumbbell size={size} className={className} />;
      default:
        return <Award size={size} className={className} />;
    }
  };

  // Get featured programs based on configuration
  const featuredPrograms = programs.filter(program => 
    featuredProgramsConfig.featured_program_ids.includes(program.id)
  );

  // Get the featured products to display
  // const featuredProductIds = featuredProductsConfig?.featured_product_ids || [];

  // Get component container style based on component ID
  const getContainerStyle = (componentId: string): React.CSSProperties => {
    // Debug logging to see what's happening
    console.log(`Trying to get container style for component: ${componentId}`);
    console.log(`Available components:`, homeComponents);
    
    const component = homeComponents.find(comp => comp.id === componentId);
    if (!component) {
      console.warn(`Component not found with ID: ${componentId}. Using default styles.`);
      return {}; // Return empty object if component not found
    }
    
    const styles = {
      backgroundColor: component.background_color,
      color: component.text_color,
      borderColor: component.border_color,
      borderWidth: component.border_width,
      borderRadius: component.border_radius,
      padding: component.padding,
      margin: component.margin || '0px',
      width: component.width || '100%'
    };
    
    console.log(`Applied styles for ${componentId}:`, styles);
    return styles;
  };

  // Get all active components sorted by order
  const activeSections = homeComponents
    .filter(component => component.is_active)
    .sort((a, b) => a.order - b.order)
    .map(component => component.id);

  // New function to handle mouseover events
  const handleButtonMouseOver = (event: React.MouseEvent<HTMLAnchorElement>, hoverColor?: string, originalColor?: string) => {
    if (!event.currentTarget) return;
    
    const buttonEl = event.currentTarget;
    const origColor = originalColor || '#000000';
    
    buttonEl.style.backgroundColor = hoverColor || 
      (origColor === '#FFFFFF' || origColor === 'white' ? '#f3f3f3' : 
       origColor === '#000000' || origColor === 'black' ? '#333333' : 
       adjustColor(origColor, -20));
  };
  
  // New function to handle mouseout events
  const handleButtonMouseOut = (event: React.MouseEvent<HTMLAnchorElement>, originalColor?: string) => {
    if (!event.currentTarget) return;
    
    const buttonEl = event.currentTarget;
    buttonEl.style.backgroundColor = originalColor || '#000000';
  };

  return (
    <>
      <Helmet>
        <title>HOG - House of Grappling | Premier Brazilian Jiu-Jitsu Academy</title>
        <meta name="description" content="Join House of Grappling for world-class Brazilian Jiu-Jitsu training. Classes for all skill levels, expert coaches, and a supportive community." />
      </Helmet>

      {/* Display sections based on configured order */}
      {activeSections.map(sectionId => {
        switch(sectionId) {
          case 'hero':
            return (
              <section 
                key="hero" 
                className="relative h-screen flex items-center justify-center overflow-hidden"
                style={getContainerStyle('hero')}
              >
                {/* Hero section content */}
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 via-transparent to-neutral-900/50 z-10" />
        
                {loadingHeroSlides ? (
                  // Show loading indicator while fetching hero slides
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-50"></div>
                  </div>
                ) : (
                  // Display hero slides or fallback images
                  displayImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 1.5 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
                        style={{ 
                          backgroundImage: `url(${image})`,
                          opacity: heroSlides[index]?.image_opacity !== undefined 
                            ? heroSlides[index].image_opacity! / 100
                            : 1
                        }}
            />
          </motion.div>
                  ))
                )}
                
                <div className="container mx-auto px-4 z-20 relative h-full flex items-center">
                  {heroSlides.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      className="w-full"
                      style={{
                        display: 'flex',
                        justifyContent: heroSlides[currentImageIndex]?.text_position?.horizontal === 'left' 
                          ? 'flex-start' 
                          : heroSlides[currentImageIndex]?.text_position?.horizontal === 'right' 
                            ? 'flex-end' 
                            : 'center',
                        alignItems: heroSlides[currentImageIndex]?.text_position?.vertical === 'top' 
                          ? 'flex-start' 
                          : heroSlides[currentImageIndex]?.text_position?.vertical === 'bottom' 
                            ? 'flex-end' 
                            : 'center',
                        height: '100%'
                      }}
                    >
                      <div 
                        className={`
                          ${heroSlides[currentImageIndex]?.text_background?.size === 'sm' ? 'max-w-md' : 
                            heroSlides[currentImageIndex]?.text_background?.size === 'md' ? 'max-w-xl' : 
                            heroSlides[currentImageIndex]?.text_background?.size === 'lg' ? 'max-w-3xl' : 
                            'w-full'}
                          relative
                        `}
                      >
                        {heroSlides[currentImageIndex]?.text_background?.enabled && (
                          <div 
                            className="absolute inset-0 rounded-lg"
                            style={{
                              backgroundColor: heroSlides[currentImageIndex]?.text_background?.color || 'rgba(0,0,0,0.7)',
                              opacity: (heroSlides[currentImageIndex]?.text_background?.opacity || 70) / 100
                            }}
                          ></div>
                        )}
                        
                        <div 
                          className={`relative ${heroSlides[currentImageIndex]?.text_background?.enabled ? 'p-8 rounded-lg' : ''}`}
                          style={{
                            padding: heroSlides[currentImageIndex]?.text_background?.enabled 
                              ? heroSlides[currentImageIndex]?.text_background?.padding || '16px'
                              : '0',
                            textAlign: heroSlides[currentImageIndex]?.text_position?.horizontal || 'center'
                          }}
                        >
                          <h1 
                            className="text-4xl md:text-6xl font-display font-bold mb-6"
                            style={{ 
                              color: heroSlides[currentImageIndex]?.text_color || '#FFFFFF'
                            }}
                          >
                            {heroSlides[currentImageIndex].title}
                          </h1>
                          <p 
                            className="text-xl mb-8"
                            style={{ 
                              color: heroSlides[currentImageIndex]?.text_color || '#FFFFFF'
                            }}
                          >
                            {heroSlides[currentImageIndex].subtitle}
                          </p>
                          
                          <div 
                            className="flex flex-wrap gap-4"
                            style={{
                              justifyContent: heroSlides[currentImageIndex]?.text_position?.horizontal === 'left' 
                                ? 'flex-start' 
                                : heroSlides[currentImageIndex]?.text_position?.horizontal === 'right' 
                                  ? 'flex-end' 
                                  : 'center'
                            }}
                          >
                            {heroSlides[currentImageIndex]?.button_active !== false && heroSlides[currentImageIndex]?.button_text && (
                              <Link 
                                to={heroSlides[currentImageIndex].button_url || '/contact'} 
                                className="text-sm"
                                style={{
                                  backgroundColor: heroSlides[currentImageIndex].button_bg || '#000000',
                                  color: heroSlides[currentImageIndex].button_text_color || '#FFFFFF',
                                  padding: `${(heroSlides[currentImageIndex].button_padding_y || 'py-2').replace('py-', '').replace('rem', '')}rem ${(heroSlides[currentImageIndex].button_padding_x || 'px-4').replace('px-', '').replace('rem', '')}rem`,
                                  fontWeight: (heroSlides[currentImageIndex].button_font || 'font-medium').includes('bold') ? 'bold' : 
                                            (heroSlides[currentImageIndex].button_font || 'font-medium').includes('medium') ? '500' : 'normal',
                                  borderRadius: '0.25rem',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s ease, color 0.3s ease',
                                  display: 'inline-flex',
                                  textDecoration: 'none',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  lineHeight: 1.2,
                                  verticalAlign: 'middle'
                                }}
                                onMouseOver={(e) => handleButtonMouseOver(
                                  e, 
                                  heroSlides[currentImageIndex].button_hover, 
                                  heroSlides[currentImageIndex].button_bg
                                )}
                                onMouseOut={(e) => handleButtonMouseOut(
                                  e, 
                                  heroSlides[currentImageIndex].button_bg
                                )}
                              >
                                {heroSlides[currentImageIndex].button_text}
                              </Link>
                            )}
                            
                            {heroSlides[currentImageIndex]?.secondary_button_active !== false && heroSlides[currentImageIndex]?.secondary_button_text && (
                              <Link 
                                to={heroSlides[currentImageIndex].secondary_button_url || '/schedule'} 
                                className="text-sm"
                                style={{
                                  backgroundColor: heroSlides[currentImageIndex].secondary_button_bg || 'rgba(0,0,0,0.5)',
                                  color: heroSlides[currentImageIndex].secondary_button_text_color || '#FFFFFF',
                                  padding: `${(heroSlides[currentImageIndex].secondary_button_padding_y || 'py-2').replace('py-', '').replace('rem', '')}rem ${(heroSlides[currentImageIndex].secondary_button_padding_x || 'px-4').replace('px-', '').replace('rem', '')}rem`,
                                  fontWeight: (heroSlides[currentImageIndex].secondary_button_font || 'font-medium').includes('bold') ? 'bold' : 
                                            (heroSlides[currentImageIndex].secondary_button_font || 'font-medium').includes('medium') ? '500' : 'normal',
                                  borderRadius: '0.25rem',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.3s ease, color 0.3s ease',
                                  display: 'inline-flex',
                                  textDecoration: 'none',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  lineHeight: 1.2,
                                  verticalAlign: 'middle'
                                }}
                                onMouseOver={(e) => handleButtonMouseOver(
                                  e, 
                                  heroSlides[currentImageIndex].secondary_button_hover, 
                                  heroSlides[currentImageIndex].secondary_button_bg
                                )}
                                onMouseOut={(e) => handleButtonMouseOut(
                                  e, 
                                  heroSlides[currentImageIndex].secondary_button_bg
                                )}
                              >
                                {heroSlides[currentImageIndex].secondary_button_text}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Fallback content if no hero slides */}
                  {heroSlides.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-neutral-900/60 backdrop-blur-sm p-8 rounded-lg border border-neutral-500/20">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-neutral-50 mb-6">
                Welcome to <span className="text-neutral-400">House of Grappling</span>
              </h1>
              <p className="text-xl text-neutral-300 mb-8">
                Join HOG for world-class training in a supportive community. Whether you're a beginner or competitor, we have the program for you.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/contact" 
                            className="text-sm"
                            style={{
                              backgroundColor: '#000000',
                              color: '#FFFFFF',
                              padding: '0.5rem 1rem',
                              fontWeight: 'bold',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.3s ease, color 0.3s ease',
                              display: 'inline-flex',
                              textDecoration: 'none',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1.2,
                              verticalAlign: 'middle'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#333333';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = '#000000';
                            }}
                >
                  Start Your Journey
                </Link>
                <Link 
                  to="/schedule" 
                            className="text-sm"
                            style={{
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: '#FFFFFF',
                              padding: '0.5rem 1rem',
                              fontWeight: 'bold',
                              borderRadius: '0.25rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.3s ease, color 0.3s ease',
                              display: 'inline-flex',
                              textDecoration: 'none',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1.2,
                              verticalAlign: 'middle'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)';
                            }}
                >
                  View Schedule
                </Link>
              </div>
            </div>
          </motion.div>
                  )}
        </div>

        {/* Hero Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                  {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-neutral-50 w-8' 
                  : 'bg-neutral-50/50 hover:bg-neutral-50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
            );
          
          case 'why_choose':
            return (
              <div key="why_choose" style={getContainerStyle('why_choose')}>
                {/* Why Choose Section content */}
              </div>
            );
            
          case 'location':
            return (
              <div key="location" style={getContainerStyle('location')}>
                {/* Location Section content */}
              </div>
            );
            
          case 'featured_programs':
            return (
              <section 
                key="featured_programs" 
                className="py-20"
                style={getContainerStyle('featured_programs')}
              >
        <div className="container mx-auto px-4">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{color: getContainerStyle('featured_programs').color}}>
                      {featuredProgramsConfig.heading}
              </h2>
                    <p className="text-lg max-w-2xl mx-auto" style={{color: getContainerStyle('featured_programs').color}}>
                      {featuredProgramsConfig.subheading}
                    </p>
                  </div>

                  {loadingFeaturedConfig ? (
                    // Loading state - show 4 placeholder cards in a centered grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                      {Array(4).fill(0).map((_, index) => (
                        <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                          <div className="h-48 bg-neutral-200"></div>
                          <div className="p-6">
                            <div className="h-4 bg-neutral-200 rounded w-1/4 mb-4"></div>
                            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-neutral-200 rounded w-full mb-1"></div>
                            <div className="h-4 bg-neutral-200 rounded w-5/6"></div>
                  </div>
                </div>
                      ))}
              </div>
                  ) : featuredPrograms.length > 0 ? (
                    // Featured programs from database - centered grid with responsive row distribution
                    <div className="flex flex-wrap justify-center gap-6">
                      {featuredPrograms.map((program, index) => {
                        // Calculate the number of items per row based on screen size
                        // This ensures proper centering with flex-wrap
                        const itemClasses = "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]";
                        
                        return (
              <motion.div 
                            key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
                viewport={{ once: true }}
                            className={`${itemClasses} bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col`}
              >
                <div 
                  className="h-48 bg-cover bg-center" 
                              style={{ backgroundImage: `url(${program.image_url})` }}
                />
                            <div className="p-6 flex-grow flex flex-col">
                              <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-neutral-100 text-neutral-800">
                                  {program.level}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-neutral-100 text-neutral-800">
                                  {program.duration} min
                    </span>
                  </div>
                              <h3 className="text-xl font-bold text-neutral-900 mb-2">{program.title}</h3>
                              <p className="text-neutral-600 mb-4 flex-grow line-clamp-2">{program.description}</p>
                  <Link 
                                to={`/programs/${program.slug || ''}`}
                                className="text-neutral-900 font-medium hover:text-neutral-600 transition-colors mt-auto"
                  >
                    Learn More
                  </Link>
                </div>
              </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    // Fallback content if no featured programs
                    <div className="text-center py-12">
                      <p className="text-neutral-600">No featured programs configured yet.</p>
          </div>
                  )}

          <div className="text-center mt-12">
            <Link 
                      to="/programs"
                      className="inline-flex items-center font-bold text-lg"
                      style={{color: getContainerStyle('featured_programs').color}}
            >
                      View All Programs <ChevronRight size={20} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
            );
            
          case 'methodology':
            return (
              <section 
                key="methodology" 
                className="py-20"
                style={getContainerStyle('methodology')}
              >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4" style={{color: getContainerStyle('methodology').color}}>
              Our Training Methodology
            </h2>
                    <p className="text-lg max-w-2xl mx-auto" style={{color: getContainerStyle('methodology').color}}>
              A systematic approach to Brazilian Jiu-Jitsu that develops well-rounded practitioners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {loadingMethodology ? (
                      // Skeleton loading for methodology items
                      Array(4).fill(0).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="rounded-full bg-neutral-700 h-16 w-16 mx-auto mb-4"></div>
                          <div className="h-6 bg-neutral-700 rounded w-1/2 mx-auto mb-3"></div>
                          <div className="h-20 bg-neutral-700 rounded"></div>
                        </div>
                      ))
                    ) : (
                      // Display methodology items
                      methodology.filter(item => item.is_active).map((item) => (
                        <div key={item.id} className="text-center">
                          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full border-2" style={{borderColor: getContainerStyle('methodology').color}}>
                            {renderIcon(item.icon_name, 40, getContainerStyle('methodology').color)}
                          </div>
                          <h3 className="text-xl font-bold mb-4" style={{color: getContainerStyle('methodology').color}}>
                            {item.title}
                          </h3>
                          <p style={{color: getContainerStyle('methodology').color}}>
                            {item.description}
                          </p>
                        </div>
                      ))
                    )}
          </div>
        </div>
      </section>
            );
            
          case 'featured_products':
            return (
              <div key="featured_products" style={getContainerStyle('featured_products')}>
                {/* Shop Section content */}
              </div>
            );
            
          case 'cta':
            return (
              <section 
                key="cta" 
                className="py-20"
                style={getContainerStyle('cta')}
              >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-6" style={{color: getContainerStyle('cta').color}}>
                      {CTAConfig.heading}
            </h2>
                    <p className="text-xl mb-8" style={{color: getContainerStyle('cta').color}}>
                      {CTAConfig.subheading}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                        to={CTAConfig.primary_button_url} 
                        className="text-sm"
                        style={{
                          backgroundColor: '#000000',
                          color: '#FFFFFF',
                          padding: '0.5rem 1rem',
                          fontWeight: 'bold',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                          display: 'inline-flex',
                          textDecoration: 'none',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1.2,
                          verticalAlign: 'middle'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = '#333333';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = '#000000';
                        }}
                      >
                        {CTAConfig.primary_button_text}
              </Link>
              <Link 
                        to={CTAConfig.secondary_button_url} 
                        className="text-sm"
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: '#FFFFFF',
                          padding: '0.5rem 1rem',
                          fontWeight: 'bold',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                          display: 'inline-flex',
                          textDecoration: 'none',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: 1.2,
                          verticalAlign: 'middle'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)';
                        }}
                      >
                        {CTAConfig.secondary_button_text}
              </Link>
            </div>
          </div>
        </div>
      </section>
            );
            
          default:
            return null;
        }
      })}

      {/* If no configuration loaded, show all sections in default order */}
      {homeComponents.length === 0 && (
        <>
          {/* Hero Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Original hero section content */}
          </section>

          {/* Why Choose Section - Using the dynamic component that fetches from the admin database */}
          <div style={getContainerStyle('why_choose')}>
            {/* Why Choose Section content */}
          </div>

          {/* Location Section */}
          <div style={getContainerStyle('location')}>
            {/* Location Section content */}
          </div>

          {/* Featured Programs */}
          <section className="py-20 bg-neutral-50">
            {/* Original featured programs section content */}
          </section>

          {/* Training Methodology */}
          <section className="py-20 bg-neutral-900 text-neutral-50">
            {/* Original methodology section content */}
          </section>

          {/* Featured Products */}
          <div style={getContainerStyle('featured_products')}>
            {/* Shop Section content */}
          </div>

          {/* CTA Section */}
          <section className="py-20 bg-neutral-900">
            {/* Original CTA section content */}
          </section>
        </>
      )}
    </>
  );
};

export default HomePage;