import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Target,
  MessageSquare,
  FileText,
  Layers,
  TrendingUp,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BarChart3,
  Search,
  ShieldCheck,
  Send,
  User,
  Bot,
  ExternalLink,
  ChevronRight,
  Headphones,
  UploadCloud,
  Code2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { NavigationRoute } from '@/types';

interface LandingViewProps {
  onNavigate: (route: NavigationRoute) => void;
}

// All 8 Core Features built in the platform
const PLATFORM_FEATURES: Array<{
  id: NavigationRoute;
  badge: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  glowColor: string;
  preview: string;
}> = [
  {
    id: 'dashboard',
    badge: 'Feature 1',
    title: 'Executive VoC Cockpit',
    description: 'Real-time overview of 12,482 customer feedback records with Net Sentiment trends, volume surges, and P0 alerts.',
    metric: '12,482',
    metricLabel: 'Processed Signals',
    icon: BarChart3,
    accentColor: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    preview: 'Net Sentiment +42% • 78% Checkout Friction Alert',
  },
  {
    id: 'feedback',
    badge: 'Feature 2',
    title: 'Multi-Channel Ingestion',
    description: 'Connect Zendesk, App Store, Google Play, G2, Intercom, and CSV files with automated AI categorization.',
    metric: '5 Sources',
    metricLabel: 'Connected In Real-time',
    icon: UploadCloud,
    accentColor: 'from-indigo-500 to-purple-600',
    glowColor: 'rgba(99, 102, 241, 0.25)',
    preview: 'Auto-sync from Zendesk, Intercom, G2, & App Stores',
  },
  {
    id: 'feedback_explorer',
    badge: 'Feature 3',
    title: 'Feedback Explorer',
    description: 'Search, filter, and inspect verbatim customer feedback by sentiment, customer tier, channel, and keywords.',
    metric: '100%',
    metricLabel: 'Verbatim Grounding',
    icon: Compass,
    accentColor: 'from-sky-500 to-blue-600',
    glowColor: 'rgba(14, 165, 233, 0.25)',
    preview: 'Filter by Enterprise tier, 1-star ratings, or payment keywords',
  },
  {
    id: 'themes',
    badge: 'Feature 4',
    title: 'AI Theme Clustering',
    description: 'Semantic topic clustering grouping unstructured complaints into actionable themes like Payment Problems & Latency.',
    metric: '437 Mentions',
    metricLabel: 'Top Problem (Payment)',
    icon: Layers,
    accentColor: 'from-violet-500 to-fuchsia-600',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    preview: 'Payment Problems (82% Neg) • App Latency (74% Neg)',
  },
  {
    id: 'insights',
    badge: 'Feature 5',
    title: 'Root Cause Insights',
    description: 'Deep-dive analysis revealing ARR at risk, customer quotes, affected user personas, and churn probability.',
    metric: '$184k',
    metricLabel: 'ARR at Churn Risk',
    icon: AlertTriangle,
    accentColor: 'from-amber-500 to-rose-600',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    preview: '3D Secure gateway timeout causes 38% user dropoff',
  },
  {
    id: 'opportunities',
    badge: 'Feature 6',
    title: 'RICE Opportunity Matrix',
    description: 'Objective prioritization balancing Customer Impact, Frequency, and Engineering Effort with automated RICE scoring.',
    metric: 'RICE 92',
    metricLabel: 'Highest Score Candidate',
    icon: Target,
    accentColor: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    preview: 'P0: Checkout Gateway Auto-Retry & Failover',
  },
  {
    id: 'copilot',
    badge: 'Feature 7',
    title: 'VoC Copilot (Gemini 3.8)',
    description: 'Grounded AI conversational partner. Answers direct PM questions strictly from customer feedback without general chat fluff.',
    metric: '<1.2s',
    metricLabel: 'Grounded Query Time',
    icon: Sparkles,
    accentColor: 'from-blue-600 to-violet-600',
    glowColor: 'rgba(37, 99, 235, 0.3)',
    preview: '“What should we prioritize?” → Payment Reliability (P0)',
  },
  {
    id: 'actions',
    badge: 'Feature 8',
    title: 'Action Generator & PRD',
    description: 'Transforms insights into product execution: generates Problems, Solutions, User Stories, Metrics, and 1-Click PRDs.',
    metric: '1-Click',
    metricLabel: 'PRD Export to Eng',
    icon: FileText,
    accentColor: 'from-cyan-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    preview: 'Problem + Solution + User Story + Success Metrics',
  },
];

