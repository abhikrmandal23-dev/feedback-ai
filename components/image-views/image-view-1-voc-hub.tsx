import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Download,
  Clock,
  Radio,
  ChevronDown,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Headphones,
  Instagram,
  Twitter,
  Facebook,
  Play,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const sentimentTrendData = [
  { date: '01 Mar', score: 3.8 },
  { date: '15 Mar', score: 3.9 },
  { date: '01 Apr', score: 4.2 },
  { date: '15 Apr', score: 4.0 },
  { date: '30 Apr', score: 4.1 },
];

const topicsTrendData = [
  { date: '01 Mar', topUp: 28, registration: 24, billPayment: 15, payLater: 10, insurance: 8 },
  { date: '15 Mar', topUp: 35, registration: 22, billPayment: 18, payLater: 14, insurance: 9 },
  { date: '01 Apr', topUp: 52, registration: 38, billPayment: 21, payLater: 16, insurance: 11 },
  { date: '15 Apr', topUp: 46, registration: 45, billPayment: 26, payLater: 19, insurance: 14 },
  { date: '30 Apr', topUp: 41, registration: 32, billPayment: 24, payLater: 15, insurance: 12 },
];

const channelScores = [
  { name: 'Customer Support', count: '14,192 tickets', score: 3.9, icon: Headphones, color: 'text-amber-500', barBg: 'bg-amber-500' },
  { name: 'Instagram', count: '8,230 mentions', score: 3.8, icon: Instagram, color: 'text-pink-500', barBg: 'bg-pink-500' },
  { name: 'App Store', count: '11,040 reviews', score: 4.8, icon: Smartphone, color: 'text-emerald-500', barBg: 'bg-emerald-500' },
  { name: 'Twitter (X)', count: '1,492 posts', score: 2.9, icon: Twitter, color: 'text-rose-500', barBg: 'bg-rose-500' },
  { name: 'Google Play', count: '36,540 reviews', score: 4.6, icon: Play, color: 'text-emerald-500', barBg: 'bg-emerald-500' },
  { name: 'Facebook', count: '2,104 comments', score: 4.3, icon: Facebook, color: 'text-blue-500', barBg: 'bg-blue-500' },
];

const topWords = [
  { word: 'Email', count: 1840, size: 'text-2xl font-bold text-indigo-700 bg-indigo-50 border-indigo-200' },
  { word: 'Robo', count: 1420, size: 'text-lg font-semibold text-purple-700 bg-purple-50 border-purple-200' },
  { word: 'Bank', count: 2120, size: 'text-2xl font-bold text-blue-700 bg-blue-50 border-blue-200' },
  { word: 'Settings', count: 980, size: 'text-sm font-medium text-slate-700 bg-slate-100 border-slate-200' },
  { word: 'Withdraw', count: 1650, size: 'text-xl font-bold text-rose-700 bg-rose-50 border-rose-200' },
  { word: 'PayLater', count: 1980, size: 'text-2xl font-bold text-emerald-700 bg-emerald-50 border-emerald-200' },
  { word: 'Top Up', count: 2450, size: 'text-3xl font-extrabold text-rose-600 bg-rose-100/80 border-rose-300' },
  { word: 'OTP', count: 1720, size: 'text-xl font-bold text-amber-700 bg-amber-50 border-amber-200' },
  { word: 'Transfer', count: 1390, size: 'text-base font-semibold text-sky-700 bg-sky-50 border-sky-200' },
  { word: 'Failed', count: 1890, size: 'text-2xl font-bold text-rose-600 bg-rose-50 border-rose-200' },
  { word: 'QRIS', count: 1120, size: 'text-base font-medium text-teal-700 bg-teal-50 border-teal-200' },
  { word: 'Refund', count: 1290, size: 'text-lg font-semibold text-orange-700 bg-orange-50 border-orange-200' },
];

