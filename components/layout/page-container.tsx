import * as React from 'react';
import { cn } from '@/lib/utils';
import { Breadcrumbs, BreadcrumbItem } from './breadcrumbs';
import type { NavigationRoute } from '@/types';

export interface PageContainerProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onNavigate?: (route: NavigationRoute) => void;
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({
  title,
  description,
  badge,
  breadcrumbs,
  actions,
  onNavigate,
  children,
  className,
}: PageContainerProps) {
  return (
    <div className={cn('min-h-full flex flex-col', className)}>
      {/* Top Header Section */}
      <div className="border-b border-zinc-200 bg-white px-6 py-5 sm:px-8">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mb-3">
            <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">
                {title}
              </h1>
              {badge}
            </div>
            {description && (
              <p className="text-sm text-zinc-500 max-w-3xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
        </div>
      </div>

      {/* Main Page Content */}
      <div className="flex-1 p-6 sm:p-8 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
