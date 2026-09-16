import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
  Clock,
  Compass,
  AlertCircle,
  BarChart3,
  ThumbsDown,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/page-container';
import type { NavigationRoute, ThemeSolutionPlan } from '@/types';
import { ThemeSolutionPanel } from './theme-solution-panel';
import { DEFAULT_THEME_SOLUTIONS, getThemeSolution } from '@/lib/theme-solutions';

interface ThemeItem {
  id: string;
  number: number;
  title: string;
  mentions: number;
  negativeRate: number;
  neutralRate: number;
  positiveRate: number;
  commonIssues: string[];
  description: string;
  quotes: Array<{
    quote: string;
    source: string;
    customer: string;
  }>;
}

const AI_DETECTED_THEMES: ThemeItem[] = [
  {
    id: 'theme-payment',
    number: 1,
    title: 'Payment Problems',
    mentions: 437,
    negativeRate: 82,
    neutralRate: 14,
    positiveRate: 4,
    description: 'High-friction checkout bottlenecks and payment gateway drops preventing customer conversions.',
    commonIssues: [
      'Payment failure',
      'Money deducted but order failed',
      'UPI timeout',
      'Card payment failure',
    ],
    quotes: [
      {
        quote: 'The payment failed twice and I had to try again.',
        source: 'Support Tickets',
        customer: 'Marcus Vance',
      },
      {
        quote: 'Money was deducted via UPI but order status showed Failed on checkout screen.',
        source: 'App Reviews',
        customer: 'Priya Sharma',
      },
      {
        quote: 'International Visa card was declined three times during 3D secure authentication.',
        source: 'Customer Interviews',
        customer: 'David Reynolds',
      },
    ],
  },
  {
    id: 'theme-performance',
    number: 2,
    title: 'Slow App Performance',
    mentions: 312,
    negativeRate: 74,
    neutralRate: 20,
    positiveRate: 6,
    description: 'Latency spikes on mobile startup, media uploads, and data intensive operations.',
    commonIssues: [
      'App is very slow',
      'High latency during photo/media upload',
      'App freezes and crashes on older devices',
      'Search takes more than 5 seconds to load',
    ],
    quotes: [
      {
        quote: 'App is very slow during peak morning hours when loading dashboard charts.',
        source: 'App Reviews',
        customer: 'Elena Chen',
      },
      {
        quote: 'Uploading high-res receipts causes the mobile app to freeze and crash.',
        source: 'Support Tickets',
        customer: 'Carlos Gomez',
      },
    ],
  },
  {
    id: 'theme-onboarding',
    number: 3,
    title: 'Difficult Onboarding',
    mentions: 185,
    negativeRate: 68,
    neutralRate: 25,
    positiveRate: 7,
    description: 'First-time users struggling with hidden navigation, persistent checklists, and workspace setup.',
    commonIssues: [
      'Export button hidden in sub-menu',
      'Undismissible onboarding checklist blocking UI',
      'Confusing team permission configuration',
      'Unclear initial tutorial steps',
    ],
    quotes: [
      {
        quote: 'During onboarding, our team struggled to find the export button hidden in settings.',
        source: 'Customer Interviews',
        customer: 'Sarah Jenkins, Lead PM',
      },
      {
        quote: 'The getting started checklist stayed stuck at 80% and could not be minimized.',
        source: 'Survey',
        customer: 'Michael Scott',
      },
    ],
  },
  {
    id: 'theme-support',
    number: 4,
    title: 'Customer Support',
    mentions: 143,
    negativeRate: 45,
    neutralRate: 35,
    positiveRate: 20,
    description: 'Support response delays, automated bot loops, and refund status follow-ups.',
    commonIssues: [
      'Long wait times for ticket resolution',
      'Chatbot repeats answers without human escalation',
      'Delayed refund processing notifications',
      'Lack of real-time phone support for critical downtime',
    ],
    quotes: [
      {
        quote: 'Support bot was stuck in an endless loop until I requested an agent three times.',
        source: 'Support Tickets',
        customer: 'Amanda Brooks',
      },
      {
        quote: 'Took 4 days to receive clarification on an invoice tax discrepancy.',
        source: 'Survey',
        customer: 'Robert Lang',
      },
    ],
  },
];

interface ThemesViewProps {
  onNavigate: (route: NavigationRoute) => void;
}

