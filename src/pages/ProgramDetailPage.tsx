import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase/supabaseClient';
import { Clock, Users, ChevronLeft, Award, Calendar, ShieldCheck, Brain, Shield, Target, Dumbbell } from 'lucide-react';
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
  category?: ProgramCategory;
  background_color?: string;
  text_color?: string;
  instructor?: string;
  icon?: string;
  icon_color?: string;
  use_icon?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  'Award': <Award size={64} />,
  'Calendar': <Calendar size={64} />,
  'Users': <Users size={64} />,
  'ShieldCheck': <ShieldCheck size={64} />,
  'Brain': <Brain size={64} />,
  'Shield': <Shield size={64} />,
  'Target': <Target size={64} />,
  'Dumbbell': <Dumbbell size={64} />
};

const ProgramDetailPage: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const defaultImage = '/images/Logo hog 2 - 1.png';

  useEffect(() => {
    const fetchProgram = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);

      try {
        // First try to fetch with categories
        let { data, error } = await supabase
          .from('programs')
          .select('*, category:category_id(*)')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        // If there's an error with the join, try without it
        if (error && error.message.includes('does not exist')) {
          console.log('Category table does not exist, fetching program without category join');
          const result = await supabase
            .from('programs')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single();
          
          data = result.data;
          error = result.error;
        }

        if (error) throw error;
        
        if (!data) {
          throw new Error('Program not found');
        }

        setProgram(data);
      } catch (error) {
        console.error('Error fetching program:', error);
        setError(error instanceof Error ? error.message : 'Failed to load program');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  const renderProgramIcon = () => {
    if (!program?.icon) return null;
    return (
      <div className="flex justify-center my-6">
        <div className="p-6 rounded-full bg-background" style={{ color: program.icon_color || 'var(--color-text)' }}>
          {iconMap[program.icon] || <Award size={64} />}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Program Not Found</h2>
          <p className="text-text mb-4">{error || 'The requested program could not be found.'}</p>
          <Link 
            to="/programs"
            className="px-4 py-2 bg-background text-white rounded-md hover:bg-neutral-700"
          >
            View All Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{program.title} | House of Grappling</title>
        <meta name="description" content={program.excerpt} />
      </Helmet>

      <div 
        className="pt-20"
        style={{
          backgroundColor: program.background_color || '#ffffff',
          color: program.text_color || 'var(--color-text)',
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link 
              to="/programs"
              className="inline-flex items-center text-text hover:text-neutral-900"
            >
              <ChevronLeft size={16} className="mr-1" /> Back to Programs
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-lg overflow-hidden shadow-lg"
              >
                {program.use_icon && program.icon ? (
                  <div className="h-64 flex items-center justify-center bg-background">
                    {renderProgramIcon()}
                  </div>
                ) : (
                  <img 
                    src={program.image_url || defaultImage} 
                    alt={program.title} 
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {program.category && (
                <span 
                  className="text-sm font-semibold inline-block py-1 px-2 rounded mb-2"
                  style={{ 
                    backgroundColor: `${program.category.color}20`, 
                    color: program.category.color 
                  }}
                >
                  {program.category.name}
                </span>
              )}

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{program.title}</h1>
              
              <p className="text-lg mb-6">{program.excerpt}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Clock size={20} className="mr-2" />
                  <span>{program.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <Users size={20} className="mr-2" />
                  <span>{program.level}</span>
                </div>
                {program.instructor && (
                  <div className="flex items-center col-span-2">
                    <Award size={20} className="mr-2" />
                    <span>Instructor: {program.instructor}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: program.content }}
          />

          <div className="mb-12">
            <Link 
              to="/contact"
              className="inline-block px-6 py-3 bg-background text-white rounded-md hover:bg-neutral-700 transition-colors"
            >
              Contact Us About This Program
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramDetailPage; 