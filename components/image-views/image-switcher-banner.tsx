import React from 'react';
import {
  Layers,
  Sparkles,
  BarChart3,
  Sliders,
  CheckCircle2,
  Gauge,
  TrendingUp,
  User,
  Image as ImageIcon,
} from 'lucide-react';
import type { NavigationRoute } from '@/types';

export interface ImageSwitcherBannerProps {
  currentRoute: NavigationRoute;
  onSelectRoute: (route: NavigationRoute) => void;
}

const imageViews: { id: NavigationRoute; label: string; imageNum: number; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'voc_hub', label: 'VoC Channel Hub', imageNum: 1, desc: 'Image 1: Multi-source scores, trend & complaints', icon: BarChart3 },
  { id: 'dash_insights', label: 'Dash PM Insights', imageNum: 2, desc: 'Image 2: Feature requests, areas, ARR leaders', icon: Sliders },
  { id: 'feedback_studio', label: 'Feedback Studio', imageNum: 3, desc: 'Image 3: Aspect filters & 2,421 samples', icon: Layers },
  { id: 'channel_analytics', label: 'Channel Analytics', imageNum: 4, desc: 'Image 4: Zendesk, OpenAI & App Store summary', icon: Sparkles },
  { id: 'product_cockpit', label: 'Product Cockpit', imageNum: 5, desc: 'Image 5: CSAT Speedometer Gauge & Churn', icon: Gauge },
  { id: 'ai_trend_center', label: 'AI Trend Center', imageNum: 6, desc: 'Image 6: 15,443 mentions & trend surge', icon: TrendingUp },
  { id: 'alex_workspace', label: 'Alex Workspace', imageNum: 7, desc: 'Image 7: PM Copilot search & trending themes', icon: User },
];

export function ImageSwitcherBanner({ currentRoute, onSelectRoute }: ImageSwitcherBannerProps) {
  const isAnyImageView = imageViews.some((v) => v.id === currentRoute);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-b border-indigo-900/60 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-xs">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight">Screens from Images</span>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-400/30">
                7 Replicas Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct pixel-accurate reproductions of your 7 uploaded Product Management interfaces
            </p>
          </div>
        </div>

        {/* Scrollable switcher pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectRoute('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              !isAnyImageView
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
            }`}
          >
            <span>Core Suite</span>
          </button>

          {imageViews.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectRoute(item.id)}
                title={item.desc}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-500 text-white font-bold shadow-xs ring-2 ring-indigo-400/50'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white'
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-400/30 text-[10px] font-mono">
                  {item.imageNum}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
