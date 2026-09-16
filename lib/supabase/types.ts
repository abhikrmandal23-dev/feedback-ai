/**
 * Supabase Database Schema Definitions
 * TypeScript interfaces matching PostgreSQL tables for VoC Copilot.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          plan: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          plan?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          plan?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          workspace_id: string;
          email: string;
          full_name: string;
          role: string;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          workspace_id: string;
          email: string;
          full_name?: string;
          role?: string;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          workspace_id?: string;
          email?: string;
          full_name?: string;
          role?: string;
          avatar_url?: string | null;
        };
      };
      feedback: {
        Row: {
          id: string;
          workspace_id: string;
          source: string;
          customer_name: string | null;
          customer_tier: string | null;
          content: string;
          sentiment: string | null;
          sentiment_score: number | null;
          pain_point_category: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          source: string;
          customer_name?: string | null;
          customer_tier?: string | null;
          content: string;
          sentiment?: string | null;
          sentiment_score?: number | null;
          pain_point_category?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          source?: string;
          customer_name?: string | null;
          customer_tier?: string | null;
          content?: string;
          sentiment?: string | null;
          sentiment_score?: number | null;
          pain_point_category?: string | null;
          metadata?: Json | null;
        };
      };
      themes: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          description: string;
          category: string;
          feedback_count: number;
          positive_count: number;
          neutral_count: number;
          negative_count: number;
          trend: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          description: string;
          category?: string;
          feedback_count?: number;
          positive_count?: number;
          neutral_count?: number;
          negative_count?: number;
          trend?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          category?: string;
          feedback_count?: number;
          positive_count?: number;
          neutral_count?: number;
          negative_count?: number;
          trend?: string;
          updated_at?: string;
        };
      };
      insights: {
        Row: {
          id: string;
          workspace_id: string;
          theme_id: string | null;
          title: string;
          statement: string;
          impact_score: number;
          confidence_score: number;
          customer_segments: string[];
          suggested_action: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          theme_id?: string | null;
          title: string;
          statement: string;
          impact_score?: number;
          confidence_score?: number;
          customer_segments?: string[];
          suggested_action?: string | null;
          created_at?: string;
        };
        Update: {
          theme_id?: string | null;
          title?: string;
          statement?: string;
          impact_score?: number;
          confidence_score?: number;
          customer_segments?: string[];
          suggested_action?: string | null;
        };
      };
      opportunities: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          description: string;
          status: string;
          priority_score: number;
          reach: number;
          impact: string;
          confidence: number;
          effort: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          description: string;
          status?: string;
          priority_score?: number;
          reach?: number;
          impact?: string;
          confidence?: number;
          effort?: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          status?: string;
          priority_score?: number;
          reach?: number;
          impact?: string;
          confidence?: number;
          effort?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: string;
          content: string;
          citations: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          role: string;
          content: string;
          citations?: Json | null;
          created_at?: string;
        };
        Update: {
          role?: string;
          content?: string;
          citations?: Json | null;
        };
      };
      prds: {
        Row: {
          id: string;
          workspace_id: string;
          opportunity_id: string | null;
          title: string;
          status: string;
          summary: string;
          problem_statement: string;
          requirements: Json;
          customer_evidence: Json;
          success_metrics: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          opportunity_id?: string | null;
          title: string;
          status?: string;
          summary?: string;
          problem_statement?: string;
          requirements?: Json;
          customer_evidence?: Json;
          success_metrics?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          opportunity_id?: string | null;
          title?: string;
          status?: string;
          summary?: string;
          problem_statement?: string;
          requirements?: Json;
          customer_evidence?: Json;
          success_metrics?: string[];
          updated_at?: string;
        };
      };
    };
  };
}
