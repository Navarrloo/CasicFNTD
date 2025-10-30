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

/*
 * =============================================================================
 * =============================================================================
 * 
 *    👉👉👉  ACTION REQUIRED: CONFIGURE YOUR SUPABASE CONNECTION  👈👈👈
 * 
 * =============================================================================
 * =============================================================================
 *
 *    Hello! For this app to work, you MUST connect it to your own Supabase
 *    database project. This is easy to do!
 *
 *    Follow these steps to get your project's URL and Key:
 *
 *    1.  Go to your Supabase project dashboard:
 *        https://supabase.com/dashboard
 *
 *    2.  In your project, go to "Project Settings" (the gear icon ⚙️).
 *
 *    3.  Click on "API" in the settings menu.
 *
 *    4.  Under the "Project API keys" section, find:
 *        - The "Project URL"
 *        - The "public" key (also called the "anon" key).
 *
 *    5.  COPY the URL and the public key and PASTE them into the variables
 *        below, replacing the placeholder text.
 *
 *    ✅ After you do this, save the file and the app will connect!
 *
 * =============================================================================
 *    РУССКАЯ ИНСТРУКЦИЯ
 * =============================================================================
 *
 *    Привет! Чтобы приложение заработало, вы ДОЛЖНЫ подключить его к
 *    вашему проекту в Supabase. Это просто!
 *
 *    1.  Перейдите в панель управления Supabase: https://supabase.com/dashboard
 *    2.  Откройте ваш проект и зайдите в "Project Settings" (иконка ⚙️).
 *    3.  Нажмите на "API" в меню.
 *    4.  Скопируйте "Project URL" и "public" ("anon") ключ.
 *    5.  ВСТАВЬТЕ их в переменные ниже, заменив текст-заполнитель.
 *
 *    ✅ После этого сохраните файл, и приложение подключится!
 * =============================================================================
 */
const supabaseUrl = 'https://lakvibnhoebryfuuompn.supabase.co'; // <--- ✅ Я ВСТАВИЛ ВАШ URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxha3ZpYm5ob2VicnlmdXVvbXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMzM0MjksImV4cCI6MjA3NjYwOTQyOX0.Xy04UdJonrGm9RCf1BCPXsoNLCCBzzzvoLuNJiwjqcM';      // <--- ✅ Я ВСТАВИЛ ВАШ КЛЮЧ


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
    // This message will appear in the browser console if the credentials are not set.
    // The UI in App.tsx will also show a user-friendly error message.
    console.error("Supabase credentials are not set. Please edit `lib/supabase.ts` and replace the placeholder values.");
}

export { supabase };