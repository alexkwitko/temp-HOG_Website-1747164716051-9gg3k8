import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase/supabaseClient';

interface LocationData {
  id: string;
  heading: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  hours_weekday: string;
  hours_saturday: string;
  hours_sunday: string;
  button_text: string;
  button_url: string;
  map_embed_url: string;
  use_custom_image: boolean;
  image_url: string | null;
  bg_color: string;
  text_color: string;
}

const LocationSection: React.FC = () => {
  // Access global settings
  // const { settings } = useSiteSettings(); // Removed as unused

  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('LocationSection: Fetching data...');
        
        // Try to get the location data from the database
        const { data, error } = await supabase
          .from('location_section')
          .select('*')
          .limit(1)
          .single();
        
        if (error) {
          console.error('Error fetching location data:', error);
          
          if (error.message.includes('relation "location_section" does not exist')) {
            throw new Error('Location section table does not exist. Please run the create_location_section.sql script.');
          } else if (error.code === 'PGRST116') {
            throw new Error('No location data found. Please add a record to the location_section table.');
          } else {
            throw error;
          }
        }
        
        if (data) {
          console.log('Location data found:', data);
          setLocationData(data);
        }
      } catch (err) {
        console.error('Error in location data fetch:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocationData();
    
    // Set up a refresh timer - refresh every 5 minutes
    const refreshTimer = setInterval(() => {
      fetchLocationData();
    }, 5 * 60 * 1000);
    
    // Handle visibility changes (when user returns to the tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchLocationData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(refreshTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-neutral-900 text-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-50 mb-4"></div>
          <p>Loading location information...</p>
        </div>
      </section>
    );
  }

  if (!locationData) {
    return (
      <section className="py-20 bg-neutral-900 text-neutral-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-400 mb-4">Could not load location information.</p>
          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${locationData.bg_color} ${locationData.text_color}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {locationData.heading}
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin size={24} className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Address</h3>
                  <p className={`${locationData.text_color.replace('text-', 'text-opacity-60 text-')}`}>
                    {locationData.address_line1}<br />
                    {locationData.address_line2 && (
                      <>{locationData.address_line2}<br /></>
                    )}
                    {locationData.city}, {locationData.state} {locationData.zip}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock size={24} className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Hours</h3>
                  <ul className={`${locationData.text_color.replace('text-', 'text-opacity-60 text-')} space-y-1`}>
                    <li>{locationData.hours_weekday}</li>
                    <li>{locationData.hours_saturday}</li>
                    <li>{locationData.hours_sunday}</li>
                  </ul>
                </div>
              </div>
              <Link 
                to={locationData.button_url}
                className="inline-block bg-red-600 hover:bg-red-700 text-neutral-50 font-bold py-3 px-6 rounded-md transition-colors mt-4"
              >
                {locationData.button_text}
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:w-1/2 h-[400px] w-full rounded-lg overflow-hidden shadow-lg"
          >
            {locationData.use_custom_image && locationData.image_url ? (
              <img 
                src={locationData.image_url} 
                alt={`${locationData.city} location`}
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe 
                src={locationData.map_embed_url}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="w-full h-full"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection; 