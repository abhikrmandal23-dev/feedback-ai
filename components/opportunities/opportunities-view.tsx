import React, { useState } from 'react';
import {
  Target,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  Sparkles,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  Layers,
  ChevronDown,
  X,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PageContainer } from '@/components/layout/page-container';
import type { NavigationRoute } from '@/types';

export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3';
export type ScoreLevel = 'High' | 'Medium' | 'Low';

export interface Opportunity {
  id: string;
  title: string;
  impact: ScoreLevel;
  frequency: ScoreLevel;
  confidence: number;
  priority: PriorityLevel;
  // Simple scoring attributes: Frequency + Customer Impact + Business Impact
  customerImpact: ScoreLevel;
  businessImpact: ScoreLevel;
  mentionsCount: number;
  description: string;
  whyItMatters: string;
  derivedFromTheme?: string;
}

const LEVEL_SCORE_MAP: Record<ScoreLevel, number> = {
  High: 3,
  Medium: 2,
  Low: 1,
};

// Simple scoring calculation: Frequency + Customer Impact + Business Impact (Score range: 3 to 9)
export function calculateSimplePriority(
  frequency: ScoreLevel,
  customerImpact: ScoreLevel,
  businessImpact: ScoreLevel
): { totalScore: number; priority: PriorityLevel } {
  const f = LEVEL_SCORE_MAP[frequency];
  const c = LEVEL_SCORE_MAP[customerImpact];
  const b = LEVEL_SCORE_MAP[businessImpact];
  const totalScore = f + c + b;

  let priority: PriorityLevel = 'P3';
  if (totalScore >= 8) {
    priority = 'P0';
  } else if (totalScore >= 6) {
    priority = 'P1';
  } else if (totalScore >= 4) {
    priority = 'P2';
  } else {
    priority = 'P3';
  }

  return { totalScore, priority };
}

// Initial opportunities featuring the user's explicit examples:
// 1. "Improve Payment Reliability" (Impact: High, Frequency: High, Confidence: 89%, Priority: P0)
// 2. "Dark Mode" (Impact: Low, Frequency: Low, Confidence: 72%, Priority: P3)
const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-payment',
    title: 'Improve Payment Reliability',
    impact: 'High',
    frequency: 'High',
    confidence: 89,
    priority: 'P0',
    customerImpact: 'High',
    businessImpact: 'High',
    mentionsCount: 437,
    description: 'Resolve checkout gateway timeouts, UPI payment drops, and 3D Secure verification failures.',
    whyItMatters: 'Directly recovers abandoned revenue and fixes the top customer friction during checkout.',
    derivedFromTheme: 'Payment Problems',
  },
  {
    id: 'opp-performance',
    title: 'Optimize App Performance & Startup',
    impact: 'High',
    frequency: 'High',
    confidence: 92,
    priority: 'P0',
    customerImpact: 'High',
    businessImpact: 'Medium',
    mentionsCount: 312,
    description: 'Eliminate 5-second search latency and resolve app freezes during photo/media uploads.',
    whyItMatters: 'Improves daily active user retention and prevents 1-star app store review spikes.',
    derivedFromTheme: 'Slow App Performance',
  },
  {
    id: 'opp-onboarding',
    title: 'Streamline First-Week Onboarding',
    impact: 'Medium',
    frequency: 'Medium',
    confidence: 84,
    priority: 'P1',
    customerImpact: 'Medium',
    businessImpact: 'Medium',
    mentionsCount: 185,
    description: 'Prominently expose export controls and unblock the persistent 80% onboarding checklist.',
    whyItMatters: 'Accelerates time-to-value for newly invited team workspaces.',
    derivedFromTheme: 'Difficult Onboarding',
  },
  {
    id: 'opp-support',
    title: 'Automate Support Bot Escalation',
    impact: 'Medium',
    frequency: 'Medium',
    confidence: 78,
    priority: 'P2',
    customerImpact: 'Medium',
    businessImpact: 'Low',
    mentionsCount: 143,
    description: 'Route recurring invoice and billing questions to human representatives after 2 automated attempts.',
    whyItMatters: 'Reduces repeat ticket turnaround times and stops support loop frustration.',
    derivedFromTheme: 'Customer Support',
  },
  {
    id: 'opp-dark-mode',
    title: 'Dark Mode',
    impact: 'Low',
    frequency: 'Low',
    confidence: 72,
    priority: 'P3',
    customerImpact: 'Low',
    businessImpact: 'Low',
    mentionsCount: 28,
    description: 'Provide an alternative dark theme palette for web and mobile interfaces.',
    whyItMatters: 'Cosmetic preference requested by a minority of users; minimal effect on conversion.',
  },
];

