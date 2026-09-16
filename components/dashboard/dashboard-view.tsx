import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Send,
  AlertCircle,
  Clock,
  Layers,
  CheckCircle2,
  ExternalLink,
  UploadCloud,
  Plus,
  MessageSquare,
  Tag,
  Lightbulb,
  Target,
  CheckSquare,
  Zap,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/layout/page-container';
import type { NavigationRoute } from '@/types';
import {
  VOC_STATS,
  TOP_CUSTOMER_PROBLEMS,
  SENTIMENT_DATA,
} from '@/lib/data/voc-store';

interface DashboardViewProps {
  onNavigate: (route: NavigationRoute) => void;
  onAskCopilot?: (query: string) => void;
}

export function DashboardView({ onNavigate, onAskCopilot }: DashboardViewProps) {
  const [copilotQuery, setCopilotQuery] = useState('');

  const handleCopilotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery.trim()) return;
    if (onAskCopilot) {
      onAskCopilot(copilotQuery);
    } else {
      onNavigate('copilot');
    }
  };

  const statCards = [
    {
      label: 'Feedback',
      value: VOC_STATS.feedbackTotal,
      change: VOC_STATS.feedbackChange,
      isPositive: true,
      route: 'feedback' as NavigationRoute,
    },
    {
      label: 'Negative',
      value: VOC_STATS.negativeRate,
      change: VOC_STATS.negativeChange,
      isPositive: true, // A reduction in negative sentiment is positive
      route: 'feedback' as NavigationRoute,
    },
    {
      label: 'Themes',
      value: VOC_STATS.themesTotal,
      change: VOC_STATS.themesChange,
      isPositive: true,
      route: 'themes' as NavigationRoute,
    },
    {
      label: 'High Priority',
      value: VOC_STATS.highPriority,
      change: VOC_STATS.highPriorityChange,
      isPositive: true,
      route: 'insights' as NavigationRoute,
    },
  ];

  return (
    <PageContainer
      title="Good morning, Product Manager"
      description="Here's what's happening with your customer feedback."
      breadcrumbs={[{ label: 'Dashboard' }]}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => onNavigate('feedback')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Upload Feedback</span>
          </Button>
        </div>
      }
    >
      {/* 4 Stat Metric Cards (Exact match with Screen 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card
            key={stat.label}
            onClick={() => onNavigate(stat.route)}
            className="cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all bg-white"
          >
            <CardContent className="p-5">
              <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="mt-2 text-3xl font-extrabold text-zinc-900 tracking-tight">
                {stat.value}
              </div>
              <div className="mt-2 flex items-center text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                <span>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* VoC AI Processing Pipeline Architecture Banner */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white">
                <Zap className="h-3.5 w-3.5" />
              </span>
              <h3 className="font-bold text-sm tracking-tight text-white">
                VoC AI Processing Pipeline
              </h3>
              <Badge className="bg-indigo-900/60 text-indigo-300 border-indigo-700/60 text-[10px] px-1.5 py-0">
                End-to-End AI Engine
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              How the AI works: raw customer feedback transforms into extracted attributes, themes, insights, prioritized opportunities, and engineering actions.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => onNavigate('copilot')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 px-3 font-semibold shrink-0 gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
            <span>Ask Copilot About Pipeline</span>
          </Button>
        </div>

        {/* 6 Sequential Steps + Copilot overlay */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
          {[
            {
              step: '1',
              name: 'Customer Feedback',
              detail: '12,482 Signals',
              sub: 'Zendesk, Play, App Store',
              icon: MessageSquare,
              route: 'feedback' as NavigationRoute,
              color: 'text-blue-400',
              bg: 'bg-blue-950/40 border-blue-800/40',
            },
            {
              step: '2',
              name: 'Extract Information',
              detail: '4 Dimensions',
              sub: 'Sentiment, Topic, Type, Pain',
              icon: Tag,
              route: 'feedback_explorer' as NavigationRoute,
              color: 'text-amber-400',
              bg: 'bg-amber-950/40 border-amber-800/40',
            },
            {
              step: '3',
              name: 'Group Themes',
              detail: '47 Thematic Clusters',
              sub: 'Semantic similarity grouping',
              icon: Layers,
              route: 'themes' as NavigationRoute,
              color: 'text-purple-400',
              bg: 'bg-purple-950/40 border-purple-800/40',
            },
            {
              step: '4',
              name: 'Identify Insights',
              detail: 'High Severity Friction',
              sub: 'Why it matters & ARR risk',
              icon: Lightbulb,
              route: 'insights' as NavigationRoute,
              color: 'text-rose-400',
              bg: 'bg-rose-950/40 border-rose-800/40',
            },
            {
              step: '5',
              name: 'Calculate Priority',
              detail: 'RICE Scoring (P0-P3)',
              sub: 'Reach × Impact × Conf / Effort',
              icon: Target,
              route: 'opportunities' as NavigationRoute,
              color: 'text-emerald-400',
              bg: 'bg-emerald-950/40 border-emerald-800/40',
            },
            {
              step: '6',
              name: 'Recommend Actions',
              detail: 'User Stories & PRDs',
              sub: 'Problems, Solutions & Metrics',
              icon: CheckSquare,
              route: 'actions' as NavigationRoute,
              color: 'text-cyan-400',
              bg: 'bg-cyan-950/40 border-cyan-800/40',
            },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                onClick={() => onNavigate(s.route)}
                className={`p-3 rounded-lg border ${s.bg} hover:border-slate-600 cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Step {s.step}
                    </span>
                    <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                  </div>
                  <div className="font-semibold text-xs text-slate-100 mt-1.5 group-hover:text-white transition-colors">
                    {s.name}
                  </div>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] font-medium text-slate-200">{s.detail}</div>
                  <div className="text-[10px] text-slate-400 truncate">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Card: Top Customer Problems (7 columns) */}
        <Card className="lg:col-span-7 bg-white shadow-2xs">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <CardTitle className="text-base font-bold text-zinc-900">
                Top Customer Problems
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                Highest frequency complaints prioritized by AI synthesis
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('insights')}
              className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
            >
              View all <ArrowRight className="h-3.5 w-3.5 ml-1 inline" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {TOP_CUSTOMER_PROBLEMS.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => onNavigate('insights')}
                  className="group flex items-center justify-between px-6 py-4 hover:bg-zinc-50/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        problem.severity === 'High' ? 'bg-rose-500' : 'bg-amber-500'
                      }`}
                    />
                    <div>
                      <span className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                        {problem.title}
                      </span>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {problem.whyItMatters}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-800">
                        {problem.mentions.toLocaleString()}
                      </span>
                      <span className="text-[11px] text-zinc-400 block">mentions</span>
                    </div>

                    <Badge
                      className={
                        problem.severity === 'High'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold text-xs px-2.5 py-0.5'
                          : 'bg-amber-50 text-amber-700 border-amber-200 font-semibold text-xs px-2.5 py-0.5'
                      }
                    >
                      {problem.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Card: Customer Sentiment Donut Chart (5 columns) */}
        <Card className="lg:col-span-5 bg-white shadow-2xs">
          <CardHeader className="pb-2 border-b border-zinc-100">
            <CardTitle className="text-base font-bold text-zinc-900">
              Customer Sentiment
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Sentiment distribution across 12,482 analyzed records
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SENTIMENT_DATA}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {SENTIMENT_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number, name: string) => [`${val}%`, name]}
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-zinc-900">12.5k</span>
                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                  Total
                </span>
              </div>
            </div>

            {/* Legend / Breakdown (Exact match from image) */}
            <div className="mt-4 space-y-2 border-t border-zinc-100 pt-4">
              {SENTIMENT_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-zinc-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-400">{item.count}</span>
                    <span className="font-bold text-zinc-900 w-8 text-right">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Bar: Ask your VoC Copilot anything... (Exact match from Screen 2) */}
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
        <form onSubmit={handleCopilotSubmit} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={copilotQuery}
            onChange={(e) => setCopilotQuery(e.target.value)}
            placeholder="Ask your VoC Copilot anything..."
            className="flex-1 bg-transparent text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
          />
          <Button
            type="submit"
            size="sm"
            className="bg-blue-600 hover:bg-blue-500 text-white gap-1.5 text-xs px-4"
          >
            <span>Ask Copilot</span>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>

        {/* Quick prompt pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 text-xs">
          <span className="text-[11px] text-zinc-400 font-medium">Try asking:</span>
          {[
            'What are customers most frustrated about?',
            'Show evidence for checkout payment failures',
            'Draft PRD for payment reliability',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setCopilotQuery(prompt);
                if (onAskCopilot) onAskCopilot(prompt);
                else onNavigate('copilot');
              }}
              className="rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-3 py-1 text-[11px] font-medium transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
