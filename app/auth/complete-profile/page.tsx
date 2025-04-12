'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { createClientSupabaseClient } from '@/lib/supabase/client';
import { AuthService } from '@/lib/services/auth/auth-service';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function CompleteProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/home';
  const supabase = createClientSupabaseClient();

  // Check if user is logged in and profile exists
  useEffect(() => {
    const checkUserAndProfile = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session }
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/auth/login');
          return;
        }

        // Check if profile exists and is already completed
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.profile_completed) {
          // If profile is already completed, redirect to home
          router.push(redirectTo);
          return;
        }

        // If we have a name from the profile, use it
        if (profile && profile.full_name) {
          setFullName(profile.full_name);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAndProfile();
  }, [router, supabase, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    try {
      setIsSaving(true);

      // Update profile
      await AuthService.updateUserProfile({
        full_name: fullName,
        profile_completed: true
      });

      toast.success('Profile completed successfully');
      router.push(redirectTo);
    } catch (error) {
      console.error('Error completing profile:', error);
      toast.error('Failed to complete profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Complete Your Profile
          </CardTitle>
          <CardDescription className='text-center'>
            Please provide your information to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='fullName'>Full Name</Label>
              <Input
                id='fullName'
                placeholder='Enter your full name'
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type='submit' className='w-full' disabled={isSaving}>
              {isSaving ? (
                <div className='flex items-center gap-2'>
                  <LoadingSpinner size='sm' />
                  <span>Saving...</span>
                </div>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
