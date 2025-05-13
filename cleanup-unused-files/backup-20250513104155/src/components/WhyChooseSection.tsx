import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';
import { Award, Users, Calendar, ShieldCheck, Brain, Shield, Target, Dumbbell } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  icon_name?: string;
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
  icon_color?: string;
}

interface SiteConfig {
  key: string;
  value: string;
}

// Map icon names to Lucide icon components
const iconMap: Record<string, (color?: string) => React.ReactNode> = {
  'Award': (color = "var(--color-text)") => <Award className="h-10 w-10" style={{ color }} />,
  'Users': (color = "var(--color-text)") => <Users className="h-10 w-10" style={{ color }} />,
  'Calendar': (color = "var(--color-text)") => <Calendar className="h-10 w-10" style={{ color }} />,
  'ShieldCheck': (color = "var(--color-text)") => <ShieldCheck className="h-10 w-10" style={{ color }} />,
  'Brain': (color = "var(--color-text)") => <Brain className="h-10 w-10" style={{ color }} />,
  'Shield': (color = "var(--color-text)") => <Shield className="h-10 w-10" style={{ color }} />,
  'Target': (color = "var(--color-text)") => <Target className="h-10 w-10" style={{ color }} />,
  'Dumbbell': (color = "var(--color-text)") => <Dumbbell className="h-10 w-10" style={{ color }} />,
};

const WhyChooseSection: React.FC = () => {
  // Access global settings
  const { settings } = useSiteSettings();

  const [cards, setCards] = useState<WhyChooseCard[]>([]);
  const [heading, setHeading] = useState('Why Choose House of Grappling?');
  const [subheading, setSubheading] = useState('We offer a world-class training environment focused on technical excellence, personal growth, and community.');
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  // Function to fetch data with retry logic
  const fetchData = async (retry = 0) => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Check if Supabase client is properly initialized
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }

      console.log('WhyChooseSection: Fetching data at', new Date().toISOString());
      
      // Fetch site config for heading and subheading
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('*')
        .in('key', ['why_choose_heading', 'why_choose_subheading']);
      
      if (configError) {
        console.warn('Error fetching site config:', configError);
        throw configError;
      }

      if (configData && configData.length > 0) {
        const headingConfig = configData.find((item: SiteConfig) => item.key === 'why_choose_heading');
        const subheadingConfig = configData.find((item: SiteConfig) => item.key === 'why_choose_subheading');
        
        if (headingConfig) setHeading(headingConfig.value);
        if (subheadingConfig) setSubheading(subheadingConfig.value);
      }
      
      // Fetch cards
      const { data: cardsData, error: cardsError } = await supabase
        .from('why_choose_cards')
        .select('*')
        .eq('is_active', true)
        .order('order');
      
      if (cardsError) {
        throw cardsError;
      }
      
      console.log('Found cards:', cardsData?.length);
      if (cardsData && cardsData.length > 0) {
        cardsData.forEach((card, index) => {
          console.log(`Card ${index + 1} (${card.id}):`);
          console.log(`  Title: ${card.title}`);
          console.log(`  Use icon: ${card.use_icon}`);
          if (card.use_icon) {
            console.log(`  Icon: ${card.icon_name}`);
            console.log(`  Icon color: ${card.icon_color}`);
          } else if (card.image_url) {
            console.log(`  Image URL: ${card.image_url}`);
          } else {
            console.log(`  Warning: Card has no icon or image`);
          }
        });
      } else {
        console.log('No active cards found');
      }
      
      setCards(cardsData || []);
      setLastRefresh(Date.now());
      setRetryCount(0); // Reset retry count on successful fetch
    } catch (err) {
      console.error('Error fetching why choose data:', err);
      
      // Implement retry logic
      if (retry < MAX_RETRIES) {
        console.log(`Retrying fetch (attempt ${retry + 1} of ${MAX_RETRIES})...`);
        setTimeout(() => {
          fetchData(retry + 1);
        }, RETRY_DELAY);
        return;
      }
      
      setHasError(true);
      setRetryCount(retry);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial mount
  useEffect(() => {
    fetchData();
    
    // Set up refresh on visibility change (when user comes back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Check if we should refresh every minute
    const refreshTimer = setInterval(() => {
      const now = Date.now();
      // If it's been more than 5 minutes since last refresh, fetch data again
      if (now - lastRefresh > 5 * 60 * 1000) {
        fetchData();
      }
    }, 60 * 1000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(refreshTimer);
    };
  }, [lastRefresh]);
  
  // Fallback cards if database fetch fails
  const fallbackCards: WhyChooseCard[] = [
    {
      id: '1',
      title: 'Expert Instructors',
      description: 'Learn from championship-level black belts with decades of combined experience.',
      icon_name: 'Award',
      image_url: '',
      image_id: undefined,
      button_text: undefined,
      button_url: undefined,
      button_bg: undefined,
      button_text_color: undefined,
      card_bg: undefined,
      card_text_color: undefined,
      use_icon: true,
      order: 1,
      is_active: true,
      icon_color: 'var(--color-text)'
    },
    {
      id: '2',
      title: 'Supportive Community',
      description: 'Train in a welcoming, ego-free environment focused on mutual growth and respect.',
      icon_name: 'Users',
      image_url: '',
      image_id: undefined,
      button_text: undefined,
      button_url: undefined,
      button_bg: undefined,
      button_text_color: undefined,
      card_bg: undefined,
      card_text_color: undefined,
      use_icon: true,
      order: 2,
      is_active: true,
      icon_color: 'var(--color-text)'
    },
    {
      id: '3',
      title: 'Flexible Schedule',
      description: 'With 40+ classes weekly, find training times that fit your busy lifestyle.',
      icon_name: 'Calendar',
      image_url: '',
      image_id: undefined,
      button_text: undefined,
      button_url: undefined,
      button_bg: undefined,
      button_text_color: undefined,
      card_bg: undefined,
      card_text_color: undefined,
      use_icon: true,
      order: 3,
      is_active: true,
      icon_color: 'var(--color-text)'
    }
  ];

  // If still loading, show a loading indicator
  if (isLoading && cards.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-text">Loading content...</p>
        </div>
      </section>
    );
  }

  // Show error state if there was a problem fetching data
  if (hasError && cards.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text mb-4">
            {retryCount >= MAX_RETRIES 
              ? "Unable to load content after multiple attempts" 
              : "Unable to load content"}
          </p>
          <button 
            onClick={() => fetchData()}
            className="px-4 py-2 bg-background text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Use fallback if loading fails or cards are empty
  const displayCards = cards.length > 0 ? cards : fallbackCards;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {heading}
          </h2>
          <p className="text-lg max-w-3xl mx-auto text-text">
            {subheading}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCards.map(card => (
            <div 
              key={card.id} 
              className="flex flex-col p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all"
              style={{
                backgroundColor: card.card_bg || 'white',
                color: card.card_text_color || 'inherit',
              }}
            >
              <div className="flex items-center mb-4">
                {card.use_icon && card.icon_name ? (
                  <div className="mr-4">
                    {iconMap[card.icon_name]?.(card.icon_color) || 
                      <Award className="h-10 w-10" style={{ color: card.icon_color || 'var(--color-text)' }} />}
                  </div>
                ) : card.image_url ? (
                  <div className="mr-4 h-16 w-16 overflow-hidden rounded-full">
                    <img 
                      src={card.image_url} 
                      alt={card.title} 
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <h3 className="text-xl font-bold">{card.title}</h3>
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
    </section>
  );
};

export default WhyChooseSection;