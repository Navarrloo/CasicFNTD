import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Unit } from '../types';

// Define a type for your database schema if you have one
// For now, we define a profile type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number
          username: string | null
          first_name: string | null
          balance: number
          inventory: Unit[] | null
        }
        Insert: {
          id: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
        }
        Update: {
          id?: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// =============================================================================
// =============================================================================
//
//                           !!! ACTION REQUIRED !!!
//
//  You MUST replace the placeholder values below with your own Supabase
//  project's URL and Public (anon) Key for the application to work.
//
//  HOW TO GET YOUR KEYS:
//  1. Go to your Supabase project dashboard: https://supabase.com/dashboard
//  2. Navigate to "Project Settings" (the gear icon in the left sidebar).
//  3. Click on "API" in the settings menu.
//  4. Under the "Project API keys" section, you will find:
//     - The "Project URL"
//     - The "public" key (also called the "anon" key).
//  5. Copy the URL and the public key and paste them into the variables below.
//
// =============================================================================
// =============================================================================
const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co'; // <--- REPLACE WITH YOUR SUPABASE URL
const supabaseAnonKey = 'YOUR_PUBLIC_ANON_KEY';      // <--- REPLACE WITH YOUR SUPABASE ANON KEY


// The App.tsx component will handle connection errors gracefully
// if these variables are not set correctly.
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_PROJECT_ID') && !supabaseAnonKey.includes('YOUR_PUBLIC_ANON_KEY')) {
    try {
        supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.error("Error creating Supabase client:", error);
    }
} else {
    console.error("Supabase credentials are not set. Please edit `lib/supabase.ts` and replace the placeholder values.");
}

export { supabase };