export function ImageView1VocHub() {
  const [activeTab, setActiveTab] = useState<'negative' | 'positive' | 'spike'>('negative');
  const [selectedChannel, setSelectedChannel] = useState('All Data Source');
  const [isEventLogOpen, setIsEventLogOpen] = useState(false);
  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Visual reference badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-violet-900/10 border border-violet-200 p-3.5 rounded-xl">
        <div className="flex items-center gap-2.5">
          <Badge className="bg-violet-600 text-white font-mono text-xs">Image 1 Replica</Badge>
          <span className="text-sm font-semibold text-violet-950">
            Voice of Customers (VoC) Multi-Channel Sentiment Hub
          </span>
        </div>
        <div className="text-xs text-violet-700 font-medium">
          Source: Voice of Customers dashboard with multi-source channels, sentiment trend, and complaint topics
        </div>
      </div>

      {/* Main Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Voice of Customers</h1>
          <p className="text-sm text-slate-500">Cross-channel sentiment diagnostics, complaint topics, and live stream</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 shadow-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>01 Mar 2020 - 30 Apr 2020</span>
          </div>

          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-slate-700 border-slate-200">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Filter</span>
          </Button>

          <Button size="sm" className="h-8 gap-1.5 text-xs bg-violet-600 hover:bg-violet-700 text-white">
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </Button>
        </div>
      </div>

      {/* Top 3 Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Average Sentiment Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Average Sentiment Score</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                +0.3 vs last period
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900">4.1</span>
              <span className="text-sm font-medium text-slate-400">/ 5.0</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Weighted customer satisfaction index across 6 sources</p>
          </div>

          <div className="h-24 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis domain={[3.5, 4.5]} hide />
                <Tooltip
                  formatter={(value: number) => [`${value} / 5.0`, 'Score']}
                  contentStyle={{ backgroundColor: '#1e1b4b', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#7c3aed', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#6d28d9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Highlights */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Highlights</span>
            <Sparkles className="h-4 w-4 text-violet-500" />
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-rose-50/70 border border-rose-100">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">1</span>
              <div>
                <p className="text-xs font-semibold text-rose-900">Registration</p>
                <p className="text-[11px] text-rose-700 leading-tight">Negative sentiment score increased significantly in this period due to OTP latency.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">2</span>
              <div>
                <p className="text-xs font-semibold text-emerald-900">Easy, Promo, Cashless</p>
                <p className="text-[11px] text-emerald-700 leading-tight">Top positive user feedback sentiment driven by Ramadan cash-back campaign.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-amber-50/70 border border-amber-100">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">3</span>
              <div>
                <p className="text-xs font-semibold text-amber-900">Top Up, Failed, Not Receive</p>
                <p className="text-[11px] text-amber-800 leading-tight">Top user complaints in this period; Bank XYZ virtual account gateway timeouts.</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-lg bg-blue-50/70 border border-blue-100">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">4</span>
              <div>
                <p className="text-xs font-semibold text-blue-900">App Store Ratings</p>
                <p className="text-[11px] text-blue-700 leading-tight">5-star ratings increased by 12% in the last 30 days after biometric login patch.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Sentiment Scores by Channel */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Channel Breakdown</span>
            <Badge variant="outline" className="text-[10px] text-slate-600">6 Channels</Badge>
          </div>

          <div className="space-y-2.5">
            {channelScores.map((channel) => {
              const Icon = channel.icon;
              return (
                <div key={channel.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${channel.color}`} />
                    <div>
                      <span className="font-semibold text-slate-800">{channel.name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({channel.count})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${channel.barBg}`}
                        style={{ width: `${(channel.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs w-7 text-right">
                      {channel.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Section: Tabs + Trend Chart + Event Log & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left 3 cols: Trend Topics Chart */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('negative')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'negative'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Top Negative
              </button>
              <button
                onClick={() => setActiveTab('positive')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'positive'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Top Positive
              </button>
              <button
                onClick={() => setActiveTab('spike')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'spike'
                    ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Top Spike
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-medium">
              Volume mentions over time (01 Mar - 30 Apr)
            </div>
          </div>

          {/* Topics Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4 p-2.5 bg-slate-50 rounded-lg text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 shrink-0" />
              <span className="font-medium text-slate-700 truncate" title="Top Up, Failed, Not Receive">1. Top Up Failed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shrink-0" />
              <span className="font-medium text-slate-700 truncate" title="Registration, Email, OTP">2. Registration OTP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-500 shrink-0" />
              <span className="font-medium text-slate-700 truncate" title="Bill, Payment, Failed">3. Bill Payment Failed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-medium text-slate-700 truncate" title="PayLater, Apply, Failed">4. PayLater Apply</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500 shrink-0" />
              <span className="font-medium text-slate-700 truncate" title="Insurance, How, Claim">5. Insurance Claim</span>
            </div>
          </div>

          {/* Recharts Multi-line */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={topicsTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                />
                <Line type="monotone" dataKey="topUp" name="Top Up Failed" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="registration" name="Registration OTP" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="billPayment" name="Bill Payment" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="payLater" name="PayLater Apply" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="insurance" name="Insurance Claim" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 col: Action Cards (Event Log & Live Stream) */}
        <div className="space-y-4 flex flex-col justify-between">
          {/* Event Log Card */}
          <div
            onClick={() => setIsEventLogOpen(!isEventLogOpen)}
            className="cursor-pointer group bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/80 rounded-xl p-4 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs group-hover:scale-105 transition-transform">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-indigo-950">Event Log</h3>
              </div>
              <ArrowUpRight className="h-4 w-4 text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed">
              See all past releases, incidents, and marketing events that directly impacted customer sentiment.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-indigo-700">
              <span>View 14 Recorded Events</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Live Stream Card */}
          <div
            onClick={() => setIsLiveStreamOpen(!isLiveStreamOpen)}
            className="cursor-pointer group bg-gradient-to-br from-rose-50 to-orange-50 hover:from-rose-100 hover:to-orange-100 border border-rose-200/80 rounded-xl p-4 transition-all shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-600 text-white rounded-lg shadow-xs group-hover:scale-105 transition-transform">
                  <Radio className="h-4 w-4 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-rose-950">Live Stream</h3>
              </div>
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            </div>
            <p className="text-xs text-rose-900/80 leading-relaxed">
              Monitor incoming customer voice stream filtering for critical negative sentiment and urgent escalations.
            </p>
            <div className="mt-3 flex items-center gap-2 text-[11px] font-semibold text-rose-700">
              <span>Monitor Real-time Feed (18/min)</span>
              <span>&rarr;</span>
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-300">
              <span>Active Complaints</span>
              <span className="font-bold text-rose-400">312 unresolved</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-rose-500 h-full w-[42%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Verbatim Details Table & Top Words Cloud */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 cols: Details table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Details</h3>
              <p className="text-xs text-slate-500">Representative customer verbatims with channel attribution</p>
            </div>

            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-violet-500"
            >
              <option>All Data Source</option>
              <option>App Store</option>
              <option>Google Play</option>
              <option>Customer Support</option>
              <option>Twitter</option>
            </select>
          </div>

          <div className="space-y-3">
            {/* Primary verbatim from Image 1 */}
            <div className="p-4 border border-rose-200 bg-rose-50/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-900 text-white text-[10px]">App Store</Badge>
                  <span className="text-xs font-mono text-slate-500">30 Apr 2020 20:02</span>
                  <Badge variant="outline" className="text-[10px] text-rose-700 border-rose-300 bg-rose-50">
                    Top Up Failed
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-700">Score:</span>
                  <span className="text-xs font-extrabold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">3.0 / 5.0</span>
                </div>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed font-normal">
                &ldquo;After latest version update, my top up via bank XYZ always failed. Please fix this soon, I need it for urgent grocery transactions! The balance was deducted from my bank account but never credited here.&rdquo;
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-rose-100">
                <span>User: @dimas_ardiansyah • v4.12.0 iOS 14.2</span>
                <span className="text-violet-600 font-semibold cursor-pointer hover:underline">Link to Jira Ticket #PAY-419</span>
              </div>
            </div>

            {/* Additional verbatims */}
            <div className="p-3 border border-slate-200 bg-slate-50/50 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white text-[10px]">Google Play</Badge>
                  <span className="text-xs font-mono text-slate-500">30 Apr 2020 18:45</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                    Ramadan Promo
                  </Badge>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">5.0 / 5.0</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                &ldquo;Cashless checkout works flawlessly. Cash-back promo with partner merchants is really generous. Keep it up!&rdquo;
              </p>
            </div>

            <div className="p-3 border border-slate-200 bg-slate-50/50 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-sky-600 text-white text-[10px]">Customer Support</Badge>
                  <span className="text-xs font-mono text-slate-500">29 Apr 2020 14:10</span>
                  <Badge variant="outline" className="text-[10px] text-rose-700 border-rose-300 bg-rose-50">
                    OTP Delayed
                  </Badge>
                </div>
                <span className="text-xs font-extrabold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">2.0 / 5.0</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                &ldquo;Registration SMS OTP takes more than 10 minutes to arrive. By the time it arrives, the code expires. Extremely frustrating.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 col: Top Words Cloud */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Top Words</h3>
              <p className="text-xs text-slate-500">Frequency extracted from customer feedback</p>
            </div>
            <Badge variant="outline" className="text-[10px] text-slate-600">NLP Cloud</Badge>
          </div>

          <div className="flex-1 flex flex-wrap items-center justify-center gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-100">
            {topWords.map((item) => (
              <span
                key={item.word}
                className={`px-2.5 py-1 rounded-lg border cursor-pointer hover:scale-105 transition-transform ${item.size}`}
                title={`${item.count} mentions`}
              >
                {item.word}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Click any keyword to filter the sentiment timeline and verbatims.
          </div>
        </div>
      </div>

      {/* Interactive Modal for Event Log */}
      {isEventLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Sentiment Impact Event Log</h3>
              </div>
              <button
                onClick={() => setIsEventLogOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <div className="border-l-2 border-rose-500 pl-3 py-1">
                <span className="text-[11px] font-mono text-slate-400">28 Apr 2020 • Incident</span>
                <p className="text-xs font-semibold text-slate-900">Bank XYZ Gateway Gateway Downtime (3h 40m)</p>
                <p className="text-[11px] text-slate-600">Generated 840+ negative sentiment tickets within 4 hours.</p>
              </div>
              <div className="border-l-2 border-indigo-500 pl-3 py-1">
                <span className="text-[11px] font-mono text-slate-400">22 Apr 2020 • Release</span>
                <p className="text-xs font-semibold text-slate-900">App Version 4.12.0 Deployment</p>
                <p className="text-[11px] text-slate-600">Introduced new biometric authentication and updated biller UI.</p>
              </div>
              <div className="border-l-2 border-emerald-500 pl-3 py-1">
                <span className="text-[11px] font-mono text-slate-400">10 Apr 2020 • Campaign</span>
                <p className="text-xs font-semibold text-slate-900">Ramadan Cashback Promo Launch</p>
                <p className="text-[11px] text-slate-600">Drove 24% increase in 5-star Google Play & App Store reviews.</p>
              </div>
            </div>
            <Button onClick={() => setIsEventLogOpen(false)} className="w-full text-xs">
              Close Event Log
            </Button>
          </div>
        </div>
      )}

      {/* Interactive Modal for Live Stream */}
      {isLiveStreamOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-rose-600 animate-pulse" />
                <h3 className="text-base font-bold text-slate-900">Live Feedback Stream (Negative Filter)</h3>
              </div>
              <button
                onClick={() => setIsLiveStreamOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-rose-800">
                  <span>Twitter • 2m ago</span>
                  <span>Score: 1.0</span>
                </div>
                <p className="text-slate-800 font-medium">Why is withdrawal taking 48 hours? Customer support is unresponsive!</p>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs space-y-1">
                <div className="flex justify-between font-mono text-[10px] text-rose-800">
                  <span>Play Store • 5m ago</span>
                  <span>Score: 2.0</span>
                </div>
                <p className="text-slate-800 font-medium">Cannot receive OTP on Telkomsel numbers after latest update.</p>
              </div>
            </div>
            <Button onClick={() => setIsLiveStreamOpen(false)} className="w-full text-xs">
              Close Live Stream
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
