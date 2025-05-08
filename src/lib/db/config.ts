
import { createClient } from '@supabase/supabase-js';

// Supabase client
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side use only - not directly imported in components
// This will be used only by server actions, not client-side code
let db: any = null;

// Only initialize Drizzle on the server side
if (typeof window === 'undefined') {
  const { drizzle } = require('drizzle-orm/postgres-js');
  const postgres = require('postgres');
  
  const connectionString = process.env.DATABASE_URL || '';
  const client = postgres(connectionString);
  db = drizzle(client);
}

export { db };
