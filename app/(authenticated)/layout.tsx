'use client';

import { usePathname } from 'next/navigation';
import BottomBar from '@/components/BottomBar';
import Header from '@/components/Header';
import { AuthProvider } from '@/providers/auth-provider';
import AuthGuard from '@/components/auth/auth-guard';
import { useEffect } from 'react';

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Configure widget with correct config name and options
    (window as any).TacbotConfig = {
      position: 'right',
      baseUrl: process.env.NEXT_PUBLIC_WIDGET_URL || 'http://localhost:3001',
      // Store user data for the widget to access
      getUser: () => {
        const userData = localStorage.getItem('auth-user');
        if (userData) {
          try {
            const user = JSON.parse(userData);
            // Save user data in the format the widget expects
            localStorage.setItem(
              'user-details',
              JSON.stringify({
                id: user.id,
                name: user.name || user.email,
                mobile: user.phone || ''
              })
            );
            return user;
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        }
        return null;
      }
    };

    // Call the getUser function to set up user data
    (window as any).TacbotConfig.getUser();

    // Load widget script with environment-aware URL
    const widgetUrl =
      process.env.NEXT_PUBLIC_WIDGET_URL || 'http://localhost:3001';
    const script = document.createElement('script');
    script.src = `${widgetUrl}/widget.js`;
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      const widgetContainer = document.getElementById(
        'jkknbot-widget-container'
      );
      if (widgetContainer && widgetContainer.parentNode) {
        widgetContainer.parentNode.removeChild(widgetContainer);
      }
    };
  }, []);

  return (
    <AuthGuard>
      <AuthProvider>
        <div className='flex flex-col min-h-screen bg-gray-50'>
          <Header />
          <main className='flex-1 overflow-y-auto'>{children}</main>
          <BottomBar />
        </div>
      </AuthProvider>
    </AuthGuard>
  );
}
