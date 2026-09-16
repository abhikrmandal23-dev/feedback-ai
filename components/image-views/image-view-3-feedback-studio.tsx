import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  Share2,
  CheckSquare,
  Square,
  Search,
  Tag,
  BarChart3,
  ListFilter,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SampleItem {
  id: string;
  category: 'Electronic' | 'Software' | 'Billing' | 'Support' | 'Mobile';
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  aspect: string;
  qualifier: string;
  text: string;
}

const initialSamples: SampleItem[] = [
  {
    id: 's-101',
    category: 'Software',
    sentiment: 'Negative',
    aspect: 'bugs',
    qualifier: 'urgent',
    text: 'App crashes immediately upon opening the camera scanner module on Android 14. Needs hotfix.',
  },
  {
    id: 's-102',
    category: 'Billing',
    sentiment: 'Negative',
    aspect: 'billing',
    qualifier: 'technicall',
    text: 'Double charged for annual renewal without receiving confirmation email or downloadable VAT invoice.',
  },
  {
    id: 's-103',
    category: 'Support',
    sentiment: 'Neutral',
    aspect: 'support',
    qualifier: 'time',
    text: 'Live chat agent took 45 minutes to transfer my ticket to the technical escalation tier.',
  },
  {
    id: 's-104',
    category: 'Electronic',
    sentiment: 'Positive',
    aspect: 'technicall',
    qualifier: 'experience',
    text: 'Firmware sync over BLE is lightning fast compared to previous gen hardware. Great improvement!',
  },
  {
    id: 's-105',
    category: 'Mobile',
    sentiment: 'Negative',
    aspect: 'bugs',
    qualifier: 'urgent',
    text: 'Push notifications are silent on iOS background state, causing missed critical alert dispatches.',
  },
  {
    id: 's-106',
    category: 'Software',
    sentiment: 'Positive',
    aspect: 'support',
    qualifier: 'experience',
    text: 'The newly introduced dark mode and customizable keyboard shortcuts saved our ops team hours.',
  },
];

const topicBarData = [
  { topic: 'Technical', count: 2123 },
  { topic: 'Billing', count: 2001 },
  { topic: 'Support', count: 3992 },
  { topic: 'Bugs', count: 4212 },
  { topic: 'Urgent', count: 1992 },
  { topic: 'Performance', count: 1650 },
];

const sentimentByTopicData = [
  { topic: 'Technical', positive: 45, neutral: 25, negative: 30 },
  { topic: 'Billing', positive: 20, neutral: 35, negative: 45 },
  { topic: 'Support', positive: 55, neutral: 20, negative: 25 },
  { topic: 'Bugs', positive: 10, neutral: 20, negative: 70 },
  { topic: 'Urgent', positive: 15, neutral: 15, negative: 70 },
];

const weeklySentimentData = [
  { week: 'W1', positive: 320, neutral: 140, negative: 280 },
  { week: 'W2', positive: 380, neutral: 160, negative: 310 },
  { week: 'W3', positive: 410, neutral: 130, negative: 460 },
  { week: 'W4', positive: 490, neutral: 180, negative: 390 },
];

