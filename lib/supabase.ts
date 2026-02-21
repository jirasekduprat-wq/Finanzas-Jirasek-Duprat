import { createClient } from '@supabase/supabase-js';

// Define Supabase types here
export type SupabaseClientConfig = {
  url: string;
  key: string;
};

// Supabase client configuration
export const supabaseUrl = 'YOUR_SUPABASE_URL';
export const supabaseKey = 'YOUR_SUPABASE_KEY';
export const supabase = createClient(supabaseUrl, supabaseKey);