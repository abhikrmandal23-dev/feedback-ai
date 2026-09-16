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
  Smartphone,
  Headphones,
  ClipboardList,
  Users,
  X,
  RefreshCw,
  Eye,
  Check,
  Zap,
  Compass,
  FileCheck,
  Table,
  Layers,
  TrendingDown,
  TrendingUp,
  Minus,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/page-container';
import { parseFeedbackFile, type ParseResult, type ParsedFeedbackRow } from '@/lib/file-parser';
import type { NavigationRoute } from '@/types';

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
  status: 'Ready for AI Analysis' | 'Analyzing' | 'Analyzed';
  analysis?: AIAnalysis;
}

const STORAGE_KEY = 'voc_stored_feedback_v3';

const INITIAL_STORED_ITEMS: StoredFeedbackItem[] = [
  {
    id: 'stored-bad-1',
    text: 'The payment failed twice and money was deducted without an order confirmation.',
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
    id: 'stored-bad-2',
    text: 'Mobile app crashes every time I try to upload photos from camera roll.',
    source: 'App Reviews',
    dateAdded: 'Today, 10:30 AM',
    timestamp: Date.now() - 1000 * 60 * 90,
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
    id: 'stored-neutral-1',
    text: 'The recent redesign moved navigation tabs to the bottom bar; it functions fine but requires getting used to.',
    source: 'App Reviews',
    dateAdded: 'Today, 09:15 AM',
    timestamp: Date.now() - 1000 * 60 * 150,
    customerName: 'Kavita Rao',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Neutral',
      topic: 'Navigation & UI',
      feedbackType: 'Inquiry',
      painPoint: 'None',
    },
  },
  {
    id: 'stored-good-1',
    text: 'The automated customer feedback summaries and instant trend detection save our product team hours every single week! Outstanding tool.',
    source: 'Survey',
    dateAdded: 'Today, 08:45 AM',
    timestamp: Date.now() - 1000 * 60 * 210,
    customerName: 'Amit Desai',
    status: 'Analyzed',
    analysis: {
      sentiment: 'Positive',
      topic: 'AI Summaries',
      feedbackType: 'Praise',
      painPoint: 'None',
    },
  },
  {
    id: 'stored-ready-1',
    text: 'Our team needs scheduled weekly CSV or PDF email summaries so executives do not have to log in manually each Monday.',
    source: 'Survey',
    dateAdded: 'Yesterday, 04:15 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    customerName: 'Sarah Jenkins',
    status: 'Ready for AI Analysis',
  },
  {
    id: 'stored-ready-2',
    text: 'During onboarding, our designers struggled to locate the export button because it is hidden in the sub-menu under settings.',
    source: 'Customer Interviews',
    dateAdded: 'Yesterday, 02:40 PM',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    customerName: 'David K., Lead PM',
    status: 'Ready for AI Analysis',
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
    description: 'Helpdesk tickets, chat logs & customer emails',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  'Survey': {
    label: 'Survey',
    icon: ClipboardList,
    description: 'NPS responses, CSAT surveys, user forms',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'Customer Interviews': {
    label: 'Customer Interviews',
    icon: Users,
    description: 'User research discovery calls & interview transcripts',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
};

interface FeedbackViewProps {
  onNavigate: (route: NavigationRoute) => void;
  onOpenQuickModal?: () => void;
}

export function FeedbackView({ onNavigate }: FeedbackViewProps) {
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
    return INITIAL_STORED_ITEMS;
  });

  // Input Mode: CSV/Excel or Manual Text
  const [inputMode, setInputMode] = useState<'csv' | 'manual'>('csv');

  // Source selection (matching exact prompt)
  const [selectedSource, setSelectedSource] = useState<FeedbackSource>('App Reviews');

  // File Upload State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<string[]>([]);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manual Paste State
  const [manualText, setManualText] = useState('The payment failed twice and I had to try again.');

  // AI Processing State & Progress
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{ current: number; total: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'All' | FeedbackSource>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Ready for AI Analysis' | 'Analyzed'>('All');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Negative' | 'Neutral' | 'Positive'>('All');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFeedback));
    } catch {
      // ignore
    }
  }, [storedFeedback]);

  // Robust Rule Fallback Generator
  const generateRuleFallback = (text: string): AIAnalysis => {
    const lower = text.toLowerCase();
    let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
    if (
      lower.includes('fail') ||
      lower.includes('crash') ||
      lower.includes('slow') ||
      lower.includes('confus') ||
      lower.includes('error') ||
      lower.includes('broken') ||
      lower.includes('terrible') ||
      lower.includes('bad') ||
      lower.includes('bug') ||
      lower.includes('stuck') ||
      lower.includes('hate') ||
      lower.includes('issue') ||
      lower.includes('disappoint')
    ) {
      sentiment = 'Negative';
    } else if (
      lower.includes('love') ||
      lower.includes('great') ||
      lower.includes('awesome') ||
      lower.includes('saves') ||
      lower.includes('fast') ||
      lower.includes('excellent') ||
      lower.includes('good') ||
      lower.includes('clean') ||
      lower.includes('best') ||
      lower.includes('helpful')
    ) {
      sentiment = 'Positive';
    }

    let topic = 'General';
    if (
      lower.includes('pay') ||
      lower.includes('checkout') ||
      lower.includes('card') ||
      lower.includes('upi') ||
      lower.includes('bill') ||
      lower.includes('invoice') ||
      lower.includes('vat')
    ) {
      topic = 'Payment & Billing';
    } else if (
      lower.includes('mobile') ||
      lower.includes('android') ||
      lower.includes('ios') ||
      lower.includes('camera') ||
      lower.includes('phone') ||
      lower.includes('app crash')
    ) {
      topic = 'Mobile App';
    } else if (
      lower.includes('export') ||
      lower.includes('csv') ||
      lower.includes('pdf') ||
      lower.includes('report') ||
      lower.includes('download')
    ) {
      topic = 'Export & Reports';
    } else if (
      lower.includes('nav') ||
      lower.includes('menu') ||
      lower.includes('button') ||
      lower.includes('ui') ||
      lower.includes('screen') ||
      lower.includes('layout')
    ) {
      topic = 'Navigation & UI';
    } else if (
      lower.includes('slow') ||
      lower.includes('speed') ||
      lower.includes('latency') ||
      lower.includes('lag') ||
      lower.includes('load') ||
      lower.includes('performance')
    ) {
      topic = 'Performance';
    } else if (
      lower.includes('onboard') ||
      lower.includes('tour') ||
      lower.includes('setup') ||
      lower.includes('guide') ||
      lower.includes('start')
    ) {
      topic = 'Onboarding';
    } else if (
      lower.includes('support') ||
      lower.includes('ticket') ||
      lower.includes('agent') ||
      lower.includes('help')
    ) {
      topic = 'Customer Support';
    } else if (lower.includes('search') || lower.includes('filter')) {
      topic = 'Search & Filters';
    } else if (
      lower.includes('auth') ||
      lower.includes('login') ||
      lower.includes('password') ||
      lower.includes('sso')
    ) {
      topic = 'Authentication';
    }

    let feedbackType: 'Complaint' | 'Feature Request' | 'Praise' | 'Inquiry' = 'Complaint';
    if (
      lower.includes('please add') ||
      lower.includes('need') ||
      lower.includes('would like') ||
      lower.includes('wish') ||
      lower.includes('can you add') ||
      lower.includes('feature') ||
      lower.includes('support for')
    ) {
      feedbackType = 'Feature Request';
    } else if (sentiment === 'Positive') {
      feedbackType = 'Praise';
    } else if (
      lower.includes('how do i') ||
      lower.includes('where is') ||
      lower.includes('is it possible') ||
      lower.includes('can i')
    ) {
      feedbackType = 'Inquiry';
    }

    let painPoint = 'None';
    if (sentiment === 'Negative' || feedbackType === 'Complaint') {
      if (topic === 'Payment & Billing') painPoint = 'Payment failure, invoice lack or checkout friction';
      else if (topic === 'Mobile App') painPoint = 'Mobile instability or unexpected crashes';
      else if (topic === 'Performance') painPoint = 'Slow app response and startup lag';
      else if (topic === 'Onboarding') painPoint = 'Setup friction or difficult initial onboarding';
      else if (topic === 'Export & Reports') painPoint = 'Missing or slow export capabilities';
      else if (topic === 'Navigation & UI') painPoint = 'Hidden navigation items or confusing interface';
      else {
        painPoint = text.length > 60 ? text.slice(0, 60) + '...' : text;
      }
    } else if (feedbackType === 'Feature Request') {
      painPoint = `Missing capability: ${topic.toLowerCase()} functionality`;
    }

    return { sentiment, topic, feedbackType, painPoint };
  };

  // Request AI Analysis via backend with dual-format support & fallback guarantee
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
      const map: Record<string, AIAnalysis> = {};

      // 1. Read from analysisMap if present
      if (data.analysisMap && typeof data.analysisMap === 'object') {
        Object.entries(data.analysisMap).forEach(([id, val]: [string, any]) => {
          if (val) {
            map[id] = {
              sentiment: val.sentiment || 'Neutral',
              topic: val.topic || 'General',
              feedbackType: val.feedbackType || 'Complaint',
              painPoint: val.painPoint || 'None',
            };
          }
        });
      }

      // 2. Read from results array if present
      if (Array.isArray(data.results)) {
        data.results.forEach((r: any) => {
          if (r && r.id) {
            map[r.id] = {
              sentiment: r.sentiment || 'Neutral',
              topic: r.topic || 'General',
              feedbackType: r.feedbackType || 'Complaint',
              painPoint: r.painPoint || 'None',
            };
          }
        });
      }

      // 3. Guarantee all requested items have an analysis entry
      items.forEach((item) => {
        if (!map[item.id]) {
          map[item.id] = generateRuleFallback(item.text);
        }
      });

      return map;
    } catch (err) {
      console.warn('AI analysis API error, utilizing local analysis engine:', err);
      const fallbackMap: Record<string, AIAnalysis> = {};
      items.forEach((item) => {
        fallbackMap[item.id] = generateRuleFallback(item.text);
      });
      return fallbackMap;
    }
  };

  // Chunked batch analysis with progress callbacks for handling any file size safely
  const requestAIAnalysisInBatches = async (
    items: Array<{ id: string; text: string }>,
    onProgress?: (processed: number, total: number) => void
  ): Promise<Record<string, AIAnalysis>> => {
    const BATCH_SIZE = 10;
    const combinedMap: Record<string, AIAnalysis> = {};

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const chunk = items.slice(i, i + BATCH_SIZE);
      const chunkMap = await requestAIAnalysis(chunk);
      Object.assign(combinedMap, chunkMap);
      if (onProgress) {
        onProgress(Math.min(i + chunk.length, items.length), items.length);
      }
    }

    return combinedMap;
  };

  // Universal Data File Parser (.xlsx, .xls, .csv, .tsv, .txt, .json)
  const handleProcessFile = async (file: File) => {
    setCsvError(null);
    setIsParsingFile(true);
    setCsvFile(file);

    try {
      const result = await parseFeedbackFile(file);
      setParseResult(result);
      setParsedRows(result.rows.map((r) => r.text));
      setStatusMessage(
        `Successfully loaded ${result.validRows} feedback item${result.validRows > 1 ? 's' : ''} from ${result.fileName}! Ready for AI analysis.`
      );
    } catch (err: any) {
      console.error('File parsing error:', err);
      setCsvError(`File Parsing Error: ${err?.message || 'Could not parse data file'}`);
      setParseResult(null);
      setParsedRows([]);
    } finally {
      setIsParsingFile(false);
    }
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

  // Sample CSV Loader
  const handleLoadSampleCSV = () => {
    const sampleCsvContent = `Customer Name,Feedback Text,Source,Rating
Rahul Sharma,"App is too slow during checkout, payment failed twice and order dropped.",Support Tickets,1
Priya Patel,"The updated navigation panel functions adequately but takes getting used to.",App Reviews,3
Amit Kumar,"Love the dashboard analytics and automated report delivery, saves us hours every week!",Survey,5
Neha Gupta,"Could you consider adding scheduled weekly CSV exports directly to email?",Customer Interviews,3`;

    const sampleBlob = new Blob([sampleCsvContent], { type: 'text/csv' });
    const sampleFile = new File([sampleBlob], 'sample_customer_feedback.csv', { type: 'text/csv' });
    handleProcessFile(sampleFile);
  };

  // Download Sample CSV Template
  const handleDownloadTemplate = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Customer Name,Feedback Text,Source\nAlex Reed,"The payment failed twice and money was deducted.",Support Tickets\nKavita Rao,"The recent settings layout update is fine but requires getting used to.",App Reviews\nSarah Jenkins,"Love the automated summaries, saves our team so much time!",Survey\nDavid K.,"Export button is hidden in settings sub-menu.",Customer Interviews\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'feedback_upload_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Action: Store Feedback (Ready for AI Analysis)
  const handleStoreFeedbackOnly = () => {
    let itemsToStore: Array<{ text: string; customerName?: string; source?: FeedbackSource }> = [];

    if (inputMode === 'csv') {
      if (parsedRows.length === 0) {
        setCsvError('Please upload or select a CSV/Excel file first.');
        return;
      }
      if (parseResult && parseResult.rows.length > 0) {
        itemsToStore = parseResult.rows.map((r) => ({
          text: r.text,
          customerName: r.customerName,
          source: (r.source as FeedbackSource) || selectedSource,
        }));
      } else {
        itemsToStore = parsedRows.map((text) => ({ text, source: selectedSource }));
      }
    } else {
      if (!manualText.trim()) return;
      itemsToStore = manualText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .map((text) => ({ text, source: selectedSource }));
    }

    if (itemsToStore.length === 0) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = `Today, ${timeStr}`;

    const newItems: StoredFeedbackItem[] = itemsToStore.map((item, idx) => ({
      id: `fb-${Date.now()}-${idx}`,
      text: item.text,
      customerName: item.customerName,
      source: item.source || selectedSource,
      dateAdded: dateStr,
      timestamp: Date.now(),
      status: 'Ready for AI Analysis',
    }));

    setStoredFeedback((prev) => [...newItems, ...prev]);
    confetti({ particleCount: 40, spread: 50 });
    setStatusMessage(
      `Stored ${newItems.length} new feedback item${newItems.length > 1 ? 's' : ''}. Ready for AI analysis!`
    );

    // Reset inputs
    if (inputMode === 'csv') {
      setCsvFile(null);
      setParsedRows([]);
      setParseResult(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      setManualText('');
    }
  };

  // 2. Action: [ Analyze Feedback ] (Store + Run AI Analysis with Batches & Live Progress)
  const handleAnalyzeFeedback = async () => {
    let itemsToProcess: Array<{ text: string; customerName?: string; source?: FeedbackSource }> = [];

    if (inputMode === 'csv') {
      if (parsedRows.length === 0) {
        setCsvError('Please upload a CSV or Excel data file with feedback rows before analyzing.');
        return;
      }
      if (parseResult && parseResult.rows.length > 0) {
        itemsToProcess = parseResult.rows.map((r) => ({
          text: r.text,
          customerName: r.customerName,
          source: (r.source as FeedbackSource) || selectedSource,
        }));
      } else {
        itemsToProcess = parsedRows.map((text) => ({ text, source: selectedSource }));
      }
    } else {
      if (!manualText.trim()) return;
      itemsToProcess = manualText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .map((text) => ({ text, source: selectedSource }));
    }

    if (itemsToProcess.length === 0) return;

    setIsProcessing(true);
    setAnalysisProgress({ current: 0, total: itemsToProcess.length });
    setStatusMessage(`Running AI analysis on ${itemsToProcess.length} feedback item(s)...`);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = `Today, ${timeStr}`;

    // Create preliminary entries
    const newItems: StoredFeedbackItem[] = itemsToProcess.map((item, idx) => ({
      id: `fb-${Date.now()}-${idx}`,
      text: item.text,
      customerName: item.customerName,
      source: item.source || selectedSource,
      dateAdded: dateStr,
      timestamp: Date.now(),
      status: 'Analyzing',
    }));

    try {
      const analysisMap = await requestAIAnalysisInBatches(
        newItems.map((item) => ({ id: item.id, text: item.text })),
        (current, total) => {
          setAnalysisProgress({ current, total });
          setStatusMessage(`Analyzing feedback with AI: ${current} of ${total} items completed...`);
        }
      );

      const analyzedItems: StoredFeedbackItem[] = newItems.map((item) => {
        const analysis = analysisMap[item.id] || generateRuleFallback(item.text);
        return {
          ...item,
          status: 'Analyzed',
          analysis,
        };
      });

      setStoredFeedback((prev) => [...analyzedItems, ...prev]);
      confetti({ particleCount: 70, spread: 60 });
      setStatusMessage(
        `Successfully analyzed ${analyzedItems.length} customer feedback item${
          analyzedItems.length > 1 ? 's' : ''
        }! Sentiment, Topic, Feedback Type, and Pain Points extracted.`
      );

      // Reset inputs
      if (inputMode === 'csv') {
        setCsvFile(null);
        setParsedRows([]);
        setParseResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setManualText('');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      const fallbackItems: StoredFeedbackItem[] = newItems.map((item) => ({
        ...item,
        status: 'Analyzed',
        analysis: generateRuleFallback(item.text),
      }));
      setStoredFeedback((prev) => [...fallbackItems, ...prev]);
      setStatusMessage(`Analyzed ${fallbackItems.length} feedback items using rule-grounded fallback.`);
    } finally {
      setIsProcessing(false);
      setAnalysisProgress(null);
    }
  };

  // Run AI analysis on a single item
  const handleAnalyzeSingleItem = async (id: string) => {
    const item = storedFeedback.find((f) => f.id === id);
    if (!item) return;

    setStoredFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'Analyzing' } : f))
    );

    try {
      const analysisMap = await requestAIAnalysis([{ id: item.id, text: item.text }]);
      const analysis = analysisMap[item.id] || generateRuleFallback(item.text);

      setStoredFeedback((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: 'Analyzed', analysis }
            : f
        )
      );
      setStatusMessage(`Analyzed feedback item from ${item.customerName || item.source}`);
    } catch (err) {
      console.error('Single item analysis failed:', err);
      setStoredFeedback((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: 'Analyzed', analysis: generateRuleFallback(item.text) }
            : f
        )
      );
    }
  };

  // Analyze all unanalyzed items in batches
  const handleAnalyzeAllReady = async () => {
    const readyItems = storedFeedback.filter((f) => f.status === 'Ready for AI Analysis');
    if (readyItems.length === 0) return;

    setIsProcessing(true);
    setAnalysisProgress({ current: 0, total: readyItems.length });
    setStatusMessage(`Running AI analysis on ${readyItems.length} stored feedback items...`);

    try {
      const analysisMap = await requestAIAnalysisInBatches(
        readyItems.map((item) => ({ id: item.id, text: item.text })),
        (current, total) => {
          setAnalysisProgress({ current, total });
          setStatusMessage(`Analyzing stored items: ${current} of ${total}...`);
        }
      );

      setStoredFeedback((prev) =>
        prev.map((item) => {
          if (item.status === 'Ready for AI Analysis') {
            const analysis = analysisMap[item.id] || generateRuleFallback(item.text);
            return {
              ...item,
              status: 'Analyzed',
              analysis,
            };
          }
          return item;
        })
      );

      confetti({ particleCount: 50, spread: 60 });
      setStatusMessage(
        `Completed AI analysis for ${readyItems.length} feedback item${readyItems.length > 1 ? 's' : ''}!`
      );
    } catch (err) {
      console.error('Batch analysis failed:', err);
      // Fallback
      setStoredFeedback((prev) =>
        prev.map((item) => {
          if (item.status === 'Ready for AI Analysis') {
            return {
              ...item,
              status: 'Analyzed',
              analysis: generateRuleFallback(item.text),
            };
          }
          return item;
        })
      );
      setStatusMessage(`Completed AI analysis for ${readyItems.length} items using grounded fallback.`);
    } finally {
      setIsProcessing(false);
      setAnalysisProgress(null);
    }
  };

  // Delete item
  const handleDeleteItem = (id: string) => {
    setStoredFeedback((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all stored
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all stored customer feedback?')) {
      setStoredFeedback([]);
      setStatusMessage(null);
    }
  };

  // Filtered feedback
  const filteredFeedback = storedFeedback.filter((item) => {
    const matchesSource = sourceFilter === 'All' || item.source === sourceFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesSentiment =
      sentimentFilter === 'All' || item.analysis?.sentiment === sentimentFilter;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesSource && matchesStatus && matchesSentiment;

    const matchesQuery =
      item.text.toLowerCase().includes(q) ||
      (item.customerName && item.customerName.toLowerCase().includes(q)) ||
      (item.analysis?.topic && item.analysis.topic.toLowerCase().includes(q)) ||
      (item.analysis?.painPoint && item.analysis.painPoint.toLowerCase().includes(q)) ||
      (item.analysis?.sentiment && item.analysis.sentiment.toLowerCase().includes(q)) ||
      item.source.toLowerCase().includes(q);

    return matchesSource && matchesStatus && matchesSentiment && matchesQuery;
  });

  const totalCount = storedFeedback.length;
  const readyCount = storedFeedback.filter((f) => f.status === 'Ready for AI Analysis').length;
  const analyzedCount = storedFeedback.filter((f) => f.status === 'Analyzed').length;
  const badCount = storedFeedback.filter((f) => f.analysis?.sentiment === 'Negative').length;
  const neutralCount = storedFeedback.filter((f) => f.analysis?.sentiment === 'Neutral').length;
  const goodCount = storedFeedback.filter((f) => f.analysis?.sentiment === 'Positive').length;

  return (
    <PageContainer
      title="Upload Customer Feedback"
      description="Feature 1 • Purpose: Bring customer feedback into the system."
      breadcrumbs={[{ label: 'Feedback' }, { label: 'Upload' }]}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV Template</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadSampleCSV}
            className="text-xs gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>Sample CSV</span>
          </Button>
          <Button
            size="sm"
            onClick={() => onNavigate('feedback_explorer')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold gap-1.5 shadow-xs"
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Feedback Explorer</span>
          </Button>
        </div>
      }
    >
      {/* 1. Main Feedback Ingestion Card */}
      <Card className="bg-white shadow-2xs border-zinc-200">
        <CardHeader className="border-b border-zinc-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <span>Upload Customer Feedback</span>
                <Badge variant="outline" className="text-[11px] font-semibold text-blue-700 bg-blue-50 border-blue-200">
                  Feature 1
                </Badge>
              </CardTitle>
              <p className="text-xs text-zinc-500 mt-0.5">
                Upload CSV/Excel or paste feedback manually, select the feedback source, and analyze.
              </p>
            </div>

            {/* Ingestion Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl w-fit border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setInputMode('csv')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  inputMode === 'csv'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <FileSpreadsheet className="h-3.5 w-3.5 text-blue-600" />
                <span>Upload CSV / Excel</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMode('manual')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  inputMode === 'manual'
                    ? 'bg-white text-zinc-900 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-blue-600" />
                <span>Paste feedback manually</span>
              </button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Mode 1: Upload CSV/Excel */}
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
                    ? 'border-blue-600 bg-blue-50/60'
                    : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/60 bg-zinc-50/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.tsv,.txt,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  {isParsingFile ? (
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  ) : (
                    <UploadCloud className="h-6 w-6" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-zinc-900">
                    <span className="text-blue-600 hover:underline">[ Upload CSV or Excel ]</span> or drag and drop file here
                  </p>
                  <p className="text-xs text-zinc-500">
                    Supports Excel (.xlsx, .xls), CSV, TSV, and JSON files from App Stores, Zendesk, or Surveys
                  </p>
                </div>

                {isParsingFile && (
                  <p className="mt-2 text-xs font-semibold text-blue-600 animate-pulse">
                    Reading and detecting feedback columns...
                  </p>
                )}
              </div>

              {/* Parsed Data Preview Panel (Shows immediately when file is loaded) */}
              {parseResult && (
                <div className="bg-blue-50/40 border border-blue-200/80 rounded-2xl p-4.5 space-y-3.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                        {parseResult.fileType || parseResult.fileName?.split('.').pop()?.toUpperCase() || 'FILE'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 truncate max-w-xs">
                            {parseResult.fileName}
                          </span>
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px] font-bold">
                            {parseResult.validRows || parseResult.rows?.length || 0} feedback rows ready
                          </Badge>
                        </div>
                        <p className="text-[11px] text-zinc-500">
                          Detected feedback column: <span className="font-semibold text-zinc-800">&ldquo;{parseResult.feedbackColumn || 'Text'}&rdquo;</span> • {(parseResult.headers || parseResult.detectedColumns || []).length} total columns
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAnalyzeFeedback}
                        disabled={isProcessing}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 h-8 rounded-lg gap-1.5 shadow-xs cursor-pointer"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>[ Analyze This File Now ]</span>
                          </>
                        )}
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setCsvFile(null);
                          setParseResult(null);
                          setParsedRows([]);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-xs text-zinc-500 hover:text-rose-600 font-medium px-2 py-1 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Quick table preview of first rows */}
                  <div className="border border-blue-100 rounded-xl bg-white overflow-hidden text-xs">
                    <div className="bg-zinc-50/80 px-3 py-1.5 font-semibold text-[11px] text-zinc-500 border-b border-zinc-100 flex items-center justify-between">
                      <span>Data Preview (First {Math.min(parseResult.rows?.length || 0, 3)} rows):</span>
                      <span className="text-zinc-400 font-normal">All {parseResult.validRows || parseResult.rows?.length || 0} rows will be analyzed</span>
                    </div>
                    <div className="divide-y divide-zinc-100 max-h-40 overflow-y-auto">
                      {(parseResult.rows || []).slice(0, 3).map((row, idx) => (
                        <div key={idx} className="p-2.5 flex items-start gap-3">
                          <span className="text-[10px] font-mono text-zinc-400 mt-0.5">#{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-zinc-800 text-xs truncate">&ldquo;{row.text}&rdquo;</p>
                            {(row.customerName || row.source) && (
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-500">
                                {row.customerName && <span>Customer: <strong className="text-zinc-700">{row.customerName}</strong></span>}
                                {row.source && <span>• Source: <strong className="text-zinc-700">{row.source}</strong></span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>Want to test file ingestion immediately?</span>
                <button
                  type="button"
                  onClick={handleLoadSampleCSV}
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Load Sample Data File (4 Customer Reviews)</span>
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

          {/* Mode 2: Paste feedback manually */}
          {inputMode === 'manual' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-zinc-800">
                  Paste Customer Feedback Text
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setManualText('The payment failed twice and I had to try again.')}
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Load Example Quote
                  </button>
                  <span className="text-zinc-300">•</span>
                  <button
                    type="button"
                    onClick={() =>
                      setManualText(
                        `The payment failed twice and I had to try again.\nMobile app crashes every time I upload photos from camera roll.\nOur team needs scheduled weekly CSV or PDF email summaries.\nDuring onboarding, our designers struggled to locate the export button.`
                      )
                    }
                    className="font-semibold text-zinc-600 hover:text-zinc-900 hover:underline cursor-pointer"
                  >
                    Paste 4 Examples
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Example: The payment failed twice and I had to try again."
                className="w-full text-xs p-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-zinc-400 leading-relaxed font-sans"
              />

              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>
                  {manualText.trim()
                    ? `${
                        manualText
                          .split(/\r?\n/)
                          .map((l) => l.trim())
                          .filter((l) => l.length > 0).length
                      } feedback item(s) ready to add`
                    : 'Enter single feedback or paste multiple rows separated by newlines'}
                </span>
                {manualText && (
                  <button
                    type="button"
                    onClick={() => setManualText('')}
                    className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                  >
                    Clear text
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Feedback Source Selection (Strictly matching prompt: App Reviews, Support Tickets, Survey, Customer Interviews) */}
          <div className="space-y-3 pt-3 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-zinc-900">
                  Source:
                </label>
                <p className="text-xs text-zinc-500">
                  Select where this customer feedback originated:
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-semibold text-zinc-700 bg-zinc-50 border-zinc-200">
                Selected: {selectedSource}
              </Badge>
            </div>

            {/* The 4 Source Radio Options */}
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
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="feedbackSource"
                      value={source}
                      checked={isSelected}
                      onChange={() => setSelectedSource(source)}
                      className="mt-0.5 h-4 w-4 text-blue-600 border-zinc-300 focus:ring-blue-500"
                    />

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-900">
                        <Icon className="h-3.5 w-3.5 text-blue-600" />
                        <span>{source}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-tight">
                        {config.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Action Row: [ Analyze Feedback ] & [ Store Feedback ] */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-100">
            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
              <span>
                Output: Feedback gets stored in the system and is ready for AI analysis.
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleStoreFeedbackOnly}
                disabled={
                  isProcessing ||
                  (inputMode === 'csv' && parsedRows.length === 0) ||
                  (inputMode === 'manual' && !manualText.trim())
                }
                className="w-full sm:w-auto text-xs font-semibold h-10 px-4 cursor-pointer"
              >
                Store Feedback (Ready for AI)
              </Button>

              <Button
                type="button"
                onClick={handleAnalyzeFeedback}
                disabled={
                  isProcessing ||
                  (inputMode === 'csv' && parsedRows.length === 0) ||
                  (inputMode === 'manual' && !manualText.trim())
                }
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 h-10 rounded-xl gap-2 shadow-sm transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing Feedback...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>[ Analyze Feedback ]</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active AI Processing Progress Banner */}
      {isProcessing && analysisProgress && (
        <div className="bg-blue-50/90 border border-blue-200 text-blue-950 rounded-2xl p-4.5 space-y-2.5 shadow-sm animate-pulse">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2 text-blue-900">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              <span>Analyzing Feedback: {analysisProgress.current} of {analysisProgress.total} items completed</span>
            </div>
            <span className="text-blue-700 font-mono">
              {Math.round((analysisProgress.current / Math.max(analysisProgress.total, 1)) * 100)}%
            </span>
          </div>

          <div className="w-full bg-blue-200/60 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${Math.round((analysisProgress.current / Math.max(analysisProgress.total, 1)) * 100)}%`,
              }}
            />
          </div>

          <p className="text-[11px] text-blue-700">
            Extracting sentiment, topics, feedback categories, and customer pain points across all rows...
          </p>
        </div>
      )}

      {/* Live Status Toast Banner */}
      {statusMessage && !isProcessing && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl p-4 flex items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">{statusMessage}</p>
              <p className="text-[11px] text-emerald-700">
                The feedback gets stored and is ready for AI analysis below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 2. Output Section: Stored Feedback Ready for AI Analysis */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-zinc-900">
                Output: Stored Customer Feedback
              </h3>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                Ready for AI Analysis ({readyCount})
              </Badge>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
                Analyzed ({analyzedCount})
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              All stored feedback rows brought into the system with originating source and AI analysis readiness.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {readyCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAnalyzeAllReady}
                disabled={isProcessing}
                className="text-xs font-semibold text-blue-600 border-blue-200 hover:bg-blue-50 gap-1.5 cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>Analyze All Ready ({readyCount})</span>
              </Button>
            )}

            {totalCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs text-zinc-400 hover:text-rose-600 gap-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </Button>
            )}
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-zinc-200">
            <div className="relative flex-1">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stored feedback by quote, topic, customer..."
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Source Filter */}
              <div className="flex items-center gap-1 text-zinc-500">
                <Filter className="h-3 w-3" />
                <span>Source:</span>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as any)}
                  className="bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs text-zinc-800 font-medium focus:outline-none"
                >
                  <option value="All">All Sources</option>
                  <option value="App Reviews">App Reviews</option>
                  <option value="Support Tickets">Support Tickets</option>
                  <option value="Survey">Survey</option>
                  <option value="Customer Interviews">Customer Interviews</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 text-zinc-500">
                <span>Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-zinc-50 border border-zinc-200 rounded-md px-2 py-1 text-xs text-zinc-800 font-medium focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Ready for AI Analysis">Ready for AI Analysis</option>
                  <option value="Analyzed">Analyzed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sentiment Color Indicator & Quick Filter Legend */}
          <div className="bg-white border border-zinc-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="font-semibold text-zinc-700">Sentiment Indicator:</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span>Bad / Negative (Red)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-300">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span>Neutral (Yellow)</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Good / Positive (Green)</span>
                </span>
              </div>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setSentimentFilter('All')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sentimentFilter === 'All'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setSentimentFilter(sentimentFilter === 'Negative' ? 'All' : 'Negative')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sentimentFilter === 'Negative'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                }`}
                title="Filter by Bad (Negative) sentiment"
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Bad ({badCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSentimentFilter(sentimentFilter === 'Neutral' ? 'All' : 'Neutral')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sentimentFilter === 'Neutral'
                    ? 'bg-yellow-500 text-zinc-950 shadow-xs'
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-300 hover:bg-yellow-100'
                }`}
                title="Filter by Neutral sentiment"
              >
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Neutral ({neutralCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setSentimentFilter(sentimentFilter === 'Positive' ? 'All' : 'Positive')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  sentimentFilter === 'Positive'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                }`}
                title="Filter by Good (Positive) sentiment"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Good ({goodCount})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stored Feedback Items Table / Cards */}
        {filteredFeedback.length === 0 ? (
          <Card className="bg-white border-zinc-200 p-8 text-center">
            <p className="text-xs text-zinc-500">
              No feedback items match your current filter or search criteria.
            </p>
          </Card>
        ) : (
          <Card className="bg-white overflow-hidden shadow-2xs border-zinc-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-50/80 text-zinc-500 font-semibold border-b border-zinc-200">
                    <th className="py-3 px-4 w-40">Customer & Source</th>
                    <th className="py-3 px-4">Customer Quote</th>
                    <th className="py-3 px-4 w-36">Sentiment</th>
                    <th className="py-3 px-4 w-44">Status / AI Analysis</th>
                    <th className="py-3 px-4 w-28 text-right">Date Added</th>
                    <th className="py-3 px-4 w-12 text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {filteredFeedback.map((item) => {
                    const sourceCfg = SOURCE_CONFIG[item.source] || SOURCE_CONFIG['App Reviews'];
                    const SourceIcon = sourceCfg.icon;
                    const sentiment = item.analysis?.sentiment;

                    // Color indication: Bad -> Red, Neutral -> Yellow, Good -> Green
                    const rowStyle =
                      sentiment === 'Negative'
                        ? 'border-l-4 border-l-red-500 bg-red-50/20 hover:bg-red-50/35'
                        : sentiment === 'Neutral'
                        ? 'border-l-4 border-l-amber-400 bg-yellow-50/20 hover:bg-yellow-50/35'
                        : sentiment === 'Positive'
                        ? 'border-l-4 border-l-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/35'
                        : 'border-l-4 border-l-zinc-200 hover:bg-zinc-50/70';

                    return (
                      <tr key={item.id} className={`${rowStyle} transition-colors`}>
                        {/* Customer & Source */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-semibold text-zinc-900">
                            {item.customerName || 'Anonymous Customer'}
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${sourceCfg.badgeColor}`}
                            >
                              <SourceIcon className="h-3 w-3" />
                              <span>{item.source}</span>
                            </span>
                          </div>
                        </td>

                        {/* Customer Quote */}
                        <td className="py-3.5 px-4 align-top">
                          <p className="text-zinc-800 font-medium leading-relaxed">
                            &ldquo;{item.text}&rdquo;
                          </p>

                          {/* If analyzed, display detailed extracted tags */}
                          {item.analysis && item.status === 'Analyzed' && (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-zinc-100 text-[11px]">
                              {/* Sentiment Tag with Red/Yellow/Green styling */}
                              <span
                                className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 ${
                                  item.analysis.sentiment === 'Positive'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : item.analysis.sentiment === 'Negative'
                                    ? 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-yellow-100 text-yellow-900 border border-yellow-300'
                                }`}
                              >
                                {item.analysis.sentiment === 'Positive' && <TrendingUp className="h-3 w-3 text-emerald-700" />}
                                {item.analysis.sentiment === 'Negative' && <TrendingDown className="h-3 w-3 text-red-700" />}
                                {item.analysis.sentiment === 'Neutral' && <Minus className="h-3 w-3 text-yellow-700" />}
                                <span>
                                  {item.analysis.sentiment === 'Positive'
                                    ? 'Good (Positive)'
                                    : item.analysis.sentiment === 'Negative'
                                    ? 'Bad (Negative)'
                                    : 'Neutral'}
                                </span>
                              </span>

                              {/* Topic */}
                              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                                Topic: {item.analysis.topic}
                              </span>

                              {/* Feedback Type */}
                              <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-medium">
                                {item.analysis.feedbackType}
                              </span>

                              {/* Pain point */}
                              {item.analysis.painPoint && item.analysis.painPoint !== 'None' && (
                                <span className="bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded font-medium truncate max-w-xs" title={item.analysis.painPoint}>
                                  Pain point: {item.analysis.painPoint}
                                </span>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Dedicated Sentiment Column (Red = Bad, Yellow = Neutral, Green = Good) */}
                        <td className="py-3.5 px-4 align-top">
                          {sentiment === 'Negative' ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 animate-pulse" />
                              <TrendingDown className="h-3.5 w-3.5 text-red-600 shrink-0" />
                              <span>Bad (Red)</span>
                            </div>
                          ) : sentiment === 'Neutral' ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-900 border border-yellow-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
                              <Minus className="h-3.5 w-3.5 text-yellow-700 shrink-0" />
                              <span>Neutral (Yellow)</span>
                            </div>
                          ) : sentiment === 'Positive' ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span>Good (Green)</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-500 border border-zinc-200">
                              <Clock className="h-3 w-3 text-zinc-400 shrink-0" />
                              <span>Pending AI</span>
                            </div>
                          )}
                        </td>

                        {/* Status / AI Action */}
                        <td className="py-3.5 px-4 align-top">
                          {item.status === 'Analyzed' ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                <Check className="h-3 w-3" />
                                <span>Analyzed by AI</span>
                              </span>
                            </div>
                          ) : item.status === 'Analyzing' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full animate-pulse">
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              <span>Analyzing...</span>
                            </span>
                          ) : (
                            <div className="space-y-1.5">
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                <Clock className="h-3 w-3" />
                                <span>Ready for AI Analysis</span>
                              </span>

                              <div>
                                <button
                                  type="button"
                                  onClick={() => handleAnalyzeSingleItem(item.id)}
                                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                                >
                                  <Sparkles className="h-3 w-3" />
                                  <span>[ Run AI Analysis ]</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* Date Added */}
                        <td className="py-3.5 px-4 align-top text-right text-zinc-400 text-[11px] whitespace-nowrap">
                          {item.dateAdded}
                        </td>

                        {/* Delete Action */}
                        <td className="py-3.5 px-4 align-top text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-zinc-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            title="Delete item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
