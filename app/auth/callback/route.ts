import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Database } from '@/types/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/home';
    const origin = requestUrl.origin;

    // Early return if no code
    if (!code) {
      console.error('No code in callback');
      return NextResponse.redirect(
        new URL(`/auth/login?error=no_code`, origin)
      );
    }

    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          }
        }
      }
    );

    // Exchange code for session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      console.error('Exchange error:', exchangeError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=exchange`, origin)
      );
    }

    // Get session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();
    if (sessionError || !session) {
      console.error('Session error:', sessionError);
      return NextResponse.redirect(
        new URL(`/auth/login?error=session`, origin)
      );
    }

    try {
      // Get or create profile
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('profile_completed')
        .eq('id', session.user.id)
        .single();

      // If no profile exists, create one
      if (!existingProfile) {
        const { error: insertError } = await supabase.from('profiles').insert([
          {
            id: session.user.id,
            email: session.user.email,
            role: 'student',
            profile_completed: false
          }
        ]);

        if (insertError) throw insertError;
        return NextResponse.redirect(new URL('/auth/complete-profile', origin));
      }

      // If profile exists but not completed
      if (!existingProfile.profile_completed) {
        return NextResponse.redirect(new URL('/auth/complete-profile', origin));
      }

      // If profile exists and is completed, redirect to the requested page or home
      // Use the redirectTo parameter if available
      return NextResponse.redirect(new URL(redirectTo, origin));
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.redirect(new URL('/auth/complete-profile', origin));
    }
  } catch (error) {
    console.error('General error:', error);
    return NextResponse.redirect(new URL(`/auth/login?error=general`, origin));
  }
}
