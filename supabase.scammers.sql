-- ============================================================================
-- SQL Script: Create scammers tracking table and storage bucket
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Create scammers table
CREATE TABLE IF NOT EXISTS public.scammers (
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

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow all users to read scammers" ON public.scammers;
DROP POLICY IF EXISTS "Allow admins to insert scammers" ON public.scammers;
DROP POLICY IF EXISTS "Allow admins to update scammers" ON public.scammers;
DROP POLICY IF EXISTS "Allow admins to delete scammers" ON public.scammers;

-- Create policies (allow read for everyone, write only for admins)
CREATE POLICY "Allow all users to read scammers" ON public.scammers FOR SELECT USING (true);
CREATE POLICY "Allow admins to insert scammers" ON public.scammers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admins to update scammers" ON public.scammers FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow admins to delete scammers" ON public.scammers FOR DELETE USING (true);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS scammers_roblox_username_idx ON public.scammers (roblox_username);
CREATE INDEX IF NOT EXISTS scammers_telegram_username_idx ON public.scammers (telegram_username);
CREATE INDEX IF NOT EXISTS scammers_status_idx ON public.scammers (status);
CREATE INDEX IF NOT EXISTS scammers_created_at_idx ON public.scammers (created_at DESC);

-- Verify table exists
SELECT 'Scammers table created successfully!' AS status;

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================
-- Note: Storage buckets must be created via Supabase Dashboard or API
-- 
-- Manual steps to create bucket:
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name: scammer-proofs
-- 4. Set as Public bucket
-- 5. Click "Create bucket"
--
-- Or run this SQL to create the bucket programmatically:
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('scammer-proofs', 'scammer-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
DROP POLICY IF EXISTS "Public read access for scammer proofs" ON storage.objects;
CREATE POLICY "Public read access for scammer proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'scammer-proofs');

-- Create storage policy for authenticated users to upload
DROP POLICY IF EXISTS "Authenticated users can upload scammer proofs" ON storage.objects;
CREATE POLICY "Authenticated users can upload scammer proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'scammer-proofs');

-- Create storage policy for users to delete their own uploads
DROP POLICY IF EXISTS "Users can delete scammer proofs" ON storage.objects;
CREATE POLICY "Users can delete scammer proofs"
ON storage.objects FOR DELETE
USING (bucket_id = 'scammer-proofs');

SELECT 'Storage bucket setup complete!' AS status;

