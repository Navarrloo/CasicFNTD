import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Unit } from '../types';

/*
 * =============================================================================
 * =============================================================================
 * 
 *    👉👉👉  ACTION REQUIRED: RERUN THIS SCRIPT TO FIX THE DATABASE  👈👈👉
 * 
 * =============================================================================
 * =============================================================================
 *
 *    Hello! The previous security rules were too strict and caused errors.
 *    This new script fixes the marketplace and achievement bugs.
 *
 *    Please follow these steps to apply the necessary fixes:
 *
 *    1.  Go to your Supabase project dashboard.
 *    2.  In your project, go to the "SQL Editor".
 *    3.  Click "+ New query".
 *    4.  COPY the entire SQL code block below and PASTE it into the editor.
 *    5.  Click the "RUN" button.
 *
 *    ✅ This will fix the errors. For better long-term security, we should
 *    discuss adding a Supabase Edge Function for user authentication next!
 *
 * =============================================================================
 *  -- START SQL SCRIPT --

-- Enable Row Level Security (RLS) on your tables. This is a good base practice.
alter table public.profiles enable row level security;
alter table public.listings enable row level security;

-- Drop old policies that were causing errors
drop policy if exists "Allow user to update their own profile" on public.profiles;
drop policy if exists "Allow all users to read active listings" on public.listings;
drop policy if exists "Allow user to read their own listings" on public.listings;
drop policy if exists "Allow user to create their own listings" on public.listings;
drop policy if exists "Allow user to cancel their own listings" on public.listings;
drop policy if exists "Allow public read access to profiles" on public.profiles;
drop policy if exists "Allow public read access to listings" on public.listings;


-- Create new, more permissive policies that allow the app to function without a backend auth server.
-- WARNING: These policies are not fully secure and trust the client.
create policy "Allow all users to read profiles" on public.profiles for select using (true);
create policy "Allow any authenticated-via-key user to update profiles" on public.profiles for update using (true) with check (true);
create policy "Allow any authenticated-via-key user to read listings" on public.listings for select using (true);
create policy "Allow any authenticated-via-key user to create listings" on public.listings for insert with check (true);

-- Drop old functions
drop function if exists buy_listing(uuid);
drop function if exists cancel_listing(uuid);

-- Create a secure function to handle buying a listing.
-- This function ensures the entire purchase happens in one safe, all-or-nothing transaction.
create or replace function buy_listing(listing_id_to_buy uuid, buyer_user_id bigint)
returns void
language plpgsql
as $$
declare
  listing record;
  buyer_balance int;
begin
  -- Lock the listing row to prevent simultaneous purchases.
  select * into listing from public.listings where id = listing_id_to_buy for update;

  -- Validate the purchase.
  if not found then raise exception 'Listing not found.'; end if;
  if listing.status <> 'active' then raise exception 'Listing is no longer available.'; end if;
  if listing.seller_id = buyer_user_id then raise exception 'You cannot buy your own listing.'; end if;

  -- Check buyer's balance.
  select balance into buyer_balance from public.profiles where id = buyer_user_id;
  if buyer_balance is null or buyer_balance < listing.asking_price then raise exception 'You do not have enough souls.'; end if;

  -- Perform the transaction.
  update public.profiles set balance = balance - listing.asking_price where id = buyer_user_id;
  update public.profiles set inventory = inventory || to_jsonb(listing.unit_data) where id = buyer_user_id;
  update public.profiles set balance = balance + listing.asking_price where id = listing.seller_id;
  update public.listings set status = 'completed' where id = listing_id_to_buy;
end;
$$;

-- Create a secure function to handle cancelling a listing.
create or replace function cancel_listing(listing_id_to_cancel uuid, seller_user_id bigint)
returns void
language plpgsql
as $$
declare
  listing record;
begin
  -- Find the listing.
  select * into listing from public.listings where id = listing_id_to_cancel for update;

  -- Validate the cancellation.
  if not found then raise exception 'Listing not found.'; end if;
  if listing.seller_id <> seller_user_id then raise exception 'You do not own this listing.'; end if;
  if listing.status <> 'active' then raise exception 'This listing is not active.'; end if;

  -- Perform the cancellation.
  update public.profiles set inventory = inventory || to_jsonb(listing.unit_data) where id = seller_user_id;
  update public.listings set status = 'cancelled' where id = listing_id_to_cancel;
end;
$$;

-- Create a secure function to handle accepting an offer.
create or replace function accept_offer(offer_id_param uuid, seller_user_id bigint)
returns void
language plpgsql
as $$
declare
  target_offer record;
  target_listing record;
  buyer_profile record;
begin
  -- Fetch the offer
  select * into target_offer from public.offers where id = offer_id_param for update;
  if not found then raise exception 'Offer not found.'; end if;
  if target_offer.status <> 'pending' then raise exception 'Offer is not pending.'; end if;

  -- Fetch the listing
  select * into target_listing from public.listings where id = target_offer.listing_id for update;
  if not found then raise exception 'Listing not found.'; end if;
  if target_listing.status <> 'active' then raise exception 'Listing is not active.'; end if;
  if target_listing.seller_id <> seller_user_id then raise exception 'You do not own this listing.'; end if;

  -- Fetch buyer profile to check balance
  select * into buyer_profile from public.profiles where id = target_offer.buyer_id for update;
  if not found then raise exception 'Buyer profile not found.'; end if;
  if buyer_profile.balance < target_offer.offer_amount then raise exception 'Buyer does not have enough souls.'; end if;

  -- EXECUTE TRANSACTION
  -- 1. Deduct balance from buyer
  update public.profiles 
  set balance = balance - target_offer.offer_amount,
      total_spent = coalesce(total_spent, 0) + target_offer.offer_amount
  where id = target_offer.buyer_id;

  -- 2. Add balance to seller
  update public.profiles 
  set balance = balance + target_offer.offer_amount,
      total_earned = coalesce(total_earned, 0) + target_offer.offer_amount
  where id = seller_user_id;

  -- 3. Transfer unit to buyer (add to inventory)
  update public.profiles 
  set inventory = inventory || to_jsonb(target_listing.unit_data) 
  where id = target_offer.buyer_id;

  -- 4. Update listing status
  update public.listings 
  set status = 'completed' 
  where id = target_listing.id;

  -- 5. Update offer status
  update public.offers 
  set status = 'accepted' 
  where id = target_offer.id;

  -- 6. Reject other pending offers for this listing
  update public.offers
  set status = 'rejected'
  where listing_id = target_listing.id and id <> target_offer.id and status = 'pending';

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
          daily_streak: number | null
          last_daily_bonus_date: string | null
          unit_stats: Record<number, number> | null
          total_spins: number | null
          total_spent: number | null
          total_earned: number | null
          transaction_history: any[] | null
          claimed_achievement_rewards: string[] | null
          last_wheel_spin_date: string | null
          quest_progress: any | null
          last_quest_reset: string | null
          referral_code: string | null
          referred_users: string[] | null
          referral_earned: number | null
          referred_by: string | null
          pending_gifts: any[] | null
          battlepass_level: number | null
          battlepass_xp: number | null
          battlepass_premium: boolean | null
          battlepass_claimed: number[] | null
          lottery_tickets: number | null
          lottery_jackpot: number | null
          balance_history: any[] | null
          pvp_wins: number | null
          pvp_losses: number | null
          pvp_rating: number | null
          trade_count: number | null
          tutorial_completed: boolean | null
        }
        Insert: {
          id: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
          achievements?: string[] | null
          daily_streak?: number | null
          last_daily_bonus_date?: string | null
          unit_stats?: Record<number, number> | null
          total_spins?: number | null
          total_spent?: number | null
          total_earned?: number | null
          transaction_history?: any[] | null
          claimed_achievement_rewards?: string[] | null
          last_wheel_spin_date?: string | null
          quest_progress?: any | null
          last_quest_reset?: string | null
          referral_code?: string | null
          referred_users?: string[] | null
          referral_earned?: number | null
          referred_by?: string | null
          pending_gifts?: any[] | null
          battlepass_level?: number | null
          battlepass_xp?: number | null
          battlepass_premium?: boolean | null
          battlepass_claimed?: number[] | null
          lottery_tickets?: number | null
          lottery_jackpot?: number | null
          balance_history?: any[] | null
          pvp_wins?: number | null
          pvp_losses?: number | null
          pvp_rating?: number | null
          trade_count?: number | null
          tutorial_completed?: boolean | null
        }
        Update: {
          id?: number
          username?: string | null
          first_name?: string | null
          balance?: number
          inventory?: Unit[] | null
          achievements?: string[] | null
          daily_streak?: number | null
          last_daily_bonus_date?: string | null
          unit_stats?: Record<number, number> | null
          total_spins?: number | null
          total_spent?: number | null
          total_earned?: number | null
          transaction_history?: any[] | null
          claimed_achievement_rewards?: string[] | null
          last_wheel_spin_date?: string | null
          quest_progress?: any | null
          last_quest_reset?: string | null
          referral_code?: string | null
          referred_users?: string[] | null
          referral_earned?: number | null
          referred_by?: string | null
          pending_gifts?: any[] | null
          battlepass_level?: number | null
          battlepass_xp?: number | null
          battlepass_premium?: boolean | null
          battlepass_claimed?: number[] | null
          lottery_tickets?: number | null
          lottery_jackpot?: number | null
          balance_history?: any[] | null
          pvp_wins?: number | null
          pvp_losses?: number | null
          pvp_rating?: number | null
          trade_count?: number | null
          tutorial_completed?: boolean | null
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
      offers: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: number;
          buyer_username: string;
          offer_amount: number;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
        }
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: number;
          buyer_username: string;
          offer_amount: number;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        }
        Update: {
          status?: 'pending' | 'accepted' | 'rejected';
        }
        Relationships: [
          {
            foreignKeyName: 'offers_listing_id_fkey'
            columns: ['listing_id']
            referencedRelation: 'listings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'offers_buyer_id_fkey'
            columns: ['buyer_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      scammers: {
        Row: {
          id: string;
          roblox_username: string;
          telegram_nickname: string | null;
          telegram_username: string | null;
          reason: string;
          description: string | null;
          damage_amount: number | null;
          proof_images: string[];
          status: 'pending' | 'verified';
          added_by: number | null;
          created_at: string;
        }
        Insert: {
          id?: string;
          roblox_username: string;
          telegram_nickname?: string | null;
          telegram_username?: string | null;
          reason: string;
          description?: string | null;
          damage_amount?: number | null;
          proof_images?: string[];
          status?: 'pending' | 'verified';
          added_by?: number | null;
          created_at?: string;
        }
        Update: {
          id?: string;
          roblox_username?: string;
          telegram_nickname?: string | null;
          telegram_username?: string | null;
          reason?: string;
          description?: string | null;
          damage_amount?: number | null;
          proof_images?: string[];
          status?: 'pending' | 'verified';
          added_by?: number | null;
          created_at?: string;
        }
        Relationships: [
          {
            foreignKeyName: 'scammers_added_by_fkey'
            columns: ['added_by']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      unit_prices: {
        Row: {
          unit_id: number;
          price: number;
          updated_at: string;
        }
        Insert: {
          unit_id: number;
          price: number;
          updated_at?: string;
        }
        Update: {
          unit_id?: number;
          price?: number;
          updated_at?: string;
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      buy_listing: {
        Args: {
          listing_id_to_buy: string;
          buyer_user_id: number;
        }
        Returns: undefined
      }
      cancel_listing: {
        Args: {
          listing_id_to_cancel: string;
          seller_user_id: number;
        }
        Returns: undefined
      }
      accept_offer: {
        Args: {
          offer_id_param: string;
          seller_user_id: number;
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