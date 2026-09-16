import React from 'react';
import {
  LayoutDashboard,
  MessageSquare,
  Compass,
  Layers,
  Lightbulb,
  Target,
  Sparkles,
  CheckSquare,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NavigationRoute } from '@/types';

export interface SidebarProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentRoute,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const handleItemClick = (route: NavigationRoute) => {
    onNavigate(route);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const isFeedbackActive = currentRoute === 'feedback';
  const isExplorerActive = currentRoute === 'feedback_explorer';

  const sidebarContent = (
    <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-[#0B132B] text-slate-100 select-none">
      {/* Brand Header - Clicking opens the 3D Home Overview */}
      <div
        onClick={() => handleItemClick('landing')}
        className="flex h-16 items-center px-5 border-b border-slate-800/80 cursor-pointer hover:bg-slate-800/50 transition-colors group"
        title="View 3D Home Overview"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 text-white fill-white/20" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider text-white uppercase font-sans">
                VoC COPILOT
              </span>
              <span className="text-[9px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-1 py-0.2 rounded font-bold uppercase">
                3D
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide group-hover:text-indigo-300 transition-colors">
              Click for 3D Home
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation List: Exactly matching requested hierarchy */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {/* 1. Dashboard */}
        <button
          onClick={() => handleItemClick('dashboard')}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
            currentRoute === 'dashboard'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          )}
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                currentRoute === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              )}
            />
            <span className="font-medium text-[13px]">Dashboard</span>
          </div>
        </button>

        {/* 2. Feedback */}
        <div className="space-y-0.5">
          <button
            onClick={() => handleItemClick('feedback')}
            className={cn(
              'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
              isFeedbackActive
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
            )}
          >
            <div className="flex items-center gap-3">
              <MessageSquare
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isFeedbackActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />
              <span className="font-medium text-[13px]">Feedback</span>
            </div>
          </button>

          {/* └─ Feedback Explorer */}
          <div className="pl-4 pr-1 pt-0.5">
            <button
              onClick={() => handleItemClick('feedback_explorer')}
              className={cn(
                'group flex w-full items-center justify-between rounded-lg pl-3 pr-2.5 py-2 text-xs font-medium transition-all relative border-l-2',
                isExplorerActive
                  ? 'border-indigo-400 bg-indigo-950/80 text-white font-semibold shadow-xs'
                  : 'border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-500'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 group-hover:text-indigo-300 select-none">
                  └─
                </span>
                <Compass
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-colors',
                    isExplorerActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'
                  )}
                />
                <span className="text-[12px]">Feedback Explorer</span>
              </div>
              <span
                className={cn(
                  'rounded px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider',
                  isExplorerActive
                    ? 'bg-indigo-500 text-white'
                    : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                )}
              >
                AI
              </span>
            </button>
          </div>
        </div>

        {/* 3. Themes */}
        <button
          onClick={() => handleItemClick('themes')}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
            currentRoute === 'themes'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          )}
        >
          <div className="flex items-center gap-3">
            <Layers
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                currentRoute === 'themes' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              )}
            />
            <span className="font-medium text-[13px]">Themes</span>
          </div>
        </button>

        {/* 4. Insights */}
        <button
          onClick={() => handleItemClick('insights')}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
            currentRoute === 'insights'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          )}
        >
          <div className="flex items-center gap-3">
            <Lightbulb
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                currentRoute === 'insights' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              )}
            />
            <span className="font-medium text-[13px]">Insights</span>
          </div>
        </button>

        {/* 5. Opportunities */}
        <button
          onClick={() => handleItemClick('opportunities')}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
            currentRoute === 'opportunities'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          )}
        >
          <div className="flex items-center gap-3">
            <Target
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                currentRoute === 'opportunities' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              )}
            />
            <span className="font-medium text-[13px]">Opportunities</span>
          </div>
        </button>

        {/* 6. Copilot */}
        <button
          onClick={() => handleItemClick('copilot')}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
            currentRoute === 'copilot'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          )}
        >
          <div className="flex items-center gap-3">
            <Sparkles
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                currentRoute === 'copilot' ? 'text-white' : 'text-indigo-400 group-hover:text-indigo-300'
              )}
            />
            <span className="font-medium text-[13px]">Copilot</span>
          </div>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
              currentRoute === 'copilot'
                ? 'bg-blue-500 text-white'
                : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
            )}
          >
            AI
          </span>
        </button>

        {/* 7. Actions */}
        <button
          onClick={() => handleItemClick('actions')}
          className={cn(
            'group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-xs font-medium transition-all',
            currentRoute === 'actions' || currentRoute === 'prd'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
              : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
          )}
        >
          <div className="flex items-center gap-3">
            <CheckSquare
              className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                currentRoute === 'actions' || currentRoute === 'prd'
                  ? 'text-white'
                  : 'text-slate-400 group-hover:text-slate-200'
              )}
            />
            <span className="font-medium text-[13px]">Actions</span>
          </div>
        </button>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-800/80 p-3.5 bg-slate-950/40">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-xs text-slate-300">
          <div className="flex items-center justify-between font-medium text-white">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              VoC Pipeline
            </span>
            <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              Ready
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400 leading-tight">
            Feedback → Themes → Insights → Opportunities → Actions
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:shrink-0">{sidebarContent}</aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
