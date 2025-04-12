'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Orb from '@/components/Orb';
import GradientText from '@/components/GradientText';
import { SparklesText } from '@/components/magicui/sparkles-text';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { BackgroundLines } from '@/components/animation/background-lines';

export default function WelcomePage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Check authentication on page load
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        const supabase = createClientSupabaseClient();
        const { data, error } = await supabase.auth.getUser();

        if (data.user && !error) {
          // User is already authenticated, redirect to home
          router.push('/home');
        }
      } catch (error) {
        console.error('Initial auth check error:', error);
      } finally {
        setIsPageLoading(false);
      }
    };

    checkInitialAuth();
  }, [router]);

  const handleGetStarted = async () => {
    try {
      setIsCheckingAuth(true);
      const supabase = createClientSupabaseClient();
      const { data, error } = await supabase.auth.getUser();

      if (data.user && !error) {
        // User is authenticated, go to home
        router.push('/home');
      } else {
        // User is not authenticated, go to login
        router.push('/auth/login?redirectTo=/home');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, default to login page
      router.push('/auth/login?redirectTo=/home');
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Show loading state while checking authentication
  if (isPageLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-black'>
        <LoadingSpinner size='lg' className='text-primary' />
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-black text-foreground p-6'>
      <div className='w-full rounded-3xl flex flex-col items-center p-4'>
        {/* Circular Image with Student */}
        <div className='relative w-full h-72 mb-8'>
          <div className='absolute inset-0 rounded-full flex items-center justify-center'>
            <div className='relative w-full h-full flex items-center justify-center'>
              <div className='relative z-10 w-full h-full flex items-center justify-center'>
                <BackgroundLines className='flex bg-transparent items-center justify-center px-4'>
                  <div className='absolute inset-0 z-10 scale-125'>
                    <Orb
                      hoverIntensity={0.5}
                      rotateOnHover={true}
                      hue={0}
                      forceHoverState={false}
                    />
                  </div>

                  <div className='relative z-0'>
                    <GradientText
                      colors={[
                        'var(--primary)',
                        'var(--accent)',
                        'var(--primary)',
                        'var(--accent)',
                        'var(--primary)'
                      ]}
                      animationSpeed={3}
                      showBorder={false}
                      className='custom-class font-extrabold text-9xl'
                    >
                      AI
                      <SparklesText
                        text='AI'
                        className='absolute z-30 inset-0'
                        sparklesCount={8}
                      />
                    </GradientText>
                  </div>
                </BackgroundLines>
              </div>
            </div>
          </div>
        </div>

        {/* Indicator Dots */}
        <div className='flex space-x-1 mb-6'>
          <div className='w-2 h-2 rounded-full bg-primary'></div>
          <div className='w-2 h-2 rounded-full bg-primary'></div>
          <div className='w-2 h-2 rounded-full bg-primary'></div>
        </div>

        {/* Heading */}
        <h1 className='text-3xl text-white font-semibold mb-3 text-center'>
          Grow your academic skills with MyJKKN
        </h1>

        {/* Subheading */}
        <p className='text-center mb-8 text-sm text-muted-foreground'>
          Here you can access all your institution resources and learning
          materials
        </p>

        {/* CTA Button */}
        <div className='w-full flex justify-center'>
          <RainbowButton
            className='w-fit text-center bg-primary text-primary-foreground'
            disabled={isCheckingAuth}
            onClick={handleGetStarted}
          >
            {isCheckingAuth ? (
              <div className='flex items-center gap-2'>
                <LoadingSpinner size='sm' />
                <span>Loading...</span>
              </div>
            ) : (
              'Get Started'
            )}
          </RainbowButton>
        </div>
      </div>
    </div>
  );
}
