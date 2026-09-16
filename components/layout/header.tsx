import * as React from 'react';
import {
  Menu,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Command,
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Workspace, UserProfile, NavigationRoute } from '@/types';

export interface HeaderProps {
  onToggleMobileSidebar: () => void;
  activeWorkspace: Workspace;
  user: UserProfile;
  onOpenQuickAction?: () => void;
  onNavigate?: (route: NavigationRoute) => void;
}

export function Header({
  onToggleMobileSidebar,
  activeWorkspace,
  user,
  onOpenQuickAction,
  onNavigate,
}: HeaderProps) {
  const [searchFocused, setSearchFocused] = React.useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white/95 px-4 sm:px-6 backdrop-blur-xs">
      {/* Left side: Mobile Toggle & Workspace Switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-zinc-400"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Workspace Pill */}
        <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-800">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
          <span className="max-w-[140px] truncate font-medium">{activeWorkspace.name}</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider bg-zinc-200/70 px-1.5 py-0.5 rounded">
            {activeWorkspace.plan}
          </span>
          <ChevronDown className="h-3 w-3 text-zinc-400 ml-0.5" />
        </div>
      </div>

      {/* Center: Search / Command Palette shortcut */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search feedback, themes, opportunities..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-8 pl-8 pr-12 text-xs rounded-md border border-zinc-200 bg-zinc-50 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-zinc-400 bg-zinc-200/50 px-1.5 py-0.5 rounded border border-zinc-200">
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right side: Supabase Status, Notifications, Quick Action & User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Backend / Supabase status indicator */}
        <div className="hidden sm:flex items-center">
          {isSupabaseConfigured ? (
            <Badge variant="success" className="gap-1 text-[11px] font-normal py-0.5">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              Supabase connected
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-[11px] text-zinc-500 font-normal py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Local Mock Engine (Ready for Supabase)
            </Badge>
          )}
        </div>

        {/* Quick Action Button */}
        {onOpenQuickAction && (
          <Button
            size="sm"
            onClick={onOpenQuickAction}
            className="hidden sm:inline-flex gap-1.5 text-xs h-8 px-3"
          >
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            <span>Action</span>
          </Button>
        )}

        {/* Flow & Architecture Diagram Shortcut */}
        {onNavigate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('landing')}
            className="hidden sm:inline-flex gap-1.5 text-xs h-8 px-2.5 border-zinc-200 hover:border-blue-300 text-zinc-700"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Architecture & Flow</span>
          </Button>
        )}

        {/* Notifications */}
        <button
          className="relative rounded-md p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>

        {/* User avatar & name */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-zinc-50">
            {user.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-medium text-zinc-800 leading-none">{user.fullName}</span>
            <span className="text-[10px] text-zinc-400 capitalize mt-0.5 leading-none">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
