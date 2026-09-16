import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Header } from './header';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { FeedbackView } from '@/components/feedback/feedback-view';
import { FeedbackExplorerView } from '@/components/feedback/feedback-explorer-view';
import { FeedbackUploadView } from '@/components/feedback-upload/feedback-upload-view';
import { InsightsView } from '@/components/insights/insights-view';
import { ThemesView } from '@/components/themes/themes-view';
import { OpportunitiesView } from '@/components/opportunities/opportunities-view';
import { CopilotView } from '@/components/copilot/copilot-view';
import { ActionsView } from '@/components/actions/actions-view';
import { SettingsView } from '@/components/settings/settings-view';
import { LandingView } from '@/components/landing/landing-view';
import { ImageSwitcherBanner } from '@/components/image-views/image-switcher-banner';
import { ImageView1VocHub } from '@/components/image-views/image-view-1-voc-hub';
import { ImageView2DashInsights } from '@/components/image-views/image-view-2-dash-insights';
import { ImageView3FeedbackStudio } from '@/components/image-views/image-view-3-feedback-studio';
import { ImageView4ChannelAnalytics } from '@/components/image-views/image-view-4-channel-analytics';
import { ImageView5ProductCockpit } from '@/components/image-views/image-view-5-product-cockpit';
import { ImageView6AiTrendCenter } from '@/components/image-views/image-view-6-ai-trend-center';
import { ImageView7AlexWorkspace } from '@/components/image-views/image-view-7-alex-workspace';
import type { NavigationRoute, Workspace, UserProfile } from '@/types';

const defaultWorkspace: Workspace = {
  id: 'ws-acme-01',
  name: 'Acme SaaS',
  slug: 'acme-saas',
  plan: 'growth',
  createdAt: '2026-01-15T00:00:00Z',
  memberCount: 8,
};

const defaultUser: UserProfile = {
  id: 'usr-pm-01',
  email: 'pm@acmesaas.com',
  fullName: 'Alex Rivera',
  role: 'product_manager',
  workspaceId: 'ws-acme-01',
};

