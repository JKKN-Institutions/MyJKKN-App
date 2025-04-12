'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleService } from '@/lib/services/roles/role-service';
import { useAuth } from '@/providers/auth-provider';

const Header = () => {
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const { user, signOut } = useAuth();
  const [roleName, setRoleName] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoleName = async () => {
      if (user?.role) {
        try {
          const roles = await RoleService.getAssignableRoles();
          const role = roles.find((r) => r.role_key === user.role);
          if (role) {
            setRoleName(role.role_name);
          } else {
            // Fallback to role key if role not found
            setRoleName(user.role);
          }
        } catch (error) {
          console.error('Error fetching role name:', error);
          // Fallback to role key in case of error
          setRoleName(user.role);
        }
      }
    };

    fetchRoleName();
  }, [user?.role]);

  if (!user) return null;

  // Generate initials for avatar
  const initials = user.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user.email[0].toUpperCase();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleNotification = () => {
    setIsNotificationActive(!isNotificationActive);
    // Add notification animation logic here if needed
  };

  return (
    <header className='sticky top-0 z-50 bg-background border-b border-border px-5 py-3 flex items-center justify-between shadow-sm'>
      <div className='flex items-center'>
        <Logo width={120} height={40} />
      </div>

      <div className='flex items-center gap-2'>
        {/* Notification Icon with Animation */}
        <button
          aria-label='Notifications'
          className='relative p-2 text-muted-foreground hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 rounded-full'
          onClick={toggleNotification}
        >
          <Bell className='h-6 w-6' />

          {/* Notification Badge */}
          <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background animate-pulse'>
            3
          </span>

          {/* Ripple Effect on Click */}
          {isNotificationActive && (
            <span className='absolute inset-0 rounded-full animate-ping-once bg-primary/20 opacity-75'></span>
          )}
        </button>

        {/* User Profile Icon with Hover Animation */}
        <Link
          href='/profile'
          className='group relative p-2 text-muted-foreground hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50 rounded-full overflow-hidden'
        >
          <div className='relative z-10 flex items-center justify-center rounded-full'>
            <Avatar className='h-10 w-10'>
              <AvatarImage
                src={user.avatar_url || undefined}
                alt={user.full_name || 'User'}
              />
              <AvatarFallback className='bg-primary/10'>
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Background Animation on Hover */}
          <span className='absolute inset-0 rounded-full bg-primary/10 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-in-out'></span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
