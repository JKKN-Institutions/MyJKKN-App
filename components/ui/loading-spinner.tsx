import React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  className
}: LoadingSpinnerProps) {
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4'
  };

  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-solid border-teal-500 border-t-transparent',
          sizeClasses[size]
        )}
      />
    </div>
  );
}