export function AppShell() {
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as NavigationRoute;
      const validRoutes: NavigationRoute[] = [
        'landing',
        'dashboard',
        'feedback',
        'feedback_explorer',
        'themes',
        'insights',
        'opportunities',
        'copilot',
        'actions',
        'prd',
        'settings',
      ];
      if (validRoutes.includes(hash)) return hash;
    }
    return 'landing';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [copilotQuery, setCopilotQuery] = useState('');

  // Sync route with URL hash for easy bookmarking and browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as NavigationRoute;
      const validRoutes: NavigationRoute[] = [
        'landing',
        'dashboard',
        'feedback',
        'feedback_explorer',
        'themes',
        'insights',
        'opportunities',
        'copilot',
        'actions',
        'prd',
        'settings',
        'voc_hub',
        'dash_insights',
        'feedback_studio',
        'channel_analytics',
        'product_cockpit',
        'ai_trend_center',
        'alex_workspace',
      ];
      if (validRoutes.includes(hash)) {
        setCurrentRoute(hash);
      } else if (!hash) {
        setCurrentRoute('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route: NavigationRoute) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentRoute) {
      case 'landing':
        return <LandingView onNavigate={handleNavigate} />;
      case 'voc_hub':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <ImageView1VocHub />
          </div>
        );
      case 'dash_insights':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <ImageView2DashInsights />
          </div>
        );
      case 'feedback_studio':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <ImageView3FeedbackStudio />
          </div>
        );
      case 'channel_analytics':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <ImageView4ChannelAnalytics />
          </div>
        );
      case 'product_cockpit':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <ImageView5ProductCockpit />
          </div>
        );
      case 'ai_trend_center':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <ImageView6AiTrendCenter />
          </div>
        );
      case 'alex_workspace':
        return (
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <ImageView7AlexWorkspace
              onAskCopilot={(query) => {
                setCopilotQuery(query);
                handleNavigate('copilot');
              }}
            />
          </div>
        );
      case 'dashboard':
        return (
          <DashboardView
            onNavigate={handleNavigate}
            onAskCopilot={(query) => {
              setCopilotQuery(query);
              handleNavigate('copilot');
            }}
          />
        );
      case 'feedback':
        return (
          <FeedbackView
            onNavigate={handleNavigate}
            onOpenQuickModal={() => setIsQuickModalOpen(true)}
          />
        );
      case 'feedback_explorer':
        return (
          <FeedbackExplorerView onNavigate={handleNavigate} />
        );
      case 'insights':
        return <InsightsView onNavigate={handleNavigate} />;
      case 'themes':
        return <ThemesView onNavigate={handleNavigate} />;
      case 'opportunities':
        return <OpportunitiesView onNavigate={handleNavigate} />;
      case 'copilot':
        return (
          <CopilotView
            onNavigate={handleNavigate}
            initialQuery={copilotQuery}
          />
        );
      case 'actions':
      case 'prd':
        return <ActionsView onNavigate={handleNavigate} />;
      case 'settings':
        return (
          <SettingsView
            onNavigate={handleNavigate}
            workspace={defaultWorkspace}
            user={defaultUser}
          />
        );
      default:
        return (
          <DashboardView
            onNavigate={handleNavigate}
            onAskCopilot={(query) => {
              setCopilotQuery(query);
              handleNavigate('copilot');
            }}
          />
        );
    }
  };

  // Full-bleed 3D Landing & Home Page
  if (currentRoute === 'landing') {
    return (
      <div className="h-screen w-screen overflow-y-auto bg-[#030712]">
        <LandingView onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 font-sans text-zinc-900 antialiased">
      {/* Persistent / Responsive Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Container Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Quick Image Switcher Banner only for image previews */}
        {['voc_hub', 'dash_insights', 'feedback_studio', 'channel_analytics', 'product_cockpit', 'ai_trend_center', 'alex_workspace'].includes(currentRoute) && (
          <ImageSwitcherBanner
            currentRoute={currentRoute}
            onSelectRoute={handleNavigate}
          />
        )}

        {/* Top Header Navigation */}
        <Header
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          activeWorkspace={defaultWorkspace}
          user={defaultUser}
          onOpenQuickAction={() => setIsQuickModalOpen(true)}
          onNavigate={handleNavigate}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/70">
          {renderActiveView()}
        </main>
      </div>

      {/* Reusable Modal / Dialog Component Demonstration */}
      <Dialog
        open={isQuickModalOpen}
        onOpenChange={setIsQuickModalOpen}
        title="Add Customer Feedback"
        description="Quick-entry dialog component. In Part 2, submitting will store into Supabase and queue AI categorization."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsQuickModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => setIsQuickModalOpen(false)}>
              Save Record (Mock)
            </Button>
          </>
        }
      >
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Customer / Account</label>
            <input
              type="text"
              placeholder="e.g. Acme Enterprise (Tier 1)"
              className="w-full h-8 px-2.5 text-xs rounded-md border border-zinc-200 bg-white focus:outline-none focus:border-zinc-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Source Channel</label>
            <select className="w-full h-8 px-2 text-xs rounded-md border border-zinc-200 bg-white text-zinc-700 focus:outline-none focus:border-zinc-400">
              <option>Zendesk Support Ticket</option>
              <option>Intercom Chat</option>
              <option>G2 Review</option>
              <option>Customer Advisory Board</option>
              <option>Sales Call (Gong)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1">Customer Quote / Feedback</label>
            <textarea
              rows={3}
              placeholder="Enter exact verbatim feedback from the customer..."
              className="w-full p-2.5 text-xs rounded-md border border-zinc-200 bg-white focus:outline-none focus:border-zinc-400 resize-none"
            />
          </div>
          <div className="rounded-md bg-zinc-50 p-2 text-[11px] text-zinc-500 border border-zinc-100 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Target table: <code className="font-mono text-zinc-700">public.feedback</code> in Supabase</span>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
