import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHomeComponents() {
  try {
    console.log('Checking home_page_components table...');
    const { data: pageComponents, error: pageError } = await supabase
      .from('home_page_components')
      .select('*');

    if (pageError) {
      console.error('Error fetching home_page_components:', pageError);
    } else {
      console.log(`Found ${pageComponents?.length || 0} rows in home_page_components`);
      console.log(JSON.stringify(pageComponents, null, 2));
    }

    console.log('\nChecking home_components table...');
    const { data: components, error: componentsError } = await supabase
      .from('home_components')
      .select('*');

    if (componentsError) {
      console.error('Error fetching home_components:', componentsError);
    } else {
      console.log(`Found ${components?.length || 0} rows in home_components`);
      console.log(JSON.stringify(components, null, 2));
    }

    // Check hero slides too
    console.log('\nChecking hero_slides table...');
    const { data: heroSlides, error: heroError } = await supabase
      .from('hero_slides')
      .select('*');

    if (heroError) {
      console.error('Error fetching hero_slides:', heroError);
    } else {
      console.log(`Found ${heroSlides?.length || 0} rows in hero_slides`);
      console.log(JSON.stringify(heroSlides, null, 2));
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkHomeComponents(); 