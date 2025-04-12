import { createServerClient, CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths
const PUBLIC_PATHS = [
  '/',
  '/auth/login',
  '/auth/callback',
  '/auth/complete-profile',
  '/auth/reset-password',
  '/auth/verify'
];

// Helper to check if path is public
const isPublicPath = (path: string) =>
  PUBLIC_PATHS.includes(path) ||
  path.startsWith('/_next') ||
  path.startsWith('/api') ||
  path.includes('favicon.ico') ||
  path.includes('.jpg') ||
  path.includes('.png') ||
  path.includes('.svg') ||
  path.includes('.ico');

export async function middleware(request: NextRequest) {
  try {
    const res = NextResponse.next();
    const currentPath = request.nextUrl.pathname;

    // Create supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            const cookie = request.cookies.get(name);
            return cookie?.value ?? '';
          },
          async set(name: string, value: string, options: CookieOptions) {
            res.cookies.set({ name, value, ...options });
          },
          async remove(name: string, options: CookieOptions) {
            res.cookies.delete({ name, ...options });
          }
        }
      }
    );

    // Skip middleware for public paths
    if (isPublicPath(currentPath)) {
      return res;
    }

    // Get and verify session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (!session) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', currentPath);
      return NextResponse.redirect(redirectUrl);
    }

    // Force session refresh if token is about to expire (within 5 minutes)
    if (
      session.expires_at &&
      Date.now() > session.expires_at * 1000 - 5 * 60 * 1000
    ) {
      const { data: refreshedSession, error: refreshError } =
        await supabase.auth.refreshSession();

      if (refreshError || !refreshedSession.session) {
        console.error('Session refresh error:', refreshError);
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }

    // Add auth info to headers for server components
    res.headers.set('x-user-id', session.user.id);
    res.headers.set('x-user-email', session.user.email || '');
    res.headers.set('x-session-expires', session.expires_at?.toString() || '');

    // Fetch and verify user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
      // Only redirect if it's a server error, not just missing profile
      if (profileError.code !== 'PGRST104') {
        return NextResponse.redirect(new URL('/error', request.url));
      }
    }

    // Check profile completion
    if (
      profile &&
      !profile.profile_completed &&
      !currentPath.includes('/auth/complete-profile')
    ) {
      return NextResponse.redirect(
        new URL('/auth/complete-profile', request.url)
      );
    }

    // Cache control for authenticated routes
    res.headers.set('Cache-Control', 'no-store, must-revalidate');

    return res;
  } catch (error) {
    // Log the error with context
    console.error('Middleware critical error:', {
      error,
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString()
    });

    // Redirect to error page for critical failures
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
