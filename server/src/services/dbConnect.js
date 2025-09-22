import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function dbConnect() {
  try {
    const { data, error } = await supabase.from('Store').select('*').limit(1)

    if (error) throw error;
    console.log('✅ Supabase connected successfully!');
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

