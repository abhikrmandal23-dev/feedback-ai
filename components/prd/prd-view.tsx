import React, { useState } from 'react';
import {
  FileText,
  Download,
  Copy,
  CheckCircle2,
  Sparkles,
  Edit3,
  ExternalLink,
  Target,
  ArrowRight,
  Share2,
  Printer,
  Calendar,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PageContainer } from '@/components/layout/page-container';
import type { NavigationRoute } from '@/types';
import { INITIAL_PRD, PRDData } from '@/lib/data/voc-store';

interface PRDViewProps {
  onNavigate: (route: NavigationRoute) => void;
}

export function PRDView({ onNavigate }: PRDViewProps) {
  const [prdData, setPrdData] = useState<PRDData>(INITIAL_PRD);
  const [isEditing, setIsEditing] = useState(false);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [jiraSuccess, setJiraSuccess] = useState(false);

  const handleCopyMarkdown = () => {
    const md = `# ${prdData.title}
*${prdData.generatedDate}*

## Problem
${prdData.problem}

## Target Users
${prdData.targetUsers.map((u) => `* ${u}`).join('\n')}

## Goal
${prdData.goal}

## Proposed Solution
${prdData.proposedSolution}

## Success Metrics
${prdData.successMetrics.map((m) => `* ${m}`).join('\n')}

## User Stories
${prdData.userStories.map((s) => `* ${s}`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  const handleCreateJira = () => {
    setIsJiraModalOpen(true);
  };

  const handleConfirmJira = () => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setJiraSuccess(true);
    setTimeout(() => {
      setIsJiraModalOpen(false);
      setJiraSuccess(false);
    }, 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageContainer
      title="Product Requirements Document"
      description="Generated from customer insights"
      breadcrumbs={[{ label: 'PRD Generator' }]}
      onNavigate={onNavigate}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMarkdown}
            className="text-xs gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Markdown</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="text-xs gap-1.5"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Save as PDF</span>
          </Button>
          <Button
            size="sm"
            onClick={handleCreateJira}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5"
          >
            <span>Create Jira Ticket</span>
          </Button>
        </div>
      }
    >
      {copiedToast && (
        <div className="mb-4 p-3 rounded-lg bg-zinc-900 text-white text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Full PRD copied to clipboard as Markdown!</span>
        </div>
      )}

      {/* Main Formatted PRD Document (Exact match from Screen 8) */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Document Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              PRD Status:
            </span>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Approved for Sprint
            </Badge>
            <span className="text-xs text-zinc-400 ml-2">
              Jira Key: <code className="font-mono text-zinc-700 font-semibold">{prdData.jiraTicketId}</code>
            </span>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Document'}</span>
          </button>
        </div>

        {/* PRD Document Card */}
        <Card className="bg-white shadow-sm border-zinc-200 print:border-none print:shadow-none">
          <CardContent className="p-8 sm:p-10 space-y-8 text-zinc-900">
            {/* Title Section */}
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Product Requirements Document
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 mt-1">
                {prdData.title}
              </h1>
              <p className="text-xs text-zinc-400 mt-1">
                {prdData.generatedDate} • Grounded in 1,245 customer complaint signals
              </p>
            </div>

            {/* 1. Problem Statement (Exact match from Screen 8) */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide text-indigo-950">
                Problem
              </h3>
              {isEditing ? (
                <textarea
                  value={prdData.problem}
                  onChange={(e) => setPrdData({ ...prdData, problem: e.target.value })}
                  rows={3}
                  className="w-full text-sm p-3 border rounded-md"
                />
              ) : (
                <p className="text-sm text-zinc-700 leading-relaxed">
                  {prdData.problem}
                </p>
              )}
            </div>

            {/* 2. Target Users (Exact match from Screen 8) */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide text-indigo-950">
                Target Users
              </h3>
              <ul className="space-y-1.5 text-sm text-zinc-700 list-disc list-inside">
                {prdData.targetUsers.map((user, idx) => (
                  <li key={idx}>{user}</li>
                ))}
              </ul>
            </div>

            {/* 3. Goal (Exact match from Screen 8) */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide text-indigo-950">
                Goal
              </h3>
              {isEditing ? (
                <textarea
                  value={prdData.goal}
                  onChange={(e) => setPrdData({ ...prdData, goal: e.target.value })}
                  rows={2}
                  className="w-full text-sm p-3 border rounded-md"
                />
              ) : (
                <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                  {prdData.goal}
                </p>
              )}
            </div>

            {/* 4. Proposed Solution (Exact match from Screen 8) */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide text-indigo-950">
                Proposed Solution
              </h3>
              {isEditing ? (
                <textarea
                  value={prdData.proposedSolution}
                  onChange={(e) =>
                    setPrdData({ ...prdData, proposedSolution: e.target.value })
                  }
                  rows={3}
                  className="w-full text-sm p-3 border rounded-md"
                />
              ) : (
                <p className="text-sm text-zinc-700 leading-relaxed">
                  {prdData.proposedSolution}
                </p>
              )}
            </div>

            {/* 5. Success Metrics (Exact match from Screen 8) */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide text-indigo-950">
                Success Metrics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {prdData.successMetrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/70 text-xs text-zinc-800 font-medium flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. User Stories (Exact match from Screen 8) */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wide text-indigo-950">
                User Stories
              </h3>
              <div className="space-y-2 pt-1">
                {prdData.userStories.map((story, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-700 italic flex items-start gap-2.5"
                  >
                    <span className="font-bold text-blue-600 not-italic shrink-0">
                      US-{idx + 1}:
                    </span>
                    <span>"{story}"</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Evidence Appendix */}
            <div className="space-y-2 pt-4 border-t border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Linked Evidence Citations
              </h3>
              <p className="text-xs text-zinc-500">
                • 1,245 customer complaint mentions linked from Zendesk, App Store, and Stripe webhooks.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Footer (Exact match from Screen 8) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Ready to execute with your sprint squad?</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyMarkdown}
              className="text-xs"
            >
              Copy Markdown
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              Save as PDF
            </Button>
            <Button
              size="sm"
              onClick={handleCreateJira}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Create Jira Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* Jira Ticket Modal */}
      <Dialog
        open={isJiraModalOpen}
        onOpenChange={setIsJiraModalOpen}
        title="Create Jira Sprint Issue"
        description="Sync this synthesized PRD directly to your engineering Jira board."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsJiraModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmJira}
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              {jiraSuccess ? 'Ticket Created!' : 'Confirm & Push to Jira'}
            </Button>
          </>
        }
      >
        {jiraSuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-zinc-900">
              Jira Ticket VOC-104 Created!
            </h4>
            <p className="text-xs text-zinc-500">
              Issue was assigned to Sprint 42 with Priority: High. Acceptance criteria & user stories attached.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-2 text-xs">
            <div>
              <label className="font-medium text-zinc-700 block mb-1">Issue Key & Title</label>
              <div className="p-2 rounded-md bg-zinc-50 border border-zinc-200 font-mono text-xs text-zinc-900">
                [VOC-104] {prdData.title}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Issue Type</label>
                <input
                  type="text"
                  disabled
                  value="Epic / Feature"
                  className="w-full h-8 px-2.5 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700"
                />
              </div>
              <div>
                <label className="font-medium text-zinc-700 block mb-1">Priority</label>
                <input
                  type="text"
                  disabled
                  value="High (P1)"
                  className="w-full h-8 px-2.5 rounded-md border border-zinc-200 bg-zinc-50 text-rose-700 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="font-medium text-zinc-700 block mb-1">Target Sprint</label>
              <input
                type="text"
                disabled
                value="Q3 Sprint 42 - Checkout Optimization"
                className="w-full h-8 px-2.5 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-700"
              />
            </div>

            <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-blue-900 text-[11px] leading-relaxed">
              <strong>Evidence attached:</strong> 1,245 customer quotes and RICE calculation score of 92 will be appended as Jira description markdown.
            </div>
          </div>
        )}
      </Dialog>
    </PageContainer>
  );
}
