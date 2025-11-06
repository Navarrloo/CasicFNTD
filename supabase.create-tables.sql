-- ============================================================================
-- SQL Script: Create tables for FNTD Casino Game
-- Run this in Supabase SQL Editor if tables don't exist
-- ============================================================================

-- Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id bigint PRIMARY KEY,
  username text,
  first_name text,
  balance integer DEFAULT 1000,
  inventory jsonb DEFAULT '[]'::jsonb,
  achievements jsonb DEFAULT '[]'::jsonb,
  daily_streak integer DEFAULT 0,
  last_daily_bonus_date text,
  unit_stats jsonb DEFAULT '{}'::jsonb,
  total_spins integer DEFAULT 0,
  total_spent integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  transaction_history jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Create listings table (if not exists)
CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  seller_id bigint NOT NULL REFERENCES public.profiles(id),
  seller_username text NOT NULL,
  unit_data jsonb NOT NULL,
  asking_price integer NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Allow user to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all users to read active listings" ON public.listings;
DROP POLICY IF EXISTS "Allow user to read their own listings" ON public.listings;
DROP POLICY IF EXISTS "Allow user to create their own listings" ON public.listings;
DROP POLICY IF EXISTS "Allow user to cancel their own listings" ON public.listings;
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access to listings" ON public.listings;
DROP POLICY IF EXISTS "Allow all users to read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow any authenticated-via-key user to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow any authenticated-via-key user to read listings" ON public.listings;
DROP POLICY IF EXISTS "Allow any authenticated-via-key user to create listings" ON public.listings;

-- Create new policies
CREATE POLICY "Allow all users to read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow any authenticated-via-key user to update profiles" ON public.profiles FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow any authenticated-via-key user to insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow any authenticated-via-key user to read listings" ON public.listings FOR SELECT USING (true);
CREATE POLICY "Allow any authenticated-via-key user to create listings" ON public.listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow any authenticated-via-key user to update listings" ON public.listings FOR UPDATE USING (true) WITH CHECK (true);

-- Drop old functions
DROP FUNCTION IF EXISTS buy_listing(uuid, bigint);
DROP FUNCTION IF EXISTS cancel_listing(uuid, bigint);

-- Create buy_listing function
CREATE OR REPLACE FUNCTION buy_listing(listing_id_to_buy uuid, buyer_user_id bigint)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  listing record;
  buyer_balance int;
BEGIN
  -- Lock the listing row to prevent simultaneous purchases
  SELECT * INTO listing FROM public.listings WHERE id = listing_id_to_buy FOR UPDATE;

  -- Validate the purchase
  IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found.'; END IF;
  IF listing.status <> 'active' THEN RAISE EXCEPTION 'Listing is no longer available.'; END IF;
  IF listing.seller_id = buyer_user_id THEN RAISE EXCEPTION 'You cannot buy your own listing.'; END IF;

  -- Check buyer's balance
  SELECT balance INTO buyer_balance FROM public.profiles WHERE id = buyer_user_id;
  IF buyer_balance IS NULL OR buyer_balance < listing.asking_price THEN RAISE EXCEPTION 'You do not have enough souls.'; END IF;

  -- Perform the transaction
  UPDATE public.profiles SET balance = balance - listing.asking_price WHERE id = buyer_user_id;
  UPDATE public.profiles SET inventory = inventory || to_jsonb(listing.unit_data) WHERE id = buyer_user_id;
  UPDATE public.profiles SET balance = balance + listing.asking_price WHERE id = listing.seller_id;
  UPDATE public.listings SET status = 'completed' WHERE id = listing_id_to_buy;
END;
$$;

-- Create cancel_listing function
CREATE OR REPLACE FUNCTION cancel_listing(listing_id_to_cancel uuid, seller_user_id bigint)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  listing record;
BEGIN
  -- Find the listing
  SELECT * INTO listing FROM public.listings WHERE id = listing_id_to_cancel FOR UPDATE;

  -- Validate the cancellation
  IF NOT FOUND THEN RAISE EXCEPTION 'Listing not found.'; END IF;
  IF listing.seller_id <> seller_user_id THEN RAISE EXCEPTION 'You do not own this listing.'; END IF;
  IF listing.status <> 'active' THEN RAISE EXCEPTION 'This listing is not active.'; END IF;

  -- Perform the cancellation
  UPDATE public.profiles SET inventory = inventory || to_jsonb(listing.unit_data) WHERE id = seller_user_id;
  UPDATE public.listings SET status = 'cancelled' WHERE id = listing_id_to_cancel;
END;
$$;

-- Verify tables exist
SELECT 'Tables created successfully!' AS status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('profiles', 'listings');

