import React from 'react';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Zap,
  Target,
  CheckCircle,
  MessageSquare,
  Mail,
  HelpCircle,
  ThumbsUp,
  Share2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const feedbackSourcesData = [
  { source: 'Surveys', count: '1,256', pct: 8 },
  { source: 'Support Tickets', count: '3,892', pct: 25 },
  { source: 'Product Reviews', count: '2,745', pct: 18 },
  { source: 'Live Chat', count: '1,032', pct: 7 },
  { source: 'Social Media', count: '4,621', pct: 30 },
  { source: 'Emails', count: '1,897', pct: 12 },
];

const sentimentData = [
  { name: 'Positive', value: 62, color: '#10b981' },
  { name: 'Neutral', value: 23, color: '#f59e0b' },
  { name: 'Negative', value: 15, color: '#ef4444' },
];

const emergingTrends = [
  { id: 1, title: 'Delivery Delays', change: '+68%', isUp: true, severity: 'critical', desc: 'Spike in logistics complaints post supplier transition' },
  { id: 2, title: 'Login Issues', change: '+42%', isUp: true, severity: 'warning', desc: 'Session drops on Android v2.5 app build' },
  { id: 3, title: 'Product Quality', change: '+35%', isUp: true, severity: 'positive', desc: 'Hardware durability praise on recent cohort' },
  { id: 4, title: 'Customer Support', change: '-18%', isUp: false, severity: 'positive', desc: 'Escalation response time dropped from 4h to 18m' },
  { id: 5, title: 'Pricing Concerns', change: '+5%', isUp: true, severity: 'neutral', desc: 'Annual renewal queries in enterprise tier' },
];

const topFeedbackWords = [
  { word: 'delivery', count: 3200, size: 'text-2xl font-bold text-rose-700 bg-rose-50 border-rose-200' },
  { word: 'good', count: 2800, size: 'text-xl font-bold text-emerald-700 bg-emerald-50 border-emerald-200' },
  { word: 'support', count: 2400, size: 'text-lg font-semibold text-blue-700 bg-blue-50 border-blue-200' },
  { word: 'app', count: 3500, size: 'text-3xl font-extrabold text-indigo-700 bg-indigo-50 border-indigo-200' },
  { word: 'product', count: 2100, size: 'text-base font-semibold text-purple-700 bg-purple-50 border-purple-200' },
  { word: 'fast', count: 1800, size: 'text-lg font-bold text-teal-700 bg-teal-50 border-teal-200' },
  { word: 'refund', count: 1600, size: 'text-base font-medium text-amber-700 bg-amber-50 border-amber-200' },
  { word: 'update', count: 1950, size: 'text-lg font-semibold text-sky-700 bg-sky-50 border-sky-200' },
  { word: 'easy', count: 2200, size: 'text-xl font-bold text-emerald-600 bg-emerald-50 border-emerald-200' },
];

