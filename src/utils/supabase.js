import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;