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
    // Configure widget
    (window as any).jkknbotConfig = {
      position: 'right'
      // Pass user data if available from your auth context
    };

    // Load widget script
    const script = document.createElement('script');
    script.src = 'http://localhost:3001/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script);
      const widgetContainer = document.getElementById(
        'jkknbot-widget-container'
      );
      if (widgetContainer) document.body.removeChild(widgetContainer);
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
