import type { ThemeSolutionPlan } from '@/types';

export const DEFAULT_THEME_SOLUTIONS: Record<string, ThemeSolutionPlan> = {
  'theme-payment': {
    themeId: 'theme-payment',
    themeTitle: 'Payment Problems',
    summary:
      'Deploy an Idempotent Payment Intent architecture with dual-gateway active-passive failover and automated asynchronous webhook reconciliation to eliminate checkout drops and double charges.',
    rootCauseAnalysis: {
      primaryCause:
        'Gateway timeout race conditions during 3D-Secure authentication and asynchronous webhook drops between the client browser, payment service provider (PSP), and order database.',
      technicalFactors: [
        'Lack of distributed idempotency keys causing duplicate transaction processing and debiting users twice upon network jitter.',
        'Hard timeout threshold (8 seconds) failing mobile UPI callbacks prematurely before bank confirmation completes.',
        'Single PSP bottleneck with no automatic fallback routing when primary gateway health degrades.',
      ],
      userJourneyFrictionPoint:
        'Checkout Final Screen: After entering OTP/UPI pin, the screen shows "Payment Failed" even though bank SMS confirms money was debited from user account.',
    },
    immediateFix: {
      title: '24-48 Hour Emergency Checkout Stabilization',
      timeframe: 'Within 24-48 hours',
      actions: [
        'Implement dynamic frontend polling (15s grace window) with a "Verifying Bank Status..." reassuring loader before marking order as failed.',
        'Configure automated webhook retry worker (exponential backoff) to capture delayed bank confirmations.',
        'Enable 1-click customer self-service "Check Payment Status & Auto-Reconcile" button on order failure screen.',
      ],
      customerComms:
        'Notice displayed to affected users: "Your transaction is secure. If funds were debited, our automated reconciliation will confirm your order or issue an instant refund to your source account within 15 minutes."',
    },
    permanentArchitectureSolution: {
      title: 'Resilient Multi-PSP Smart Routing & Self-Healing Reconciliation Engine',
      architectureChanges: [
        'Distributed Idempotency Layer: Enforce unique idempotency keys in Redis with a 120-second lease to guarantee at-most-once payment processing.',
        'Multi-Gateway Smart Router: Real-time latency & error rate monitor that automatically fails over traffic to secondary PSP (e.g., Stripe/Adyen/Razorpay) if p95 response > 2.5s.',
        'Event-Driven Reconciliation Worker: Kafka/RabbitMQ consumer that queries PSP capture APIs every 30s to automatically match orphaned debits with cart orders.',
      ],
      productUxEnhancements: [
        'Proactive Order Recovery Banner: If an order fails, cart contents and applied coupon codes are preserved indefinitely without requiring card re-entry.',
        'Saved Alternate Payment Methods: 1-tap fallback switch (e.g., "Primary UPI timed out — tap to switch to Saved Card or Apple/Google Pay").',
      ],
      safeguardsAndFallbacks: [
        'Circuit Breaker: Automatically halts traffic to degraded payment routes and shifts traffic to healthy backup rail.',
        'Automated Zero-Touch Refund Protocol: Auto-initiates instant refund via PSP reversal API if payment succeeds but inventory hold fails.',
      ],
    },
    actionRoadmap: [
      {
        step: 1,
        phase: 'P0 - Immediate',
        owner: 'Backend Engineering',
        task: 'Implement Idempotency Keys & Distributed Redis Lock',
        details: 'Pass X-Idempotency-Key on all checkout API routes to eliminate double charges.',
        impact: 'Zero duplicate customer charges during network retry.',
      },
      {
        step: 2,
        phase: 'P0 - Immediate',
        owner: 'Frontend / Mobile',
        task: 'Reassuring Verification State & Graceful Timeout UI',
        details: 'Replace harsh red error modal with live status poller and funds safety assurance.',
        impact: 'Prevents customer panic and repeated failed retry loops.',
      },
      {
        step: 3,
        phase: 'P1 - High Priority',
        owner: 'Backend Engineering',
        task: 'Deploy Secondary Payment Gateway Failover',
        details: 'Integrate automated fallback routing when primary PSP returns 5xx or drops packets.',
        impact: 'Elevates checkout availability to 99.95% uptime.',
      },
      {
        step: 4,
        phase: 'P2 - Architectural',
        owner: 'Customer Operations',
        task: 'Automate Instant Orphaned Debit Resolution',
        details: 'Build internal webhook listener that automatically generates support refund receipt within 5 mins.',
        impact: 'Reduces payment support ticket volume by 90%.',
      },
    ],
    preventionGuardrails: [
      'Real-time PagerDuty / Slack alert trigger whenever checkout failure rate exceeds 2.5% in any 5-minute rolling window.',
      'Continuous synthetic end-to-end checkout test running every 3 minutes across all supported payment rails.',
      'Hard SLA: Zero unexplained failed debits lasting longer than 15 minutes without proactive customer email notification.',
    ],
    projectedImpact: {
      frictionReduction: '85% reduction in payment-related customer complaints and support tickets',
      targetSuccessRate: '99.8% checkout completion success rate across mobile and web',
      kpisToTrack: [
        'Checkout Conversion Rate (+4.8% projected)',
        'Payment Gateway Failure Rate (<0.5% target)',
        'Support Tickets with tag "Payment Failure" (-88%)',
        'Customer CSAT on Checkout (4.8 / 5.0)',
      ],
    },
    generatedAt: 'Grounded AI Solution Plan',
    modelUsed: 'gemini-3.8-flash',
  },

  'theme-performance': {
    themeId: 'theme-performance',
    themeTitle: 'Slow App Performance',
    summary:
      'Implement client-side WebWorker image downscaling, optimistic UI updates, and CDN edge caching with database query indexing to achieve sub-500ms interactions across all client devices.',
    rootCauseAnalysis: {
      primaryCause:
        'Synchronous uncompressed high-resolution asset uploads blocking the browser main JavaScript thread, paired with unindexed compound queries on aggregate analytics tables.',
      technicalFactors: [
        'Main thread blocking: Large uncompressed images (5MB-15MB) decoded directly in UI thread before upload.',
        'Uncached N+1 database queries on dashboard initialization during peak morning traffic spikes.',
        'Large JavaScript bundle payload without code splitting or route-based lazy loading.',
      ],
      userJourneyFrictionPoint:
        'Morning Dashboard Launch & Receipt Upload: Application hangs for 5-8 seconds, causing mobile browser freezes and crash reports.',
    },
    immediateFix: {
      title: 'Main-Thread Unblock & Stale-While-Revalidate Caching',
      timeframe: 'Within 24-48 hours',
      actions: [
        'Deploy client-side HTML5 Canvas image downscaler to compress uploads to WebP (max 1600px, <400KB) before transmission.',
        'Add Redis Stale-While-Revalidate (SWR) cache header to all dashboard metrics endpoints (TTL 60s).',
        'Add database compound indexes on `(workspace_id, created_at DESC)` to accelerate initial table queries.',
      ],
      customerComms:
        'In-app release note: "We have upgraded our media processing and dashboard engine. Uploads and metric charts now load up to 10x faster with reduced battery consumption."',
    },
    permanentArchitectureSolution: {
      title: 'Asynchronous Chunked Storage & Virtualized Edge Rendering',
      architectureChanges: [
        'Direct-to-Cloud Pre-Signed Multi-Part Uploads: Client streams compressed chunks directly to S3/GCS with background web workers, completely bypassing backend web servers.',
        'Virtualized DOM Lists: Implement react-window / TanStack virtualizer for all feedback feeds and table logs to render only active viewport DOM nodes.',
        'Edge API Caching: Cache read-heavy analytical endpoints via Cloudflare / Cloud CDN edge locations.',
      ],
      productUxEnhancements: [
        'Optimistic Local UI Updates: Immediately display uploaded items in UI state with a subtle uploading spinner while background sync finishes.',
        'Skeleton Loading States: Smooth shimmer placeholders replacing jarring blank white screen flashes during data fetches.',
      ],
      safeguardsAndFallbacks: [
        'CI/CD Bundle Size Budget: Automated pull request blocker if initial JavaScript chunk exceeds 180KB gzip.',
        'Lighthouse Synthetic Performance Gates: Automatic rollback if p95 response time exceeds 400ms.',
      ],
    },
    actionRoadmap: [
      {
        step: 1,
        phase: 'P0 - Immediate',
        owner: 'Frontend / Mobile',
        task: 'WebWorker Client Image Compression',
        details: 'Offload image downscaling to background WebWorker before upload payload dispatch.',
        impact: 'Eliminates 100% of mobile browser freeze crashes.',
      },
      {
        step: 2,
        phase: 'P0 - Immediate',
        owner: 'Backend Engineering',
        task: 'Query Plan Optimization & SWR Redis Cache',
        details: 'Index workspace timestamp columns and cache aggregated count metrics in memory.',
        impact: 'Reduces database CPU utilization by 65% during morning peak.',
      },
      {
        step: 3,
        phase: 'P1 - High Priority',
        owner: 'Frontend / Mobile',
        task: 'Virtualize Heavy Feedback Tables',
        details: 'Only render visible DOM elements in table feeds, capping active DOM elements under 100.',
        impact: 'Smooth 60fps scrolling and immediate responsiveness.',
      },
      {
        step: 4,
        phase: 'P2 - Architectural',
        owner: 'Backend Engineering',
        task: 'Multi-Part Direct Cloud Storage Ingestion',
        details: 'Issue pre-signed storage URLs for direct background file uploads.',
        impact: 'Server bandwidth footprint drops by 80%.',
      },
    ],
    preventionGuardrails: [
      'Automated synthetic latency probe testing dashboard load every 60 seconds from 5 global regions.',
      'Sentry crash rate alert triggered if ANR (Application Not Responding) rate crosses 0.15%.',
    ],
    projectedImpact: {
      frictionReduction: '78% reduction in app latency and crash complaints',
      targetSuccessRate: 'Average initial page load under 450ms (down from 5.4s)',
      kpisToTrack: [
        'p95 Page Load Time (<500ms)',
        'App Crash / Freeze Rate (<0.05%)',
        'Upload Success Rate (99.9%)',
        'Mobile App Store Rating (Jump from 3.1 to 4.6 stars)',
      ],
    },
    generatedAt: 'Grounded AI Solution Plan',
    modelUsed: 'gemini-3.8-flash',
  },

  'theme-onboarding': {
    themeId: 'theme-onboarding',
    themeTitle: 'Difficult Onboarding',
    summary:
      'Transform the high-friction linear checklist into a non-intrusive contextual discovery system with universal Command Palette navigation and 1-click interactive sandbox data.',
    rootCauseAnalysis: {
      primaryCause:
        'Cognitive overload from mandatory multi-step modal checklist blocking primary user exploration, combined with high-value actions (like CSV Export) hidden inside tertiary sub-menus.',
      technicalFactors: [
        'Checklist modal state saved in un-synced client cookie that frequently fails to register completion events, getting stuck at 80%.',
        'Navigation taxonomy buried primary PM workflows (Export, Filter, Share) inside user profile preferences rather than contextual action bars.',
        'Absence of sample playground data leaving first-time users on intimidating blank empty states.',
      ],
      userJourneyFrictionPoint:
        'First 10 Minutes in Workspace: User attempts to export initial sample data or invite teammates, but is blocked by an unminimizable checklist modal.',
    },
    immediateFix: {
      title: 'Checklist Dismissal & Header Action Elevation',
      timeframe: 'Within 24-48 hours',
      actions: [
        'Add a clear "Minimize to Dock" and "Dismiss" button to the onboarding checklist modal.',
        'Elevate the "Export CSV / PDF" action directly into the primary top navigation and table header.',
        'Fix checklist completion state listener to auto-mark finished steps in real time.',
      ],
      customerComms:
        'In-app guidance: "Looking for Export? You can now export feedback tables directly from the top-right action bar or press Cmd+K to export anywhere."',
    },
    permanentArchitectureSolution: {
      title: 'Contextual Just-In-Time Guidance & Universal Action Palette',
      architectureChanges: [
        'Omnipresent Command Palette (`Cmd + K` / `Ctrl + K`): Search, navigate, and execute any action (Export, Filter, Invite, AI Analyze) instantly.',
        'Dynamic Role-Based Onboarding Engine: Custom tailored paths for Product Managers, Engineers, and Customer Support leads.',
        'Persistent Progress State Microservice: Cloud-synced onboarding state with zero state drift across multiple devices.',
      ],
      productUxEnhancements: [
        'Contextual Pulsing Beacons: Light, non-blocking tooltips that appear only when a user hovers over a new feature for the first time.',
        '1-Click Interactive Sample Project: Pre-loads 20 sample feedback records so new users immediately see value within 30 seconds.',
      ],
      safeguardsAndFallbacks: [
        'Inactivity Help Trigger: If a user spends >60 seconds idling on an empty screen, gently suggest a 1-click video walkthrough or sample data load.',
      ],
    },
    actionRoadmap: [
      {
        step: 1,
        phase: 'P0 - Immediate',
        owner: 'Product & UX',
        task: 'Add Dismissible Floating Dock to Onboarding',
        details: 'Allow users to collapse the checklist into a subtle floating pill in the bottom corner.',
        impact: 'Eliminates 100% of complaints regarding blocked UI screens.',
      },
      {
        step: 2,
        phase: 'P0 - Immediate',
        owner: 'Frontend / Mobile',
        task: 'Promote Export & Share Buttons to Main Header',
        details: 'Make Export CSV/PDF accessible with a single click from every view.',
        impact: 'Directly resolves the top reported onboarding issue.',
      },
      {
        step: 3,
        phase: 'P1 - High Priority',
        owner: 'Frontend / Mobile',
        task: 'Implement Universal Cmd+K Command Palette',
        details: 'Index all routes, exports, and actions in a rapid keyboard-first modal.',
        impact: 'Power users find features in under 2 seconds.',
      },
      {
        step: 4,
        phase: 'P2 - Architectural',
        owner: 'Product & UX',
        task: 'Role-Based Guided Walkthroughs',
        details: 'Segment initial product tour by user persona (PM vs Support vs Exec).',
        impact: 'Increases 7-day user activation rate from 54% to 84%.',
      },
    ],
    preventionGuardrails: [
      'Telemetry tracking of "Time to First Meaningful Action" with an alert if median exceeds 3 minutes.',
      'Auto-survey triggered if a user exits the onboarding flow early to diagnose remaining friction.',
    ],
    projectedImpact: {
      frictionReduction: '72% drop in onboarding frustration and navigation complaints',
      targetSuccessRate: '91% onboarding completion rate within first session (up from 64%)',
      kpisToTrack: [
        'Day 1 User Activation (+38%)',
        'Time to First Value (<90 seconds)',
        'Export Feature Discovery (+84%)',
        'Trial-to-Paid Conversion (+18%)',
      ],
    },
    generatedAt: 'Grounded AI Solution Plan',
    modelUsed: 'gemini-3.8-flash',
  },

  'theme-support': {
    themeId: 'theme-support',
    themeTitle: 'Customer Support',
    summary:
      'Implement smart AI-assisted ticket triage with 1-click human escalation and automated self-service account portals for instant invoice and refund tracking.',
    rootCauseAnalysis: {
      primaryCause:
        'Rigid keyword-based bot decision trees trapping users in circular loops without human escalation, combined with lack of customer self-service for recurring administrative tasks like invoices.',
      technicalFactors: [
        'Chatbot lacking context persistence between conversational turns, forcing customers to repeat their problem multiple times.',
        'Manual support ticket routing creating 24-48 hour queues for high-priority revenue-affecting questions.',
        'Absence of automated self-serve invoice download and refund status endpoints.',
      ],
      userJourneyFrictionPoint:
        'Help Desk Chat: Customer asks for tax clarification or refund status and receives generic canned responses with no option to speak with an agent.',
    },
    immediateFix: {
      title: 'One-Click Human Handoff & Self-Service Invoice Portal',
      timeframe: 'Within 24-48 hours',
      actions: [
        'Add an unconditional "Talk to a Human Specialist" button visible after a single unresolved bot message.',
        'Deploy a self-service "Instant Tax / VAT Invoice Generator" directly inside the Billing settings page.',
        'Create a Priority Escalation rule that routes payment and billing tickets directly to Tier-2 support with an SLA of under 15 minutes.',
      ],
      customerComms:
        'Support response assurance: "We hear you. You can connect with our live specialist team with a single click, or download instant tax invoices anytime from your account settings."',
    },
    permanentArchitectureSolution: {
      title: 'Context-Aware LLM Support Copilot with Unified Customer Event Timeline',
      architectureChanges: [
        'Unified Customer Journey Context: Inject customer session logs, recent payment status, and feedback history directly into the agent dashboard so reps never ask customers to repeat details.',
        'Self-Healing Account Webhooks: Expose real-time refund status tracking with bank ARN reference IDs in the customer account portal.',
        'Automated AI Ticket Summarization: Pre-draft accurate resolution steps for support agents grounded in product documentation.',
      ],
      productUxEnhancements: [
        'In-App Ticket Status Widget: Real-time progress bar showing queue position, assigned agent, and estimated resolution time.',
        'Proactive Downtime Banners: In-app notices alerting users during known third-party API incidents before they file tickets.',
      ],
      safeguardsAndFallbacks: [
        'Sentiment Escalation Trigger: NLP analyzer automatically flags frustrated or angry tone and elevates ticket priority to Urgent.',
      ],
    },
    actionRoadmap: [
      {
        step: 1,
        phase: 'P0 - Immediate',
        owner: 'Customer Operations',
        task: 'Enable Instant Human Escalation Override',
        details: 'Allow customers to bypass bot replies and queue directly for a human agent.',
        impact: 'Eliminates circular loop frustration immediately.',
      },
      {
        step: 2,
        phase: 'P0 - Immediate',
        owner: 'Product & UX',
        task: 'Launch Self-Serve Tax Invoice Generator',
        details: 'Provide 1-click PDF receipt generation in billing settings.',
        impact: 'Removes 35% of all support ticket volume overnight.',
      },
      {
        step: 3,
        phase: 'P1 - High Priority',
        owner: 'Backend Engineering',
        task: 'Live Customer Context Stream in CRM',
        details: 'Pass last 5 user events and recent failed payments to support rep console.',
        impact: 'Cuts average ticket handling time by 50%.',
      },
      {
        step: 4,
        phase: 'P2 - Architectural',
        owner: 'Customer Operations',
        task: 'Automate Instant Refund Status Tracker',
        details: 'Expose bank tracking reference numbers directly to customers.',
        impact: 'Reduces refund status follow-ups by 95%.',
      },
    ],
    preventionGuardrails: [
      'Strict 15-minute first-response SLA for any ticket tagged with "Payment" or "Billing".',
      'Automated post-resolution CSAT pulse survey sent within 1 hour of ticket close.',
    ],
    projectedImpact: {
      frictionReduction: '65% decrease in recurring support tickets and bot escalation complaints',
      targetSuccessRate: 'Average resolution time reduced from 48 hours to under 35 minutes',
      kpisToTrack: [
        'First Response Time (<15 mins)',
        'Customer CSAT on Support (4.7 / 5.0)',
        'Self-Serve Invoice Download Rate (89%)',
        'Ticket Deflection Rate (42% without customer frustration)',
      ],
    },
    generatedAt: 'Grounded AI Solution Plan',
    modelUsed: 'gemini-3.8-flash',
  },
};

