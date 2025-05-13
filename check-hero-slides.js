import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkHeroSlides() {
  try {
    // Get all hero slides
    const { data: slides, error } = await supabase
      .from('hero_slides')
      .select('*')
      .order('order');

    if (error) {
      console.error('Error fetching hero slides:', error);
    } else {
      console.log(`Found ${slides?.length || 0} hero slides:`);
      slides?.forEach((slide, index) => {
        console.log(`\n---- Slide ${index + 1} ----`);
        console.log('ID:', slide.id);
        console.log('Title:', slide.title);
        console.log('Image URL:', slide.image_url);
        console.log('Image ID:', slide.image_id);
        console.log('Text Background:', slide.text_background);
        console.log('Background Color:', slide.background_color);
        console.log('Text Color:', slide.text_color);
        console.log('Is Active:', slide.is_active);
      });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkHeroSlides(); 