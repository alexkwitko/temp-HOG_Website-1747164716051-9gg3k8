import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase/supabaseClient';

interface DataItem {
  id: number;
  name: string;
  [key: string]: string | number | boolean | null; // More specific type for additional fields
}

export function SupabaseExample() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Replace 'your_table' with your actual table name
        const { data, error } = await supabase
          .from('your_table')
          .select('*');
          
        if (error) throw error;
        setData(data || []);
      } catch (err: unknown) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-text">Error: {error}</div>;
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Supabase Data</h2>
      {data.length === 0 ? (
        <p>No data found. Make sure your Supabase project is set up correctly.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((item) => (
            <li key={item.id} className="p-2 border rounded">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 