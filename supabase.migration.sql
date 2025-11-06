-- ============================================================================
-- FULL MIGRATION: Add ALL new fields to profiles table
-- Run this SQL in Supabase SQL Editor
-- ============================================================================

-- Add new columns to profiles table
ALTER TABLE public.profiles 
-- Daily bonus system
ADD COLUMN IF NOT EXISTS daily_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_daily_bonus_date text,

-- Statistics
ADD COLUMN IF NOT EXISTS unit_stats jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS total_spins integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_spent integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_earned integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS transaction_history jsonb DEFAULT '[]'::jsonb,

-- Achievements with rewards
ADD COLUMN IF NOT EXISTS claimed_achievement_rewards jsonb DEFAULT '[]'::jsonb,

-- Wheel of Fortune
ADD COLUMN IF NOT EXISTS last_wheel_spin_date text,

-- Quests system
ADD COLUMN IF NOT EXISTS quest_progress jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS last_quest_reset text,

-- Referral system
ADD COLUMN IF NOT EXISTS referral_code text,
ADD COLUMN IF NOT EXISTS referred_users jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS referral_earned integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS referred_by text,

-- Gifts system
ADD COLUMN IF NOT EXISTS pending_gifts jsonb DEFAULT '[]'::jsonb,

-- Battle Pass
ADD COLUMN IF NOT EXISTS battlepass_level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS battlepass_xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS battlepass_premium boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS battlepass_claimed jsonb DEFAULT '[]'::jsonb,

-- Lottery
ADD COLUMN IF NOT EXISTS lottery_tickets integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS lottery_jackpot integer DEFAULT 500,

-- Advanced Stats
ADD COLUMN IF NOT EXISTS balance_history jsonb DEFAULT '[]'::jsonb,

-- PvP Battles
ADD COLUMN IF NOT EXISTS pvp_wins integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS pvp_losses integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS pvp_rating integer DEFAULT 1000,

-- Trade tracking
ADD COLUMN IF NOT EXISTS trade_count integer DEFAULT 0;

-- Verify the changes
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

