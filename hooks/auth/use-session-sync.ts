// hooks/use-session-sync.ts
import { useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { Database } from '@/types/supabase';
import { toast } from 'react-hot-toast';

export function useSessionSync() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const { refreshUser } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check initial session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // No valid session, redirect to login
        const currentPath = window.location.pathname;
        if (
          !currentPath.includes('/auth/login') &&
          !currentPath.includes('/auth/callback') &&
          currentPath !== '/'
        ) {
          router.push('/auth/login');
        }
      }
    };

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);

      if (event === 'SIGNED_IN') {
        await refreshUser();
        router.refresh();
        toast.success('Successfully signed in');
      } else if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
        await refreshUser();
      } else if (event === 'USER_UPDATED') {
        await refreshUser();
        router.refresh();
      }
    });

    // Set up realtime subscription for profile changes
    const profileSubscription = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        async (payload: { new: { id?: string } }) => {
          // Only refresh if it's the current user's profile
          const currentUser = await supabase.auth.getUser();
          if (
            payload.new &&
            payload.new.id &&
            currentUser.data.user?.id === payload.new.id
          ) {
            await refreshUser();
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      profileSubscription.unsubscribe();
    };
  }, [supabase, router, refreshUser]);
}
