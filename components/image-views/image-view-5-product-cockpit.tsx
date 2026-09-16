import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Compass,
  BarChart2,
  Users,
  ShieldCheck,
  Globe,
  Settings,
  HelpCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const featureRequests6M = [
  { name: 'Customizable Reports', count: 135, pct: 100 },
  { name: 'Multi-language Support', count: 53, pct: 39 },
  { name: 'Auto-Save Functionality', count: 44, pct: 32 },
  { name: 'Two-Factor Authentication', count: 43, pct: 31 },
  { name: 'Team Management', count: 31, pct: 23 },
  { name: 'Keyboard Shortcuts', count: 31, pct: 23 },
  { name: 'Dark Mode', count: 27, pct: 20 },
];

const churnByPlanData = [
  { reason: 'Pricing', monthly: 45, yearly: 15 },
  { reason: 'Features', monthly: 35, yearly: 30 },
  { reason: 'Support', monthly: 28, yearly: 12 },
  { reason: 'Competitor', monthly: 25, yearly: 20 },
  { reason: 'Not Needed', monthly: 22, yearly: 8 },
  { reason: 'Complexity', monthly: 18, yearly: 14 },
  { reason: 'Performance', monthly: 15, yearly: 10 },
  { reason: 'Integrations', monthly: 14, yearly: 16 },
  { reason: 'Contract', monthly: 5, yearly: 22 },
  { reason: 'Other', monthly: 8, yearly: 6 },
];

const cockpitDashboards = [
  'Marketing Metrics',
  'Product Cockpit',
  'Sales Calls',
  'Support',
  'Ideal Customer Profile Data',
  'Customer Success Data',
  'Website Feedback',
];

export function ImageView5ProductCockpit() {
  const [activeDashboard, setActiveDashboard] = useState('Product Cockpit');
  const [csatScore, setCsatScore] = useState(71);

  // Calculate needle angle for semi-circle gauge (0% is -90 deg, 100% is +90 deg or 180 total sweep)
  const needleRotation = -90 + (csatScore / 100) * 180;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual reference badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-900/10 border border-amber-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-amber-600 text-white font-mono text-xs">Image 5 Replica</Badge>
          <span className="text-sm font-semibold text-amber-950">
            Product Cockpit (Feature Backlog 6M • Speedometer CSAT Gauge • Churn Matrix)
          </span>
        </div>
        <div className="text-xs text-amber-700 font-medium">
          Source: Executive Product Cockpit with semi-circular lifecycle CSAT gauge and plan-type churn comparisons
        </div>
      </div>

      {/* Sky backdrop container representing Image 5 glassmorphism aesthetic */}
      <div className="relative rounded-3xl p-6 bg-gradient-to-b from-sky-400/20 via-blue-50/50 to-slate-100 border border-sky-200/60 shadow-lg overflow-hidden">
        {/* Subtle cloud glows */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-white/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-32 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Cockpit Top Bar */}
          <div className="bg-white/85 backdrop-blur-md border border-white/80 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Product Cockpit</h1>
                <p className="text-xs text-slate-500">Executive overview of feature demands, health gauge, and retention blockers</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl text-xs">
                {['6M', 'YTD', '1Y'].map((range) => (
                  <button
                    key={range}
                    className={`px-2.5 py-1 rounded-lg font-medium ${
                      range === '6M' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 shadow-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Widget</span>
              </Button>
            </div>
          </div>

          {/* Sub-Dashboards Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-600 font-semibold px-2">Dashboards:</span>
            {cockpitDashboards.map((dash) => (
              <button
                key={dash}
                onClick={() => setActiveDashboard(dash)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  activeDashboard === dash
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/60'
                }`}
              >
                {dash}
              </button>
            ))}
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/50 border border-dashed border-slate-300 text-slate-500 hover:bg-white text-xs">
              <Plus className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>

          {/* Grid of 3 Main Widgets from Image 5 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Widget 1: Top Feature Requests (6M) - 5 cols */}
            <div className="lg:col-span-5 bg-white/90 backdrop-blur-md border border-white/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">Top Feature Requests (6M)</h3>
                  <Badge variant="outline" className="text-[10px] font-mono text-slate-500">Ranked</Badge>
                </div>
                <p className="text-xs text-slate-500 mb-4">Highest aggregated customer demand across all segments</p>
              </div>

              <div className="space-y-3 flex-1">
                {featureRequests6M.map((item) => (
                  <div key={item.name} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-mono font-bold text-slate-900">{item.count}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Total 364 requests logged</span>
                <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                  Export to Roadmap &rarr;
                </span>
              </div>
            </div>

            {/* Widget 2: Lifecycle CSAT (Speedometer Gauge) - 7 cols */}
            <div className="lg:col-span-7 bg-white/90 backdrop-blur-md border border-white/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-900">Lifecycle CSAT</h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    +3% vs last month
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-2">Overall customer satisfaction score across key onboarding & renewal stages</p>
              </div>

              {/* Speedometer Gauge SVG */}
              <div className="relative flex flex-col items-center justify-center py-4">
                <svg className="w-64 h-36 overflow-visible" viewBox="0 0 200 110">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="25%" stopColor="#f97316" />
                      <stop offset="50%" stopColor="#eab308" />
                      <stop offset="75%" stopColor="#84cc16" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Arc Background */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />

                  {/* Colored Arc */}
                  <path
                    d="M 20 100 A 80 80 0 0 1 180 100"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />

                  {/* Needle */}
                  <g transform={`translate(100, 100) rotate(${needleRotation})`}>
                    <line x1="0" y1="0" x2="0" y2="-70" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="8" fill="#0f172a" />
                    <circle cx="0" cy="0" r="3" fill="#ffffff" />
                  </g>
                </svg>

                {/* Score display */}
                <div className="text-center mt-2">
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {csatScore}%
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                    Good Rating (Target: 75%)
                  </span>
                </div>
              </div>

              {/* Gauge thresholds */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-center text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Poor (&lt;50%)</span>
                  <span className="font-semibold text-rose-600">Action Required</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Average (50-70%)</span>
                  <span className="font-semibold text-amber-600">Stable</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Target (&gt;75%)</span>
                  <span className="font-semibold text-emerald-600">Top Quartile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Widget 3: Churn Reason by Plan Type (Full Width) */}
          <div className="bg-white/90 backdrop-blur-md border border-white/90 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Churn Reason by Plan Type</h3>
                <p className="text-xs text-slate-500">Comparison of cancellation drivers: Monthly vs. Yearly contracts</p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <span className="h-3 w-3 rounded-xs bg-blue-500" />
                  Monthly Plan
                </span>
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="h-3 w-3 rounded-xs bg-emerald-500" />
                  Yearly Plan
                </span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={churnByPlanData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="reason" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Bar dataKey="monthly" name="Monthly Churn" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="yearly" name="Yearly Churn" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