export function ImageView3FeedbackStudio() {
  const [selectedAspects, setSelectedAspects] = useState<string[]>([
    'bugs',
    'support',
    'advertisement',
    'technicall',
    'billing',
    'urgent',
  ]);
  const [selectedQualifiers, setSelectedQualifiers] = useState<string[]>([
    'bugs',
    'technicall',
    'billing',
    'urgent',
    'experience',
    'time',
  ]);
  const [activeTab, setActiveTab] = useState<'mixed' | 'charts' | 'samples'>('mixed');
  const [searchFilter, setSearchFilter] = useState('');

  const toggleAspect = (aspect: string) => {
    setSelectedAspects((prev) =>
      prev.includes(aspect) ? prev.filter((a) => a !== aspect) : [...prev, aspect]
    );
  };

  const toggleQualifier = (qualifier: string) => {
    setSelectedQualifiers((prev) =>
      prev.includes(qualifier) ? prev.filter((q) => q !== qualifier) : [...prev, qualifier]
    );
  };

  const filteredSamples = initialSamples.filter((sample) => {
    if (searchFilter && !sample.text.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    return selectedAspects.includes(sample.aspect);
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual reference badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-sky-900/10 border border-sky-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-sky-600 text-white font-mono text-xs">Image 3 Replica</Badge>
          <span className="text-sm font-semibold text-sky-950">
            Feedback Analysis Enterprise Studio (Aspects, Samples & Sentiment Matrix)
          </span>
        </div>
        <div className="text-xs text-sky-700 font-medium">
          Source: Deep-dive feedback analysis tool with 3-pane layout, aspect filters, verbatim table, and stacked analytics
        </div>
      </div>

      {/* Top Workflow Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900">Feedback Analysis</h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Build</span>
              <span>&gt;</span>
              <span>Run</span>
              <span>&gt;</span>
              <span className="font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">
                Analytics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 text-slate-700">
              <Download className="h-3.5 w-3.5" />
              <span>Export CSV</span>
            </Button>
            <Button size="sm" className="h-8 text-xs gap-1.5 bg-sky-600 hover:bg-sky-700 text-white">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-medium">
            <Calendar className="h-3 w-3 text-slate-500" />
            <span>Jan 12 - Nov 30</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
            Year Month
          </div>

          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
            Metatags
          </div>

          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
            Topic
          </div>

          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
            Sentiment
          </div>

          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
            Intent
          </div>

          <div className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-slate-600">
            More filters
          </div>

          <button
            onClick={() => {
              setSelectedAspects(['bugs', 'support', 'advertisement', 'technicall', 'billing', 'urgent']);
              setSearchFilter('');
            }}
            className="text-sky-600 font-semibold text-xs ml-auto hover:underline"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* 3-Pane Layout: Left Filters, Center Samples Table, Right Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Pane (3 cols): Aspect & Qualifier Checkboxes */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveTab('mixed')}
                className={`px-2 py-1 rounded font-semibold ${
                  activeTab === 'mixed' ? 'bg-sky-100 text-sky-800' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mixed
              </button>
              <button
                onClick={() => setActiveTab('charts')}
                className={`px-2 py-1 rounded font-semibold ${
                  activeTab === 'charts' ? 'bg-sky-100 text-sky-800' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Charts
              </button>
              <button
                onClick={() => setActiveTab('samples')}
                className={`px-2 py-1 rounded font-semibold ${
                  activeTab === 'samples' ? 'bg-sky-100 text-sky-800' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Samples
              </button>
            </div>
            <ListFilter className="h-4 w-4 text-slate-400" />
          </div>

          {/* Aspect Checkboxes */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Aspect</span>
            <div className="space-y-1.5 mt-2 text-xs">
              {[
                { id: 'bugs', label: 'bugs', count: 4212 },
                { id: 'support', label: 'support', count: 3992 },
                { id: 'advertisement', label: 'advertisement', count: 2123 },
                { id: 'technicall', label: 'technicall', count: 2123 },
                { id: 'billing', label: 'billing', count: 2001 },
                { id: 'urgent', label: 'urgent', count: 1992 },
              ].map((item) => {
                const checked = selectedAspects.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAspect(item.id)}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {checked ? (
                        <CheckSquare className="h-4 w-4 text-sky-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-300" />
                      )}
                      <span className={`font-medium ${checked ? 'text-slate-900' : 'text-slate-500'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{item.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Qualifier Checkboxes */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Qualifier</span>
            <div className="space-y-1.5 mt-2 text-xs">
              {['bugs', 'technicall', 'billing', 'urgent', 'experience', 'time'].map((q) => {
                const checked = selectedQualifiers.includes(q);
                return (
                  <div
                    key={q}
                    onClick={() => toggleQualifier(q)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    {checked ? (
                      <CheckSquare className="h-4 w-4 text-sky-600" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-300" />
                    )}
                    <span className={`font-medium ${checked ? 'text-slate-900' : 'text-slate-500'}`}>
                      {q}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center Pane (5 cols): 2,421 Samples Table */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">2,421 samples</h3>
              <Badge variant="outline" className="text-[10px] text-slate-500 font-mono">Filtered</Badge>
            </div>
            <div className="relative">
              <Search className="h-3 w-3 absolute left-2 top-2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search verbatims..."
                className="pl-7 pr-2 py-1 text-xs border border-slate-200 rounded-lg w-36 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto pr-1">
            {filteredSamples.map((sample) => (
              <div key={sample.id} className="py-3 text-xs space-y-1.5 hover:bg-slate-50/50 p-2 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-medium text-slate-700 bg-slate-50">
                      {sample.category}
                    </Badge>
                    <Badge
                      className={`text-[10px] ${
                        sample.sentiment === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : sample.sentiment === 'Negative'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {sample.sentiment}
                    </Badge>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    {sample.aspect} • {sample.qualifier}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">{sample.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane (4 cols): Stacked Analytics & Topic Charts */}
        <div className="lg:col-span-4 space-y-4">
          {/* Samples by Topic */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Samples by Topic</h4>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topicBarData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="topic" type="category" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Bar dataKey="count" fill="#38bdf8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sentiment by Topic Stacked */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Sentiment by Topic</h4>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentByTopicData} margin={{ left: 10 }}>
                  <XAxis dataKey="topic" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Bar dataKey="positive" stackId="a" fill="#10b981" />
                  <Bar dataKey="neutral" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="negative" stackId="a" fill="#f43f5e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 mt-2">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Positive</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Neutral</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Negative</span>
            </div>
          </div>

          {/* Keyword Cloud */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
            <h4 className="text-xs font-bold text-slate-900 mb-2">Keyword Cloud (Qualifiers)</h4>
            <div className="flex flex-wrap gap-1.5">
              {['bugs (4.2k)', 'urgent (2.0k)', 'technicall (2.1k)', 'billing (2.0k)', 'experience (1.4k)', 'support (3.9k)', 'time (890)', 'crash (720)', 'checkout (640)'].map((kw, i) => (
                <span
                  key={kw}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    i % 3 === 0
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : i % 3 === 1
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
