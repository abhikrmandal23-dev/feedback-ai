import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  CheckCircle2,
  Clock,
  Link as LinkIcon,
  Building2,
  ChevronDown,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const requestedFeatures = [
  { name: 'AI Marketing Bot', count: 93, highlighted: true },
  { name: 'AI Chatbots', count: 89 },
  { name: 'Content Personalization', count: 85 },
  { name: 'Account-Based Marketing', count: 82 },
  { name: 'A/B Testing', count: 78 },
  { name: 'Attribution Modeling', count: 71 },
  { name: 'Chatbot NLP', count: 67 },
  { name: 'Ad Networks', count: 65 },
  { name: 'Blogging Tools', count: 58 },
  { name: 'Content Calendar', count: 54 },
];

const concernedProductAreas = [
  { name: 'A/B Testing and Optimization', count: 112 },
  { name: 'Marketing Automation', count: 104 },
  { name: 'Video Marketing', count: 91 },
  { name: 'AI Chatbots', count: 88 },
  { name: 'Attribution Modeling', count: 79 },
  { name: 'Sales Analytics', count: 74 },
  { name: 'Personalization & Targeting', count: 68 },
  { name: 'Email Marketing', count: 65 },
  { name: 'CRM Enhancement', count: 59 },
  { name: 'Social Media Engagement', count: 52 },
];

const topCustomers = [
  { name: 'Apple', insights: 142, arr: '$2.4M', logo: '', tier: 'Enterprise' },
  { name: 'Amazon', insights: 128, arr: '$1.8M', logo: 'A', tier: 'Enterprise' },
  { name: 'Microsoft', insights: 114, arr: '$3.1M', logo: 'M', tier: 'Enterprise' },
  { name: 'Alphabet', insights: 98, arr: '$1.5M', logo: 'G', tier: 'Enterprise' },
  { name: 'Facebook (Meta)', insights: 87, arr: '$1.2M', logo: 'f', tier: 'Enterprise' },
  { name: 'Tesla', insights: 76, arr: '$950k', logo: 'T', tier: 'Mid-Market' },
  { name: 'Netflix', insights: 64, arr: '$820k', logo: 'N', tier: 'Mid-Market' },
  { name: 'Uber', insights: 59, arr: '$740k', logo: 'U', tier: 'Mid-Market' },
  { name: 'Airbnb', insights: 51, arr: '$680k', logo: 'b', tier: 'Mid-Market' },
];

const statusSplitData = [
  { name: 'To link', value: 45, color: '#3b82f6' },
  { name: 'To do', value: 20, color: '#f59e0b' },
  { name: 'Shipped', value: 35, color: '#10b981' },
];

