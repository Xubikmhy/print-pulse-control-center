
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { createClient } from '@supabase/supabase-js';

// Supabase client
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Postgres connection
const connectionString = import.meta.env.VITE_DATABASE_URL || '';

// Database connection for Drizzle
const client = postgres(connectionString);

export const db = drizzle(client);
