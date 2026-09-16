import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  ChevronRight,
  UploadCloud,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Check,
  Copy,
  AlertCircle,
  Tag,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PageContainer } from '@/components/layout/page-container';
import type { NavigationRoute } from '@/types';
import type { FeedbackSource, AIAnalysis, StoredFeedbackItem } from './feedback-view';

const STORAGE_KEY = 'voc_stored_feedback_v2';

// Standard 3 user examples + representative items
const DEFAULT_FEEDBACK_ITEMS: StoredFeedbackItem[] = [
  {
    id: 'exp-1',
    text: 'Payment failed twice',
    source: 'Support Tickets',
    dateAdded: 'Today, 11:20 AM',
    timestamp: Date.now() - 1000 * 60 * 20,
    customerName: 'Marcus Vance',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Negative',
      topic: 'Payment',
      feedbackType: 'Complaint',
      painPoint: 'Payment failure during checkout',
    },
  },
  {
    id: 'exp-2',
    text: 'App is very slow',
    source: 'App Reviews',
    dateAdded: 'Today, 10:15 AM',
    timestamp: Date.now() - 1000 * 60 * 45,
    customerName: 'Elena Chen',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Negative',
      topic: 'Performance',
      feedbackType: 'Complaint',
      painPoint: 'Sluggish performance and slow app response times',
    },
  },
  {
    id: 'exp-3',
    text: 'Love the new dashboard',
    source: 'Survey',
    dateAdded: 'Yesterday, 04:30 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    customerName: 'Sarah Jenkins',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Positive',
      topic: 'UI',
      feedbackType: 'Praise',
      painPoint: 'None (Positive feedback)',
    },
  },
  {
    id: 'exp-4',
    text: 'Need scheduled weekly email reports with PDF summaries for executives.',
    source: 'Survey',
    dateAdded: 'Yesterday, 02:10 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    customerName: 'David K., Lead PM',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Neutral',
      topic: 'Export & Reports',
      feedbackType: 'Feature Request',
      painPoint: 'Missing automated weekly email PDF summaries',
    },
  },
  {
    id: 'exp-5',
    text: 'Checkout failed twice when trying to pay with international credit cards.',
    source: 'Support Tickets',
    dateAdded: '2 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    customerName: 'Amanda Brooks',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Negative',
      topic: 'Payment',
      feedbackType: 'Complaint',
      painPoint: 'International credit card payment failures at checkout',
    },
  },
  {
    id: 'exp-6',
    text: 'Great customer support team, helped resolve my billing question in five minutes!',
    source: 'Customer Interviews',
    dateAdded: '3 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    customerName: 'Robert Lang',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Positive',
      topic: 'Support',
      feedbackType: 'Praise',
      painPoint: 'None (Positive feedback)',
    },
  },
];

// Helper to abbreviate source names to match user prompt format (Support, Review, Survey, Interview)
function formatSourceShort(source: FeedbackSource | string): string {
  if (source.includes('Support')) return 'Support';
  if (source.includes('Review')) return 'Review';
  if (source.includes('Survey')) return 'Survey';
  if (source.includes('Interview')) return 'Interview';
  return source;
}

interface FeedbackExplorerViewProps {
  onNavigate?: (route: NavigationRoute) => void;
}