interface OpportunitiesViewProps {
  onNavigate: (route: NavigationRoute) => void;
}

export function OpportunitiesView({ onNavigate }: OpportunitiesViewProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [selectedFilter, setSelectedFilter] = useState<'All' | PriorityLevel>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<Opportunity | null>(null);

  // New Opportunity Form State
  const [newTitle, setNewTitle] = useState('');
  const [newFreq, setNewFreq] = useState<ScoreLevel>('High');
  const [newCustImpact, setNewCustImpact] = useState<ScoreLevel>('High');
  const [newBizImpact, setNewBizImpact] = useState<ScoreLevel>('High');
  const [newConfidence, setNewConfidence] = useState(85);

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const { priority } = calculateSimplePriority(newFreq, newCustImpact, newBizImpact);

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      title: newTitle.trim(),
      impact: newCustImpact,
      frequency: newFreq,
      confidence: newConfidence,
      priority,
      customerImpact: newCustImpact,
      businessImpact: newBizImpact,
      mentionsCount: newFreq === 'High' ? 240 : newFreq === 'Medium' ? 95 : 20,
      description: `Opportunity scored using Frequency (${newFreq}), Customer Impact (${newCustImpact}), and Business Impact (${newBizImpact}).`,
      whyItMatters: 'Identified through customer feedback analysis.',
    };

    setOpportunities([newOpp, ...opportunities]);
    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const handleGeneratePRD = (oppTitle: string) => {
    confetti({ particleCount: 40, spread: 60 });
    onNavigate('actions');
  };

  const filteredOpportunities = opportunities.filter(
    (opp) => selectedFilter === 'All' || opp.priority === selectedFilter
  );

  return (
    <PageContainer
      title="Product Opportunities"
      description="Help PMs decide what deserves attention first using simple MVP scoring."
      breadcrumbs={[{ label: 'Opportunities' }, { label: 'Prioritization' }]}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('insights')}
            className="text-xs gap-1.5"
          >
            <Compass className="h-3.5 w-3.5 text-zinc-500" />
            <span>Review Insights</span>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Opportunity</span>
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Simple Scoring Formula Banner */}
        <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                  Simple Scoring (MVP)
                </h3>
              </div>
              <p className="text-xs text-zinc-600 font-medium">
                Score Formula: <strong className="text-zinc-900">Frequency + Customer Impact + Business Impact</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="font-semibold text-zinc-700">P0: Score 8–9</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-zinc-700">P1: Score 6–7</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-zinc-700">P2: Score 4–5</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-lg">
                <span className="h-2 w-2 rounded-full bg-zinc-400" />
                <span className="font-semibold text-zinc-700">P3: Score 3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Filter Bar */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-zinc-500 mr-1">Filter Priority:</span>
            {(['All', 'P0', 'P1', 'P2', 'P3'] as const).map((filter) => {
              const isSelected = selectedFilter === filter;
              const count =
                filter === 'All'
                  ? opportunities.length
                  : opportunities.filter((o) => o.priority === filter).length;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <span>{filter}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isSelected ? 'bg-zinc-800 text-zinc-300' : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
            Showing {filteredOpportunities.length} opportunities
          </span>
        </div>

        {/* Product Opportunities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => {
            const isP0 = opp.priority === 'P0';
            const isP1 = opp.priority === 'P1';
            const isP2 = opp.priority === 'P2';
            const isP3 = opp.priority === 'P3';

            return (
              <div
                key={opp.id}
                className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between relative group"
              >
                {/* Card Body */}
                <div className="space-y-4">
                  {/* Opportunity Title */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-zinc-900 leading-snug tracking-tight">
                      {opp.title}
                    </h3>
                  </div>

                  {/* Core Metrics: Impact, Frequency, Confidence */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500 font-medium">Impact:</span>
                      <span className="font-bold text-zinc-800">{opp.impact}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500 font-medium">Frequency:</span>
                      <span className="font-bold text-zinc-800">{opp.frequency}</span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                      <span className="text-zinc-500 font-medium">Confidence:</span>
                      <span className="font-bold text-zinc-800">{opp.confidence}%</span>
                    </div>
                  </div>

                  {/* Priority Display */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500">
                      Priority:
                    </span>
                    <span
                      className={`text-sm font-black px-3 py-1 rounded-lg border tracking-wide ${
                        isP0
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isP1
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : isP2
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      {opp.priority}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedOppForDetail(opp)}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                  >
                    View Scoring Breakdown
                  </button>

                  <Button
                    size="sm"
                    onClick={() => handleGeneratePRD(opp.title)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold gap-1.5 h-8 shadow-xs"
                  >
                    <FileText className="h-3 w-3" />
                    <span>Generate PRD</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunity Detail & Scoring Inspection Dialog */}
      <Dialog
        open={Boolean(selectedOppForDetail)}
        onOpenChange={(open) => !open && setSelectedOppForDetail(null)}
        title={selectedOppForDetail?.title || 'Opportunity Details'}
        description="Simple MVP scoring breakdown: Frequency + Customer Impact + Business Impact"
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedOppForDetail(null)}
              className="text-xs"
            >
              Close
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const title = selectedOppForDetail?.title || '';
                setSelectedOppForDetail(null);
                handleGeneratePRD(title);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Generate PRD</span>
            </Button>
          </div>
        }
      >
        {selectedOppForDetail && (
          <div className="space-y-4 py-2 text-xs">
            {/* Priority Banner */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Assigned Priority
                </span>
                <span className="text-xl font-black text-zinc-900">
                  {selectedOppForDetail.priority}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                  Confidence
                </span>
                <span className="text-base font-bold text-emerald-600">
                  {selectedOppForDetail.confidence}%
                </span>
              </div>
            </div>

            {/* 3 Simple Scoring Inputs */}
            <div>
              <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                Simple Scoring Breakdown
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
                  <span className="text-[10px] text-zinc-500 font-semibold block mb-0.5">
                    Frequency
                  </span>
                  <span className="text-sm font-bold text-zinc-900">
                    {selectedOppForDetail.frequency}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    ({LEVEL_SCORE_MAP[selectedOppForDetail.frequency]} pts)
                  </span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
                  <span className="text-[10px] text-zinc-500 font-semibold block mb-0.5">
                    Customer Impact
                  </span>
                  <span className="text-sm font-bold text-zinc-900">
                    {selectedOppForDetail.customerImpact}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    ({LEVEL_SCORE_MAP[selectedOppForDetail.customerImpact]} pts)
                  </span>
                </div>

                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-center">
                  <span className="text-[10px] text-zinc-500 font-semibold block mb-0.5">
                    Business Impact
                  </span>
                  <span className="text-sm font-bold text-zinc-900">
                    {selectedOppForDetail.businessImpact}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5">
                    ({LEVEL_SCORE_MAP[selectedOppForDetail.businessImpact]} pts)
                  </span>
                </div>
              </div>
            </div>

            {/* Description & Why it matters */}
            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/50">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                  Context & Scope
                </span>
                <p className="text-zinc-700 font-medium">
                  {selectedOppForDetail.description}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50">
                <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block mb-1">
                  Why it matters
                </span>
                <p className="text-zinc-800 font-medium">
                  {selectedOppForDetail.whyItMatters}
                </p>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Add Opportunity Dialog */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Add Product Opportunity"
        description="Quickly score a candidate using Frequency + Customer Impact + Business Impact."
        footer={
          <div className="flex items-center justify-end gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="create-opportunity-form"
              size="sm"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
            >
              Save Opportunity
            </Button>
          </div>
        }
      >
        <form
          id="create-opportunity-form"
          onSubmit={handleCreateOpportunity}
          className="space-y-4 py-2 text-xs"
        >
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1">
              Opportunity Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Improve Payment Reliability"
              className="w-full text-xs px-3 py-2 rounded-lg border border-zinc-300 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                Frequency
              </label>
              <select
                value={newFreq}
                onChange={(e) => setNewFreq(e.target.value as ScoreLevel)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-800 focus:outline-none focus:border-blue-500"
              >
                <option value="High">High (3 pts)</option>
                <option value="Medium">Medium (2 pts)</option>
                <option value="Low">Low (1 pt)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                Customer Impact
              </label>
              <select
                value={newCustImpact}
                onChange={(e) => setNewCustImpact(e.target.value as ScoreLevel)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-800 focus:outline-none focus:border-blue-500"
              >
                <option value="High">High (3 pts)</option>
                <option value="Medium">Medium (2 pts)</option>
                <option value="Low">Low (1 pt)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                Business Impact
              </label>
              <select
                value={newBizImpact}
                onChange={(e) => setNewBizImpact(e.target.value as ScoreLevel)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 bg-white text-zinc-800 focus:outline-none focus:border-blue-500"
              >
                <option value="High">High (3 pts)</option>
                <option value="Medium">Medium (2 pts)</option>
                <option value="Low">Low (1 pt)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-zinc-600">
                Confidence: {newConfidence}%
              </label>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={newConfidence}
              onChange={(e) => setNewConfidence(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between">
            <span className="text-xs text-zinc-600 font-medium">
              Calculated Priority:
            </span>
            <span className="text-sm font-black text-zinc-900">
              {calculateSimplePriority(newFreq, newCustImpact, newBizImpact).priority}
            </span>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
}
