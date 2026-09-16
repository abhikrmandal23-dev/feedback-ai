import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  CheckCircle2,
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Target,
  Compass,
  Layers,
  Send,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PageContainer } from '@/components/layout/page-container';
import type { NavigationRoute } from '@/types';

export interface ActionItem {
  id: string;
  opportunityTitle: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  problem: string;
  suggestedSolution: string;
  suggestedUserStory: string;
  successMetrics: string[];
}

export const ACTION_GENERATOR_DATA: ActionItem[] = [
  {
    id: 'act-payment',
    opportunityTitle: 'Payment Reliability',
    priority: 'P0',
    problem: 'Customers experience failed payments during checkout.',
    suggestedSolution: 'Improve payment retry and error handling.',
    suggestedUserStory:
      'As a customer, I want payment failures to be handled smoothly so that I can complete my purchase.',
    successMetrics: [
      'Payment success rate',
      'Checkout conversion',
      'Payment failure rate',
    ],
  },
  {
    id: 'act-performance',
    opportunityTitle: 'App Performance & Startup',
    priority: 'P0',
    problem: 'Customers experience high latency during media uploads and search.',
    suggestedSolution: 'Implement client-side media compression and cache heavy queries.',
    suggestedUserStory:
      'As a mobile user, I want instant media uploads so that I can submit receipts without app freezes.',
    successMetrics: [
      'Media upload latency',
      'App crash-free session rate',
      'Search response time (<1.5s)',
    ],
  },
  {
    id: 'act-onboarding',
    opportunityTitle: 'First-Week Onboarding',
    priority: 'P1',
    problem: 'New workspaces struggle to locate export controls and clear initial setup.',
    suggestedSolution: 'Expose export controls in the primary toolbar and add dismissible guidance.',
    suggestedUserStory:
      'As a new user, I want quick access to export features so that I can share reports with my team immediately.',
    successMetrics: [
      'Onboarding task completion rate',
      'Time-to-first-export',
      '14-day team retention',
    ],
  },
  {
    id: 'act-support',
    opportunityTitle: 'Customer Support Escalation',
    priority: 'P2',
    problem: 'Users get trapped in automated chatbot loops during billing inquiries.',
    suggestedSolution: 'Add automated agent handover after two consecutive unresolved bot responses.',
    suggestedUserStory:
      'As a customer, I want quick escalation to a human agent so that my billing dispute is resolved without delay.',
    successMetrics: [
      'First-contact resolution rate',
      'Support ticket turnaround time',
      'Billing CSAT score',
    ],
  },
  {
    id: 'act-dark-mode',
    opportunityTitle: 'Dark Mode',
    priority: 'P3',
    problem: 'Users working late hours report visual fatigue in low-light environments.',
    suggestedSolution: 'Provide an alternative dark theme palette for web and mobile interfaces.',
    suggestedUserStory:
      'As a power user, I want a dark theme toggle so that I can work comfortably in the evening.',
    successMetrics: [
      'Dark mode adoption percentage',
      'Evening session duration',
    ],
  },
];

interface ActionsViewProps {
  onNavigate: (route: NavigationRoute) => void;
}

