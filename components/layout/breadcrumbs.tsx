import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import type { NavigationRoute } from '@/types';

export interface BreadcrumbItem {
  label: string;
  route?: NavigationRoute;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (route: NavigationRoute) => void;
}

export function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1.5 text-xs text-zinc-500 font-medium">
      <button
        onClick={() => onNavigate?.('dashboard')}
        className="flex items-center hover:text-zinc-900 transition-colors"
        title="Go to Dashboard"
      >
        <Home className="h-3.5 w-3.5" />
      </button>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="h-3 w-3 text-zinc-400 shrink-0" />
            {isLast || !item.route ? (
              <span className={isLast ? 'text-zinc-900 font-semibold truncate max-w-[200px]' : 'truncate max-w-[200px]'}>
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => item.route && onNavigate?.(item.route)}
                className="hover:text-zinc-900 transition-colors truncate max-w-[200px]"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
