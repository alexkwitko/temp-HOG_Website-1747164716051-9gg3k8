import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProgramsTable() {
  try {
    // First try to get a single row to check the structure
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Error querying programs table:', error);
    } else {
      console.log('Programs table structure:');
      if (data && data.length > 0) {
        // Display all column names
        console.log('Columns:', Object.keys(data[0]));
        console.log('Sample data:', data[0]);
      } else {
        console.log('No data in programs table');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkProgramsTable(); 