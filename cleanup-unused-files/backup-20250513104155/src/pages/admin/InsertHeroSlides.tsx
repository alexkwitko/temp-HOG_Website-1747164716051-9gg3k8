import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase/supabaseClient';

// Define the HeroSlide interface to fix the 'any' type error
interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image_url?: string;
  button_text?: string;
  button_url?: string;
  order: number;
  is_active?: boolean;
}

const InsertHeroSlides: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  useEffect(() => {
    // Check for existing slides when component mounts
    checkHeroSlidesTable();
  }, []);

  const checkHeroSlidesTable = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const { data, error: checkError } = await supabase
        .from('hero_slides')
        .select('*');
      
      if (checkError) {
        if (checkError.code === '42P01') { // Table doesn't exist
          setError('The hero_slides table does not exist in the database.');
        } else {
          throw checkError;
        }
        return;
      }
      
      setSlides(data || []);
      setMessage(`Found ${data?.length || 0} hero slides in the database.`);
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Hero Slides Management</h2>
        <p className="text-text">Check and manage hero slides for the homepage</p>
      </div>
      
      {error && (
        <div className="bg-background border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-text" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-text">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {message && (
        <div className="bg-background border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-text" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-text">{message}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex space-x-4 mb-8">
            <button
              onClick={checkHeroSlidesTable}
              disabled={loading}
              className="bg-background hover:bg-neutral-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check Hero Slides'}
            </button>
            <a 
              href="/admin/hero-config"
              className="bg-background hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-flex items-center"
            >
              Go to Hero Config
            </a>
          </div>
          
          {slides.length > 0 && (
            <>
              <h3 className="text-lg font-medium mb-4">Current Hero Slides</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-background">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Order</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Title</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Active</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text uppercase tracking-wider">Image</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {slides.map((slide) => (
                      <tr key={slide.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">{slide.order}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text">{slide.title}</div>
                          <div className="text-sm text-text">{slide.subtitle}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${slide.is_active ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-800'}`}>
                            {slide.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text">
                          <div className="h-10 w-16 bg-cover bg-center rounded" style={{ backgroundImage: `url(${slide.image_url})` }} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <p className="text-text text-sm">
                  You can manage these slides in detail using the <a href="/admin/hero-config" className="text-text hover:underline">Hero Config Page</a>.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default InsertHeroSlides; 