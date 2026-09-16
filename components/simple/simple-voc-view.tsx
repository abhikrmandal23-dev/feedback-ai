import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  ChevronRight,
  User,
  Building2,
  Mail,
  MessageSquareQuote,
  Sparkles,
  ArrowUp,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

export interface FeedbackRecord {
  id: string;
  customerName: string;
  company?: string;
  source: 'User Interview' | 'Customer Survey' | 'Email' | 'Direct Feedback';
  type: 'pain_point' | 'feature_request' | 'positive';
  category: string;
  quote: string;
  date: string;
  status: 'Open' | 'Under Review' | 'Resolved';
}

export interface PainPointItem {
  id: string;
  issue: string;
  count: number;
  severity: 'High' | 'Medium' | 'Low';
  category: string;
}

export interface FeatureRequestItem {
  id: string;
  feature: string;
  votes: number;
  status: 'Planned' | 'In Progress' | 'Reviewing';
  category: string;
}

const INITIAL_PAIN_POINTS: PainPointItem[] = [
  {
    id: 'pp-1',
    issue: 'Mobile app login session drops unexpectedly',
    count: 18,
    severity: 'High',
    category: 'Mobile & Auth',
  },
  {
    id: 'pp-2',
    issue: 'Slow CSV export on queries with more than 10k items',
    count: 12,
    severity: 'Medium',
    category: 'Export',
  },
  {
    id: 'pp-3',
    issue: 'Invoices lack itemized sales tax and VAT breakdown',
    count: 8,
    severity: 'Medium',
    category: 'Billing',
  },
  {
    id: 'pp-4',
    issue: 'Navigation menu hard to collapse on tablet screens',
    count: 5,
    severity: 'Low',
    category: 'UI/UX',
  },
];

const INITIAL_FEATURE_REQUESTS: FeatureRequestItem[] = [
  {
    id: 'fr-1',
    feature: 'Custom PDF and spreadsheet report exports',
    votes: 28,
    status: 'In Progress',
    category: 'Reporting',
  },
  {
    id: 'fr-2',
    feature: 'Keyboard shortcuts for rapid feedback triaging',
    votes: 19,
    status: 'Planned',
    category: 'Usability',
  },
  {
    id: 'fr-3',
    feature: 'Weekly automated email summary digest',
    votes: 14,
    status: 'Reviewing',
    category: 'Notifications',
  },
  {
    id: 'fr-4',
    feature: 'Dark mode theme for low-light environments',
    votes: 11,
    status: 'Planned',
    category: 'UI/UX',
  },
];

const INITIAL_FEEDBACK: FeedbackRecord[] = [
  {
    id: 'fb-1',
    customerName: 'Sarah Jenkins',
    company: 'Northstar Labs',
    source: 'User Interview',
    type: 'pain_point',
    category: 'Mobile & Auth',
    quote: 'The mobile app logs me out every few hours when switching Wi-Fi networks. It interrupts customer review meetings.',
    date: 'Today',
    status: 'Open',
  },
  {
    id: 'fb-2',
    customerName: 'Marcus Vance',
    company: 'CloudScale Inc',
    source: 'Customer Survey',
    type: 'feature_request',
    category: 'Reporting',
    quote: 'We need to export monthly summary charts directly into formatted PDF reports for executive steering committee updates.',
    date: 'Yesterday',
    status: 'Under Review',
  },
  {
    id: 'fb-3',
    customerName: 'Elena Rostova',
    company: 'Apex Financial',
    source: 'Email',
    type: 'pain_point',
    category: 'Export',
    quote: 'Downloading larger dataset exports hangs the browser tab for over two minutes without a progress indicator.',
    date: '2 days ago',
    status: 'Open',
  },
  {
    id: 'fb-4',
    customerName: 'David Chen',
    company: 'HyperGrowth Tech',
    source: 'Direct Feedback',
    type: 'positive',
    category: 'Usability',
    quote: 'The simplified feedback dashboard is straightforward and easy to navigate. Our product team checks it every morning.',
    date: '3 days ago',
    status: 'Resolved',
  },
  {
    id: 'fb-5',
    customerName: 'Rachel Adams',
    company: 'Horizon Health',
    source: 'Customer Survey',
    type: 'feature_request',
    category: 'Notifications',
    quote: 'An automated Monday morning email with top complaints from the prior 7 days would save our PM team hours.',
    date: '4 days ago',
    status: 'Planned' as any,
  },
  {
    id: 'fb-6',
    customerName: 'Jordan Miller',
    company: 'Studio Alpha',
    source: 'User Interview',
    type: 'pain_point',
    category: 'Billing',
    quote: 'Our accounting department asked why invoices do not specify the regional VAT number and itemized tax breakdown.',
    date: '5 days ago',
    status: 'Open',
  },
];

