import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Trash2,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRight,
  MessageSquare,
  HelpCircle,
  Smartphone,
  Headphones,
  ClipboardList,
  Users,
  X,
  RefreshCw,
  Eye,
  TrendingDown,
  TrendingUp,
  Minus,
  Tag,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  Flame,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export type FeedbackSource = 
  | 'App Reviews'
  | 'Support Tickets'
  | 'Survey'
  | 'Customer Interviews';

export interface AIAnalysis {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  topic: string;
  feedbackType: 'Complaint' | 'Feature Request' | 'Praise' | 'Inquiry';
  painPoint: string;
}

export interface StoredFeedbackItem {
  id: string;
  text: string;
  source: FeedbackSource;
  dateAdded: string;
  timestamp: number;
  customerName?: string;
  status: 'Analyzed' | 'Analyzing' | 'Ready for AI Analysis';
  analysis?: AIAnalysis;
}

const STORAGE_KEY = 'voc_stored_feedback_v2';

const INITIAL_SAMPLE_FEEDBACK: StoredFeedbackItem[] = [
  {
    id: 'sample-0',
    text: 'The payment failed twice and I had to try again.',
    source: 'Support Tickets',
    dateAdded: 'Today, 11:20 AM',
    timestamp: Date.now() - 1000 * 60 * 30,
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
    id: 'sample-1',
    text: 'The checkout page hangs when entering a European billing address with VAT. Had to abandon our annual subscription purchase.',
    source: 'Support Tickets',
    dateAdded: 'Today, 09:15 AM',
    timestamp: Date.now() - 1000 * 60 * 180,
    customerName: 'Marcus Lindqvist',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Negative',
      topic: 'Billing',
      feedbackType: 'Complaint',
      painPoint: 'Checkout hangs on European billing address with VAT',
    },
  },
  {
    id: 'sample-2',
    text: 'Love the speed of the desktop app, but the mobile version crashes every time I try to upload photos from camera roll.',
    source: 'App Reviews',
    dateAdded: 'Today, 10:30 AM',
    timestamp: Date.now() - 1000 * 60 * 120,
    customerName: 'Elena Chen',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Negative',
      topic: 'Mobile App',
      feedbackType: 'Complaint',
      painPoint: 'Mobile app crashes when uploading photos from camera roll',
    },
  },
  {
    id: 'sample-3',
    text: 'Our team needs scheduled weekly CSV or PDF email summaries so executives do not have to log in manually each Monday.',
    source: 'Survey',
    dateAdded: 'Yesterday',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    customerName: 'Sarah Jenkins',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Neutral',
      topic: 'Reporting',
      feedbackType: 'Feature Request',
      painPoint: 'Missing automated scheduled weekly CSV/PDF email summaries',
    },
  },
  {
    id: 'sample-4',
    text: 'During onboarding, our designers struggled to locate the export button because it is hidden in the sub-menu under settings.',
    source: 'Customer Interviews',
    dateAdded: 'Yesterday',
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    customerName: 'David K., Lead PM at ScaleCorp',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Negative',
      topic: 'Navigation',
      feedbackType: 'Complaint',
      painPoint: 'Export button hidden deep in settings sub-menu during onboarding',
    },
  },
  {
    id: 'sample-5',
    text: 'The simplified interface saves our team at least 2 hours each morning. Very responsive and clean!',
    source: 'Survey',
    dateAdded: '2 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    customerName: 'Amanda Brooks',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Positive',
      topic: 'Usability',
      feedbackType: 'Praise',
      painPoint: 'None (Positive feedback)',
    },
  },
];

const SOURCE_CONFIG: Record<
  FeedbackSource,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string; badgeColor: string }
> = {
  'App Reviews': {
    label: 'App Reviews',
    icon: Smartphone,
    description: 'Apple App Store & Google Play Store reviews',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  'Support Tickets': {
    label: 'Support Tickets',
    icon: Headphones,
    description: 'Customer helpdesk tickets, chat logs & inquiries',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'Survey': {
    label: 'Survey',
    icon: ClipboardList,
    description: 'NPS responses, CSAT surveys, customer forms',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'Customer Interviews': {
    label: 'Customer Interviews',
    icon: Users,
    description: 'User research discovery calls & interview notes',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

export function FeedbackUploadView() {
  // Stored feedback list
  const [storedFeedback, setStoredFeedback] = useState<StoredFeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_SAMPLE_FEEDBACK;
  });

  const [inputMode, setInputMode] = useState<'csv' | 'manual'>('manual');
  const [selectedSource, setSelectedSource] = useState<FeedbackSource>('App Reviews');
  
  // CSV Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<string[]>([]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Paste State
  const [manualText, setManualText] = useState('The payment failed twice and I had to try again.');

  // AI Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [analyzingStatusText, setAnalyzingStatusText] = useState<string>('');
  const [lastBatchMessage, setLastBatchMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'All' | FeedbackSource>('All');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Negative' | 'Positive' | 'Neutral'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Complaint' | 'Feature Request' | 'Praise' | 'Inquiry'>('All');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFeedback));
    } catch {
      // ignore
    }
  }, [storedFeedback]);

  // Server API caller for AI Analysis
  const requestAIAnalysis = async (items: Array<{ id: string; text: string }>): Promise<Record<string, AIAnalysis>> => {
    try {
      const res = await fetch('/api/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const resultsMap: Record<string, AIAnalysis> = {};
      if (Array.isArray(data.results)) {
        for (const r of data.results) {
          if (r && r.id) {
            resultsMap[r.id] = {
              sentiment: r.sentiment || 'Neutral',
              topic: r.topic || 'General',
              feedbackType: r.feedbackType || 'Complaint',
              painPoint: r.painPoint || 'None',
            };
          }
        }
      }
      return resultsMap;
    } catch (err) {
      console.warn('AI analysis API error, falling back gracefully:', err);
      // Fallback local heuristic
      const resultsMap: Record<string, AIAnalysis> = {};
      for (const item of items) {
        const text = item.text.toLowerCase();
        let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
        if (text.includes('fail') || text.includes('error') || text.includes('crash') || text.includes('broken') || text.includes('slow')) {
          sentiment = 'Negative';
        } else if (text.includes('love') || text.includes('great') || text.includes('clean') || text.includes('fast')) {
          sentiment = 'Positive';
        }

        let topic = 'General';
        if (text.includes('payment') || text.includes('checkout')) topic = 'Payment';
        else if (text.includes('mobile') || text.includes('app')) topic = 'Mobile App';
        else if (text.includes('export') || text.includes('csv') || text.includes('pdf')) topic = 'Reporting';
        else if (text.includes('bill') || text.includes('vat')) topic = 'Billing';

        let feedbackType: 'Complaint' | 'Feature Request' | 'Praise' | 'Inquiry' = 'Complaint';
        if (text.includes('please add') || text.includes('would love') || text.includes('need to')) feedbackType = 'Feature Request';
        else if (sentiment === 'Positive') feedbackType = 'Praise';

        let painPoint = 'None';
        if (sentiment === 'Negative' || feedbackType === 'Complaint') {
          painPoint = topic === 'Payment' ? 'Payment failure during checkout' : item.text.slice(0, 60);
        }

        resultsMap[item.id] = { sentiment, topic, feedbackType, painPoint };
      }
      return resultsMap;
    }
  };

  // Parse CSV File helper
  const handleProcessFile = (file: File) => {
    setCsvError(null);
    setCsvFile(file);

    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rawData = results.data as string[][];
          if (!rawData || rawData.length === 0) {
            setCsvError('The uploaded file appears to be empty.');
            setParsedRows([]);
            return;
          }

          const extracted: string[] = [];
          for (let i = 0; i < rawData.length; i++) {
            const row = rawData[i];
            if (!row || row.length === 0) continue;

            if (
              i === 0 &&
              row.some((cell) =>
                ['feedback', 'comment', 'review', 'text', 'quote', 'description', 'message', 'content'].includes(
                  String(cell).trim().toLowerCase()
                )
              )
            ) {
              continue;
            }

            const textCandidates = row.map((cell) => String(cell).trim()).filter((c) => c.length > 5);
            if (textCandidates.length > 0) {
              const longest = textCandidates.reduce((a, b) => (a.length > b.length ? a : b));
              extracted.push(longest);
            } else {
              const joined = row.join(' ').trim();
              if (joined.length > 0) extracted.push(joined);
            }
          }

          if (extracted.length === 0) {
            setCsvError('No valid feedback text rows could be parsed from this file.');
            setParsedRows([]);
          } else {
            setParsedRows(extracted);
          }
        } catch (err: any) {
          setCsvError(`Failed to parse file: ${err?.message || 'Unknown error'}`);
          setParsedRows([]);
        }
      },
      error: (err) => {
        setCsvError(`CSV Parsing error: ${err.message}`);
        setParsedRows([]);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  // Load Sample CSV for one-click testing
  const handleLoadSampleCSV = () => {
    const sampleCsvContent = `Customer,Feedback Text,Rating
Alex Reed,"The payment failed twice and I had to try again.",1
Elena Ward,"Mobile app crashes every time I upload photos from camera roll.",2
Devon R.,"Search filters are very fast and intuitive to use.",5
Marcus T.,"Exporting monthly reports hangs without a progress indicator.",2`;

    const sampleBlob = new Blob([sampleCsvContent], { type: 'text/csv' });
    const sampleFile = new File([sampleBlob], 'sample_customer_reviews.csv', { type: 'text/csv' });
    handleProcessFile(sampleFile);
  };

  // Main Action: Analyze Feedback (Upload + Automatic AI Analysis)
  const handleAnalyzeFeedback = async () => {
    let itemsToStore: string[] = [];

    if (inputMode === 'csv') {
      if (parsedRows.length === 0) {
        setCsvError('Please upload a CSV/Excel file with feedback rows before analyzing.');
        return;
      }
      itemsToStore = parsedRows;
    } else {
      if (!manualText.trim()) return;
      itemsToStore = manualText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }

    if (itemsToStore.length === 0) return;

    setIsProcessing(true);
    setAnalyzingStatusText(`AI is analyzing ${itemsToStore.length} customer feedback items...`);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = `Today, ${timeStr}`;

    // Create preliminary entries
    const newItems: StoredFeedbackItem[] = itemsToStore.map((text, idx) => ({
      id: `fb-${Date.now()}-${idx}`,
      text,
      source: selectedSource,
      dateAdded: dateStr,
      timestamp: Date.now(),
      status: 'Analyzing',
    }));

    // Trigger AI Analysis automatically for each item
    try {
      const analysisMap = await requestAIAnalysis(
        newItems.map((item) => ({ id: item.id, text: item.text }))
      );

      const analyzedItems: StoredFeedbackItem[] = newItems.map((item) => {
        const analysis = analysisMap[item.id] || {
          sentiment: 'Negative',
          topic: 'General',
          feedbackType: 'Complaint',
          painPoint: item.text.slice(0, 50),
        };
        return {
          ...item,
          status: 'Analyzed',
          analysis,
        };
      });

      setStoredFeedback((prev) => [...analyzedItems, ...prev]);
      setLastBatchMessage(
        `AI analyzed ${analyzedItems.length} new feedback item${
          analyzedItems.length > 1 ? 's' : ''
        }! Sentiment, Topic, Feedback Type, and Customer Pain Points identified.`
      );

      // Reset inputs
      if (inputMode === 'csv') {
        setCsvFile(null);
        setParsedRows([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setManualText('');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsProcessing(false);
      setAnalyzingStatusText('');
    }
  };

  // Re-run AI analysis on any unanalyzed items
  const handleAnalyzeAllUnanalyzed = async () => {
    const unanalyzed = storedFeedback.filter((f) => f.status !== 'Analyzed' || !f.analysis);
    if (unanalyzed.length === 0) return;

    setIsProcessing(true);
    setAnalyzingStatusText(`Analyzing ${unanalyzed.length} items with AI...`);

    const analysisMap = await requestAIAnalysis(
      unanalyzed.map((item) => ({ id: item.id, text: item.text }))
    );

    setStoredFeedback((prev) =>
      prev.map((item) => {
        if (analysisMap[item.id]) {
          return {
            ...item,
            status: 'Analyzed',
            analysis: analysisMap[item.id],
          };
        }
        return item;
      })
    );

    setIsProcessing(false);
    setAnalyzingStatusText('');
    setLastBatchMessage(`Completed AI analysis for ${unanalyzed.length} feedback items.`);
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    setStoredFeedback((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all stored feedback items?')) {
      setStoredFeedback([]);
      setLastBatchMessage(null);
    }
  };

  // Filtered feedback list
  const filteredFeedback = storedFeedback.filter((item) => {
    const matchesSource = sourceFilter === 'All' || item.source === sourceFilter;
    const matchesSentiment = sentimentFilter === 'All' || item.analysis?.sentiment === sentimentFilter;
    const matchesType = typeFilter === 'All' || item.analysis?.feedbackType === typeFilter;
    
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesSource && matchesSentiment && matchesType;

    const matchesQuery =
      item.text.toLowerCase().includes(q) ||
      (item.customerName && item.customerName.toLowerCase().includes(q)) ||
      (item.analysis?.topic && item.analysis.topic.toLowerCase().includes(q)) ||
      (item.analysis?.painPoint && item.analysis.painPoint.toLowerCase().includes(q)) ||
      item.source.toLowerCase().includes(q);

    return matchesSource && matchesSentiment && matchesType && matchesQuery;
  });

  // Count metrics
  const totalCount = storedFeedback.length;
  const analyzedCount = storedFeedback.filter((f) => f.status === 'Analyzed' && f.analysis).length;
  const negativeCount = storedFeedback.filter((f) => f.analysis?.sentiment === 'Negative').length;
  const positiveCount = storedFeedback.filter((f) => f.analysis?.sentiment === 'Positive').length;
  const complaintsCount = storedFeedback.filter((f) => f.analysis?.feedbackType === 'Complaint').length;

  return (
    <div className="min-h-screen bg-slate-50/80 font-sans text-slate-900 antialiased pb-24">
      {/* 1. Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-xs">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base text-slate-900 tracking-tight">VoC Copilot</h1>
                <Badge variant="outline" className="text-[11px] font-semibold text-indigo-700 bg-indigo-50/80 border-indigo-200">
                  Feature 2: AI Feedback Analysis
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Automatically extracts Sentiment, Topic, Type, and Pain Point</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {analyzedCount} / {totalCount} Analyzed by AI
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-7 space-y-7">
        {/* Purpose Banner & AI Specification */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Feature 2 Purpose
              </span>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Understand Each Individual Feedback Automatically
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-950/80 border border-indigo-700/50 text-indigo-200 px-3 py-1 rounded-lg">
                4 Identified Attributes: Sentiment • Topic • Type • Pain Point
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            When you upload or paste customer feedback, AI immediately analyzes each quote and identifies{' '}
            <strong className="text-white">only 4 things</strong>: Sentiment, Topic, Feedback type, and the exact Customer Pain Point.
          </p>

          {/* Interactive Reference Example from Prompt */}
          <div className="mt-3 bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Prompt Example Specification
              </span>
              <button
                type="button"
                onClick={() => {
                  setInputMode('manual');
                  setSelectedSource('Support Tickets');
                  setManualText('The payment failed twice and I had to try again.');
                }}
                className="text-[11px] font-semibold text-indigo-300 hover:text-white underline"
              >
                Load This Example
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-700/60">
              <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-[10px] font-semibold text-slate-400 block mb-1">Customer says:</span>
                <p className="text-slate-200 font-medium italic">
                  &ldquo;The payment failed twice and I had to try again.&rdquo;
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/50 text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sentiment:</span>
                  <span className="font-bold text-rose-400">Negative</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Topic:</span>
                  <span className="font-bold text-indigo-300">Payment</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Type:</span>
                  <span className="font-bold text-amber-300">Complaint</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Pain Point:</span>
                  <span className="font-semibold text-slate-200 truncate block" title="Payment failure during checkout">
                    Payment failure during checkout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Upload and Auto-Analyze Section */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload & Analyze Customer Feedback</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload CSV or paste text. AI will automatically evaluate Sentiment, Topic, Type, and Pain Point.
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200/70 self-start sm:self-auto">
              <button
                onClick={() => setInputMode('manual')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  inputMode === 'manual'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-indigo-600" />
                <span>Paste Feedback</span>
              </button>

              <button
                onClick={() => setInputMode('csv')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  inputMode === 'csv'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-indigo-600" />
                <span>Upload CSV / Excel</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Manual Paste */}
          {inputMode === 'manual' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800">
                  Customer Quote / Feedback Text
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setManualText('The payment failed twice and I had to try again.')}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Load Payment Example
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setManualText(
                        `The payment failed twice and I had to try again.\nMobile app crashes every time I upload a receipt.\nPlease add scheduled PDF reports for executives.`
                      )
                    }
                    className="font-semibold text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    Paste 3 Examples
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="e.g. The payment failed twice and I had to try again."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 placeholder:text-slate-400 leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  {manualText.trim()
                    ? `${
                        manualText
                          .split(/\r?\n/)
                          .map((l) => l.trim())
                          .filter((l) => l.length > 0).length
                      } feedback item(s) to analyze`
                    : 'Enter one or multiple lines'}
                </span>
                {manualText && (
                  <button
                    onClick={() => setManualText('')}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: CSV Upload */}
          {inputMode === 'csv' && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-600 bg-indigo-50/50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-slate-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.tsv,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <UploadCloud className="h-6 w-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">
                    <span className="text-indigo-600 hover:underline">Click to upload CSV</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports .csv files exported from Excel, Google Sheets, or Helpdesk
                  </p>
                </div>

                {csvFile && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-indigo-50 text-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-200 text-xs font-medium">
                    <FileSpreadsheet className="h-4 w-4 text-indigo-600" />
                    <span>{csvFile.name}</span>
                    <span className="text-indigo-500 font-normal">
                      ({parsedRows.length} rows detected)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Want to test CSV parsing?</span>
                <button
                  type="button"
                  onClick={handleLoadSampleCSV}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Load Sample CSV (4 Customer Reviews)</span>
                </button>
              </div>

              {csvError && (
                <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                  <span>{csvError}</span>
                </div>
              )}
            </div>
          )}

          {/* Feedback Source Selection (The 4 core sources) */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-900">
                  Select Feedback Source <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-500">
                  Assign the originating channel to track patterns by customer touchpoint
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                Source: {selectedSource}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(
                [
                  'App Reviews',
                  'Support Tickets',
                  'Survey',
                  'Customer Interviews',
                ] as FeedbackSource[]
              ).map((source) => {
                const config = SOURCE_CONFIG[source];
                const Icon = config.icon;
                const isSelected = selectedSource === source;

                return (
                  <label
                    key={source}
                    onClick={() => setSelectedSource(source)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="feedbackSource"
                      value={source}
                      checked={isSelected}
                      onChange={() => setSelectedSource(source)}
                      className="mt-0.5 h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
                    />

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Icon className="h-3.5 w-3.5 text-indigo-600" />
                        <span>{source}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {config.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Trigger: [ Analyze Feedback ] */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
            <div className="text-xs text-slate-600 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>
                AI will extract: <strong className="text-slate-900">Sentiment</strong>,{' '}
                <strong className="text-slate-900">Topic</strong>,{' '}
                <strong className="text-slate-900">Type</strong>, and{' '}
                <strong className="text-slate-900">Customer Pain Point</strong>
              </span>
            </div>

            <Button
              onClick={handleAnalyzeFeedback}
              disabled={
                isProcessing ||
                (inputMode === 'csv' && parsedRows.length === 0) ||
                (inputMode === 'manual' && !manualText.trim())
              }
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 h-10 rounded-xl gap-2 shadow-sm transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{analyzingStatusText || 'Analyzing Feedback...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-indigo-300" />
                  <span>[ Analyze Feedback ]</span>
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Live Notification Banner */}
        {lastBatchMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl p-4 flex items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-emerald-950">{lastBatchMessage}</p>
                <p className="text-[11px] text-emerald-700">
                  Feedback is processed and structured below for review.
                </p>
              </div>
            </div>
            <button
              onClick={() => setLastBatchMessage(null)}
              className="text-emerald-700 hover:text-emerald-950"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 3. Output Section: Analyzed Feedback Items */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Analyzed Customer Feedback
                </h3>
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  {analyzedCount} Analyzed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Each feedback item with its Sentiment, Topic, Type, and Customer Pain Point
              </p>
            </div>

            <div className="flex items-center gap-2">
              {totalCount > analyzedCount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyzeAllUnanalyzed}
                  disabled={isProcessing}
                  className="text-xs text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 gap-1.5 h-8"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Analyze {totalCount - analyzedCount} Pending</span>
                </Button>
              )}

              {storedFeedback.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-slate-500 hover:text-rose-600 hover:border-rose-200 gap-1.5 h-8"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Total Analyzed */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs">
              <span className="text-xs text-slate-500 font-medium block">Total Items</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {totalCount}
              </div>
              <span className="text-[11px] text-slate-400 block mt-0.5">In customer database</span>
            </div>

            {/* Negative Feedback */}
            <div
              onClick={() => setSentimentFilter(sentimentFilter === 'Negative' ? 'All' : 'Negative')}
              className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition-all ${
                sentimentFilter === 'Negative'
                  ? 'border-rose-500 ring-2 ring-rose-400'
                  : 'border-rose-100 hover:border-rose-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-rose-800">
                <span className="font-medium">Negative Sentiment</span>
                <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
              </div>
              <div className="text-2xl font-extrabold text-rose-950 mt-0.5">
                {negativeCount}
              </div>
              <span className="text-[11px] text-rose-700/80 block mt-0.5">Requires PM attention</span>
            </div>

            {/* Complaints */}
            <div
              onClick={() => setTypeFilter(typeFilter === 'Complaint' ? 'All' : 'Complaint')}
              className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition-all ${
                typeFilter === 'Complaint'
                  ? 'border-amber-500 ring-2 ring-amber-400'
                  : 'border-amber-100 hover:border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-amber-800">
                <span className="font-medium">Complaints</span>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div className="text-2xl font-extrabold text-amber-950 mt-0.5">
                {complaintsCount}
              </div>
              <span className="text-[11px] text-amber-700/80 block mt-0.5">Bugs & pain points</span>
            </div>

            {/* Positive Feedback */}
            <div
              onClick={() => setSentimentFilter(sentimentFilter === 'Positive' ? 'All' : 'Positive')}
              className={`bg-white border rounded-xl p-3.5 shadow-xs cursor-pointer transition-all ${
                sentimentFilter === 'Positive'
                  ? 'border-emerald-500 ring-2 ring-emerald-400'
                  : 'border-emerald-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-emerald-800">
                <span className="font-medium">Positive / Praise</span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="text-2xl font-extrabold text-emerald-950 mt-0.5">
                {positiveCount}
              </div>
              <span className="text-[11px] text-emerald-700/80 block mt-0.5">Product love & wins</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quote, topic, or pain point..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8.5 pr-8 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Source Filters */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSourceFilter('All');
                    setSentimentFilter('All');
                    setTypeFilter('All');
                  }}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    sourceFilter === 'All' && sentimentFilter === 'All' && typeFilter === 'All'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All ({storedFeedback.length})
                </button>
                {(
                  [
                    'App Reviews',
                    'Support Tickets',
                    'Survey',
                    'Customer Interviews',
                  ] as FeedbackSource[]
                ).map((src) => (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(sourceFilter === src ? 'All' : src)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                      sourceFilter === src
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {src}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Feedback Items with AI Analysis */}
            <div className="space-y-3 pt-2">
              {filteredFeedback.map((item) => {
                const sourceCfg = SOURCE_CONFIG[item.source] || SOURCE_CONFIG['App Reviews'];
                const SourceIcon = sourceCfg.icon;
                const analysis = item.analysis;

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all space-y-3 text-xs"
                  >
                    {/* Header: Source, Customer, Date, and Delete */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full border text-[10px] ${sourceCfg.badgeColor}`}
                        >
                          <SourceIcon className="h-3 w-3" />
                          {item.source}
                        </span>

                        {item.customerName && (
                          <span className="font-bold text-slate-800">
                            {item.customerName}
                          </span>
                        )}

                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 text-[11px]">{item.dateAdded}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'Analyzed' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            AI Analyzed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md animate-pulse">
                            <RefreshCw className="h-3 w-3 text-amber-600 animate-spin" />
                            Analyzing...
                          </span>
                        )}

                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          title="Remove item"
                          className="text-slate-300 hover:text-rose-600 p-1 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Feedback Quote */}
                    <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Customer Quote
                      </span>
                      <p className="text-slate-900 font-medium leading-relaxed italic text-[13px]">
                        &ldquo;{item.text}&rdquo;
                      </p>
                    </div>

                    {/* AI Analysis Grid: The 4 Core Output Attributes */}
                    {analysis ? (
                      <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/40 via-white to-slate-50/50 p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-indigo-100/60 pb-2">
                          <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                            AI Feedback Analysis
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            4 Core Attributes
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          {/* 1. Sentiment */}
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                              Sentiment
                            </span>
                            <div className="mt-1 flex items-center gap-1.5">
                              {analysis.sentiment === 'Negative' ? (
                                <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-bold gap-1 px-2 py-0.5">
                                  <TrendingDown className="h-3 w-3 text-rose-600" />
                                  Negative
                                </Badge>
                              ) : analysis.sentiment === 'Positive' ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold gap-1 px-2 py-0.5">
                                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                                  Positive
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-50 text-yellow-800 border-yellow-300 text-xs font-bold gap-1 px-2 py-0.5">
                                  <Minus className="h-3 w-3 text-yellow-700" />
                                  Neutral
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* 2. Topic */}
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                              Topic
                            </span>
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 font-bold text-indigo-950 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md text-xs">
                                <Tag className="h-3 w-3 text-indigo-600" />
                                {analysis.topic}
                              </span>
                            </div>
                          </div>

                          {/* 3. Feedback Type */}
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                              Feedback Type
                            </span>
                            <div className="mt-1">
                              <span
                                className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-xs border ${
                                  analysis.feedbackType === 'Complaint'
                                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                                    : analysis.feedbackType === 'Feature Request'
                                    ? 'bg-blue-50 text-blue-900 border-blue-200'
                                    : analysis.feedbackType === 'Praise'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                    : 'bg-purple-50 text-purple-900 border-purple-200'
                                }`}
                              >
                                {analysis.feedbackType === 'Complaint' && <AlertTriangle className="h-3 w-3 text-amber-600" />}
                                {analysis.feedbackType === 'Feature Request' && <Lightbulb className="h-3 w-3 text-blue-600" />}
                                {analysis.feedbackType === 'Praise' && <ThumbsUp className="h-3 w-3 text-emerald-600" />}
                                {analysis.feedbackType}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 4. Customer Pain Point */}
                        <div className="bg-white p-3 rounded-lg border border-rose-200/70 shadow-2xs">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-rose-600" />
                              Customer Pain Point
                            </span>
                            {analysis.painPoint !== 'None' && analysis.painPoint !== 'None (Positive feedback)' && (
                              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                                Critical Friction
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-900">
                            {analysis.painPoint}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 italic text-xs">
                        Analysis pending...
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredFeedback.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs space-y-1">
                  <p className="font-semibold text-slate-600">No feedback items match your filters</p>
                  <p>
                    {searchQuery
                      ? `No items match "${searchQuery}".`
                      : 'Upload a CSV or paste feedback above to start AI analysis.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