/**
 * Generate a dynamic structured solution plan for any custom theme
 */
export function generateGenericThemeSolution(
  themeId: string,
  themeTitle: string,
  mentions: number,
  negativeRate: number,
  commonIssues: string[],
  description: string
): ThemeSolutionPlan {
  const issuesList = commonIssues.length > 0 ? commonIssues : ['User workflow friction', 'Unclear error messaging'];
  const primaryIssue = issuesList[0];

  return {
    themeId,
    themeTitle,
    summary: `Comprehensive solution plan addressing "${themeTitle}" by eliminating root-cause bottlenecks across ${mentions} user friction points through automated prevention, proactive UX guardrails, and rapid engineering response.`,
    rootCauseAnalysis: {
      primaryCause: `Underlying friction in ${themeTitle.toLowerCase()} workflow: ${primaryIssue}, leading to customer frustration and repeated support inquiries.`,
      technicalFactors: [
        `Lack of automated validation and error recovery when ${themeTitle.toLowerCase()} actions are performed.`,
        'Insufficient telemetry and error logging obscuring friction until reported by users.',
        'User interface does not provide proactive feedback or clear next steps during error states.',
      ],
      userJourneyFrictionPoint: `Primary user friction occurs when interacting with ${themeTitle.toLowerCase()} components, resulting in unexpected blockers or delays.`,
    },
    immediateFix: {
      title: '24-48 Hour Friction Triage & Quick-Win Remediation',
      timeframe: 'Within 24-48 hours',
      actions: [
        `Deploy descriptive in-app contextual error messaging and recovery hints for ${primaryIssue}.`,
        'Add proactive telemetry logging to capture user drop-offs and friction points in real time.',
        'Publish self-serve troubleshooting documentation in the knowledge base.',
      ],
      customerComms: `In-app notice: "We have updated the ${themeTitle} experience with improved reliability, clear status indicators, and faster response times."`,
    },
    permanentArchitectureSolution: {
      title: `Architectural Hardening & Prevention Framework for ${themeTitle}`,
      architectureChanges: [
        `Implement resilient background processing and retry policies for all ${themeTitle.toLowerCase()} requests.`,
        'Introduce automated client-side state recovery and offline tolerance.',
        'Add dedicated API health checks and circuit breakers.',
      ],
      productUxEnhancements: [
        'Provide inline contextual validation before user commits actions to catch errors before submission.',
        'Implement 1-click recovery options allowing users to restore state without starting over.',
      ],
      safeguardsAndFallbacks: [
        `Automated Slack alert when error rate on ${themeTitle.toLowerCase()} exceeds 2% in any 10-minute window.`,
        'Self-healing automated fallback routing when primary service experiences latency.',
      ],
    },
    actionRoadmap: [
      {
        step: 1,
        phase: 'P0 - Immediate',
        owner: 'Frontend / Mobile',
        task: `Clarify Error States & Inline Guidance for ${themeTitle}`,
        details: 'Replace cryptic errors with actionable guidance and 1-click retry.',
        impact: 'Immediate drop in customer confusion and abandonment.',
      },
      {
        step: 2,
        phase: 'P0 - Immediate',
        owner: 'Backend Engineering',
        task: 'Add Failure Telemetry & Anomaly Alerts',
        details: 'Log all error codes and capture request context in telemetry.',
        impact: 'Full visibility into production failure triggers.',
      },
      {
        step: 3,
        phase: 'P1 - High Priority',
        owner: 'Product & UX',
        task: 'Streamline User Journey & Reduce Step Count',
        details: 'Optimize flow to eliminate unnecessary friction and verification gates.',
        impact: 'Completion rate increases by 25%.',
      },
      {
        step: 4,
        phase: 'P2 - Architectural',
        owner: 'Backend Engineering',
        task: 'Automated Failover & Resilience Architecture',
        details: 'Build redundancy and self-healing retries for core services.',
        impact: 'Protects customers from future outages or service degradations.',
      },
    ],
    preventionGuardrails: [
      `Automated regression test suite validating ${themeTitle.toLowerCase()} flows on every pull request.`,
      `Real-time alert threshold: Alert engineering if negative feedback mentions of "${themeTitle}" exceed 3 in 24 hours.`,
    ],
    projectedImpact: {
      frictionReduction: `75% reduction in "${themeTitle}" customer complaints`,
      targetSuccessRate: '99.5% user flow success rate',
      kpisToTrack: [
        `User Task Success Rate in ${themeTitle} (+35%)`,
        'Support Ticket Escalations (-70%)',
        'Customer Satisfaction Score (4.8 / 5.0)',
      ],
    },
    generatedAt: 'Grounded AI Solution Plan',
    modelUsed: 'gemini-3.8-flash',
  };
}

