import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Unit } from '../types';

/*
 * =============================================================================
 * =============================================================================
 * 
 *    👉👉👉  ACTION REQUIRED: SECURE YOUR DATABASE & ENABLE TRADING  👈👈👈
 * 
 * =============================================================================
 * =============================================================================
 *
 *    Hello! The trading marketplace was experiencing errors because the
 *    database needs proper security rules and functions to handle trades
 *    safely.
 *
 *    Please follow these steps to apply the necessary fixes:
 *
 *    1.  Go to your Supabase project dashboard:
 *        https://supabase.com/dashboard
 *
 *    2.  In your project, go to the "SQL Editor" (look for an icon with 'SQL').
 *
 *    3.  Click "+ New query".
 *
 *    4.  COPY the entire SQL code block below (from -- START SQL SCRIPT --
 *        to -- END SQL SCRIPT --) and PASTE it into the Supabase SQL Editor.
 *
 *    5.  Click the "RUN" button.
 *
 *    ✅ This one-time setup will make your marketplace secure and reliable!
 *
 * =============================================================================
 *  -- START SQL SCRIPT --

-- Step 1: Enable Row Level Security (RLS) on your tables.
-- This is a critical security measure to protect user data.
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

-- Step 2: Create policies for the 'profiles' table.
-- Allow users to see other users' profiles (e.g., for usernames on listings).
create policy "Allow all users to read profiles" on public.profiles for select using (true);
-- Allow a user to update ONLY their own profile.
create policy "Allow user to update their own profile" on public.profiles for update using ((select auth.uid())::bigint = id);

-- Step 3: Create policies for the 'listings' table.
-- Allow any logged-in user to see 'active' listings on the marketplace.
create policy "Allow all users to read active listings" on public.listings for select using (status = 'active');
-- Allow users to see their own listings, regardless of status (active, completed, etc.).
create policy "Allow user to read their own listings" on public.listings for select using ((select auth.uid())::bigint = seller_id);
-- Allow a user to create a listing where they are the seller.
create policy "Allow user to create their own listings" on public.listings for insert with check ((select auth.uid())::bigint = seller_id);
-- Allow a user to update (cancel) their own listing. The 'buy' action is handled by a special function.
create policy "Allow user to cancel their own listings" on public.listings for update using ((select auth.uid())::bigint = seller_id);

-- Step 4: Create a secure function to handle buying a listing.
-- This function ensures the entire purchase happens in one safe, all-or-nothing transaction.
create or replace function buy_listing(listing_id_to_buy uuid)
returns void
language plpgsql
security definer
as $$
declare
  listing record;
  seller_profile record;
  buyer_id bigint := (select auth.uid())::bigint;
  buyer_balance int;
begin
  -- Lock the listing row to prevent simultaneous purchases.
  select * into listing from public.listings where id = listing_id_to_buy for update;

  -- Validate the purchase.
  if not found then raise exception 'Listing not found.'; end if;
  if listing.status <> 'active' then raise exception 'Listing is no longer available.'; end if;
  if listing.seller_id = buyer_id then raise exception 'You cannot buy your own listing.'; end if;

  -- Check buyer's balance.
  select balance into buyer_balance from public.profiles where id = buyer_id;
  if buyer_balance < listing.asking_price then raise exception 'You do not have enough souls.'; end if;

  -- Perform the transaction.
  -- a. Debit buyer's account.
  update public.profiles set balance = balance - listing.asking_price where id = buyer_id;
  -- b. Add the unit to the buyer's inventory.
  update public.profiles set inventory = inventory || to_jsonb(listing.unit_data) where id = buyer_id;
  -- c. Credit seller's account.
  update public.profiles set balance = balance + listing.asking_price where id = listing.seller_id;
  -- d. Mark the listing as 'completed'.
  update public.listings set status = 'completed' where id = listing_id_to_buy;
end;
$$;

-- Step 5: Create a secure function to handle cancelling a listing.
create or replace function cancel_listing(listing_id_to_cancel uuid)
returns void
language plpgsql
security definer
as $$
declare
  listing record;
  canceller_id bigint := (select auth.uid())::bigint;
begin
  -- Find the listing.
  select * into listing from public.listings where id = listing_id_to_cancel for update;

  -- Validate the cancellation.
  if not found then raise exception 'Listing not found.'; end if;
  if listing.seller_id <> canceller_id then raise exception 'You do not own this listing.'; end if;
  if listing.status <> 'active' then raise exception 'This listing is not active.'; end if;

  -- Perform the cancellation.
  -- a. Return the unit to the seller's inventory.
  update public.profiles set inventory = inventory || to_jsonb(listing.unit_data) where id = canceller_id;
  -- b. Mark the listing as 'cancelled'.
  update public.listings set status = 'cancelled' where id = listing_id_to_cancel;
end;
$$;

--  -- END SQL SCRIPT --
 * =============================================================================
 */


// Define a type for your database schema
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
          achievements: string[] | null
        }
        Insert: {
          id: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
          achievements?: string[] | null
        }
        Update: {
          id?: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
          achievements?: string[] | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          id: string;
          created_at: string;
          seller_id: number;
          seller_username: string;
          asking_price: number;
          status: 'active' | 'completed' | 'cancelled';
          unit_data: Unit;
        }
        Insert: {
          id?: string // uuid is generated by db
          seller_id: number;
          seller_username: string;
          unit_data: Unit;
          asking_price: number;
          status?: 'active' | 'completed' | 'cancelled';
        }
        Update: {
            status?: 'active' | 'completed' | 'cancelled';
        }
        Relationships: [
            {
              foreignKeyName: 'listings_seller_id_fkey'
              columns: ['seller_id']
              referencedRelation: 'profiles'
              referencedColumns: ['id']
            }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buy_listing: {
        Args: {
          listing_id_to_buy: string
        }
        Returns: undefined
      }
      cancel_listing: {
        Args: {
          listing_id_to_cancel: string
        }
        Returns: undefined
      }
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