// Interactive Copilot Sample Questions for Live Home Demo
const COPILOT_DEMO_QUESTIONS = [
  {
    q: 'What are customers complaining about the most?',
    a: 'Payment reliability is the biggest complaint. It appears in 437 feedback items, with most mentions being negative.',
    theme: 'Payment Reliability (437 mentions)',
  },
  {
    q: 'What should we prioritize?',
    a: 'Payment reliability should be prioritized first because it has high frequency and high customer impact.',
    theme: 'P0 Priority (RICE 92)',
  },
  {
    q: 'What are customers asking for?',
    a: 'The most requested improvements are faster checkout, better payment reliability, and clearer onboarding.',
    theme: 'Top 3 Product Requests',
  },
];

export function LandingView({ onNavigate }: LandingViewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const card3DRef = useRef<HTMLDivElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [activeCopilotDemoIndex, setActiveCopilotDemoIndex] = useState<number>(0);
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);
  const [typedResponse, setTypedResponse] = useState(COPILOT_DEMO_QUESTIONS[0].a);

  // 3D Canvas Background Simulation (Particles & AI Core Rings)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes in 3D coordinate space
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1000,
      z: Math.random() * 1000 + 200,
      radius: Math.random() * 2.2 + 0.8,
      speedZ: Math.random() * 0.8 + 0.4,
      hue: Math.random() > 0.6 ? 220 : Math.random() > 0.3 ? 260 : 190,
      pulse: Math.random() * Math.PI,
    }));

    let rotationAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep spatial gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2 + mousePosition.x * 40,
        height / 2 + mousePosition.y * 40,
        50,
        width / 2,
        height / 2,
        width * 0.8
      );
      bgGrad.addColorStop(0, '#0d1527');
      bgGrad.addColorStop(0.5, '#070b16');
      bgGrad.addColorStop(1, '#03050a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient 3D orbital rings in the background
      rotationAngle += 0.003;
      const centerX = width * 0.5;
      const centerY = height * 0.45;

      // Draw subtle orbital rings
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotationAngle);
      for (let ring = 1; ring <= 3; ring++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, 260 * ring, 90 * ring, Math.PI / 4, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 / ring})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // Project and render 3D particles
      const fov = 450;
      const mouseInfluenceX = mousePosition.x * 70;
      const mouseInfluenceY = mousePosition.y * 70;

      // Connect nearby particles with glowing neural lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.z -= p1.speedZ;
        if (p1.z < 100) {
          p1.z = 1200;
          p1.x = (Math.random() - 0.5) * 1600;
          p1.y = (Math.random() - 0.5) * 1000;
        }

        const scale = fov / (fov + p1.z);
        const projX = (p1.x + mouseInfluenceX) * scale + centerX;
        const projY = (p1.y + mouseInfluenceY) * scale + centerY;
        const alpha = Math.min(1, Math.max(0.1, (1200 - p1.z) / 900));

        // Draw node
        ctx.beginPath();
        ctx.arc(projX, projY, p1.radius * scale * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p1.hue}, 85%, 65%, ${alpha * 0.8})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsla(${p1.hue}, 90%, 60%, ${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections
        for (let j = i + 1; j < Math.min(particles.length, i + 8); j++) {
          const p2 = particles[j];
          const scale2 = fov / (fov + p2.z);
          const p2ProjX = (p2.x + mouseInfluenceX) * scale2 + centerX;
          const p2ProjY = (p2.y + mouseInfluenceY) * scale2 + centerY;

          const dx = projX - p2ProjX;
          const dy = projY - p2ProjY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(projX, projY);
            ctx.lineTo(p2ProjX, p2ProjY);
            ctx.strokeStyle = `rgba(129, 140, 248, ${0.15 * (1 - dist / 130) * alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  // Handle 3D Mouse Parallax on Hero Card
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const normX = x / (rect.width / 2);
    const normY = y / (rect.height / 2);

    setMousePosition({ x: normX, y: normY });
    setCardTilt({
      rotateX: -normY * 12,
      rotateY: normX * 14,
    });
  };

  const handleHeroMouseLeave = () => {
    setCardTilt({ rotateX: 0, rotateY: 0 });
    setMousePosition({ x: 0, y: 0 });
  };

  // Switch demo question for Copilot
  const handleSelectDemoQuestion = (index: number) => {
    setActiveCopilotDemoIndex(index);
    setIsCopilotTyping(true);
    setTypedResponse('');

    const targetText = COPILOT_DEMO_QUESTIONS[index].a;
    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += 3;
      if (currentLength >= targetText.length) {
        setTypedResponse(targetText);
        setIsCopilotTyping(false);
        clearInterval(interval);
      } else {
        setTypedResponse(targetText.slice(0, currentLength));
      }
    }, 18);
  };

  const handleLaunchApp = (route: NavigationRoute = 'dashboard') => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    onNavigate(route);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#030712] text-slate-100 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Interactive 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 opacity-90"
      />

      {/* Floating Glowing Grid & Ambient Lights */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))]" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed top-2/3 right-10 w-[500px] h-[300px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080d1a]/80 border-b border-slate-800/80 px-6 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Product Tag */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-white/20 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white font-sans">
                  VoC COPILOT
                </span>
                <Badge className="bg-indigo-950 text-indigo-300 border border-indigo-700/60 text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider">
                  3D AI Platform
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Voice of Customer Intelligence for Product Managers
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a
              href="#features"
              className="hover:text-white transition-colors cursor-pointer"
            >
              8 Core Features
            </a>
            <a
              href="#copilot-demo"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Interactive Copilot
            </a>
            <a
              href="#pipeline"
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </a>
            <button
              onClick={() => onNavigate('feedback_explorer')}
              className="hover:text-white transition-colors"
            >
              Feedback Explorer
            </button>
            <button
              onClick={() => onNavigate('opportunities')}
              className="hover:text-white transition-colors"
            >
              Opportunity Matrix
            </button>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('copilot')}
              className="hidden sm:inline-flex border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-medium gap-1.5 h-9"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Ask Copilot</span>
            </Button>

            <Button
              size="sm"
              onClick={() => handleLaunchApp('dashboard')}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-xs gap-2 h-9 px-4 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20"
            >
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* HERO SECTION with 3D Holographic Perspective Deck */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative z-10 pt-16 pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        {/* Animated Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-950/60 backdrop-blur-md text-xs font-semibold text-indigo-300 shadow-sm shadow-indigo-500/20 mb-6 hover:border-indigo-400 transition-colors">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Connected to 12,482 Live Customer Signals Across 5 Channels</span>
        </div>

        {/* Display Typography Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl">
          Turn Customer Chaos into{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Shipped Products.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
          The all-in-one AI platform for PMs. Ingest reviews, cluster pain points,
          calculate RICE impact, interrogate feedback with a grounded Copilot, and
          generate PRDs in 1 click.
        </p>

        {/* Main CTA Cluster */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => handleLaunchApp('dashboard')}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm px-6 h-12 gap-2.5 shadow-xl shadow-indigo-500/30 ring-1 ring-white/30 cursor-pointer"
          >
            <span>Open VoC Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onNavigate('copilot')}
            className="border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-sm px-6 h-12 gap-2 cursor-pointer backdrop-blur-md shadow-md"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Try VoC Copilot</span>
          </Button>
        </div>

        {/* 3D HOLOGRAPHIC PERSPECTIVE CARD DECK */}
        <div
          ref={card3DRef}
          style={{
            perspective: '1400px',
          }}
          className="mt-14 w-full max-w-4xl"
        >
          <div
            style={{
              transform: `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.15s ease-out',
            }}
            className="relative rounded-3xl border border-slate-700/80 bg-gradient-to-b from-slate-900/90 to-[#0B132B]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-indigo-950/60"
          >
            {/* Hologram Glass Glow Top Border */}
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />

            {/* Deck Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-3 w-3 rounded-full bg-rose-500" />
                <div className="flex h-3 w-3 rounded-full bg-amber-500" />
                <div className="flex h-3 w-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-xs text-slate-400">
                  voc-engine://intelligence-cockpit/live-stream
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-rose-950/80 text-rose-300 border-rose-800 text-xs font-semibold gap-1">
                  <AlertTriangle className="h-3 w-3 text-rose-400" />
                  <span>P0 Critical Issue Identified</span>
                </Badge>
              </div>
            </div>

            {/* 3D Inner Layer - Opportunity Focus Card */}
            <div
              style={{
                transform: 'translateZ(35px)',
              }}
              className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-left"
            >
              {/* Left Column: Problem & AI Suggested Actions */}
              <div className="md:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                      Highest Priority Opportunity
                    </span>
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      Payment Reliability
                    </h3>
                  </div>
                  <Badge className="bg-emerald-950 text-emerald-300 border-emerald-700 text-xs font-bold">
                    RICE Score: 92
                  </Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Problem Identified:
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    Customers experience failed payments during checkout. 437 mentions, 82% negative sentiment.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                    AI Suggested Solution:
                  </span>
                  <p className="text-xs text-indigo-100 font-medium">
                    Improve payment retry, implement gateway failover, and provide graceful 3D Secure error recovery.
                  </p>
                </div>

                {/* Floating Success Metrics */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Target Success Metrics:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Payment success rate', 'Checkout conversion', 'Failure rate (<1.2%)'].map((m, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        <span>{m}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Copilot Dialogue Simulation */}
              <div className="md:col-span-5 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">VoC Copilot</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Grounded
                  </span>
                </div>

                {/* Simulated Chat Dialogue */}
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl text-slate-200 border border-slate-700/60">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">PM:</span>
                    &ldquo;What are customers complaining about the most?&rdquo;
                  </div>

                  <div className="bg-indigo-950/60 p-2.5 rounded-xl text-indigo-100 border border-indigo-800/60">
                    <span className="text-[10px] font-bold text-indigo-300 block mb-0.5">Copilot:</span>
                    Payment reliability is the biggest complaint. It appears in 437 feedback items, with most mentions being negative.
                  </div>
                </div>

                {/* 1-Click PRD Action Button */}
                <div className="pt-2">
                  <Button
                    onClick={() => handleLaunchApp('actions')}
                    size="sm"
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs h-9 gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    <span>Generate PRD in 1-Click</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating 3D Depth Layer Badges */}
            <div
              style={{
                transform: 'translateZ(55px)',
              }}
              className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-2 text-slate-400">
                <span className="font-mono text-emerald-400 font-bold">$184,000</span>
                <span>ARR Churn Protected</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-indigo-300 font-bold">437</span>
                <span>Zendesk & Play Store Complaints</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLaunchApp('opportunities')}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <span>Inspect Full Matrix</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS TICKER STRIP */}
      <section className="relative z-10 border-y border-slate-800/80 bg-slate-900/50 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white font-mono">12,482</div>
            <div className="text-xs font-medium text-slate-400">Customer Feedback Items</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-rose-400 font-mono">437</div>
            <div className="text-xs font-medium text-slate-400">Payment Complaints Caught</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">$184k</div>
            <div className="text-xs font-medium text-slate-400">ARR Churn Risk Solved</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400 font-mono">92</div>
            <div className="text-xs font-medium text-slate-400">Top RICE Score Priority</div>
          </div>
        </div>
      </section>

      {/* 8 CORE FEATURES SHOWCASE GRID */}
      <section id="features" className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Badge className="bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold uppercase tracking-wider">
            Comprehensive Suite
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Everything Built for the Modern PM
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            From raw customer feedback to prioritized product requirements documents. Explore all 8 live modules.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLATFORM_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => handleLaunchApp(feature.id)}
                className="group relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-[#0A1020]/95 p-5 flex flex-col justify-between hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer"
              >
                {/* Top header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-10 w-10 rounded-xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center text-white shadow-md`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                      {feature.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Bottom preview & metric */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-white font-mono">
                      {feature.metric}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {feature.metricLabel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                    <span>Open Module</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE COPILOT TEST DRIVE ON HOME PAGE */}
      <section id="copilot-demo" className="relative z-10 py-20 px-6 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-slate-900/95 via-[#0C1226]/95 to-[#060A17]/95 p-6 sm:p-10 backdrop-blur-xl shadow-2xl shadow-indigo-950/60">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
            <Badge className="bg-indigo-900/70 text-indigo-300 border-indigo-700 text-xs font-bold">
              Feature 7 • Live Simulator
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Ask VoC Copilot Right Here
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Click any real question below to test how our AI answers strictly using customer feedback:
            </p>
          </div>

          {/* Question Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {COPILOT_DEMO_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectDemoQuestion(idx)}
                className={`text-xs px-3.5 py-2 rounded-xl font-medium transition-all cursor-pointer border ${
                  activeCopilotDemoIndex === idx
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 font-semibold'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                &ldquo;{item.q}&rdquo;
              </button>
            ))}
          </div>

          {/* Interactive Response Box */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">VoC Copilot Response</span>
                  <span className="text-[10px] text-indigo-400">Grounded in 12,482 customer records</span>
                </div>
              </div>

              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px]">
                {COPILOT_DEMO_QUESTIONS[activeCopilotDemoIndex].theme}
              </Badge>
            </div>

            <p className="text-sm text-slate-100 leading-relaxed font-medium min-h-[50px]">
              {typedResponse}
              {isCopilotTyping && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle" />
              )}
            </p>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Want to ask your own custom queries?
              </span>
              <Button
                size="sm"
                onClick={() => handleLaunchApp('copilot')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 h-8"
              >
                <span>Launch Full Copilot</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PIPELINE */}
      {/* ARCHITECTURE: HOW THE AI WORKS PIPELINE */}
      <section id="pipeline" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <Badge className="bg-indigo-950 text-indigo-300 border-indigo-800 text-xs font-bold uppercase tracking-wider px-3 py-1">
            How The AI Works
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            The VoC AI Backend Pipeline
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            From raw customer signals across multiple channels to prioritized engineering actions, with the VoC Copilot sitting on top.
          </p>
        </div>

        {/* 7-Step Visual Pipeline Flow */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                step: '01',
                title: 'Customer Feedback',
                desc: 'Raw multi-channel feedback ingested from Zendesk, App Store, Google Play, G2, and Intercom (12,482 customer signals).',
                tag: 'Input Stream',
                color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-400',
              },
              {
                step: '02',
                title: 'AI Reads & Extracts Information',
                desc: 'AI parses each item into 4 core dimensions: Sentiment (Positive/Negative/Neutral), Topic (Payment, Performance, UI), Type (Complaint/Feature Request/Praise), and Pain Point.',
                tag: 'Extraction',
                color: 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400',
              },
              {
                step: '03',
                title: 'Group Similar Feedback (Themes)',
                desc: 'Semantic embeddings aggregate related feedback into high-level themes (e.g., Payment Problems, Slow Performance, Onboarding Friction).',
                tag: 'Clustering',
                color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-400',
              },
              {
                step: '04',
                title: 'Identify Important Problems (Insights)',
                desc: 'Synthesizes clusters to isolate urgent problems, calculating customer impact, negative rates, evidence quotes, and ARR at churn risk.',
                tag: 'Synthesis',
                color: 'from-rose-500/20 to-pink-500/20 border-rose-500/40 text-rose-400',
              },
              {
                step: '05',
                title: 'Calculate Priority (Opportunities)',
                desc: 'Applies algorithmic RICE scoring: (Reach × Impact × Confidence) / Effort to assign objective P0, P1, P2, and P3 roadmap tiers.',
                tag: 'Prioritization',
                color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-400',
              },
              {
                step: '06',
                title: 'Recommend Actions',
                desc: 'Generates engineering-ready deliverables: problem statement, suggested solution, user story, success metrics, and one-click PRD generation.',
                tag: 'Execution',
                color: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-400',
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl bg-gradient-to-br ${p.color} border backdrop-blur-xs flex flex-col justify-between hover:scale-[1.02] transition-transform`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black font-mono text-white/90">{p.step}</span>
                    <Badge className="bg-slate-900/80 text-slate-300 border-slate-700 text-[10px] uppercase font-bold">
                      {p.tag}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">{p.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Copilot Sits On Top */}
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/40 shadow-xl text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Step 07 • Sits On Top Of Everything</span>
            </div>
            <h3 className="text-xl font-black text-white">VoC Copilot</h3>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto mt-1 mb-4">
              The Copilot connects directly to every layer of this pipeline. The PM can ask natural language questions about customer complaints, themes, priority calculations, or action specs and get instant grounded answers.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                'What are customers complaining about the most?',
                'What should we prioritize first?',
                'What action should we take on payment failures?',
              ].map((chip) => (
                <span
                  key={chip}
                  onClick={() => onNavigate('copilot')}
                  className="text-[11px] bg-slate-900/90 text-indigo-200 border border-indigo-800/60 px-3 py-1.5 rounded-full cursor-pointer hover:border-indigo-400 transition-colors"
                >
                  "{chip}"
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="relative z-10 py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-indigo-500/40 backdrop-blur-2xl shadow-2xl shadow-indigo-950">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Build What Customers Actually Want?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Experience the complete Voice of Customer workflow. Start with the executive dashboard or jump straight into the Copilot.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => handleLaunchApp('dashboard')}
              className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm px-8 h-12 shadow-lg cursor-pointer gap-2"
            >
              <span>Launch VoC Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => handleLaunchApp('copilot')}
              className="border-white/20 bg-black/40 hover:bg-black/60 text-white font-bold text-sm px-6 h-12 gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Talk to VoC Copilot</span>
            </Button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="font-bold text-slate-300">VoC Copilot</span>
            <span>• Voice of Customer Intelligence Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white">
              Dashboard
            </button>
            <button onClick={() => onNavigate('themes')} className="hover:text-white">
              Themes
            </button>
            <button onClick={() => onNavigate('opportunities')} className="hover:text-white">
              Opportunities
            </button>
            <button onClick={() => onNavigate('copilot')} className="hover:text-white">
              Copilot
            </button>
            <button onClick={() => onNavigate('actions')} className="hover:text-white">
              Actions
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
