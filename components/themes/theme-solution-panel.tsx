import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Download,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  AlertTriangle,
  Target,
  BarChart3,
  Wrench,
  FileText,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ThemeSolutionPlan, NavigationRoute } from '@/types';

interface ThemeSolutionPanelProps {
  themeTitle: string;
  solution: ThemeSolutionPlan | null;
  isLoading: boolean;
  onGenerate: () => void;
  onNavigate: (route: NavigationRoute) => void;
}

export function ThemeSolutionPanel({
  themeTitle,
  solution,
  isLoading,
  onGenerate,
  onNavigate,
}: ThemeSolutionPanelProps) {
  const [activeTab, setActiveTab] = useState<'permanent' | 'immediate' | 'roadmap' | 'metrics'>('permanent');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!solution) return;
    const text = `# AI Resolution & Prevention Plan: ${solution.themeTitle}
Generated: ${solution.generatedAt} (Engine: ${solution.modelUsed || 'AI Studio Engine'})

## Executive Summary
${solution.summary}

## 1. Root Cause Diagnosis
- Primary Cause: ${solution.rootCauseAnalysis.primaryCause}
- Friction Point in User Journey: ${solution.rootCauseAnalysis.userJourneyFrictionPoint}
Technical Factors:
${solution.rootCauseAnalysis.technicalFactors.map((f) => `  * ${f}`).join('\n')}

## 2. Immediate 24-48h Tactical Fix
${solution.immediateFix.title} (${solution.immediateFix.timeframe})
Actions:
${solution.immediateFix.actions.map((a) => `  * ${a}`).join('\n')}
Customer Communications:
"${solution.immediateFix.customerComms}"

## 3. Permanent Architecture & Prevention Solution
${solution.permanentArchitectureSolution.title}
Architecture Changes:
${solution.permanentArchitectureSolution.architectureChanges.map((c) => `  * ${c}`).join('\n')}
Product UX Enhancements:
${solution.permanentArchitectureSolution.productUxEnhancements.map((u) => `  * ${u}`).join('\n')}
Safeguards & Circuit Breakers:
${solution.permanentArchitectureSolution.safeguardsAndFallbacks.map((s) => `  * ${s}`).join('\n')}

## 4. Action Roadmap
${solution.actionRoadmap.map((r) => `[${r.phase}] (${r.owner}) ${r.task}: ${r.details} -> Impact: ${r.impact}`).join('\n')}

## 5. Prevention Guardrails
${solution.preventionGuardrails.map((g) => `  * ${g}`).join('\n')}

## 6. Projected Impact
- Friction Reduction: ${solution.projectedImpact.frictionReduction}
- Target Success Rate: ${solution.projectedImpact.targetSuccessRate}
- KPIs: ${solution.projectedImpact.kpisToTrack.join(', ')}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    if (!solution) return;
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(solution, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${solution.themeTitle.toLowerCase().replace(/\s+/g, '-')}-solution-plan.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!solution && !isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-purple-50/50 border border-blue-200/90 rounded-2xl p-6 text-center space-y-4">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>

        <div className="max-w-md mx-auto space-y-1.5">
          <h4 className="text-base font-bold text-zinc-900">
            How to Improve &amp; Prevent Customer Problems
          </h4>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Run an AI root-cause diagnosis for <strong className="text-zinc-900">{themeTitle}</strong> to generate an exact engineering architecture and UX prevention plan so customers never face this issue again.
          </p>
        </div>

        <div className="pt-1">
          <Button
            onClick={onGenerate}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs gap-2 transition-all hover:shadow-md cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-blue-200" />
            <span>Generate Exact AI Solution &amp; Prevention Plan</span>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-500 pt-2 border-t border-blue-100">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Root Cause Diagnosis
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" /> Permanent Prevention
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-blue-600" /> 24-48h Triage Fix
          </span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-blue-200 rounded-2xl p-8 text-center space-y-4 shadow-xs">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        </div>

        <div className="max-w-sm mx-auto space-y-2">
          <h4 className="text-sm font-bold text-zinc-900">
            Synthesizing Exact AI Solution Plan...
          </h4>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Diagnosing underlying root causes and formulating architecture prevention guardrails for <strong className="text-zinc-800">{themeTitle}</strong>.
          </p>
        </div>

        <div className="max-w-xs mx-auto space-y-2 text-[11px] text-zinc-500 pt-2">
          <div className="flex items-center gap-2 justify-center text-blue-600 font-medium animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Consulting Staff Systems Reliability Model...</span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-2/3 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!solution) return null;

  return (
    <div className="bg-white border-2 border-blue-500/80 rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-5 border-b border-blue-900/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-blue-400" />
                AI Resolution &amp; Prevention Plan
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {solution.modelUsed || 'Gemini 3.8 Flash'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Exact Solution for &ldquo;{solution.themeTitle}&rdquo;</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 text-xs h-8 gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-300" />
                  <span>Copy Plan</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onGenerate}
              title="Regenerate Solution with AI"
              className="bg-slate-800/80 hover:bg-slate-700 text-white border-slate-700 text-xs h-8 px-2.5"
            >
              <RefreshCw className="h-3.5 w-3.5 text-slate-300" />
            </Button>
          </div>
        </div>

        {/* Breakthrough Summary Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-blue-900/40 border border-blue-700/50 backdrop-blur-xs">
          <div className="flex items-start gap-2.5">
            <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wide">
                Definitive Solution Breakthrough:
              </span>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                {solution.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Root Cause Diagnostics Box */}
      <div className="p-5 border-b border-zinc-100 bg-amber-50/40">
        <div className="flex items-start gap-3">
          <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
          </div>
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Root Cause Diagnosis: Why Customers Face This
              </h4>
              <span className="text-[11px] text-amber-700 font-medium">
                Verified Friction Point
              </span>
            </div>

            <p className="text-xs font-semibold text-zinc-900 leading-relaxed">
              {solution.rootCauseAnalysis.primaryCause}
            </p>

            <div className="bg-white/80 rounded-lg p-2.5 border border-amber-200/70 text-xs text-zinc-700 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                Contributing Technical &amp; UX Factors:
              </span>
              <ul className="space-y-1">
                {solution.rootCauseAnalysis.technicalFactors.map((fact, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-800">
                    <span className="text-amber-600 font-bold text-sm leading-none">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[11px] text-zinc-600 pt-1">
              <strong className="text-zinc-800">Customer Drop-off Stage: </strong>
              <span>{solution.rootCauseAnalysis.userJourneyFrictionPoint}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="px-5 pt-3 border-b border-zinc-200 bg-zinc-50/60 flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('permanent')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'permanent'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Permanent Solution &amp; Prevention</span>
          <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            Core
          </span>
        </button>

        <button
          onClick={() => setActiveTab('immediate')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'immediate'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Immediate 24-48h Triage</span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'roadmap'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          <span>Implementation Roadmap</span>
          <span className="bg-zinc-200 text-zinc-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {solution.actionRoadmap.length} Tasks
          </span>
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
            activeTab === 'metrics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Projected Impact &amp; Guardrails</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5">
        {/* Tab 1: Permanent Solution */}
        {activeTab === 'permanent' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-blue-600" />
                <span>{solution.permanentArchitectureSolution.title}</span>
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                Engineered changes designed to systematically prevent this issue from ever recurring.
              </p>
            </div>

            {/* Architecture Changes */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3.5 w-3.5 text-zinc-400" />
                <span>Architectural System Redesign</span>
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                {solution.permanentArchitectureSolution.architectureChanges.map((arch, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80 text-xs flex items-start gap-2.5"
                  >
                    <span className="flex h-5 w-5 rounded-full bg-blue-600 text-white text-[11px] font-bold items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-zinc-900 leading-relaxed">
                      {arch}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* UX Enhancements & Safeguards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-[11px] uppercase font-bold text-zinc-700 tracking-wider block">
                  Product &amp; UX Protections
                </span>
                <ul className="space-y-1.5">
                  {solution.permanentArchitectureSolution.productUxEnhancements.map((ux, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-800">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ux}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
                <span className="text-[11px] uppercase font-bold text-zinc-700 tracking-wider block">
                  Automated Circuit Breakers &amp; Fallbacks
                </span>
                <ul className="space-y-1.5">
                  {solution.permanentArchitectureSolution.safeguardsAndFallbacks.map((safe, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-800">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{safe}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Immediate Fix */}
        {activeTab === 'immediate' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>{solution.immediateFix.title}</span>
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Tactical triage steps to immediately stop customer bleeding while permanent architecture builds.
                </p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {solution.immediateFix.timeframe}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] uppercase font-bold text-zinc-500 tracking-wider block">
                Immediate Action Checklist:
              </span>
              <div className="space-y-2">
                {solution.immediateFix.actions.map((act, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/80 text-xs flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span className="font-medium text-zinc-900 leading-relaxed">
                      {act}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proactive Customer Communication */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
                Proactive In-App Notice / Email for Affected Customers:
              </span>
              <p className="text-xs text-slate-200 italic leading-relaxed">
                &ldquo;{solution.immediateFix.customerComms}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-zinc-900">
                  Engineering &amp; Product Action Roadmap
                </h4>
                <p className="text-xs text-zinc-500">
                  Step-by-step tasks categorized by urgency, owner, and expected impact.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {solution.actionRoadmap.map((item) => (
                <div
                  key={item.step}
                  className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all space-y-2 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 rounded-md bg-zinc-900 text-white text-[11px] font-bold items-center justify-center">
                        {item.step}
                      </span>
                      <h5 className="text-xs font-bold text-zinc-900">
                        {item.task}
                      </h5>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.phase.includes('P0')
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : item.phase.includes('P1')
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {item.phase}
                      </span>
                      <span className="bg-zinc-100 text-zinc-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-zinc-200">
                        {item.owner}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 pl-7 leading-relaxed">
                    {item.details}
                  </p>

                  <div className="pl-7 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium pt-1 border-t border-zinc-100">
                    <Target className="h-3 w-3 text-emerald-600" />
                    <span>Target Impact: {item.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Metrics & Guardrails */}
        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-900">
                Operational Guardrails &amp; Projected Impact
              </h4>
              <p className="text-xs text-zinc-500">
                Quantifiable metrics to monitor and ensure this problem never regresses.
              </p>
            </div>

            {/* Impact Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                  Projected Complaint Reduction
                </span>
                <span className="text-xl font-black text-emerald-700">
                  {solution.projectedImpact.frictionReduction}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-800 tracking-wider block">
                  Target Flow Success Rate
                </span>
                <span className="text-xl font-black text-blue-700">
                  {solution.projectedImpact.targetSuccessRate}
                </span>
              </div>
            </div>

            {/* Prevention Guardrails */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2">
              <span className="text-[11px] uppercase font-bold text-zinc-700 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Continuous Prevention Guardrails &amp; Alerts</span>
              </span>
              <ul className="space-y-1.5">
                {solution.preventionGuardrails.map((g, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-800">
                    <span className="text-blue-600 font-bold text-sm leading-none">•</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* KPIs */}
            <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">
                Key Performance Indicators (KPIs) to Track:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {solution.projectedImpact.kpisToTrack.map((kpi, idx) => (
                  <span
                    key={idx}
                    className="bg-zinc-100 text-zinc-800 text-xs px-2.5 py-1 rounded-lg border border-zinc-200 font-medium"
                  >
                    {kpi}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="text-xs h-8 gap-1.5 text-zinc-700"
          >
            <Download className="h-3.5 w-3.5 text-zinc-500" />
            <span>Export JSON</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs h-8 gap-1.5 text-zinc-700"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied Markdown</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-zinc-500" />
                <span>Copy Markdown</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => onNavigate('opportunities')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8 gap-1.5 shadow-xs"
          >
            <span>Prioritize as Opportunity</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            onClick={() => onNavigate('prd')}
            className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold h-8 gap-1.5 shadow-xs"
          >
            <FileText className="h-3.5 w-3.5 text-zinc-300" />
            <span>Generate PRD Spec</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