export function FeedbackExplorerView({ onNavigate }: FeedbackExplorerViewProps) {
  // 1. Stored feedback
  const [feedbackList, setFeedbackList] = useState<StoredFeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if default examples exist, if not prepend them for immediate demo readiness
          const hasPaymentTwice = parsed.some((p: any) =>
            typeof p.text === 'string' && p.text.toLowerCase().includes('payment failed')
          );
          if (hasPaymentTwice) {
            return parsed;
          }
          return [...DEFAULT_FEEDBACK_ITEMS, ...parsed];
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_FEEDBACK_ITEMS;
  });

  // 2. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Negative' | 'Positive' | 'Neutral'>('All');
  const [topicFilter, setTopicFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'sentiment-neg' | 'sentiment-pos' | 'topic'>('newest');

  // 3. Selected item for "Open individual feedback" modal
  const [selectedFeedback, setSelectedFeedback] = useState<StoredFeedbackItem | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackList));
    } catch {
      // ignore
    }
  }, [feedbackList]);

  // Unique topics list for topic dropdown
  const allTopics = Array.from(
    new Set(
      feedbackList
        .map((f) => f.analysis?.topic)
        .filter((t): t is string => Boolean(t))
    )
  ).sort();

  // Handle Copy text in modal
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSentimentFilter('All');
    setTopicFilter('All');
    setSourceFilter('All');
    setSortBy('newest');
  };

  const isFiltered =
    searchQuery.trim() !== '' ||
    sentimentFilter !== 'All' ||
    topicFilter !== 'All' ||
    sourceFilter !== 'All' ||
    sortBy !== 'newest';

  // Filter items
  const filteredList = feedbackList
    .filter((item) => {
      // Sentiment filter
      if (sentimentFilter !== 'All') {
        if (item.analysis?.sentiment !== sentimentFilter) return false;
      }

      // Topic filter
      if (topicFilter !== 'All') {
        if (item.analysis?.topic !== topicFilter) return false;
      }

      // Source filter
      if (sourceFilter !== 'All') {
        const shortSource = formatSourceShort(item.source);
        if (shortSource !== sourceFilter && item.source !== sourceFilter) return false;
      }

      // Search query: matches text, customer name, pain point, or topic
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const textMatch = item.text.toLowerCase().includes(q);
        const customerMatch = item.customerName?.toLowerCase().includes(q) ?? false;
        const topicMatch = item.analysis?.topic?.toLowerCase().includes(q) ?? false;
        const painMatch = item.analysis?.painPoint?.toLowerCase().includes(q) ?? false;
        const sourceMatch = item.source.toLowerCase().includes(q);

        if (!textMatch && !customerMatch && !topicMatch && !painMatch && !sourceMatch) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.timestamp - a.timestamp;
      if (sortBy === 'oldest') return a.timestamp - b.timestamp;
      if (sortBy === 'sentiment-neg') {
        const order = { Negative: 0, Neutral: 1, Positive: 2 };
        const scoreA = order[a.analysis?.sentiment || 'Neutral'] ?? 1;
        const scoreB = order[b.analysis?.sentiment || 'Neutral'] ?? 1;
        return scoreA - scoreB;
      }
      if (sortBy === 'sentiment-pos') {
        const order = { Positive: 0, Neutral: 1, Negative: 2 };
        const scoreA = order[a.analysis?.sentiment || 'Neutral'] ?? 1;
        const scoreB = order[b.analysis?.sentiment || 'Neutral'] ?? 1;
        return scoreA - scoreB;
      }
      if (sortBy === 'topic') {
        const topicA = a.analysis?.topic || '';
        const topicB = b.analysis?.topic || '';
        return topicA.localeCompare(topicB);
      }
      return 0;
    });

  return (
    <PageContainer
      title="Feedback Explorer"
      description="Allow the PM to search and filter customer feedback."
      breadcrumbs={[{ label: 'Feedback' }, { label: 'Feedback Explorer' }]}
      onNavigate={onNavigate}
      actions={
        onNavigate && (
          <Button
            size="sm"
            onClick={() => onNavigate('feedback')}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Upload Feedback</span>
          </Button>
        )
      }
    >
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Simple Table Card */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-xs overflow-hidden">
          {/* Header Title */}
          <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Customer Feedback
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">
                {filteredList.length} {filteredList.length === 1 ? 'result' : 'results'}
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium underline ml-2 cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Controls: Search & Filters */}
          <div className="p-4 bg-zinc-50/70 border-b border-zinc-200 space-y-3">
            {/* Search Input */}
            <div className="flex items-center gap-2">
              <label htmlFor="feedback-search-input" className="text-xs font-semibold text-zinc-700 whitespace-nowrap">
                Search:
              </label>
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                <input
                  id="feedback-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="payment"
                  className="w-full text-xs pl-9 pr-8 py-2 rounded-lg bg-white border border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter & Sort Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs font-semibold text-zinc-700 whitespace-nowrap">
                Filter:
              </span>

              {/* [Sentiment ▼] */}
              <select
                aria-label="Filter by Sentiment"
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value as any)}
                className="text-xs bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-zinc-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Sentiment ▼</option>
                <option value="Negative">Negative</option>
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
              </select>

              {/* [Topic ▼] */}
              <select
                aria-label="Filter by Topic"
                value={topicFilter}
                onChange={(e) => setTopicFilter(e.target.value)}
                className="text-xs bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-zinc-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Topic ▼</option>
                {allTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>

              {/* [Source ▼] */}
              <select
                aria-label="Filter by Source"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="text-xs bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-zinc-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All">Source ▼</option>
                <option value="Support">Support</option>
                <option value="Review">Review</option>
                <option value="Survey">Survey</option>
                <option value="Interview">Interview</option>
              </select>

              <div className="ml-auto flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-700 whitespace-nowrap">
                  Sort:
                </span>
                {/* [Sort ▼] */}
                <select
                  aria-label="Sort feedback"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs bg-white border border-zinc-300 rounded-lg px-2.5 py-1.5 text-zinc-800 font-medium focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="newest">Newest First ▼</option>
                  <option value="oldest">Oldest First ▼</option>
                  <option value="sentiment-neg">Negative First ▼</option>
                  <option value="sentiment-pos">Positive First ▼</option>
                  <option value="topic">Topic (A-Z) ▼</option>
                </select>
              </div>
            </div>
          </div>

          {/* Simple Table Listing:
              ────────────────────────────────────
              Payment failed twice
              Negative | Payment | Support
              ────────────────────────────────────
              App is very slow
              Negative | Performance | Review
              ────────────────────────────────────
              Love the new dashboard
              Positive | UI | Survey
              ────────────────────────────────────
          */}
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-500 space-y-2">
              <p className="font-semibold text-zinc-700">No matching feedback found</p>
              <p>Try searching for a different keyword or resetting filters.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-2 text-xs"
              >
                Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200">
              {filteredList.map((item) => {
                const sentiment = item.analysis?.sentiment || 'Neutral';
                const topic = item.analysis?.topic || 'General';
                const sourceShort = formatSourceShort(item.source);

                const rowBorder =
                  sentiment === 'Negative'
                    ? 'border-l-4 border-l-red-500 bg-red-50/10'
                    : sentiment === 'Neutral'
                    ? 'border-l-4 border-l-amber-400 bg-amber-50/10'
                    : 'border-l-4 border-l-emerald-500 bg-emerald-50/10';

                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedFeedback(item)}
                    className={`p-4 hover:bg-zinc-50/90 cursor-pointer transition-colors group flex items-center justify-between ${rowBorder}`}
                  >
                    <div className="space-y-1.5 flex-1 pr-4">
                      {/* Feedback Text Line */}
                      <p className="text-sm font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors leading-snug">
                        {item.text}
                      </p>

                      {/* Format: Sentiment | Topic | Source */}
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                        <span
                          className={`font-bold inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] border ${
                            sentiment === 'Negative'
                              ? 'text-red-700 bg-red-50 border-red-200'
                              : sentiment === 'Positive'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-amber-800 bg-yellow-50 border-yellow-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              sentiment === 'Negative'
                                ? 'bg-red-500'
                                : sentiment === 'Positive'
                                ? 'bg-emerald-500'
                                : 'bg-yellow-500'
                            }`}
                          />
                          {sentiment === 'Negative'
                            ? 'Bad (Negative)'
                            : sentiment === 'Positive'
                            ? 'Good (Positive)'
                            : 'Neutral'}
                        </span>
                        <span className="text-zinc-300">|</span>
                        <span className="text-zinc-700 font-medium">{topic}</span>
                        <span className="text-zinc-300">|</span>
                        <span className="text-zinc-600">{sourceShort}</span>
                      </div>
                    </div>

                    {/* Open Arrow */}
                    <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-blue-600 transition-colors shrink-0">
                      <span className="text-xs font-medium hidden sm:inline">Open</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* "Open individual feedback" Modal Dialog */}
      <Dialog
        open={Boolean(selectedFeedback)}
        onOpenChange={(open) => !open && setSelectedFeedback(null)}
        title="Customer Feedback"
        description="Individual feedback record and AI analysis breakdown."
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => selectedFeedback && handleCopyText(selectedFeedback.text)}
              className="text-xs gap-1.5"
            >
              {hasCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setSelectedFeedback(null)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs"
            >
              Close
            </Button>
          </div>
        }
      >
        {selectedFeedback && (
          <div className="space-y-4 py-1">
            {/* Feedback Quote Block */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block mb-1">
                Customer Quote:
              </span>
              <p className="text-sm font-semibold text-zinc-900 leading-relaxed italic">
                &ldquo;{selectedFeedback.text}&rdquo;
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-500">
                <span>
                  Customer: <strong className="text-zinc-700">{selectedFeedback.customerName || 'Anonymous'}</strong>
                </span>
                <span>{selectedFeedback.dateAdded}</span>
              </div>
            </div>

            {/* AI Identified Attributes (4 Things) */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  AI Analysis Breakdown
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Sentiment */}
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 font-semibold block mb-1">
                    Sentiment
                  </span>
                  <div className="flex items-center gap-1.5">
                    {selectedFeedback.analysis?.sentiment === 'Negative' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                        <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                        <span>Bad (Negative)</span>
                      </span>
                    ) : selectedFeedback.analysis?.sentiment === 'Positive' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Good (Positive)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300">
                        <Minus className="h-3.5 w-3.5 text-yellow-700" />
                        <span>Neutral</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 2. Topic */}
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 font-semibold block mb-1">
                    Topic
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-blue-600" />
                    <span className="text-xs font-bold text-zinc-900">
                      {selectedFeedback.analysis?.topic || 'General'}
                    </span>
                  </div>
                </div>

                {/* 3. Feedback Type */}
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 font-semibold block mb-1">
                    Feedback Type
                  </span>
                  <div className="flex items-center gap-1.5">
                    {selectedFeedback.analysis?.feedbackType === 'Complaint' ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    ) : selectedFeedback.analysis?.feedbackType === 'Feature Request' ? (
                      <Lightbulb className="h-3.5 w-3.5 text-blue-600" />
                    ) : selectedFeedback.analysis?.feedbackType === 'Praise' ? (
                      <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <HelpCircle className="h-3.5 w-3.5 text-purple-600" />
                    )}
                    <span className="text-xs font-bold text-zinc-900">
                      {selectedFeedback.analysis?.feedbackType || 'Feedback'}
                    </span>
                  </div>
                </div>

                {/* Source */}
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  <span className="text-[10px] text-zinc-500 font-semibold block mb-1">
                    Source
                  </span>
                  <span className="text-xs font-bold text-zinc-900">
                    {selectedFeedback.source}
                  </span>
                </div>
              </div>

              {/* 4. Customer Pain Point */}
              <div className="mt-2.5 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-500 font-semibold block mb-1">
                  Customer Pain Point
                </span>
                <p className="text-xs font-medium text-zinc-900">
                  {selectedFeedback.analysis?.painPoint || 'No friction point identified'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </PageContainer>
  );
}
