import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase/supabaseClient';

interface InstructorType {
  id: string;
  name: string;
  title: string;
  bio: string;
  bio_summary?: string;
  image_id: string | null;
  image_url?: string;
  order: number;
  created_at: string;
  updated_at: string;
  image_hover_effect: string;
  image_size: string;
  belt?: string;
  role?: string;
  achievements?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

const InstructorsPage: React.FC = () => {
  const [instructors, setInstructors] = useState<InstructorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        // Fetch instructors from Supabase
        const { data, error } = await supabase
          .from('instructors')
          .select('*, images:image_id(url)')
          .order('order', { ascending: true });

        if (error) {
          throw error;
        }

        // Process data to match InstructorType interface
        const processedInstructors = data.map(item => ({
          ...item,
          image_url: item.images?.url || 'https://images.pexels.com/photos/7991572/pexels-photo-7991572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
          role: item.title,
          // Parse achievements from bio if needed
          achievements: ['Black Belt in Brazilian Jiu-Jitsu', 'Multiple-time competition champion']
        }));

        setInstructors(processedInstructors);
      } catch (err) {
        console.error('Error fetching instructors:', err);
        setError('Failed to load instructors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Instructors | House of Grappling</title>
        <meta name="description" content="Meet our world-class Brazilian Jiu-Jitsu instructors. Experienced black belts passionate about helping students achieve their goals." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30" 
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/7991572/pexels-photo-7991572.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
          }}
        />
        <div className="absolute inset-0 bg-background opacity-90" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-text mb-6">
              Our Instructors
            </h1>
            <p className="text-xl text-text">
              Meet our team of world-class Brazilian Jiu-Jitsu coaches
            </p>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-text mb-4">
              Expert Coaches, Proven Champions
            </h2>
            <p className="text-lg text-text">
              Our instructors are accomplished competitors and dedicated teachers who have developed champions at all levels.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neutral-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-text mb-2">Error Loading Instructors</h3>
              <p className="text-text mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-secondary-500 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-16">
              {instructors.map((instructor, index) => (
                <motion.div 
                  key={instructor.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-8 items-start`}
                >
                  {/* Instructor Image */}
                  <div className="lg:w-1/3">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img 
                        src={instructor.image_url} 
                        alt={instructor.name} 
                        className="w-full h-auto object-cover aspect-[3/4]"
                      />
                      {/* Belt Badge */}
                      {instructor.belt && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <span className="inline-block bg-secondary-500 text-text px-3 py-1 rounded-full text-sm font-medium">
                            {instructor.belt}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Instructor Details */}
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-text mb-2">
                      {instructor.name}
                    </h3>
                    <p className="text-xl text-secondary-500 font-medium mb-4">{instructor.title}</p>
                    
                    <div className="prose prose-lg text-text mb-6">
                      <p>{instructor.bio_summary || instructor.bio.substring(0, 300) + '...'}</p>
                    </div>
                    
                    {/* Achievements */}
                    {instructor.achievements && (
                      <div className="mb-6">
                        <h4 className="text-lg font-bold text-text mb-3">Achievements</h4>
                        <ul className="space-y-2">
                          {instructor.achievements.map((achievement, i) => (
                            <li key={i} className="flex items-start">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary-500 mt-2 mr-2"></span>
                              <span className="text-text">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Social Media */}
                    {instructor.socialMedia && (
                      <div className="flex items-center space-x-4">
                        {instructor.socialMedia.instagram && (
                          <a 
                            href={instructor.socialMedia.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-text hover:text-secondary-500 transition-colors"
                          >
                            <Instagram size={24} />
                          </a>
                        )}
                        {instructor.socialMedia.facebook && (
                          <a 
                            href={instructor.socialMedia.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-text hover:text-secondary-500 transition-colors"
                          >
                            <Facebook size={24} />
                          </a>
                        )}
                        {instructor.socialMedia.twitter && (
                          <a 
                            href={instructor.socialMedia.twitter} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-text hover:text-secondary-500 transition-colors"
                          >
                            <Twitter size={24} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Training Philosophy */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-text mb-8 text-center">
              Our Training Philosophy
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold text-text mb-4">Combat Effectiveness</h3>
                <p className="text-text mb-3">
                  We emphasize techniques that work in real combat situations. Every move is pressure-tested through live sparring to ensure effectiveness.
                </p>
                <p className="text-text">
                  Our curriculum focuses on high-percentage techniques that have been proven in both competition and self-defense scenarios.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold text-text mb-4">Systematic Progression</h3>
                <p className="text-text mb-3">
                  Our structured curriculum ensures consistent progress. Students develop a strong foundation before advancing to more complex techniques.
                </p>
                <p className="text-text">
                  Regular feedback and assessment help students identify areas for improvement and track their development.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold text-text mb-4">Competition Mindset</h3>
                <p className="text-text mb-3">
                  We foster a competitive spirit that drives continuous improvement. Our training prepares students for both tournament success and real-world challenges.
                </p>
                <p className="text-text">
                  Regular sparring and competition preparation develop mental toughness and technical precision.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-background p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold text-text mb-4">Continuous Evolution</h3>
                <p className="text-text mb-3">
                  We stay at the forefront of BJJ development, incorporating proven innovations while maintaining fundamental principles.
                </p>
                <p className="text-text">
                  Our instructors regularly train with other high-level practitioners to bring new perspectives to our students.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Training CTA */}
      <section className="py-16 bg-secondary-500">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-text mb-6">
              Train with Champions
            </h2>
            <p className="text-xl text-text/90 mb-8">
              Accelerate your progress with private lessons from our expert instructors.
            </p>
            <Link 
              to="/contact" 
              className="bg-background hover:bg-neutral-800 text-text font-bold py-3 px-8 rounded-md transition-colors text-lg inline-block"
            >
              Schedule Private Training
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstructorsPage;