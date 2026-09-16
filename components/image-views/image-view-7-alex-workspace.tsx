import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
  ShieldCheck,
  Zap,
  Volume2,
  Lock,
  Layers,
  Users,
  MessageSquare,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const sparklineData1 = [{ v: 190 }, { v: 210 }, { v: 205 }, { v: 220 }, { v: 235 }, { v: 247 }];
const sparklineData2 = [{ v: 32 }, { v: 34 }, { v: 36 }, { v: 38 }, { v: 40 }, { v: 42 }];
const sparklineData3 = [{ v: 85 }, { v: 92 }, { v: 98 }, { v: 104 }, { v: 108 }, { v: 113 }];

const popularCategories = [
  { name: 'Integration with CRM tools', count: 16, pct: 100 },
  { name: 'Storage and sharing limits', count: 7, pct: 44 },
  { name: 'Mobile onboarding experience', count: 6, pct: 38 },
  { name: 'Automation in product management', count: 6, pct: 38 },
  { name: 'Feedback integration', count: 4, pct: 25 },
];

export function ImageView7AlexWorkspace({
  onAskCopilot,
}: {
  onAskCopilot?: (query: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onAskCopilot) {
      onAskCopilot(query);
    } else {
      setCopilotResponse(
        `AI Analysis for "${query}": Found 24 matching customer verbatims. The top cluster relates to Enterprise SSO (Okta/SAML) which is directly blocking $1.8M ARR across 12 enterprise prospects.`
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual reference badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-violet-900/10 border border-violet-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-violet-600 text-white font-mono text-xs">Image 7 Replica</Badge>
          <span className="text-sm font-semibold text-violet-950">
            Alex&apos;s PM Copilot Workspace (&ldquo;Alex, let&apos;s make your product shine&rdquo;)
          </span>
        </div>
        <div className="text-xs text-violet-700 font-medium">
          Source: Personalized Product Manager home screen with conversational prompt bar, sparklines, trending themes, and popular categories
        </div>
      </div>

      {/* Main Hero Header from Image 7 */}
      <div className="bg-white border border-slate-200 rounded-3xl p-7 shadow-xs space-y-5">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Alex, let&apos;s make your product shine
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search customer insights, surface high-impact themes, and generate specifications.
          </p>
        </div>

        {/* Big Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) handleSearch(searchQuery);
          }}
          className="relative max-w-3xl"
        >
          <div className="flex items-center bg-slate-50 border border-slate-300/80 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-violet-500 transition-all shadow-xs">
            <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything about feedback, themes, customers..."
              className="w-full bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors shrink-0 shadow-xs"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Quick prompt suggestion chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Try asking:</span>
          {[
            'What are the top feature requests?',
            'Show feedback trends',
            'Summarize this week',
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSearch(prompt)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 border border-slate-200 rounded-xl text-slate-700 font-medium transition-all"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* Live response if searched */}
        {copilotResponse && (
          <div className="p-4 bg-violet-50 border border-violet-200 rounded-2xl text-xs space-y-1 text-violet-950 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-violet-900">
              <Sparkles className="h-3.5 w-3.5 text-violet-600" />
              <span>AI Copilot Answer</span>
            </div>
            <p className="leading-relaxed">{copilotResponse}</p>
          </div>
        )}
      </div>

      {/* 3 Metric Cards with Sparklines from Image 7 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Total Insights */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Total insights</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">247</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +12%
              </span>
            </div>
            <span className="text-[11px] text-slate-400">vs last month</span>
          </div>
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData1}>
                <Line type="monotone" dataKey="v" stroke="#7c3aed" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Active Customers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Active customers</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">42</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +8%
              </span>
            </div>
            <span className="text-[11px] text-slate-400">vs last month</span>
          </div>
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData2}>
                <Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Weekly Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500">Weekly activity</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">113</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +3%
              </span>
            </div>
            <span className="text-[11px] text-slate-400">vs last month</span>
          </div>
          <div className="h-10 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData3}>
                <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Trending Themes & Popular Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Trending Themes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Trending themes</h3>
              <p className="text-xs text-slate-500">Fastest emerging problem areas from customer verbatims</p>
            </div>
            <Badge variant="outline" className="text-xs text-slate-500">Prioritized</Badge>
          </div>

          <div className="space-y-3">
            {/* Theme 1: SSO and Authentication [New] */}
            <div className="p-4 border border-slate-200 hover:border-violet-300 rounded-2xl space-y-2 hover:bg-violet-50/20 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-violet-100 text-violet-700 rounded-lg">
                    <Lock className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">SSO and authentication</h4>
                  <Badge className="bg-violet-600 text-white text-[10px]">New</Badge>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Multiple enterprise customers requesting SSO enforcement and better authentication flows.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>16 insights • 12 customers</span>
                <span className="text-violet-600 font-semibold cursor-pointer hover:underline">
                  View cluster &rarr;
                </span>
              </div>
            </div>

            {/* Theme 2: Integrations [Sales blocker] */}
            <div className="p-4 border border-rose-200 bg-rose-50/20 rounded-2xl space-y-2 hover:bg-rose-50/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                    <Zap className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Integrations</h4>
                  <Badge className="bg-rose-600 text-white text-[10px]">Sales blocker</Badge>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Slack, Notion, and other tool integrations being requested for better workflow automation.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>12 insights • 11 customers</span>
                <span className="text-rose-600 font-semibold cursor-pointer hover:underline">
                  View cluster &rarr;
                </span>
              </div>
            </div>

            {/* Theme 3: Audio quality */}
            <div className="p-4 border border-slate-200 hover:border-slate-300 rounded-2xl space-y-2 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                    <Volume2 className="h-4 w-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Audio quality</h4>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                High request for background noise cancellation and crisp voice transmission.
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>9 insights • 7 customers</span>
                <span className="text-slate-600 font-semibold cursor-pointer hover:underline">
                  View cluster &rarr;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Popular Categories */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900">Popular categories</h3>
              <Badge variant="outline" className="text-xs text-slate-500">Distribution</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-5">Categorized breakdown of feedback mentions</p>

            <div className="space-y-4">
              {popularCategories.map((cat) => (
                <div key={cat.name} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{cat.name}</span>
                    <span className="font-mono font-bold text-slate-900">{cat.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-violet-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Aggregated across all active customer logs</span>
            <span className="text-violet-600 font-semibold cursor-pointer hover:underline">
              View All Categories &rarr;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
