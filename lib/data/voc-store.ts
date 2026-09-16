export interface VoCFeedbackItem {
  id: string;
  customer: string;
  feedback: string;
  rating: number;
  date: string;
  source: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  customerTier?: 'enterprise' | 'mid_market' | 'smb';
  category?: string;
}

export interface CustomerProblem {
  id: string;
  title: string;
  mentions: number;
  severity: 'High' | 'Medium' | 'Low';
  trend: string;
  negativeRate: string;
  confidence: string;
  whyItMatters: string;
  evidenceQuotes: string[];
  recommendedActions: string[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  problem: string;
  reach: number;
  impact: 'Very High' | 'High' | 'Medium' | 'Low';
  confidence: number;
  effort: 'XS' | 'S' | 'M' | 'L' | 'XL';
  riceScore: number;
  status: 'Prioritized' | 'Evaluating' | 'In Progress' | 'Backlog';
}

export interface PRDData {
  id: string;
  title: string;
  generatedDate: string;
  problem: string;
  targetUsers: string[];
  goal: string;
  proposedSolution: string;
  successMetrics: string[];
  userStories: string[];
  jiraTicketId?: string;
}

export const INITIAL_FEEDBACK_ITEMS: VoCFeedbackItem[] = [
  {
    id: 'fb-01',
    customer: 'Rahul',
    feedback: 'App is too slow during checkout, takes over 15 seconds to load payment options.',
    rating: 2,
    date: 'Sep 1',
    source: 'Google Play',
    sentiment: 'negative',
    customerTier: 'smb',
    category: 'Performance',
  },
  {
    id: 'fb-02',
    customer: 'Priya',
    feedback: 'Checkout is confusing, can’t tell if discount code was applied or not.',
    rating: 2,
    date: 'Sep 2',
    source: 'App Store',
    sentiment: 'negative',
    customerTier: 'mid_market',
    category: 'Checkout',
  },
  {
    id: 'fb-03',
    customer: 'Amit',
    feedback: 'Love the dashboard, the data visualizations and automated reports save us hours every week!',
    rating: 5,
    date: 'Sep 2',
    source: 'G2 Review',
    sentiment: 'positive',
    customerTier: 'enterprise',
    category: 'Reporting',
  },
  {
    id: 'fb-04',
    customer: 'Neha',
    feedback: 'Add UPI payment and localized wallet support for international orders.',
    rating: 3,
    date: 'Sep 3',
    source: 'Survey',
    sentiment: 'neutral',
    customerTier: 'smb',
    category: 'Payments',
  },
  {
    id: 'fb-05',
    customer: 'Michael Chang',
    feedback: 'Payment failed three times before my order went through. Extremely frustrating experience.',
    rating: 1,
    date: 'Sep 4',
    source: 'Zendesk',
    sentiment: 'negative',
    customerTier: 'enterprise',
    category: 'Payments',
  },
  {
    id: 'fb-06',
    customer: 'Sarah Jenkins',
    feedback: 'Payment corrupts my order. Money was debited from card but order status showed payment error.',
    rating: 1,
    date: 'Sep 4',
    source: 'Intercom',
    sentiment: 'negative',
    customerTier: 'mid_market',
    category: 'Payments',
  },
  {
    id: 'fb-07',
    customer: 'David Miller',
    feedback: 'Checkout keeps freezing on the 3D Secure verification step on Safari browser.',
    rating: 1,
    date: 'Sep 5',
    source: 'Zendesk',
    sentiment: 'negative',
    customerTier: 'smb',
    category: 'Checkout',
  },
  {
    id: 'fb-08',
    customer: 'Elena Rostova',
    feedback: 'Onboarding checklist was stuck at 80% and couldn’t be dismissed by team members.',
    rating: 2,
    date: 'Sep 5',
    source: 'Intercom',
    sentiment: 'negative',
    customerTier: 'enterprise',
    category: 'Onboarding',
  },
  {
    id: 'fb-09',
    customer: 'Marcus Vance',
    feedback: 'Need native Slack and HubSpot sync so our product squad gets alerts immediately.',
    rating: 3,
    date: 'Sep 6',
    source: 'Sales Call',
    sentiment: 'neutral',
    customerTier: 'enterprise',
    category: 'Integrations',
  },
  {
    id: 'fb-10',
    customer: 'Carlos Rivera',
    feedback: 'Incredible customer support response time and the automated sentiment tags are spot on.',
    rating: 5,
    date: 'Sep 6',
    source: 'G2 Review',
    sentiment: 'positive',
    customerTier: 'mid_market',
    category: 'Support',
  },
];

export const TOP_CUSTOMER_PROBLEMS: CustomerProblem[] = [
  {
    id: 'prob-payment-fail',
    title: 'Payment failures',
    mentions: 1245,
    severity: 'High',
    trend: '+31%',
    negativeRate: '78%',
    confidence: 'High confidence',
    whyItMatters:
      'Customers are experiencing frequent payment failures, leading to abandoned purchases and negative sentiment, particularly among high-value customers.',
    evidenceQuotes: [
      'Payment failed three times before my order went through.',
      'Payment corrupts my order.',
      'Checkout keeps freezing.',
      'Tried 3 different corporate credit cards and all returned generic error 500.',
      'Our team could not complete annual plan upgrade due to recurring payment timeout.',
    ],
    recommendedActions: [
      'Investigate payment failure rate by payment method and device.',
      'Analyze if issues are concentrated by region or time.',
      'Create an opportunity and PRD once validated.',
    ],
  },
  {
    id: 'prob-slow-checkout',
    title: 'Slow checkout',
    mentions: 934,
    severity: 'High',
    trend: '+24%',
    negativeRate: '71%',
    confidence: 'High confidence',
    whyItMatters:
      'Latency during cart calculation and shipping rate fetching causes mobile shoppers to bounce before final confirmation.',
    evidenceQuotes: [
      'Checkout takes 12+ seconds to respond after clicking Place Order.',
      'Spinning loading circle never finishes on mobile cellular connections.',
      'The price summary takes forever to recalculate when applying promotional codes.',
    ],
    recommendedActions: [
      'Profile checkout API microservices and cache static shipping tiers.',
      'Add optimistic UI progress indicators for multi-step checkout.',
      'A/B test single-page checkout flow.',
    ],
  },
  {
    id: 'prob-confusing-onboarding',
    title: 'Confusing onboarding',
    mentions: 721,
    severity: 'Medium',
    trend: '+12%',
    negativeRate: '58%',
    confidence: 'Medium confidence',
    whyItMatters:
      'New users report lack of clear guidance during initial workspace setup, leading to delayed time-to-value.',
    evidenceQuotes: [
      'Not clear what step I need to do next after inviting coworkers.',
      'The tutorial modal covers up the button it tells me to click.',
      'Would love pre-built industry templates instead of empty blank canvas.',
    ],
    recommendedActions: [
      'Redesign first-run onboarding checklist with clickable task states.',
      'Provide default template presets for B2B SaaS and E-commerce squads.',
      'Implement interactive product tours for first-time administrators.',
    ],
  },
  {
    id: 'prob-missing-integrations',
    title: 'Missing integrations',
    mentions: 612,
    severity: 'Medium',
    trend: '+9%',
    negativeRate: '52%',
    confidence: 'Medium confidence',
    whyItMatters:
      'Enterprise prospects require bi-directional sync with Jira, Linear, and Salesforce to replace existing fragmented spreadsheets.',
    evidenceQuotes: [
      'Can you please add Jira Cloud integration for one-click issue creation?',
      'We run everything through Slack channels; webhook notifications are essential.',
      'Currently exporting CSV manually every Monday to sync with our data warehouse.',
    ],
    recommendedActions: [
      'Prioritize Jira & Linear webhook integrations on public roadmap.',
      'Ship Zapier and Make.com connector for custom workflow triggers.',
      'Provide public REST API documentation for enterprise teams.',
    ],
  },
];

export const SENTIMENT_DATA = [
  { name: 'Positive', value: 42, color: '#10B981', count: '5,242 items' },
  { name: 'Neutral', value: 21, color: '#64748B', count: '2,621 items' },
  { name: 'Negative', value: 37, color: '#EF4444', count: '4,619 items' },
];

export const VOC_STATS = {
  feedbackTotal: '12,482',
  feedbackChange: '+12% from last 30 days',
  negativeRate: '34%',
  negativeChange: '-3% from last 30 days',
  themesTotal: '47',
  themesChange: '+8% from last 30 days',
  highPriority: '8',
  highPriorityChange: '+2 from last 30 days',
};

export const INITIAL_PRD: PRDData = {
  id: 'prd-payment-reliability',
  title: 'Checkout Payment Reliability & Failover',
  generatedDate: 'Generated from customer insights',
  problem: 'Customers frequently experience payment failures during checkout.',
  targetUsers: [
    'Existing customers attempting renewals and cart checkouts',
    'High-frequency purchasers on mobile and web',
    'Enterprise finance buyers executing high-value transactions',
  ],
  goal: 'Reduce checkout payment failures and improve conversion rate.',
  proposedSolution:
    'Improve payment flow reliability, add retry mechanism, and better error handling.',
  successMetrics: [
    'Payment success rate (target: >99.2%)',
    'Checkout conversion rate (+4.5% target)',
    'Payment failure rate (<0.8%)',
    'Decrease customer support payment dispute tickets by 60%',
  ],
  userStories: [
    'As a customer, I want my payment to go through on the first attempt.',
    'As a customer, I want clear error messages when payment fails.',
    'As a PM, I want real-time telemetry on payment gateway drop-offs.',
    'As an international shopper, I want automatic fallback to alternate payment processors when primary gateway is unreachable.',
  ],
  jiraTicketId: 'VOC-104',
};

export const INITIAL_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-01',
    title: 'Payment Reliability & Gateway Auto-Retry',
    problem: 'Customers experiencing 3D-secure freezes and duplicate card charges',
    reach: 1245,
    impact: 'Very High',
    confidence: 90,
    effort: 'M',
    riceScore: 92,
    status: 'Prioritized',
  },
  {
    id: 'opp-02',
    title: 'Streamlined One-Click Checkout Flow',
    problem: 'Cart calculation latency and multi-step drop-offs',
    reach: 934,
    impact: 'High',
    confidence: 85,
    effort: 'M',
    riceScore: 84,
    status: 'Evaluating',
  },
  {
    id: 'opp-03',
    title: 'Guided Interactive Onboarding Experience',
    problem: 'Users abandon workspace setup due to lack of role-specific templates',
    reach: 721,
    impact: 'High',
    confidence: 80,
    effort: 'S',
    riceScore: 78,
    status: 'Evaluating',
  },
  {
    id: 'opp-04',
    title: 'Native Jira & Slack Sync Integrations',
    problem: 'Manual copy-pasting of feedback into developer ticketing systems',
    reach: 612,
    impact: 'Medium',
    confidence: 85,
    effort: 'M',
    riceScore: 68,
    status: 'Backlog',
  },
];
