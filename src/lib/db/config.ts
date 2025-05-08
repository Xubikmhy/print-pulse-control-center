
import { createClient } from '@supabase/supabase-js';

// Supabase client
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// We're not using Drizzle directly in the client code
// This avoids the Node.js module import errors during build
export const db = null;

// Note: For a real server environment (like in Next.js or with edge functions),
// you would initialize Drizzle here for server-side database operations