export function ImageView6AiTrendCenter() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual reference badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-indigo-900/10 border border-indigo-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-indigo-600 text-white font-mono text-xs">Image 6 Replica</Badge>
          <span className="text-sm font-semibold text-indigo-950">
            AI-Powered Sentiment and Trend Analysis Command Center
          </span>
        </div>
        <div className="text-xs text-indigo-700 font-medium">
          Source: Executive hero analysis with 15,443 mentions, 68% delivery surge trend, and value loop banner
        </div>
      </div>

      {/* Hero Header from Image 6 */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-[#0B132B] text-white rounded-3xl p-8 shadow-xl border border-indigo-900/50 space-y-5">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Next-Gen Customer Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            AI-Powered Sentiment and Trend Analysis
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Understand how customers feel. Discover trends that matter. Take action that drives loyalty.
          </p>
        </div>

        {/* 5 Capability Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {[
            'AI-Powered Insights',
            'Understand Sentiment',
            'Spot Emerging Trends',
            'Take Action Faster',
            'Better Customer Outcomes',
          ].map((pill) => (
            <span
              key={pill}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/15 border border-white/15 text-slate-200 transition-colors"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Three-Column Core Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: Feedback Sources */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Feedback Sources</h3>
              <span className="text-xs text-slate-400 font-semibold">6 Ingestion Streams</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Volume breakdown across integrated channels</p>

            <div className="space-y-3">
              {feedbackSourcesData.map((item) => (
                <div key={item.source} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">{item.source}</span>
                    <span className="font-mono font-bold text-slate-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${item.pct * 3}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Mentions</span>
                <span className="text-2xl font-extrabold text-slate-900">15,443</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +11% vs last week
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Sentiment Overview */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Sentiment Overview</h3>
              <Badge variant="outline" className="text-[10px] font-mono text-slate-500">15,443 Total</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-2">Aggregate customer perception distribution</p>

            {/* Donut Chart */}
            <div className="h-44 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sentimentData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${val}%`, 'Share']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900">62%</span>
                <span className="text-[10px] font-semibold text-emerald-600 uppercase">Positive</span>
              </div>
            </div>
          </div>

          {/* Sentiment Stat Pills */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div className="p-2 bg-emerald-50/70 rounded-xl">
              <span className="block text-[11px] font-medium text-emerald-800">Positive</span>
              <span className="text-lg font-extrabold text-emerald-950 font-mono">62%</span>
            </div>
            <div className="p-2 bg-amber-50/70 rounded-xl">
              <span className="block text-[11px] font-medium text-amber-800">Neutral</span>
              <span className="text-lg font-extrabold text-amber-950 font-mono">23%</span>
            </div>
            <div className="p-2 bg-rose-50/70 rounded-xl">
              <span className="block text-[11px] font-medium text-rose-800">Negative</span>
              <span className="text-lg font-extrabold text-rose-950 font-mono">15%</span>
            </div>
          </div>
        </div>

        {/* Column 3: Top Emerging Trends */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Top Emerging Trends</h3>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mb-3">Topics with greatest velocity changes</p>

            <div className="space-y-2.5">
              {emergingTrends.map((trend) => (
                <div
                  key={trend.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono text-[11px]">{trend.id}.</span>
                      {trend.title}
                    </span>
                    <p className="text-[10px] text-slate-500 truncate w-40">{trend.desc}</p>
                  </div>

                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md flex items-center gap-0.5 ${
                      trend.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800'
                        : trend.severity === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {trend.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {trend.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 text-center">
            <span className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
              Explore All 38 Trend Clusters &rarr;
            </span>
          </div>
        </div>
      </div>

      {/* Lower Section: AI Insights Callouts & Top Words in Feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* AI Insights */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">AI Insights</h3>
            </div>
            <Badge variant="outline" className="text-[10px] text-indigo-700 bg-indigo-50 border-indigo-200">
              Live Synthesis
            </Badge>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Delivery Delays Spiked 68%
              </span>
              <p className="text-slate-700 leading-relaxed font-normal">
                Complaints are localized to the Midwest fulfillment hub following the courier contract transition on Monday.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Login Issues Trending Upward
              </span>
              <p className="text-slate-700 leading-relaxed font-normal">
                42% surge in Android authentication timeout tickets following the v2.5 client bundle deployment.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Customers Love Mobile App Update
              </span>
              <p className="text-slate-700 leading-relaxed font-normal">
                Positive mentions around 1-click checkout and dark mode increased 5-star app store ratings by 12%.
              </p>
            </div>
          </div>
        </div>

        {/* Top Words in Feedback */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Top Words in Feedback</h3>
              <Badge variant="outline" className="text-[10px] text-slate-500">Extracted</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-4">High-frequency terms across all sentiment classifications</p>

            <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
              {topFeedbackWords.map((word) => (
                <span
                  key={word.word}
                  className={`px-3 py-1 rounded-xl border cursor-pointer hover:scale-105 transition-transform ${word.size}`}
                  title={`${word.count} mentions`}
                >
                  {word.word}
                </span>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-3">
            Words sized by relative frequency across 15,443 customer interactions.
          </p>
        </div>
      </div>

      {/* Bottom Value Proposition Banner from Image 6 */}
      <div className="bg-[#0B132B] text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
          <h3 className="text-lg font-bold text-white">AI turns data into insights. Insights turn into action.</h3>
          <p className="text-xs text-slate-400">The end-to-end continuous VoC intelligence workflow</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
          {[
            { step: '1', title: 'Real-time Analysis', desc: 'Continuous stream ingestion' },
            { step: '2', title: 'Trend Detection', desc: 'Algorithmic velocity spikes' },
            { step: '3', title: 'Actionable Insights', desc: 'Root cause synthesis' },
            { step: '4', title: 'Measure Impact', desc: 'CSAT & ARR correlation' },
            { step: '5', title: 'Stronger Loyalty', desc: 'Proactive customer retention' },
          ].map((item) => (
            <div key={item.step} className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1">
              <span className="flex h-5 w-5 mx-auto items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {item.step}
              </span>
              <p className="font-bold text-slate-200">{item.title}</p>
              <p className="text-[10px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
