import { useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../lib/supabase';

export const useRealtimeListings = (supabase: SupabaseClient<Database> | null, onChange: () => void) => {
    useEffect(() => {
        if (!supabase) return;

        const channel = supabase.channel('realtime:listings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
                onChange();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase, onChange]);
};


