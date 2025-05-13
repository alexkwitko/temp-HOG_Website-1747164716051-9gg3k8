import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase/supabaseClient';
import { useComponentGlobalStyles } from '../lib/hooks/useComponentGlobalStyles';

interface ProgramType {
  id: string;
  title: string;
  description: string;
  slug?: string;
  level: string;
  duration: number;
  image_url: string;
  is_featured: boolean;
  order: number;
}

interface FeaturedProgramsConfig {
  id?: string;
  heading: string;
  subheading: string;
  featured_program_ids: string[];
}

const FeaturedPrograms: React.FC = () => {
  const [programs, setPrograms] = useState<ProgramType[]>([]);
  const [featuredProgramsConfig, setFeaturedProgramsConfig] = useState<FeaturedProgramsConfig>({
    heading: 'Featured Programs',
    subheading: 'From beginner-friendly fundamentals to advanced competition training, find the perfect program for your journey.',
    featured_program_ids: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get global styles
  const { buttonStyles, fontStyles, colorStyles, isLoading: loadingStyles } = useComponentGlobalStyles('FeaturedPrograms');
  
  // States for button hover effects
  const [primaryButtonHovered, setPrimaryButtonHovered] = useState(false);
  
  // Fetch featured programs config and programs data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch config
        const { data: configData, error: configError } = await supabase
          .from('featured_programs_config')
          .select('*')
          .single();
        
        if (configError && configError.code !== 'PGRST116') {
          console.error('Error fetching featured programs config:', configError);
          throw configError;
        }
        
        if (configData) {
          setFeaturedProgramsConfig(configData);
        }
        
        // Fetch all programs
        const { data: programsData, error: programsError } = await supabase
          .from('programs')
          .select('*')
          .order('order');
        
        if (programsError) {
          console.error('Error fetching programs:', programsError);
          throw programsError;
        }
        
        setPrograms(programsData || []);
      } catch (err) {
        console.error('Error loading featured programs:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Listen for global settings changes
    const handleSettingsChange = () => {
      console.log('FeaturedPrograms: Global settings changed, refreshing component');
      // Just trigger a re-render, we don't need to reload data
      setLoading(prev => !prev);
    };
    
    window.addEventListener('globalSettingsChanged', handleSettingsChange);
    
    return () => {
      window.removeEventListener('globalSettingsChanged', handleSettingsChange);
    };
  }, []);
  
  // Filter to get only featured programs
  const featuredPrograms = featuredProgramsConfig.featured_program_ids.length > 0
    ? programs.filter(program => featuredProgramsConfig.featured_program_ids.includes(program.id))
    : programs.filter(program => program.is_featured).slice(0, 4);
  
  // Generate styles from global settings
  const sectionStyle = {
    backgroundColor: `var(--color-palette-light, ${colorStyles.paletteId === 'hog_brand' ? 'var(--color-accent)' : 'var(--color-background)'})`,
    color: `var(--color-palette-text-dark, var(--color-secondary))`,
    fontFamily: fontStyles.bodyFont,
  };
  
  const headingStyle = {
    fontFamily: fontStyles.headingFont,
    color: `var(--color-palette-primary, var(--color-secondary))`,
  };
  
  const subheadingStyle = {
    fontFamily: fontStyles.bodyFont,
    color: `var(--color-palette-secondary, #334155)`,
  };
  
  const buttonStyle = {
    backgroundColor: primaryButtonHovered 
      ? buttonStyles.primary.hoverBackground 
      : buttonStyles.primary.background,
    color: primaryButtonHovered 
      ? buttonStyles.primary.hoverTextColor 
      : buttonStyles.primary.textColor,
    fontFamily: fontStyles.primaryFont,
    padding: `${buttonStyles.primary.paddingY} ${buttonStyles.primary.paddingX}`,
    borderRadius: buttonStyles.primary.borderRadius,
    border: `${buttonStyles.primary.borderWidth} solid ${buttonStyles.primary.borderColor}`,
    fontWeight: buttonStyles.primary.fontWeight,
    transition: `all ${buttonStyles.shared.transitionSpeed} ease`,
  };
  
  const viewAllLinkStyle = {
    color: `var(--color-palette-primary, var(--color-secondary))`,
    fontFamily: fontStyles.primaryFont,
    fontWeight: 'bold',
  };
  
  const programCardStyle = {
    backgroundColor: `white`,
    borderRadius: buttonStyles.primary.borderRadius,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  };

  if (loading || loadingStyles) {
    return (
      <section style={sectionStyle} className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-4"></div>
          <p>Loading featured programs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={sectionStyle} className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text mb-4">Error loading featured programs.</p>
          <p className="text-sm text-text">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section style={sectionStyle} className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 style={headingStyle} className="text-3xl font-bold mb-4">
            {featuredProgramsConfig.heading}
          </h2>
          <p style={subheadingStyle} className="text-lg max-w-3xl mx-auto">
            {featuredProgramsConfig.subheading}
          </p>
        </div>

        {featuredPrograms.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {featuredPrograms.map((program, index) => {
              // Calculate responsive width classes
              const itemClasses = "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)]";
              
              return (
                <motion.div 
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
                  viewport={{ once: true }}
                  className={`${itemClasses} flex flex-col`}
                  style={programCardStyle}
                >
                  <div 
                    className="h-48 bg-cover bg-center" 
                    style={{ backgroundImage: `url(${program.image_url})` }}
                  />
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-background text-text">
                        {program.level}
                      </span>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-background text-text">
                        {program.duration} min
                      </span>
                    </div>
                    <h3 style={headingStyle} className="text-xl font-bold mb-2">{program.title}</h3>
                    <p style={subheadingStyle} className="mb-4 flex-grow line-clamp-2">{program.description}</p>
                    <Link 
                      to={`/programs/${program.slug || ''}`}
                      style={buttonStyle}
                      onMouseEnter={() => setPrimaryButtonHovered(true)}
                      onMouseLeave={() => setPrimaryButtonHovered(false)}
                      className="inline-block text-center mt-auto rounded"
                    >
                      Learn More
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p style={subheadingStyle}>No featured programs configured yet.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/programs"
            style={viewAllLinkStyle}
            className="inline-flex items-center text-lg"
          >
            View All Programs <ChevronRight size={20} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms; 