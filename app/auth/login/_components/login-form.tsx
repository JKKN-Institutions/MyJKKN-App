'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-hot-toast';
import { BeatLoader } from 'react-spinners';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import GradientText from '@/components/animation/GradientText';
import { BackgroundLines } from '@/components/animation/background-lines';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/home';
  const supabase = createClientSupabaseClient();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (user && !error) {
        router.push(redirectTo);
      }
    };
    checkUser();
  }, [router, supabase.auth, redirectTo]);

  // Check for error params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      const errorMessages: Record<string, string> = {
        no_code: 'Authentication code missing',
        exchange: 'Error exchanging auth code',
        session: 'Error creating session',
        general: 'An unexpected error occurred',
        callback: 'Authentication callback failed'
      };
      toast.error(errorMessages[error] || `Login error: ${error}`);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      // Build the callback URL with the redirectTo parameter
      const callbackUrl = `${window.location.origin}/auth/callback`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            redirectTo: redirectTo // Pass the final redirect destination
          }
        }
      });

      if (error) throw error;

      toast.success('Redirecting to Google...');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen w-full'>
      <BackgroundLines className='flex bg-transparent items-center justify-center px-4'>
        <div className='relative flex items-center justify-center w-full max-w-3xl h-[600px] overflow-hidden rounded-4xl'>
          <FlickeringGrid
            className='absolute inset-0 z-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]'
            squareSize={4}
            gridGap={6}
            color='#60A5FA'
            maxOpacity={0.5}
            flickerChance={0.1}
            height={800}
            width={800}
          />
          <Card className='absolute z-20 w-full max-w-md bg-gray-900 border-none'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl font-bold tracking-tight text-center text-white'>
                Welcome to{' '}
                <GradientText
                  colors={[
                    '#40ffaa',
                    '#4079ff',
                    '#40ffaa',
                    '#4079ff',
                    '#40ffaa'
                  ]}
                  animationSpeed={3}
                  showBorder={false}
                  className='custom-class mt-2'
                >
                  MyJKKN
                </GradientText>
              </CardTitle>
              <CardDescription className='text-center'>
                Sign in with your institutional Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant='outline'
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className='w-full bg-black border-none text-white flex items-center justify-center gap-2 h-12 cursor-pointer hover:bg-black hover:text-white'
              >
                {isLoading ? (
                  <BeatLoader size={8} color='#000000' />
                ) : (
                  <>
                    <FcGoogle className='h-5 w-5' />
                    <span>Sign in with Google</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </BackgroundLines>
    </div>
  );
}
