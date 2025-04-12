'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session) {
          // Redirect to login if no session
          const currentPath = window.location.pathname;
          router.push(
            `/auth/login?redirectTo=${encodeURIComponent(currentPath)}`
          );
          return;
        }

        // Check if session is expired or about to expire (within 5 minutes)
        const expiresAt = session.expires_at;
        const isExpiringSoon =
          expiresAt && expiresAt * 1000 - Date.now() < 5 * 60 * 1000;

        if (isExpiringSoon) {
          // Try to refresh the session
          const { data: refreshResult, error: refreshError } =
            await supabase.auth.refreshSession();

          if (refreshError || !refreshResult.session) {
            router.push('/auth/login');
            return;
          }
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        router.push('/auth/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
