-- ============================================================================
-- FIX: Remove NOT NULL constraint from added_by field
-- Run this in Supabase SQL Editor to fix the foreign key error
-- ============================================================================

-- Drop the old table and recreate with nullable added_by
DROP TABLE IF EXISTS public.scammers CASCADE;

-- Create scammers table with nullable added_by
CREATE TABLE public.scammers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  roblox_username text NOT NULL,
  telegram_nickname text,
  telegram_username text,
  reason text NOT NULL,
  description text,
  damage_amount integer,
  proof_images text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'verified')),
  added_by bigint REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scammers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all users to read scammers" ON public.scammers FOR SELECT USING (true);
CREATE POLICY "Allow users to insert scammers" ON public.scammers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to update scammers" ON public.scammers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow users to delete scammers" ON public.scammers FOR DELETE USING (true);

-- Create indexes
CREATE INDEX scammers_roblox_username_idx ON public.scammers (roblox_username);
CREATE INDEX scammers_telegram_username_idx ON public.scammers (telegram_username);
CREATE INDEX scammers_status_idx ON public.scammers (status);
CREATE INDEX scammers_created_at_idx ON public.scammers (created_at DESC);

SELECT 'Scammers table fixed!' AS status;

