-- Migration: Add new fields to profiles table for enhanced features
-- Run this SQL in Supabase SQL Editor

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS daily_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_daily_bonus_date text,
ADD COLUMN IF NOT EXISTS unit_stats jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS total_spins integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earned integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS transaction_history jsonb DEFAULT '[]'::jsonb;

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