export function ImageView2DashInsights() {
  const [activeSubTab, setActiveSubTab] = useState<'customer_voice' | 'tracking' | 'analyses' | 'all'>('analyses');
  const [hoveredFeature, setHoveredFeature] = useState<string | null>('AI Marketing Bot');
  const [arrSegment, setArrSegment] = useState('All');
  const [importance, setImportance] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [timeRange, setTimeRange] = useState('Past 7 days');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual reference badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-900/10 border border-blue-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-blue-600 text-white font-mono text-xs">Image 2 Replica</Badge>
          <span className="text-sm font-semibold text-blue-950">
            Dash Product Management Insights & Requested Features
          </span>
        </div>
        <div className="text-xs text-blue-700 font-medium">
          Source: Dash Product Analytics with 4-card matrix (Requested features, Product areas, Top customers, Status split)
        </div>
      </div>

      {/* Dash Header & Sub-Navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Insights</span>
              <Badge variant="outline" className="text-xs text-slate-500 font-normal">Dash Analytics</Badge>
            </h1>
            <p className="text-xs text-slate-500">Cross-cutting feature requests, customer feedback leaders, and delivery status</p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5 shadow-xs">
              <Plus className="h-3.5 w-3.5" />
              <span>New Feedback</span>
            </Button>
          </div>
        </div>

        {/* Sub-navigation tabs */}
        <div className="flex items-center gap-1 border-b border-slate-200 pb-2 text-xs">
          <button
            onClick={() => setActiveSubTab('customer_voice')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeSubTab === 'customer_voice' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer voice
          </button>
          <button
            onClick={() => setActiveSubTab('tracking')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeSubTab === 'tracking' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Tracking
          </button>
          <button
            onClick={() => setActiveSubTab('analyses')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeSubTab === 'analyses' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Analyses
          </button>
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 font-medium rounded-lg transition-colors ${
              activeSubTab === 'all' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All
          </button>
        </div>

        {/* Filter Row from Image 2 */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 font-medium">
            <span className="text-slate-400">ARR segment:</span>
            <select
              value={arrSegment}
              onChange={(e) => setArrSegment(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none"
            >
              <option>All</option>
              <option>&gt; $1M</option>
              <option>$500k - $1M</option>
              <option>&lt; $500k</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 font-medium">
            <span className="text-slate-400">Importance:</span>
            <select
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none"
            >
              <option>All</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 font-medium">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none"
            >
              <option>All</option>
              <option>To link</option>
              <option>To do</option>
              <option>Shipped</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 font-medium">
            <span className="text-slate-400">Customer:</span>
            <span className="text-slate-800 font-semibold">All</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-600 font-medium">
            <span className="text-slate-400">Source:</span>
            <span className="text-slate-800 font-semibold">All</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium">
            <Calendar className="h-3 w-3 text-slate-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent border-none text-slate-800 font-semibold focus:outline-none"
            >
              <option>Past 7 days</option>
              <option>Past 30 days</option>
              <option>Past 90 days</option>
              <option>All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Cards Grid - Exactly as in Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 1: What are the most requested features? */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">What are the most requested features?</h3>
            <span className="text-[11px] font-semibold text-slate-400">Volume</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Ranked by customer request volume and insight connections</p>

          <div className="space-y-2 flex-1">
            {requestedFeatures.map((item) => {
              const percentage = (item.count / 100) * 100;
              const isHighlight = item.highlighted || hoveredFeature === item.name;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredFeature(item.name)}
                  className="group flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className={`w-44 truncate font-medium ${isHighlight ? 'text-indigo-700 font-bold' : 'text-slate-700'}`}>
                    {item.name}
                  </span>
                  <div className="flex-1 mx-3 relative">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isHighlight ? 'bg-indigo-600' : 'bg-indigo-400/80 group-hover:bg-indigo-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    {isHighlight && (
                      <div className="absolute -top-7 right-0 bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow-lg z-10 whitespace-nowrap">
                        {item.count} insights
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-slate-500 font-semibold text-[11px] w-8 text-right">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 2: What are the most concerned product areas? */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">What are the most concerned product areas?</h3>
            <span className="text-[11px] font-semibold text-slate-400">Pain Points</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Areas generating friction, support tickets, and roadmap discussions</p>

          <div className="space-y-2 flex-1">
            {concernedProductAreas.map((item) => {
              const percentage = (item.count / 120) * 100;
              return (
                <div
                  key={item.name}
                  className="group flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="w-48 truncate font-medium text-slate-700 group-hover:text-slate-900">
                    {item.name}
                  </span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-rose-400/80 group-hover:bg-rose-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-slate-500 font-semibold text-[11px] w-8 text-right">
                    {item.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card 3: Which customers give the most feedback? */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Which customers give the most feedback?</h3>
            <span className="text-[11px] font-semibold text-slate-400">ARR Impact</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Feedback volume correlated with customer ARR</p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium text-[11px]">
                  <th className="text-left pb-2">Customer</th>
                  <th className="text-left pb-2">Tier</th>
                  <th className="text-right pb-2">Insights</th>
                  <th className="text-right pb-2">ARR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topCustomers.map((c) => (
                  <tr key={c.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 flex items-center gap-2.5 font-semibold text-slate-800">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 font-bold text-xs text-slate-700">
                        {c.logo}
                      </span>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-2">
                      <Badge variant="outline" className={`text-[10px] ${c.tier === 'Enterprise' ? 'text-indigo-700 border-indigo-200 bg-indigo-50' : 'text-slate-600'}`}>
                        {c.tier}
                      </Badge>
                    </td>
                    <td className="py-2 text-right font-mono font-bold text-slate-900">
                      {c.insights}
                    </td>
                    <td className="py-2 text-right font-mono font-semibold text-emerald-600">
                      {c.arr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card 4: What's the status split? */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">What&apos;s the status split?</h3>
              <PieIcon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-2">Proportion of feedback linked, in backlog, or shipped to production</p>
          </div>

          <div className="h-56 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusSplitData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${val}%`, 'Share']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
            <div className="p-2 bg-blue-50/60 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-blue-700 font-semibold mb-0.5">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>To link</span>
              </div>
              <span className="text-lg font-bold text-blue-950 font-mono">45%</span>
            </div>

            <div className="p-2 bg-amber-50/60 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-amber-700 font-semibold mb-0.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>To do</span>
              </div>
              <span className="text-lg font-bold text-amber-950 font-mono">20%</span>
            </div>

            <div className="p-2 bg-emerald-50/60 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-semibold mb-0.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Shipped</span>
              </div>
              <span className="text-lg font-bold text-emerald-950 font-mono">35%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