export function ActionsView({ onNavigate }: ActionsViewProps) {
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>('act-payment');
  const [isPRDModalOpen, setIsPRDModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const activeAction =
    ACTION_GENERATOR_DATA.find((a) => a.id === selectedOpportunityId) ||
    ACTION_GENERATOR_DATA[0];

  const handleOpenPRD = () => {
    confetti({ particleCount: 35, spread: 50 });
    setIsPRDModalOpen(true);
  };

  const handleCopyMarkdown = () => {
    const md = `# PRD: ${activeAction.opportunityTitle}
*Priority: ${activeAction.priority}*

## Problem
${activeAction.problem}

## Suggested Solution
${activeAction.suggestedSolution}

## User Story
${activeAction.suggestedUserStory}

## Success Metrics
${activeAction.successMetrics.map((m) => `- ${m}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <PageContainer
      title="Action Generator"
      description="Turn customer insights into something the PM can actually use."
      breadcrumbs={[{ label: 'Actions' }, { label: 'Action Generator' }]}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('opportunities')}
            className="text-xs gap-1.5"
          >
            <Target className="h-3.5 w-3.5 text-zinc-500" />
            <span>Opportunities</span>
          </Button>
          <Button
            size="sm"
            onClick={handleOpenPRD}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Generate PRD</span>
          </Button>
        </div>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Opportunity Selector Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
            Select Opportunity:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {ACTION_GENERATOR_DATA.map((item) => {
              const isSelected = item.id === activeAction.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedOpportunityId(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <span>{item.opportunityTitle}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {item.priority}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Core Action Generator Card - Exactly matching user specifications */}
        <Card className="bg-white border-zinc-200 shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="p-6 border-b border-zinc-100 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                {activeAction.opportunityTitle}
              </h2>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold px-2.5 py-1 gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>AI Suggested Actions</span>
                </Badge>
                <Badge
                  variant="outline"
                  className={`text-xs font-bold ${
                    activeAction.priority === 'P0'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : activeAction.priority === 'P1'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                  }`}
                >
                  Priority: {activeAction.priority}
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* 1. Problem */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Problem:
              </span>
              <p className="text-base font-semibold text-zinc-900 leading-snug">
                {activeAction.problem}
              </p>
            </div>

            {/* 2. Suggested solution */}
            <div className="space-y-1.5 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                Suggested solution:
              </span>
              <p className="text-sm font-semibold text-zinc-800 leading-relaxed">
                {activeAction.suggestedSolution}
              </p>
            </div>

            {/* 3. Suggested user story */}
            <div className="space-y-1.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                Suggested user story:
              </span>
              <p className="text-xs sm:text-sm font-medium text-zinc-800 italic leading-relaxed">
                &ldquo;{activeAction.suggestedUserStory}&rdquo;
              </p>
            </div>

            {/* 4. Success Metrics */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block">
                Success Metrics:
              </span>
              <div className="space-y-2">
                {activeAction.successMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 text-xs font-semibold text-zinc-800"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card Footer: [ Generate PRD ] */}
          <div className="p-6 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-medium">
              Ready to hand off to engineering?
            </span>
            <Button
              onClick={handleOpenPRD}
              size="sm"
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold gap-1.5 h-9 px-4 shadow-xs"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Generate PRD</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Lightweight PRD Preview Dialog */}
      <Dialog
        open={isPRDModalOpen}
        onOpenChange={setIsPRDModalOpen}
        title={`PRD: ${activeAction.opportunityTitle}`}
        description="One-click PRD generated directly from AI Suggested Actions."
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="text-xs gap-1.5"
            >
              {copiedToast ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsPRDModalOpen(false)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
            >
              Done
            </Button>
          </div>
        }
      >
        <div className="space-y-4 py-2 text-xs">
          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between">
            <span className="font-semibold text-zinc-700">Priority Level:</span>
            <Badge className="bg-zinc-900 text-white text-[10px]">
              {activeAction.priority}
            </Badge>
          </div>

          <div>
            <span className="font-bold text-zinc-900 block mb-1">1. Problem Statement</span>
            <p className="text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
              {activeAction.problem}
            </p>
          </div>

          <div>
            <span className="font-bold text-zinc-900 block mb-1">2. Proposed Solution</span>
            <p className="text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200">
              {activeAction.suggestedSolution}
            </p>
          </div>

          <div>
            <span className="font-bold text-zinc-900 block mb-1">3. User Story</span>
            <p className="text-zinc-600 bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 italic">
              &ldquo;{activeAction.suggestedUserStory}&rdquo;
            </p>
          </div>

          <div>
            <span className="font-bold text-zinc-900 block mb-1">4. Target Success Metrics</span>
            <ul className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 space-y-1">
              {activeAction.successMetrics.map((metric, i) => (
                <li key={i} className="flex items-center gap-2 text-zinc-700">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Dialog>
    </PageContainer>
  );
}