export function SimpleVoCHub() {
  const [feedbackList, setFeedbackList] = useState<FeedbackRecord[]>(INITIAL_FEEDBACK);
  const [painPoints, setPainPoints] = useState<PainPointItem[]>(INITIAL_PAIN_POINTS);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequestItem[]>(INITIAL_FEATURE_REQUESTS);

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pain_point' | 'feature_request' | 'positive'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formCustomer, setFormCustomer] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formSource, setFormSource] = useState<FeedbackRecord['source']>('Customer Survey');
  const [formType, setFormType] = useState<FeedbackRecord['type']>('pain_point');
  const [formCategory, setFormCategory] = useState('');
  const [formQuote, setFormQuote] = useState('');

  // Handle vote increment
  const handleVote = (id: string) => {
    setFeatureRequests((prev) =>
      prev.map((fr) => (fr.id === id ? { ...fr, votes: fr.votes + 1 } : fr))
    );
  };

  // Handle add feedback
  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuote.trim()) return;

    const newRecord: FeedbackRecord = {
      id: `fb-${Date.now()}`,
      customerName: formCustomer.trim() || 'Anonymous User',
      company: formCompany.trim() || undefined,
      source: formSource,
      type: formType,
      category: formCategory.trim() || 'General',
      quote: formQuote.trim(),
      date: 'Just now',
      status: 'Open',
    };

    setFeedbackList([newRecord, ...feedbackList]);

    // Update pain points or feature requests lists if matching category
    if (formType === 'pain_point') {
      const match = painPoints.find(
        (p) => p.issue.toLowerCase() === formCategory.toLowerCase() || p.category.toLowerCase() === formCategory.toLowerCase()
      );
      if (match) {
        setPainPoints((prev) =>
          prev.map((p) => (p.id === match.id ? { ...p, count: p.count + 1 } : p))
        );
      } else if (formCategory.trim()) {
        setPainPoints((prev) => [
          ...prev,
          {
            id: `pp-${Date.now()}`,
            issue: formCategory.trim(),
            count: 1,
            severity: 'Medium',
            category: formCategory.trim(),
          },
        ]);
      }
    } else if (formType === 'feature_request') {
      const match = featureRequests.find(
        (f) => f.feature.toLowerCase() === formCategory.toLowerCase() || f.category.toLowerCase() === formCategory.toLowerCase()
      );
      if (match) {
        setFeatureRequests((prev) =>
          prev.map((f) => (f.id === match.id ? { ...f, votes: f.votes + 1 } : f))
        );
      } else if (formCategory.trim()) {
        setFeatureRequests((prev) => [
          ...prev,
          {
            id: `fr-${Date.now()}`,
            feature: formCategory.trim(),
            votes: 1,
            status: 'Reviewing',
            category: formCategory.trim(),
          },
        ]);
      }
    }

    // Reset Form
    setFormCustomer('');
    setFormCompany('');
    setFormCategory('');
    setFormQuote('');
    setIsAddModalOpen(false);
  };

  // Handle delete feedback
  const handleDeleteFeedback = (id: string) => {
    setFeedbackList((prev) => prev.filter((item) => item.id !== id));
  };

  // Toggle feedback status
  const handleToggleStatus = (id: string) => {
    setFeedbackList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: FeedbackRecord['status'] =
            item.status === 'Open' ? 'Under Review' : item.status === 'Under Review' ? 'Resolved' : 'Open';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Metrics calculations
  const totalCount = feedbackList.length;
  const painPointCount = feedbackList.filter((f) => f.type === 'pain_point').length;
  const featureRequestCount = feedbackList.filter((f) => f.type === 'feature_request').length;
  const positiveCount = feedbackList.filter((f) => f.type === 'positive').length;
  const positiveRatio = totalCount > 0 ? Math.round((positiveCount / totalCount) * 100) : 0;

  // Filter feedback
  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesType;
      const matchesSearch =
        item.quote.toLowerCase().includes(q) ||
        item.customerName.toLowerCase().includes(q) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [feedbackList, typeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased pb-20">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-slate-900 tracking-tight">VoC Copilot</h1>
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  V1 Essential
                </span>
              </div>
              <p className="text-xs text-slate-500">Collect, track, and prioritize customer feedback</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold gap-1.5 shadow-xs px-3.5 h-8.5 rounded-lg"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log Feedback</span>
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-7">
        {/* 2. Top Metric Cards (Customer Pulse - Simple, No Charts) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overview
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              {totalCount} total entries recorded
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Card 1: Total Feedback */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-xs font-medium text-slate-500 block">Total Feedback</span>
              <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {totalCount}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Across all sources</span>
            </div>

            {/* Card 2: Pain Points */}
            <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-xs bg-rose-50/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-rose-800">Pain Points</span>
                <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
              </div>
              <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-rose-950 tracking-tight">
                {painPointCount}
              </div>
              <span className="text-[11px] text-rose-700/80 mt-1 block">Bugs & frustrations</span>
            </div>

            {/* Card 3: Feature Requests */}
            <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-xs bg-blue-50/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-blue-800">Feature Requests</span>
                <Lightbulb className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-blue-950 tracking-tight">
                {featureRequestCount}
              </div>
              <span className="text-[11px] text-blue-700/80 mt-1 block">Roadmap ideas</span>
            </div>

            {/* Card 4: Positive Feedback */}
            <div className="bg-white border border-emerald-100 rounded-xl p-4 shadow-xs bg-emerald-50/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-800">Positive Feedback</span>
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
                {positiveCount}
              </div>
              <span className="text-[11px] text-emerald-700/80 mt-1 block">Praise & delight</span>
            </div>
          </div>
        </section>

        {/* 3. Two Core Decision Columns: What's Broken vs What to Build Next */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column A: Top Pain Points */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  Top Pain Points & Complaints
                </h3>
                <p className="text-xs text-slate-500">Most frequent user complaints</p>
              </div>
              <Badge variant="outline" className="text-[11px] text-rose-700 border-rose-200 bg-rose-50">
                Fix Priority
              </Badge>
            </div>

            <div className="space-y-2 pt-1">
              {painPoints.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSearchQuery(item.category)}
                  title="Click to filter feedback by this category"
                  className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-rose-200 bg-slate-50/60 hover:bg-rose-50/30 transition-all cursor-pointer text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-slate-400 mt-0.5">
                      {idx + 1}.
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-rose-950 leading-snug">
                        {item.issue}
                      </p>
                      <span className="text-[11px] text-slate-500">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <Badge
                      className={`text-[10px] px-1.5 py-0 ${
                        item.severity === 'High'
                          ? 'bg-rose-600 text-white'
                          : item.severity === 'Medium'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-400 text-white'
                      }`}
                    >
                      {item.severity}
                    </Badge>
                    <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Column B: Top Feature Requests */}
          <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  Top Feature Requests
                </h3>
                <p className="text-xs text-slate-500">Ranked by customer requests</p>
              </div>
              <Badge variant="outline" className="text-[11px] text-blue-700 border-blue-200 bg-blue-50">
                Roadmap Input
              </Badge>
            </div>

            <div className="space-y-2 pt-1">
              {featureRequests.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/60 hover:bg-blue-50/30 transition-all text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono font-bold text-slate-400 mt-0.5">
                      {idx + 1}.
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900 leading-snug">{item.feature}</p>
                      <span className="text-[11px] text-slate-500">{item.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        item.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : item.status === 'Planned'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </span>
                    <button
                      onClick={() => handleVote(item.id)}
                      title="Add a vote"
                      className="flex items-center gap-1 font-mono font-bold text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                    >
                      <ArrowUp className="h-3 w-3" />
                      <span>{item.votes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 4. Customer Feedback Log (Real Quotes & Evidence) */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquareQuote className="h-4 w-4 text-slate-700" />
                Customer Quotes & Feedback Log
              </h3>
              <p className="text-xs text-slate-500">
                Direct customer words to validate problems and product decisions
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({feedbackList.length})
              </button>
              <button
                onClick={() => setTypeFilter('pain_point')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  typeFilter === 'pain_point'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Pain Points ({painPointCount})
              </button>
              <button
                onClick={() => setTypeFilter('feature_request')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  typeFilter === 'feature_request'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Requests ({featureRequestCount})
              </button>
              <button
                onClick={() => setTypeFilter('positive')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  typeFilter === 'positive'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Positive ({positiveCount})
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter feedback by customer, topic, or keyword..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9.5 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Feedback items list */}
          <div className="space-y-3">
            {filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-2.5 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{item.customerName}</span>
                    {item.company && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-medium">{item.company}</span>
                      </>
                    )}
                    <span className="text-slate-300">•</span>
                    <Badge variant="outline" className="text-[10px] text-slate-600 font-normal px-1.5 py-0">
                      {item.source}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        item.type === 'pain_point'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.type === 'feature_request'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.type === 'pain_point'
                        ? 'Pain Point'
                        : item.type === 'feature_request'
                        ? 'Request'
                        : 'Positive'}
                    </span>

                    <button
                      onClick={() => handleToggleStatus(item.id)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded border cursor-pointer transition-colors ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : item.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.status}
                    </button>

                    <button
                      onClick={() => handleDeleteFeedback(item.id)}
                      title="Delete feedback"
                      className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                  &ldquo;{item.quote}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}

            {filteredFeedback.length === 0 && (
              <div className="py-10 text-center text-slate-400 text-xs">
                No feedback matches &ldquo;{searchQuery}&rdquo;.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 5. Simple Modal to Add Customer Feedback */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Log Customer Feedback"
        description="Record a quote, complaint, or request from customer conversations."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleAddFeedback}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              Save Feedback
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddFeedback} className="space-y-3.5 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Customer Quote or Observation *
            </label>
            <textarea
              required
              rows={3}
              value={formQuote}
              onChange={(e) => setFormQuote(e.target.value)}
              placeholder="e.g. The report takes 2 minutes to generate when selecting date ranges..."
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Customer Name</label>
              <input
                type="text"
                value={formCustomer}
                onChange={(e) => setFormCustomer(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full text-xs h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Company (Optional)</label>
              <input
                type="text"
                value={formCompany}
                onChange={(e) => setFormCompany(e.target.value)}
                placeholder="e.g. Acme Labs"
                className="w-full text-xs h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as any)}
                className="w-full text-xs h-8.5 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="pain_point">Pain Point / Bug</option>
                <option value="feature_request">Feature Request</option>
                <option value="positive">Positive / Praise</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Source</label>
              <select
                value={formSource}
                onChange={(e) => setFormSource(e.target.value as any)}
                className="w-full text-xs h-8.5 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              >
                <option value="User Interview">User Interview</option>
                <option value="Customer Survey">Customer Survey</option>
                <option value="Email">Email</option>
                <option value="Direct Feedback">Direct Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g. Export, Login, UI"
                className="w-full text-xs h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              />
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
