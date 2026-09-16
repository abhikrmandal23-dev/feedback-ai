import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Compass,
  Layers,
  ShieldCheck,
  Target,
  FileText,
  Clock,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/page-container';
import type { NavigationRoute } from '@/types';

export interface CustomerInsightItem {
  id: string;
  themeTitle: string;
  themeMentions: number;
  rawCountStatement: string;
  insightExplanation: string;
  evidenceMentions: number;
  customerImpact: 'High' | 'Medium' | 'Low';
  confidence: number;
  whyItMatters: string;
  sampleQuotes: Array<{
    quote: string;
    source: string;
    customer: string;
  }>;
}

export const CUSTOMER_INSIGHTS_DATA: CustomerInsightItem[] = [
  {
    id: 'insight-payment',
    themeTitle: 'Payment Problems',
    themeMentions: 437,
    rawCountStatement: '437 people mentioned payment.',
    insightExplanation:
      'Customers are frequently experiencing payment failures during checkout.',
    evidenceMentions: 437,
    customerImpact: 'High',
    confidence: 89,
    whyItMatters:
      'Repeated payment failures may cause customers to abandon checkout.',
    sampleQuotes: [
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
    id: 'insight-performance',
    themeTitle: 'Slow App Performance',
    themeMentions: 312,
    rawCountStatement: '312 people mentioned performance.',
    insightExplanation:
      'App latency and freezes during photo uploads impair daily checkout and app navigation.',
    evidenceMentions: 312,
    customerImpact: 'High',
    confidence: 92,
    whyItMatters:
      'Prolonged response times degrade app store ratings and decrease session conversion rates.',
    sampleQuotes: [
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
    id: 'insight-onboarding',
    themeTitle: 'Difficult Onboarding',
    themeMentions: 185,
    rawCountStatement: '185 people mentioned onboarding.',
    insightExplanation:
      'New teams struggle to discover export and sharing controls hidden deep within sub-menus.',
    evidenceMentions: 185,
    customerImpact: 'Medium',
    confidence: 84,
    whyItMatters:
      'First-week setup friction delays time-to-value and increases early customer churn.',
    sampleQuotes: [
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
    id: 'insight-support',
    themeTitle: 'Customer Support',
    themeMentions: 143,
    rawCountStatement: '143 people mentioned support.',
    insightExplanation:
      'Repetitive chatbot loops and ticket turnaround delays cause frustration with billing inquiries.',
    evidenceMentions: 143,
    customerImpact: 'Medium',
    confidence: 78,
    whyItMatters:
      'Unresolved billing inquiries damage customer trust and escalate into payment disputes.',
    sampleQuotes: [
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

interface InsightsViewProps {
  onNavigate: (route: NavigationRoute) => void;
  selectedProblemId?: string;
}

export function InsightsView({ onNavigate }: InsightsViewProps) {
  const [selectedInsightId, setSelectedInsightId] = useState<string>('insight-payment');

  const activeInsight =
    CUSTOMER_INSIGHTS_DATA.find((i) => i.id === selectedInsightId) ||
    CUSTOMER_INSIGHTS_DATA[0];

  return (
    <PageContainer
      title="Customer Insights"
      description="Convert themes into actual customer insights."
      breadcrumbs={[{ label: 'Insights' }, { label: 'Customer Insights' }]}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('themes')}
            className="text-xs gap-1.5"
          >
            <Layers className="h-3.5 w-3.5 text-zinc-500" />
            <span>View Detected Themes</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onNavigate('opportunities')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Target className="h-3.5 w-3.5" />
            <span>Prioritize Opportunities</span>
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Contrast Explainer Banner: Raw Count vs AI Customer Insight */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="px-2 py-0.5 rounded bg-zinc-100 font-mono text-[11px] font-semibold text-zinc-500 line-through">
                Instead of only:
              </span>
              <span className="font-semibold text-zinc-500 italic">
                &ldquo;{activeInsight.rawCountStatement}&rdquo;
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-blue-700 font-semibold bg-blue-50 border border-blue-200/80 px-2.5 py-1 rounded-lg">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Your system synthesizes actionable context</span>
            </div>
          </div>
        </div>

        {/* Theme Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CUSTOMER_INSIGHTS_DATA.map((item) => {
            const isSelected = item.id === activeInsight.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedInsightId(item.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
                }`}
              >
                <span>{item.themeTitle}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {item.evidenceMentions}
                </span>
              </button>
            );
          })}
        </div>

        {/* Core Customer Insight Card - Designed directly to user specifications */}
        <Card className="bg-white border-zinc-200 shadow-xs overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
                Customer Insight
              </h2>
            </div>
            <span className="text-xs text-zinc-400 font-medium">
              Theme: {activeInsight.themeTitle}
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Primary AI Explanation (Kept short and clear) */}
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug tracking-tight">
                {activeInsight.insightExplanation}
              </p>
            </div>

            {/* Three Key Indicators: Evidence, Customer Impact, Confidence */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {/* Evidence */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Evidence:
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-zinc-900 tracking-tight">
                    {activeInsight.evidenceMentions}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">mentions</span>
                </div>
              </div>

              {/* Customer impact */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Customer impact:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-2xl font-black tracking-tight ${
                      activeInsight.customerImpact === 'High'
                        ? 'text-rose-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {activeInsight.customerImpact}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      activeInsight.customerImpact === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {activeInsight.customerImpact === 'High' ? 'Critical Friction' : 'Moderate Friction'}
                  </Badge>
                </div>
              </div>

              {/* Confidence */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                  Confidence:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">
                    {activeInsight.confidence}%
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    High Accuracy
                  </Badge>
                </div>
              </div>
            </div>

            {/* Why it matters section */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Info className="h-4 w-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-950">
                  Why it matters
                </h3>
              </div>
              <p className="text-sm font-semibold text-zinc-800 leading-relaxed">
                {activeInsight.whyItMatters}
              </p>
            </div>

            {/* Supporting Customer Quotes */}
            <div className="space-y-2.5 pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Representative Mentions ({activeInsight.sampleQuotes.length}):
              </span>
              <div className="space-y-2">
                {activeInsight.sampleQuotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <p className="font-medium text-zinc-800 italic">
                      &ldquo;{q.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 shrink-0">
                      <span>{q.customer}</span>
                      <span className="text-zinc-300">•</span>
                      <span className="bg-white border border-zinc-200 px-1.5 py-0.5 rounded text-[10px] font-semibold text-zinc-600">
                        {q.source}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('feedback_explorer')}
              className="text-xs gap-1.5 text-zinc-700"
            >
              <Compass className="h-3.5 w-3.5 text-zinc-500" />
              <span>Search in Feedback Explorer</span>
            </Button>

            <Button
              size="sm"
              onClick={() => onNavigate('opportunities')}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              <span>Convert to Opportunity</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
