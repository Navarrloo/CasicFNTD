
import { createClient, SupabaseClient } from 'supabase-client'
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

// -----------------------------------------------------------------------------
// ⚠️ IMPORTANT: PASTE YOUR SUPABASE CREDENTIALS HERE! ⚠️
// You MUST replace the placeholder values below with your actual Supabase
// project URL and anon (public) key.
//
// Find these in your Supabase project's "Project Settings" > "API".
// -----------------------------------------------------------------------------
const supabaseUrl = 'https://lakvibnhoebryfuuompn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxha3ZpYm5ob2VicnlmdXVvbXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzM0MjksImV4cCI6MjA3NjYwOTQyOX0.Xy04UdJonrGm9RCf1BCPXsoNLCCBzzzvoLuNJiwjqcM';


// The App.tsx component will handle connection errors gracefully
// if these variables are not set correctly.
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.error("Error creating Supabase client:", error);
    }
} else {
    console.error("Supabase credentials are not set. Please edit `lib/supabase.ts` and replace the placeholder values.");
}

export { supabase };