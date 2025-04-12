'use client';

import { usePathname } from 'next/navigation';
import BottomBar from '@/components/BottomBar';
import Header from '@/components/Header';
import { AuthProvider } from '@/providers/auth-provider';
import AuthGuard from '@/components/auth/auth-guard';

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode;
}) {
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
