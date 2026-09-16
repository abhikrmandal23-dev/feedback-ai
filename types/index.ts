/**
 * VoC Copilot - Core Domain Types
 * Defines data contracts for Workspaces, Users, Feedback, Themes, Insights, Opportunities, Copilot, and PRDs.
 */

export type NavigationRoute =
  | 'landing'
  | 'dashboard'
  | 'feedback'
  | 'feedback_explorer'
  | 'themes'
  | 'insights'
  | 'opportunities'
  | 'copilot'
  | 'actions'
  | 'prd'
  | 'settings'
  | 'voc_hub'
  | 'dash_insights'
  | 'feedback_studio'
  | 'channel_analytics'
  | 'product_cockpit'
  | 'ai_trend_center'
  | 'alex_workspace';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'starter' | 'growth' | 'enterprise';
  createdAt: string;
  memberCount: number;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'product_manager' | 'designer' | 'engineer' | 'admin';
  avatarUrl?: string;
  workspaceId: string;
}

export type FeedbackSource =
  | 'zendesk'
  | 'intercom'
  | 'g2'
  | 'app_store'
  | 'survey'
  | 'sales_call'
  | 'slack'
  | 'csv_import';

export type SentimentType = 'positive' | 'neutral' | 'negative' | 'mixed';

export interface FeedbackItem {
  id: string;
  workspaceId: string;
  customerName?: string;
  customerTier?: 'enterprise' | 'mid_market' | 'smb';
  source: FeedbackSource;
  content: string;
  sentiment: SentimentType;
  sentimentScore?: number; // -1.0 to 1.0
  painPointCategory?: string;
  themeIds?: string[];
  createdAt: string;
}

export interface Theme {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  category: 'usability' | 'performance' | 'feature_gap' | 'pricing' | 'integration' | 'reliability';
  feedbackCount: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  arrAtRisk?: number;
  trend: 'up' | 'down' | 'stable';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInsight {
  id: string;
  workspaceId: string;
  themeId?: string;
  title: string;
  statement: string; // The distilled product insight
  impactScore: number; // 1 to 10
  confidenceScore: number; // 1 to 100%
  supportingFeedbackCount: number;
  customerSegments: string[];
  suggestedAction: string;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  targetPersona: string;
  status: 'backlog' | 'evaluating' | 'prioritized' | 'in_progress' | 'shipped';
  priorityScore: number; // e.g. RICE score calculation
  reach: number;
  impact: 'low' | 'medium' | 'high' | 'very_high';
  confidence: number;
  effort: 'xs' | 's' | 'm' | 'l' | 'xl';
  linkedThemeIds: string[];
  createdAt: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Array<{
    feedbackId: string;
    customerName: string;
    excerpt: string;
  }>;
  createdAt: string;
}

export interface PRDSection {
  id: string;
  title: string;
  content: string;
}

export interface PRDDocument {
  id: string;
  workspaceId: string;
  opportunityId?: string;
  title: string;
  targetRelease?: string;
  author: string;
  status: 'draft' | 'review' | 'approved' | 'in_development';
  summary: string;
  problemStatement: string;
  customerEvidence: Array<{
    quote: string;
    source: string;
    customerTier: string;
  }>;
  requirements: Array<{
    id: string;
    category: 'must_have' | 'should_have' | 'could_have';
    description: string;
  }>;
  successMetrics: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ThemeSolutionPlan {
  themeId: string;
  themeTitle: string;
  summary: string;
  rootCauseAnalysis: {
    primaryCause: string;
    technicalFactors: string[];
    userJourneyFrictionPoint: string;
  };
  immediateFix: {
    title: string;
    timeframe: string;
    actions: string[];
    customerComms: string;
  };
  permanentArchitectureSolution: {
    title: string;
    architectureChanges: string[];
    productUxEnhancements: string[];
    safeguardsAndFallbacks: string[];
  };
  actionRoadmap: Array<{
    step: number;
    phase: 'P0 - Immediate' | 'P1 - High Priority' | 'P2 - Architectural';
    owner: 'Backend Engineering' | 'Frontend / Mobile' | 'Product & UX' | 'Customer Operations';
    task: string;
    details: string;
    impact: string;
  }>;
  preventionGuardrails: string[];
  projectedImpact: {
    frictionReduction: string;
    targetSuccessRate: string;
    kpisToTrack: string[];
  };
  generatedAt: string;
  modelUsed?: string;
}
