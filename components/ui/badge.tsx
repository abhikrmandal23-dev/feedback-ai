import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'info';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-zinc-900 text-zinc-50 shadow-xs',
    secondary: 'border-transparent bg-zinc-100 text-zinc-900',
    outline: 'text-zinc-700 border border-zinc-200 bg-white',
    success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'border-transparent bg-amber-50 text-amber-700 border border-amber-200/60',
    destructive: 'border-transparent bg-red-50 text-red-700 border border-red-200/60',
    info: 'border-transparent bg-sky-50 text-sky-700 border border-sky-200/60',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors whitespace-nowrap',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
