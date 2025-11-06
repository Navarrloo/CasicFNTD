-- Run these in Supabase SQL editor
create index if not exists idx_listings_status_created on public.listings(status, created_at desc);
create index if not exists idx_listings_asking_price on public.listings(asking_price);