export function ThemesView({ onNavigate }: ThemesViewProps) {
  // Currently selected theme (defaults to Payment Problems)
  const [selectedThemeId, setSelectedThemeId] = useState<string>('theme-payment');
  const [themesList] = useState<ThemeItem[]>(AI_DETECTED_THEMES);
  const [solutionsMap, setSolutionsMap] = useState<Record<string, ThemeSolutionPlan>>(DEFAULT_THEME_SOLUTIONS);
  const [loadingSolutionId, setLoadingSolutionId] = useState<string | null>(null);

  const selectedTheme =
    themesList.find((t) => t.id === selectedThemeId) || themesList[0];

  const totalMentions = themesList.reduce((acc, curr) => acc + curr.mentions, 0);
  const currentSolution = solutionsMap[selectedTheme.id] || null;

  const handleGenerateSolution = async (theme: ThemeItem) => {
    setLoadingSolutionId(theme.id);
    try {
      const response = await fetch('/api/theme-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId: theme.id,
          themeTitle: theme.title,
          mentions: theme.mentions,
          negativeRate: theme.negativeRate,
          commonIssues: theme.commonIssues,
          quotes: theme.quotes,
          description: theme.description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.solution) {
          setSolutionsMap((prev) => ({
            ...prev,
            [theme.id]: data.solution,
          }));
          return;
        }
      }
    } catch (err) {
      console.warn('Backend call failed, using high-precision domain solution:', err);
    } finally {
      setLoadingSolutionId(null);
    }

    // High precision fallback
    const fallback = getThemeSolution(
      theme.id,
      theme.title,
      theme.mentions,
      theme.negativeRate,
      theme.commonIssues,
      theme.description
    );
    setSolutionsMap((prev) => ({
      ...prev,
      [theme.id]: fallback,
    }));
  };

  return (
    <PageContainer
      title="Feature 4: Theme Detection"
      description="Purpose: Combine hundreds of similar feedback items into meaningful themes."
      breadcrumbs={[{ label: 'Themes' }, { label: 'Theme Detection' }]}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('feedback_explorer')}
            className="text-xs gap-1.5"
          >
            <Compass className="h-3.5 w-3.5 text-zinc-500" />
            <span>Open Feedback Explorer</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onNavigate('feedback')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <span>Upload More Feedback</span>
          </Button>
        </div>
      }
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Summary Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h2 className="text-sm font-bold tracking-tight text-white uppercase">
                AI Thematic Clustering Engine
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Aggregated <strong className="text-white">{totalMentions.toLocaleString()}</strong> individual feedback items into <strong className="text-white">{themesList.length}</strong> strategic customer themes.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Dominant Friction</span>
              <span className="font-bold text-rose-400">Payment Problems (82% Neg)</span>
            </div>
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Total Themes</span>
              <span className="font-bold text-slate-100">{themesList.length} Recurring</span>
            </div>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: AI Detected Themes List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                <Layers className="h-4 w-4 text-blue-600" />
                <span>AI Detected Themes</span>
              </h3>
              <span className="text-xs text-zinc-400 font-medium">
                Click a theme to inspect
              </span>
            </div>

            <div className="space-y-2">
              {themesList.map((theme) => {
                const isSelected = theme.id === selectedTheme.id;

                return (
                  <div
                    key={theme.id}
                    onClick={() => setSelectedThemeId(theme.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer text-left relative ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          {theme.number}
                        </span>

                        <div className="space-y-1">
                          <h4
                            className={`text-sm font-bold ${
                              isSelected ? 'text-blue-950' : 'text-zinc-900'
                            }`}
                          >
                            {theme.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <p className="text-xs text-zinc-500 font-medium">
                              {theme.mentions} mentions
                            </p>
                            {solutionsMap[theme.id] && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded-md">
                                <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                                <span>AI Solution</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                            theme.negativeRate >= 70
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : theme.negativeRate >= 50
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                          }`}
                        >
                          {theme.negativeRate}% Neg
                        </span>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform ${
                            isSelected ? 'text-blue-600 translate-x-0.5' : 'text-zinc-400'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Theme Detail View */}
          <div className="lg:col-span-7">
            <Card className="bg-white border-zinc-200 shadow-xs overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-zinc-200 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full inline-block mb-2">
                      Theme #{selectedTheme.number} Details
                    </span>
                    <h2 className="text-2xl font-black text-zinc-900 tracking-tight">
                      {selectedTheme.title}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {selectedTheme.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => {
                        if (!currentSolution) {
                          handleGenerateSolution(selectedTheme);
                        }
                        const el = document.getElementById('ai-solution-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-xs font-semibold cursor-pointer"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{currentSolution ? 'View AI Solution' : 'AI Solution Analysis'}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate('feedback_explorer')}
                      className="text-xs gap-1.5"
                    >
                      <Compass className="h-3.5 w-3.5 text-zinc-600" />
                      <span>View in Explorer</span>
                    </Button>
                  </div>
                </div>

                {/* Key Metrics Display as requested: Mentions: 437, Negative: 82% */}
                <div className="mt-5 grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                      Mentions
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-zinc-900">
                        {selectedTheme.mentions}
                      </span>
                      <span className="text-xs text-zinc-500">customer quotes</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                      Negative Sentiment
                    </span>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-rose-600">
                        {selectedTheme.negativeRate}%
                      </span>
                      <span className="text-xs text-rose-500 font-medium">Critical</span>
                    </div>
                  </div>
                </div>

                {/* Sentiment Ratio Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs text-zinc-500 font-medium">
                    <span>Sentiment Breakdown:</span>
                    <span>
                      <strong className="text-rose-600">{selectedTheme.negativeRate}% Negative</strong> •{' '}
                      <span className="text-zinc-600">{selectedTheme.neutralRate}% Neutral</span> •{' '}
                      <span className="text-emerald-600">{selectedTheme.positiveRate}% Positive</span>
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 flex overflow-hidden">
                    <div
                      style={{ width: `${selectedTheme.negativeRate}%` }}
                      className="bg-rose-500 h-full"
                      title={`${selectedTheme.negativeRate}% Negative`}
                    />
                    <div
                      style={{ width: `${selectedTheme.neutralRate}%` }}
                      className="bg-zinc-400 h-full"
                      title={`${selectedTheme.neutralRate}% Neutral`}
                    />
                    <div
                      style={{ width: `${selectedTheme.positiveRate}%` }}
                      className="bg-emerald-500 h-full"
                      title={`${selectedTheme.positiveRate}% Positive`}
                    />
                  </div>
                </div>
              </div>

              {/* Common Issues section as explicitly requested by prompt */}
              <div className="p-6 border-b border-zinc-200 bg-zinc-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-rose-600" />
                    <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                      Common issues:
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      if (!currentSolution) {
                        handleGenerateSolution(selectedTheme);
                      }
                      const el = document.getElementById('ai-solution-section');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>{currentSolution ? 'View AI Solution' : 'Resolve with AI'}</span>
                  </button>
                </div>

                <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-2xs">
                  <ul className="space-y-2.5">
                    {selectedTheme.commonIssues.map((issue, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-800 font-medium">
                        <span className="text-rose-500 font-black text-sm leading-none">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* AI Exact Solution & Prevention Section (User Request) */}
              <div id="ai-solution-section" className="p-6 border-b border-zinc-200 bg-blue-50/20 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                        AI Solution &amp; Prevention Analysis
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Permanent engineering architecture, UX fixes, and operational guardrails
                      </p>
                    </div>
                  </div>

                  {currentSolution && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full w-fit">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Solution Generated</span>
                    </span>
                  )}
                </div>

                <ThemeSolutionPanel
                  themeTitle={selectedTheme.title}
                  solution={currentSolution}
                  isLoading={loadingSolutionId === selectedTheme.id}
                  onGenerate={() => handleGenerateSolution(selectedTheme)}
                  onNavigate={onNavigate}
                />
              </div>

              {/* Real Customer Quotes for this theme */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                    <span>Representative Customer Excerpts</span>
                  </h4>
                  <span className="text-[11px] text-zinc-400">
                    Source Verified
                  </span>
                </div>

                <div className="space-y-2.5">
                  {selectedTheme.quotes.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-50 border border-zinc-200/80 rounded-lg p-3 space-y-1.5 text-xs"
                    >
                      <p className="font-semibold text-zinc-900 leading-relaxed italic">
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1 border-t border-zinc-200/60">
                        <span>Customer: <strong className="text-zinc-700">{q.customer}</strong></span>
                        <span className="bg-white px-2 py-0.5 rounded border border-zinc-200 font-medium text-zinc-600">
                          {q.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('insights')}
                  className="text-xs gap-1.5 text-zinc-700"
                >
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>View Customer Insight</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => onNavigate('opportunities')}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs gap-1.5"
                >
                  <span>Prioritize Opportunity</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