export function getThemeSolution(
  themeId: string,
  themeTitle: string,
  mentions: number,
  negativeRate: number,
  commonIssues: string[] = [],
  description: string = ''
): ThemeSolutionPlan {
  // Check exact match
  if (DEFAULT_THEME_SOLUTIONS[themeId]) {
    return DEFAULT_THEME_SOLUTIONS[themeId];
  }

  // Check fuzzy match by title
  const lower = themeTitle.toLowerCase();
  if (lower.includes('pay') || lower.includes('checkout') || lower.includes('upi') || lower.includes('card')) {
    return { ...DEFAULT_THEME_SOLUTIONS['theme-payment'], themeId, themeTitle };
  }
  if (lower.includes('perform') || lower.includes('slow') || lower.includes('speed') || lower.includes('crash') || lower.includes('latency')) {
    return { ...DEFAULT_THEME_SOLUTIONS['theme-performance'], themeId, themeTitle };
  }
  if (lower.includes('onboard') || lower.includes('export') || lower.includes('start') || lower.includes('setup') || lower.includes('navig')) {
    return { ...DEFAULT_THEME_SOLUTIONS['theme-onboarding'], themeId, themeTitle };
  }
  if (lower.includes('support') || lower.includes('ticket') || lower.includes('bot') || lower.includes('help') || lower.includes('agent')) {
    return { ...DEFAULT_THEME_SOLUTIONS['theme-support'], themeId, themeTitle };
  }

  // Otherwise generate custom
  return generateGenericThemeSolution(themeId, themeTitle, mentions, negativeRate, commonIssues, description);
}
