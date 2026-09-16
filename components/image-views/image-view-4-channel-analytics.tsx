import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  Inbox,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Share2,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Smartphone,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const dailySentimentData = [
  { date: 'Oct 19', positive: 85, negative: 15 },
  { date: 'Oct 20', positive: 82, negative: 18 },
  { date: 'Oct 21', positive: 79, negative: 21 },
  { date: 'Oct 22', positive: 65, negative: 35 }, // Release dip
  { date: 'Oct 23', positive: 68, negative: 32 },
  { date: 'Oct 24', positive: 70, negative: 30 },
];

const topTopicsData = [
  { topic: 'Login Issue', count: 52, isNegative: true },
  { topic: 'Feature Request', count: 48, isNegative: false },
  { topic: 'Pricing', count: 22, isNegative: false },
  { topic: 'UI/UX', count: 20, isNegative: false },
  { topic: 'Bug', count: 14, isNegative: true },
];

export function ImageView4ChannelAnalytics() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'inbox'>('analysis');
  const [showTicketsModal, setShowTicketsModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual reference badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-emerald-900/10 border border-emerald-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-emerald-600 text-white font-mono text-xs">Image 4 Replica</Badge>
          <span className="text-sm font-semibold text-emerald-950">
            Customer Feedback Analytics (Zendesk • OpenAI • App Store)
          </span>
        </div>
        <div className="text-xs text-emerald-700 font-medium">
          Source: Integrated 3-source feedback dashboard with daily sentiment trend, topic counts, and AI correlation summary
        </div>
      </div>

      {/* Dark Integrated Brand Header from Image 4 */}
      <div className="bg-[#0B132B] text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              {/* Zendesk badge */}
              <span className="flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs px-2.5 py-1 rounded-full font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Zendesk
              </span>
              {/* OpenAI badge */}
              <span className="flex items-center gap-1.5 bg-purple-900/60 border border-purple-700/60 text-purple-300 text-xs px-2.5 py-1 rounded-full font-semibold">
                <Sparkles className="h-3 w-3" />
                OpenAI Analysis
              </span>
              {/* Apple App Store */}
              <span className="flex items-center gap-1.5 bg-sky-900/60 border border-sky-700/60 text-sky-300 text-xs px-2.5 py-1 rounded-full font-semibold">
                <Smartphone className="h-3 w-3" />
                App Store
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Customer Feedback Analytics</h1>
            <p className="text-xs text-slate-400">Continuous AI-driven synthesis across customer touchpoints</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-900 border border-slate-700 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'analysis'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Analysis & Insights
              </button>
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'inbox'
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Feedback Inbox (450)
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>Oct 19 - Oct 24</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Stat KPI Cards from Image 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Feedback */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Total Feedback</span>
            <Inbox className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">450</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" />
              +18% vs last week
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">All sources combined (Zendesk, OpenAI, App Store)</p>
        </div>

        {/* Overall Sentiment */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
            <span>Overall Sentiment</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-900">70%</span>
            <span className="text-xs font-semibold text-rose-600 flex items-center gap-0.5">
              <TrendingDown className="h-3 w-3" />
              -15% this week
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">This week&apos;s rolling positive customer average</p>
        </div>

        {/* Top Negative */}
        <div className="bg-white border border-rose-200 bg-rose-50/30 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-rose-800 font-semibold uppercase tracking-wider">
            <span>Top Negative Issue</span>
            <ShieldAlert className="h-4 w-4 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-950">Login Issue</span>
          </div>
          <p className="text-xs text-rose-700 mt-1">52 mentions • Most prominent friction driver post v2.5</p>
        </div>
      </div>

      {/* Middle Row: Daily Sentiment Line Chart & Top Topics Horizontal Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily Sentiment Trends */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sentiment Over Time</h3>
              <p className="text-xs text-slate-500">Daily trend of positive vs negative feedback (Oct 19 - Oct 24)</p>
            </div>
            <Badge variant="outline" className="text-xs font-mono text-slate-600">Daily</Badge>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailySentimentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="positive" name="Positive Sentiment %" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="negative" name="Negative Sentiment %" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Feedback Topics */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Feedback Topics</h3>
              <p className="text-xs text-slate-500">Feedback frequency grouped by core product area</p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Mentions</span>
          </div>

          <div className="space-y-3 pt-2">
            {topTopicsData.map((item) => {
              const pct = (item.count / 60) * 100;
              return (
                <div key={item.topic} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      {item.isNegative ? (
                        <span className="h-2 w-2 rounded-full bg-rose-500" />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                      {item.topic}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.isNegative ? 'bg-rose-500' : 'bg-blue-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI-Generated Summary Callout from Image 4 */}
      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl shadow-md shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-purple-950">AI-Generated Summary</h3>
                <Badge className="bg-purple-600 text-white text-[10px]">Powered by Intelligent Analysis</Badge>
              </div>
              <span className="text-xs font-mono text-purple-700">Updated 10m ago</span>
            </div>

            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              &ldquo;Sentiment dipped <strong className="text-rose-600">15%</strong> this week, correlating with the <strong className="text-slate-900">v2.5 app release</strong>. The primary driver is a new <strong className="text-rose-700">&apos;Login Issue&apos;</strong> affecting Android users where session tokens are invalidated during background sleep. Feature requests for <strong className="text-indigo-700">&apos;Dark Mode&apos;</strong> and <strong className="text-indigo-700">&apos;Bulk Export&apos;</strong> continue to lead positive engagement.&rdquo;
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setShowTicketsModal(true)}
                size="sm"
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs gap-1.5"
              >
                <span>View 52 Affected Android Tickets</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button variant="outline" size="sm" className="text-xs border-purple-300 text-purple-800 bg-white">
                Draft Incident Post-Mortem
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Modal */}
      {showTicketsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900">Affected Android Login Tickets (v2.5)</h3>
              </div>
              <button
                onClick={() => setShowTicketsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-2.5 max-h-72 overflow-y-auto">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-rose-800">
                  <span>#ZD-88412 • Galaxy S24</span>
                  <span>Negative</span>
                </div>
                <p className="text-slate-800 font-medium">&ldquo;I get logged out every time I minimize the app for more than 30 seconds.&rdquo;</p>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-rose-800">
                  <span>#ZD-88390 • Pixel 8</span>
                  <span>Negative</span>
                </div>
                <p className="text-slate-800 font-medium">&ldquo;Biometric prompt shows blank screen and requires password reset.&rdquo;</p>
              </div>
            </div>
            <Button onClick={() => setShowTicketsModal(false)} className="w-full text-xs">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
