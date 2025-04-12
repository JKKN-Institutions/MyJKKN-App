'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { HomeIcon, LayoutGridIcon, BellIcon, UserIcon } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Dock, DockIcon } from '@/components/magicui/dock';

const BottomBar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      href: '/home',
      icon: HomeIcon
    },
    {
      label: 'Applications',
      href: '/applications',
      icon: LayoutGridIcon
    },
    {
      label: 'Notifications',
      href: '/notifications',
      icon: BellIcon
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: UserIcon
    }
  ];

  return (
    <nav className='sticky bottom-0 bg-background border-t border-border py-2 px-4 flex justify-center'>
      <TooltipProvider>
        <Dock className='max-w-md w-full mx-auto'>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href + '/') && item.href !== '/home');

            return (
              <DockIcon key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      className={cn(
                        buttonVariants({
                          variant: isActive ? 'default' : 'ghost',
                          size: 'icon'
                        }),
                        'size-12 rounded-full',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className='size-5' />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
            );
          })}
        </Dock>
      </TooltipProvider>
    </nav>
  );
};

export default BottomBar;
