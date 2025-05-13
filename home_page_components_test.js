// Test file for debugging home_page_components query
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'http://localhost:54321';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to test different query approaches
export async function testHomePageComponentsQueries() {
  console.log('Testing home page components queries...');
  
  try {
    // Approach 1: Original query with order.asc
    console.log('Approach 1: Original query');
    const { data: data1, error: error1 } = await supabase
      .from('home_page_components')
      .select('*')
      .order('order', { ascending: true });
      
    console.log('Approach 1 result:', { data: data1, error: error1 });
    
    // Approach 2: Double quote the column name
    console.log('Approach 2: Double quoted column name');
    const { data: data2, error: error2 } = await supabase
      .from('home_page_components')
      .select('*')
      .order('"order"', { ascending: true });
      
    console.log('Approach 2 result:', { data: data2, error: error2 });
    
    // Approach 3: Just list all rows without ordering
    console.log('Approach 3: No ordering');
    const { data: data3, error: error3 } = await supabase
      .from('home_page_components')
      .select('*');
      
    console.log('Approach 3 result:', { data: data3, error: error3 });
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Export a main function to run this test
export default async function runTest() {
  await testHomePageComponentsQueries();
} 