import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  description?: string;
  className?: string;
}

export function LoadingState({
  message = 'Loading data...',
  description = 'Fetching the latest customer intelligence',
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[280px] flex-col items-center justify-center p-8 text-center animate-in fade-in',
        className
      )}
    >
      <div className="relative flex items-center justify-center mb-4">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
      </div>
      <p className="text-sm font-medium text-zinc-900">{message}</p>
      {description && <p className="mt-1 text-xs text-zinc-500">{description}</p>}
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return <div className={cn('h-4 w-full animate-pulse rounded bg-zinc-200/80', className)} />;
}
