import React from 'react';
import {
  Settings,
  Database,
  Key,
  Building,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { NavigationRoute, Workspace, UserProfile } from '@/types';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { isOpenAIConfigured } from '@/lib/ai/openai';

interface SettingsViewProps {
  onNavigate: (route: NavigationRoute) => void;
  workspace: Workspace;
  user: UserProfile;
}

export function SettingsView({ onNavigate, workspace, user }: SettingsViewProps) {
  return (
    <PageContainer
      title="Settings"
      description="Manage workspace configurations, Supabase database connections, and AI environment variables."
      badge={<Badge variant="outline">Configuration</Badge>}
      breadcrumbs={[{ label: 'Settings' }]}
      onNavigate={onNavigate}
    >
      <div className="space-y-6 max-w-4xl">
        {/* Workspace Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-zinc-700" />
              <CardTitle className="text-sm">Workspace Information</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Basic details about your active Product Management workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 border-b border-zinc-100">
              <span className="text-zinc-500 font-medium">Workspace Name</span>
              <span className="sm:col-span-2 font-medium text-zinc-900">{workspace.name}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 border-b border-zinc-100">
              <span className="text-zinc-500 font-medium">Workspace Slug</span>
              <span className="sm:col-span-2 font-mono text-zinc-700">{workspace.slug}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 border-b border-zinc-100">
              <span className="text-zinc-500 font-medium">Current Plan</span>
              <span className="sm:col-span-2">
                <Badge variant="secondary" className="uppercase text-[10px]">
                  {workspace.plan}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2">
              <span className="text-zinc-500 font-medium">Active Member</span>
              <span className="sm:col-span-2 text-zinc-800">
                {user.fullName} ({user.email}) - <span className="capitalize">{user.role.replace('_', ' ')}</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Supabase Connection Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-sm">Supabase Integration</CardTitle>
              </div>
              {isSupabaseConfigured ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Needs .env credentials
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              VoC Copilot uses Supabase PostgreSQL for multi-tenant workspace data, feedback items, and insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-zinc-700 font-semibold">NEXT_PUBLIC_SUPABASE_URL</span>
                <span className="text-zinc-500 font-mono text-[11px]">
                  {isSupabaseConfigured ? 'Configured' : 'Not set (see .env.example)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-zinc-700 font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                <span className="text-zinc-500 font-mono text-[11px]">
                  {isSupabaseConfigured ? 'Configured (Hidden)' : 'Not set (see .env.example)'}
                </span>
              </div>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              When ready to persist to live Supabase, supply these environment variables in your deployment settings or local <code className="font-mono text-zinc-700">.env</code>.
            </p>
          </CardContent>
        </Card>

        {/* OpenAI Configuration Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-zinc-700" />
                <CardTitle className="text-sm">OpenAI API Configuration (Part 2+)</CardTitle>
              </div>
              {isOpenAIConfigured ? (
                <Badge variant="success">Configured</Badge>
              ) : (
                <Badge variant="secondary">Required for Part 2</Badge>
              )}
            </div>
            <CardDescription className="text-xs">
              Required for Theme Clustering, Sentiment Analysis, Copilot answers, and PRD generation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 flex items-center justify-between">
              <div>
                <div className="font-mono font-semibold text-zinc-700">OPENAI_API_KEY</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Target models: gpt-4o, o3-mini
                </div>
              </div>
              <span className="text-zinc-500 font-mono text-[11px]">
                {isOpenAIConfigured ? 'Present in environment' : 'Not set (see .env.example)'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
