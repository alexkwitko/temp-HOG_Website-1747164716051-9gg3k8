import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Users, BrainCircuit, Filter, Search, X, Award, Calendar, ShieldCheck, Brain, Shield, Target, Dumbbell } from 'lucide-react';
import { supabase } from '../lib/supabase/supabaseClient';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface ProgramCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
}

interface Program {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  level: string;
  duration: number;
  image_url: string;
  is_featured: boolean;
  order: number;
  is_active: boolean;
  category_id: string;
  background_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  button_text: string;
  button_hover_color?: string;
  show_button: boolean;
  icon: string;
  icon_color?: string;
  use_icon?: boolean;
  animation_type?: string;
  hover_effect?: string;
  layout_style?: string;
  content_alignment?: string;
  title_alignment?: string;
  image_position?: string;
  category?: ProgramCategory;
}

type ProgramDataItem = {
  id: string;
  title?: string;
  excerpt?: string;
  content?: string;
  slug?: string;
  level?: string;
  duration?: number;
  image_url?: string;
  is_featured?: boolean;
  order?: number;
  is_active?: boolean;
  category_id?: string;
  background_color?: string;
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
  button_text?: string;
  button_hover_color?: string;
  show_button?: boolean;
  icon?: string;
  icon_color?: string;
  use_icon?: boolean;
  animation_type?: string;
  hover_effect?: string;
  layout_style?: string;
  content_alignment?: string;
  title_alignment?: string;
  image_position?: string;
  category?: ProgramCategory;
  name?: string;
  description?: string;
  instructor?: string;
  has_parallax?: boolean;
  hero_image_url?: string;
  overlay_color?: string;
  overlay_opacity?: number;
  hero_text_color?: string;
};

const iconMap: Record<string, React.ReactNode> = {
  'Award': <Award size={48} />,
  'Calendar': <Calendar size={48} />,
  'Users': <Users size={48} />,
  'ShieldCheck': <ShieldCheck size={48} />,
  'Brain': <Brain size={48} />,
  'Shield': <Shield size={48} />,
  'Target': <Target size={48} />,
  'Dumbbell': <Dumbbell size={48} />
};

const defaultProgramImage = '/images/Logo hog 2 - 1.png';

const ProgramsPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch programs with category join
        const { data: programsData, error: programsError } = await supabase
          .from('programs')
          .select('*, category:category_id(*)')
          .eq('is_active', true)
          .order('order');

        if (programsError) throw programsError;

        // Process the programs data with defaults
        const processedPrograms = (programsData || []).map((program: ProgramDataItem) => ({
          id: program.id,
          title: program.title || 'Untitled Program',
          excerpt: program.excerpt || '',
          content: program.content || '',
          slug: program.slug || '',
          level: program.level || 'All Levels',
          duration: program.duration || 60,
          image_url: program.image_url || defaultProgramImage,
          is_featured: program.is_featured || false,
          order: program.order || 0,
          is_active: program.is_active !== false, // default to true
          category_id: program.category_id || '',
          background_color: program.background_color || '#ffffff',
          text_color: program.text_color || 'var(--color-text)',
          button_color: program.button_color || 'var(--color-text)',
          button_text_color: program.button_text_color || '#ffffff',
          button_text: program.button_text || 'Learn More',
          button_hover_color: program.button_hover_color,
          show_button: program.show_button !== false, // default to true
          icon: program.icon || '',
          icon_color: program.icon_color || 'var(--color-text)',
          use_icon: program.use_icon === true,
          animation_type: program.animation_type || 'none',
          hover_effect: program.hover_effect || 'none',
          layout_style: program.layout_style || 'standard',
          content_alignment: program.content_alignment || 'left',
          title_alignment: program.title_alignment || 'left',
          image_position: program.image_position || 'top',
          category: program.category
        }));

        setPrograms(processedPrograms);
        setFilteredPrograms(processedPrograms);

        // Extract unique levels
        const uniqueLevels = [...new Set(processedPrograms.map((program: Program) => program.level))].filter(Boolean);
        setLevels(uniqueLevels);

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('program_categories')
          .select('*')
          .order('name');

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
          // Don't throw error here, just set empty categories to allow rendering without them
          setCategories([]);
        } else {
          setCategories(categoriesData || []);
        }
      } catch (error: unknown) {
        console.error('Error fetching data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load programs';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter programs based on selected category, level, and search query
    let result = programs;

    if (selectedCategory) {
      result = result.filter(program => program.category_id === selectedCategory);
    }

    if (selectedLevel) {
      result = result.filter(program => program.level === selectedLevel);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        program =>
          program.title.toLowerCase().includes(query) ||
          program.excerpt.toLowerCase().includes(query) ||
          program.content.toLowerCase().includes(query)
      );
    }

    setFilteredPrograms(result);
  }, [selectedCategory, selectedLevel, searchQuery, programs]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedLevel('');
    setSearchQuery('');
  };

  const renderProgramIcon = (program: Program) => {
    if (!program.icon) return null;
    
    const IconComponent = iconMap[program.icon] || <Award size={48} />;
    return (
      <div style={{ color: program.icon_color || program.text_color }}>
        {IconComponent}
      </div>
    );
  };

  const renderProgramCard = (program: Program) => {
    const cardStyles = {
      backgroundColor: program.background_color || '#ffffff',
      color: program.text_color || 'var(--color-text)',
      textAlign: program.content_alignment as 'left' | 'center' | 'right' || 'left',
      transform: program.hover_effect === 'lift' ? 'translateY(0)' : 'none',
      transition: 'all 0.3s ease',
    };

    const imageStyles = {
      height: '200px',
      objectFit: 'cover' as const,
      width: '100%',
    };

    const buttonStyles = {
      backgroundColor: program.button_color || 'var(--color-text)',
      color: program.button_text_color || '#ffffff',
    };

    const hoverEffects: Record<string, string> = {
      'lift': 'hover:-translate-y-2',
      'grow': 'hover:scale-105',
      'shadow': 'hover:shadow-xl',
      'glow': 'hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]',
      'none': ''
    };

    const safeHoverEffect = program.hover_effect || 'none';
    const hoverEffectClass = hoverEffects[safeHoverEffect as keyof typeof hoverEffects] || '';

    return (
      <motion.div
        key={program.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`rounded-lg overflow-hidden shadow-lg flex flex-col h-full ${hoverEffectClass}`}
        style={cardStyles}
      >
        {program.use_icon && program.icon ? (
          <div className="h-48 flex items-center justify-center bg-background">
            {renderProgramIcon(program)}
          </div>
        ) : program.image_url ? (
          <div className="overflow-hidden">
            <img 
              src={program.image_url} 
              alt={program.title} 
              className="w-full transition-transform duration-300 hover:scale-105"
              style={imageStyles}
              onError={(e) => {
                e.currentTarget.src = defaultProgramImage;
              }}
            />
          </div>
        ) : (
          <div className="h-48 overflow-hidden">
            <img 
              src={defaultProgramImage} 
              alt={program.title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <div className="p-6 flex-grow flex flex-col">
          {program.category && (
            <span 
              className="text-xs font-semibold inline-block py-1 px-2 rounded mb-2"
              style={{ 
                backgroundColor: `${program.category.color}20`, 
                color: program.category.color 
              }}
            >
              {program.category.name}
            </span>
          )}
          <h3 className="text-xl font-bold mb-2">{program.title}</h3>
          <p className="mb-4 flex-grow">{program.excerpt}</p>
          <div className="flex items-center mb-2">
            <Clock size={16} className="mr-2" />
            <span>{program.duration} minutes</span>
          </div>
          <div className="flex items-center mb-4">
            <Users size={16} className="mr-2" />
            <span>{program.level}</span>
          </div>
          {program.show_button && (
            <Link 
              to={`/programs/${program.slug}`} 
              className="mt-2 px-4 py-2 rounded font-medium transition-colors inline-block text-center"
              style={buttonStyles}
              onMouseOver={(e) => {
                if (program.button_hover_color) {
                  e.currentTarget.style.backgroundColor = program.button_hover_color;
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = program.button_color || 'var(--color-text)';
              }}
            >
              {program.button_text}
            </Link>
          )}
        </div>
      </motion.div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <BrainCircuit size={48} className="mx-auto text-text mb-4" />
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-text mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-background text-white rounded-md hover:bg-neutral-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Programs | House of Grappling</title>
        <meta name="description" content="Explore our diverse range of programs designed for all skill levels." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative pt-20 pb-10 md:pt-32 md:pb-16 bg-background">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-fixed" 
          style={{ 
            backgroundImage: "url('/images/programs-header.jpg')"
          }} 
        />
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: 'var(--color-text)',
            opacity: 0.7
          }} 
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Our Programs
            </h1>
            <p className="text-xl text-text max-w-3xl">
              Explore our diverse range of programs designed to help you achieve your fitness goals.
            </p>
          </div>
        </div>
      </div>

      <section className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">Find Your Program</h2>
            <p className="text-text">
              From beginner to advanced, find the perfect program for your fitness journey.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-neutral-500"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-text" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-text hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-background"
            >
              <Filter size={18} className="mr-2" /> Filters
              {(selectedCategory || selectedLevel) && (
                <span className="ml-2 bg-background text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {(selectedCategory ? 1 : 0) + (selectedLevel ? 1 : 0)}
                </span>
              )}
            </button>
            
            {(selectedCategory || selectedLevel) && (
              <button
                onClick={clearFilters}
                className="text-sm text-text hover:text-neutral-900 flex items-center px-2 py-2"
              >
                <X size={14} className="mr-1" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Filter Bar - replaces the sidebar */}
        {showFilters && (
          <div className="bg-background p-4 rounded-lg mb-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row gap-6 justify-between">
              {/* Categories filter */}
              {categories.length > 0 && (
                <div className="md:flex-1">
                  <h4 className="font-medium mb-2">Category</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-neutral-800 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Levels filter */}
              {levels.length > 0 && (
                <div className="md:flex-1">
                  <h4 className="font-medium mb-2">Level</h4>
                  <div className="flex flex-wrap gap-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() => setSelectedLevel(selectedLevel === level ? '' : level)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedLevel === level
                            ? 'bg-neutral-800 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Programs Grid */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="text-center py-12">
              <BrainCircuit size={48} className="mx-auto text-text mb-4" />
              <h3 className="text-xl font-semibold mb-2">No programs found</h3>
              <p className="text-text mb-4">Try adjusting your filters or search query.</p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-background text-white rounded-md hover:bg-neutral-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map(renderProgramCard)}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProgramsPage; 