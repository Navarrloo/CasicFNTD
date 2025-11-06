# Enable Realtime on `public.listings`

1. Open Supabase Dashboard → Table Editor → `public.listings`.
2. Go to Realtime tab and enable "Broadcast changes".
3. Events: INSERT, UPDATE, DELETE.
4. Save.

Client subscribes via `useRealtimeListings` hook.


