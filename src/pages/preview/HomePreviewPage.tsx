import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HomePage from '../HomePage';
import { supabase } from '../../lib/supabase/supabaseClient';

// This component is a thin wrapper around the HomePage component
// that ensures all styling updates are fetched from the database
// before rendering the preview
const HomePreviewPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const timestamp = queryParams.get('t');
  
  useEffect(() => {
    // Force a server cache refresh when previewing
    const refreshCache = async () => {
      try {
        await supabase.auth.refreshSession();
        console.log('Session refreshed for preview');
      } catch (error) {
        console.error('Error refreshing session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    refreshCache();
  }, [timestamp]); // Re-fetch when timestamp changes
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text">Loading preview...</p>
        </div>
      </div>
    );
  }
  
  return <HomePage />;
};

export default HomePreviewPage; 