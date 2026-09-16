import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { getThemeSolution } from './lib/theme-solutions';

dotenv.config();

export interface AnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral';
  topic: string;
  feedbackType: 'Complaint' | 'Feature Request' | 'Praise' | 'Inquiry';
  painPoint: string;
}

// Fallback rule-based analyzer in case GEMINI_API_KEY is not configured
function ruleBasedAnalysis(text: string): AnalysisResult {
  const lower = text.toLowerCase();

  // 1. Sentiment
  let sentiment: 'Positive' | 'Negative' | 'Neutral' = 'Neutral';
  const positiveWords = ['love', 'great', 'awesome', 'good', 'improved', 'helpful', 'fast', 'clean', 'simple', 'straightforward', 'saves'];
  const negativeWords = ['fail', 'failed', 'crash', 'crashes', 'error', 'bug', 'drops', 'slow', 'struggle', 'struggled', 'issue', 'broken', 'hangs', 'terrible', 'frustrat'];

  const hasPos = positiveWords.some((w) => lower.includes(w));
  const hasNeg = negativeWords.some((w) => lower.includes(w));

  if (hasNeg && !hasPos) sentiment = 'Negative';
  else if (hasPos && !hasNeg) sentiment = 'Positive';
  else if (hasNeg && hasPos) sentiment = 'Negative'; // negative nuance takes precedence for PM actionability

  // 2. Feedback Type
  let feedbackType: 'Complaint' | 'Feature Request' | 'Praise' | 'Inquiry' = 'Complaint';
  if (lower.includes('would love') || lower.includes('please add') || lower.includes('need to') || lower.includes('we need') || lower.includes('feature') || lower.includes('wish')) {
    feedbackType = 'Feature Request';
  } else if (hasPos && !hasNeg) {
    feedbackType = 'Praise';
  } else if (lower.includes('how to') || lower.includes('why do') || lower.includes('question') || lower.includes('where is')) {
    feedbackType = 'Inquiry';
  } else {
    feedbackType = 'Complaint';
  }

  // 3. Topic
  let topic = 'General';
  if (lower.includes('payment') || lower.includes('checkout') || lower.includes('card') || lower.includes('purchase')) {
    topic = 'Payment';
  } else if (lower.includes('mobile') || lower.includes('app') || lower.includes('ios') || lower.includes('android')) {
    topic = 'Mobile App';
  } else if (lower.includes('login') || lower.includes('session') || lower.includes('password') || lower.includes('auth')) {
    topic = 'Authentication';
  } else if (lower.includes('export') || lower.includes('csv') || lower.includes('pdf') || lower.includes('download')) {
    topic = 'Export & Reports';
  } else if (lower.includes('bill') || lower.includes('invoice') || lower.includes('tax') || lower.includes('vat')) {
    topic = 'Billing';
  } else if (lower.includes('nav') || lower.includes('menu') || lower.includes('ui') || lower.includes('button') || lower.includes('screen')) {
    topic = 'Navigation & UI';
  } else if (lower.includes('notif') || lower.includes('email') || lower.includes('alert')) {
    topic = 'Notifications';
  } else if (lower.includes('onboard') || lower.includes('start') || lower.includes('setup')) {
    topic = 'Onboarding';
  } else if (lower.includes('slow') || lower.includes('speed') || lower.includes('hang') || lower.includes('load')) {
    topic = 'Performance';
  } else if (lower.includes('search') || lower.includes('filter')) {
    topic = 'Search & Filters';
  }

  // 4. Pain Point
  let painPoint = 'None';
  if (sentiment === 'Negative' || feedbackType === 'Complaint') {
    if (topic === 'Payment') painPoint = 'Payment failure or checkout friction';
    else if (topic === 'Mobile App') painPoint = 'Mobile instability or unexpected crashes';
    else if (topic === 'Authentication') painPoint = 'Frequent session dropouts or login difficulties';
    else if (topic === 'Export & Reports') painPoint = 'Slow or incomplete file exports';
    else if (topic === 'Billing') painPoint = 'Lack of itemized billing or tax details';
    else if (topic === 'Navigation & UI') painPoint = 'Confusing navigation or hard to access buttons';
    else if (topic === 'Performance') painPoint = 'Application latency and unresponsiveness';
    else {
      // Extract brief phrase from sentence
      painPoint = text.length > 50 ? text.slice(0, 50) + '...' : text;
    }
  } else if (feedbackType === 'Feature Request') {
    painPoint = `Missing capability: ${topic.toLowerCase()} functionality`;
  }

  return {
    sentiment,
    topic,
    feedbackType,
    painPoint,
  };
}

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Feature 2: AI Feedback Analysis endpoint
  app.post('/api/analyze-feedback', async (req, res) => {
    try {
      const { items } = req.body as { items: Array<{ id: string; text: string }> };

      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'items array is required' });
      }

      const client = getGeminiClient();

      if (!client) {
        // Safe graceful fallback when API key is not configured in local preview
        const results = items.map((item) => ({
          id: item.id,
          ...ruleBasedAnalysis(item.text),
        }));
        const analysisMap: Record<string, any> = {};
        results.forEach((r) => {
          analysisMap[r.id] = r;
        });
        return res.json({ results, analysisMap, model: 'heuristic-fallback' });
      }

      // Format prompt for Gemini 3.6 Flash
      const prompt = `You are a product management AI analyzing customer feedback.
For EVERY feedback item below, identify ONLY these 4 things:
1. "sentiment": Exactly one of ["Positive", "Negative", "Neutral"]
2. "topic": A concise 1-2 word topic (e.g., "Payment", "Mobile App", "Navigation", "Billing", "Reporting", "Performance", "Notifications", "Onboarding", "Search", "Usability")
3. "feedbackType": Exactly one of ["Complaint", "Feature Request", "Praise", "Inquiry"]
4. "painPoint": A concise summary of the specific friction or customer struggle (e.g., "Payment failure during checkout", "Mobile app crash on upload", "Export takes too long", or "None" if positive praise)

Feedback items to analyze:
${items.map((item, idx) => `[Item ${idx + 1}] (ID: ${item.id}): "${item.text}"`).join('\n')}

Respond with a JSON array where each object has:
{
  "id": "<matching item id>",
  "sentiment": "Positive" | "Negative" | "Neutral",
  "topic": "<1-2 words>",
  "feedbackType": "Complaint" | "Feature Request" | "Praise" | "Inquiry",
  "painPoint": "<concise summary of pain point or None>"
}
Return ONLY valid JSON. Do not include markdown codeblocks or extra text.`;

      let responseText = '[]';
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI request timeout')), 8000)
        );
        const apiPromise = client.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        responseText = response.text?.trim() || '[]';
      } catch (genError: any) {
        console.warn('Gemini 3.6 call failed, trying backup model:', genError?.message);
        try {
          const backupResponse = await client.models.generateContent({
            model: 'gemini-flash-latest',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });
          responseText = backupResponse.text?.trim() || '[]';
        } catch {
          // Will fall back to ruleBasedAnalysis below
          responseText = '[]';
        }
      }

      let parsedResults: any[] = [];
      try {
        parsedResults = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        try {
          parsedResults = JSON.parse(cleaned);
        } catch {
          parsedResults = [];
        }
      }

      // Map back to guarantee all items have a result
      const finalResults = items.map((item, idx) => {
        const found = parsedResults.find((r: any) => r.id === item.id) || parsedResults[idx];
        if (found && found.sentiment && found.topic && found.feedbackType && found.painPoint) {
          return {
            id: item.id,
            sentiment: found.sentiment,
            topic: found.topic,
            feedbackType: found.feedbackType,
            painPoint: found.painPoint,
          };
        }
        return {
          id: item.id,
          ...ruleBasedAnalysis(item.text),
        };
      });

      const analysisMap: Record<string, any> = {};
      finalResults.forEach((r) => {
        analysisMap[r.id] = r;
      });

      res.json({ results: finalResults, analysisMap, model: 'gemini-3.6-flash' });
    } catch (error: any) {
      console.error('Error during AI analysis:', error);
      // Resilient fallback so user flow never breaks
      const { items } = req.body as { items: Array<{ id: string; text: string }> };
      const fallbackResults = (items || []).map((item) => ({
        id: item.id,
        ...ruleBasedAnalysis(item.text),
      }));
      const analysisMap: Record<string, any> = {};
      fallbackResults.forEach((r) => {
        analysisMap[r.id] = r;
      });
      res.json({ results: fallbackResults, analysisMap, model: 'fallback', warning: error?.message });
    }
  });

  // Feature 4: AI Theme Solution & Prevention Analysis endpoint
  app.post('/api/theme-solution', async (req, res) => {
    try {
      const {
        themeId = 'theme-payment',
        themeTitle = 'Payment Problems',
        mentions = 437,
        negativeRate = 82,
        commonIssues = [],
        quotes = [],
        description = '',
      } = req.body || {};

      const client = getGeminiClient();

      if (!client) {
        // Immediate domain-grounded solution
        const solution = getThemeSolution(
          themeId,
          themeTitle,
          mentions,
          negativeRate,
          commonIssues,
          description
        );
        return res.json({ solution, source: 'grounded-engine' });
      }

      const issuesText = Array.isArray(commonIssues) && commonIssues.length > 0
        ? commonIssues.map((i: string) => `- ${i}`).join('\n')
        : '- Recurring user friction and complaint tickets';

      const quotesText = Array.isArray(quotes) && quotes.length > 0
        ? quotes.map((q: any) => `- "${q.quote}" (Source: ${q.source || 'Verified Feedback'})`).join('\n')
        : '- Customer complains about repeated blockers';

      const prompt = `You are a Principal Product Architect and Staff Systems Reliability Engineer.
A Product Manager is analyzing recurring customer complaints for the theme: "${themeTitle}".
Context & Evidence:
- Customer Mentions: ${mentions} customer signals
- Negative Sentiment: ${negativeRate}%
- Theme Summary: ${description || themeTitle}
- Top Common Issues Identified:
${issuesText}

- Real Customer Quotes:
${quotesText}

The user asks: "How can I improve all that problem so that the customer could not face the same problem? Give me the exact solution accordingly."

Provide an exhaustive, exact engineering and product resolution plan in strictly valid JSON:
{
  "themeId": "${themeId}",
  "themeTitle": "${themeTitle}",
  "summary": "<1-2 sentences stating the definitive technical & product breakthrough that eliminates this friction>",
  "rootCauseAnalysis": {
    "primaryCause": "<specific underlying technical or UX failure mechanism>",
    "technicalFactors": [
      "<technical reason 1 (e.g. timeout race condition, unindexed query, lack of idempotency)>",
      "<technical reason 2>",
      "<workflow or UI failure mechanism 3>"
    ],
    "userJourneyFrictionPoint": "<exact screen or step in customer journey where failure occurs>"
  },
  "immediateFix": {
    "title": "<24-48 Hour Emergency Triage>",
    "timeframe": "Within 24-48 hours",
    "actions": [
      "<action 1>",
      "<action 2>",
      "<action 3>"
    ],
    "customerComms": "<exact proactive message to display to affected customers to prevent frustration & churn>"
  },
  "permanentArchitectureSolution": {
    "title": "<Architectural Redesign & Permanent Prevention Plan>",
    "architectureChanges": [
      "<architectural design change 1>",
      "<architectural design change 2>",
      "<architectural design change 3>"
    ],
    "productUxEnhancements": [
      "<UX enhancement 1>",
      "<UX enhancement 2>"
    ],
    "safeguardsAndFallbacks": [
      "<automated safeguard or circuit breaker 1>",
      "<automated safeguard 2>"
    ]
  },
  "actionRoadmap": [
    {
      "step": 1,
      "phase": "P0 - Immediate",
      "owner": "Backend Engineering",
      "task": "<Action title>",
      "details": "<Technical execution detail>",
      "impact": "<Measurable outcome>"
    },
    {
      "step": 2,
      "phase": "P0 - Immediate",
      "owner": "Frontend / Mobile",
      "task": "<Action title>",
      "details": "<Technical execution detail>",
      "impact": "<Measurable outcome>"
    },
    {
      "step": 3,
      "phase": "P1 - High Priority",
      "owner": "Product & UX",
      "task": "<Action title>",
      "details": "<Technical execution detail>",
      "impact": "<Measurable outcome>"
    },
    {
      "step": 4,
      "phase": "P2 - Architectural",
      "owner": "Customer Operations",
      "task": "<Action title>",
      "details": "<Technical execution detail>",
      "impact": "<Measurable outcome>"
    }
  ],
  "preventionGuardrails": [
    "<metric or PagerDuty alert threshold to prevent regressions>",
    "<automated synthetic test or failover policy>",
    "<hard operational SLA>"
  ],
  "projectedImpact": {
    "frictionReduction": "<e.g., 85% reduction in recurring complaints>",
    "targetSuccessRate": "<e.g., 99.8% flow success rate>",
    "kpisToTrack": [
      "<Primary KPI>",
      "<Secondary KPI>",
      "<Customer CSAT Metric>"
    ]
  }
}
Return ONLY valid JSON. No markdown code blocks, no preamble, no postscript.`;

      let responseText = '';
      try {
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 9000)
        );
        const apiPromise = client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        responseText = response.text?.trim() || '';
      } catch (genErr: any) {
        console.warn('Gemini 3.8 flash call failed or timed out, trying backup model:', genErr?.message);
        try {
          const backupResponse = await client.models.generateContent({
            model: 'gemini-flash-latest',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
            },
          });
          responseText = backupResponse.text?.trim() || '';
        } catch (backupErr: any) {
          console.warn('Backup model also failed:', backupErr?.message);
        }
      }

      if (responseText) {
        try {
          const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleaned);
          if (parsed && parsed.rootCauseAnalysis && parsed.immediateFix && parsed.permanentArchitectureSolution) {
            parsed.generatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            parsed.modelUsed = 'gemini-3.8-flash';
            return res.json({ solution: parsed, source: 'gemini-3.8-flash' });
          }
        } catch (parseErr) {
          console.warn('Failed to parse Gemini solution JSON, using grounded engine:', parseErr);
        }
      }

      // Fallback to rich pre-engineered domain solution
      const solution = getThemeSolution(
        themeId,
        themeTitle,
        mentions,
        negativeRate,
        commonIssues,
        description
      );
      return res.json({ solution, source: 'grounded-engine' });
    } catch (error: any) {
      console.error('Error in /api/theme-solution:', error);
      const {
        themeId = 'theme-payment',
        themeTitle = 'Payment Problems',
        mentions = 437,
        negativeRate = 82,
        commonIssues = [],
        description = '',
      } = req.body || {};
      const solution = getThemeSolution(
        themeId,
        themeTitle,
        mentions,
        negativeRate,
        commonIssues,
        description
      );
      res.json({ solution, source: 'fallback', warning: error?.message });
    }
  });

  // Pipeline State representation
  const VOC_PIPELINE_DATA = {
    pipeline: [
      {
        step: 1,
        id: 'feedback',
        name: 'Customer Feedback',
        description: 'Multi-channel customer feedback ingested and normalized into unified stream',
        metrics: { totalSignals: 12482, channelsCount: 5 },
        channels: [
          { name: 'Zendesk', count: 4120, share: '33%' },
          { name: 'App Store', count: 2890, share: '23%' },
          { name: 'Google Play', count: 2410, share: '19%' },
          { name: 'G2 Reviews', count: 1840, share: '15%' },
          { name: 'Intercom', count: 1222, share: '10%' },
        ],
      },
      {
        step: 2,
        id: 'extraction',
        name: 'Extract Information',
        description: 'AI reads each feedback item and extracts 4 core dimensions: Sentiment, Topic, Type, and Pain Point',
        dimensions: [
          { name: 'Sentiment', values: ['Positive', 'Negative', 'Neutral'] },
          { name: 'Topic', values: ['Payment', 'Performance', 'Onboarding', 'Support', 'Integrations', 'Reporting'] },
          { name: 'Type', values: ['Complaint', 'Feature Request', 'Praise', 'Inquiry'] },
          { name: 'Pain Point', description: 'Extracted specific customer friction or struggle' },
        ],
        sampleExtractions: [
          {
            text: 'Payment failed three times before my order went through.',
            sentiment: 'Negative',
            topic: 'Payment',
            feedbackType: 'Complaint',
            painPoint: 'Payment failure during checkout',
          },
          {
            text: 'App takes over 15 seconds to load payment options on mobile.',
            sentiment: 'Negative',
            topic: 'Performance',
            feedbackType: 'Complaint',
            painPoint: 'Checkout loading latency and mobile freeze',
          },
          {
            text: 'Add automated weekly PDF export scheduling for team reports.',
            sentiment: 'Neutral',
            topic: 'Reporting',
            feedbackType: 'Feature Request',
            painPoint: 'Missing automated report scheduling capability',
          },
        ],
      },
      {
        step: 3,
        id: 'themes',
        name: 'Group Similar Feedback (Themes)',
        description: 'AI groups similar extracted feedback into high-level thematic clusters',
        items: [
          {
            id: 'theme-payment',
            title: 'Payment Problems',
            mentions: 437,
            negativeRate: 82,
            topPainPoints: ['Payment failure during checkout', 'UPI timeout', 'Money deducted without confirmation'],
          },
          {
            id: 'theme-performance',
            title: 'Slow App Performance',
            mentions: 312,
            negativeRate: 74,
            topPainPoints: ['4.2s startup lag', 'Media upload timeout', 'Freezes on older Android devices'],
          },
          {
            id: 'theme-onboarding',
            title: 'Difficult Onboarding',
            mentions: 185,
            negativeRate: 68,
            topPainPoints: ['Hidden export controls in sub-menus', 'Undismissible checklist modal'],
          },
          {
            id: 'theme-support',
            title: 'Customer Support Escalation',
            mentions: 143,
            negativeRate: 45,
            topPainPoints: ['Long ticket response wait times', 'Repetitive automated chatbot loops'],
          },
        ],
      },
      {
        step: 4,
        id: 'insights',
        name: 'Identify Important Problems (Insights)',
        description: 'AI synthesizes thematic clusters to identify critical problems and business impact',
        items: [
          {
            id: 'ins-payment',
            title: 'Frequent Checkout Payment Failures',
            severity: 'High',
            whyItMatters: 'Repeated payment failures cause direct cart abandonment, resulting in $184,000 ARR churn risk.',
            evidenceMentions: 437,
            negativeRate: '82%',
            sampleQuote: 'Payment failed three times before my order went through. Extremely frustrating.',
          },
          {
            id: 'ins-performance',
            title: 'Startup Latency & Media Upload Timeouts',
            severity: 'High',
            whyItMatters: 'Slow load times lead to 24% bounce rate on mobile cellular connections, putting $92,000 ARR at risk.',
            evidenceMentions: 312,
            negativeRate: '74%',
            sampleQuote: 'App takes over 15 seconds to load payment options on Android.',
          },
          {
            id: 'ins-onboarding',
            title: 'First-Week Workspace Setup Abandonment',
            severity: 'Medium',
            whyItMatters: 'New users cannot discover key export features, stalling team activation and delaying time-to-value.',
            evidenceMentions: 185,
            negativeRate: '68%',
            sampleQuote: 'Onboarding checklist was stuck at 80% and could not be dismissed.',
          },
        ],
      },
      {
        step: 5,
        id: 'opportunities',
        name: 'Calculate Priority (Opportunities)',
        description: 'AI prioritizes problems using Reach, Impact, Confidence, and Effort (RICE) scoring',
        formula: 'RICE = (Reach × Impact × Confidence) / Effort',
        items: [
          {
            id: 'opp-payment',
            title: 'Payment Reliability & Auto-Retry',
            priority: 'P0',
            riceScore: 92,
            reach: 437,
            impact: 'Very High (9)',
            confidence: '89%',
            effort: 'M (4)',
            arrAtRisk: '$184,000',
          },
          {
            id: 'opp-performance',
            title: 'App Performance & Startup Latency Fix',
            priority: 'P0',
            riceScore: 87,
            reach: 312,
            impact: 'High (8)',
            confidence: '92%',
            effort: 'M (3)',
            arrAtRisk: '$92,000',
          },
          {
            id: 'opp-onboarding',
            title: 'Interactive Onboarding & Visible Exports',
            priority: 'P1',
            riceScore: 79,
            reach: 185,
            impact: 'High (7)',
            confidence: '84%',
            effort: 'S (2)',
            arrAtRisk: '$45,000',
          },
          {
            id: 'opp-support',
            title: 'Human Support Escalation Trigger',
            priority: 'P2',
            riceScore: 64,
            reach: 143,
            impact: 'Medium (5)',
            confidence: '78%',
            effort: 'S (2)',
            arrAtRisk: '$22,000',
          },
          {
            id: 'opp-dark-mode',
            title: 'Dark Mode Theme Option',
            priority: 'P3',
            riceScore: 38,
            reach: 28,
            impact: 'Low (2)',
            confidence: '72%',
            effort: 'XS (1)',
            arrAtRisk: '$0',
          },
        ],
      },
      {
        step: 6,
        id: 'actions',
        name: 'Recommend Actions',
        description: 'AI generates concrete problem statements, suggested solutions, user stories, and measurable success metrics',
        items: [
          {
            id: 'act-payment',
            opportunityTitle: 'Payment Reliability',
            priority: 'P0',
            problem: 'Customers experience failed payments during checkout.',
            suggestedSolution: 'Improve payment retry and error handling with automated fallback gateway.',
            suggestedUserStory: 'As a customer, I want payment failures to be handled smoothly so that I can complete my purchase.',
            successMetrics: [
              'Payment success rate (>99.2%)',
              'Checkout conversion (+4.5%)',
              'Payment failure rate (<0.8%)',
            ],
            hasPRD: true,
            jiraTicket: 'VOC-104',
          },
          {
            id: 'act-performance',
            opportunityTitle: 'App Performance & Startup',
            priority: 'P0',
            problem: 'Customers experience high latency during checkout loading and media uploads.',
            suggestedSolution: 'Implement client-side media compression and cache static rate tables.',
            suggestedUserStory: 'As a mobile user, I want instant checkout loading so that I can complete orders without app freezes.',
            successMetrics: [
              'Checkout load time (<1.5s)',
              'App crash-free rate (>99.8%)',
              'Media upload latency (<800ms)',
            ],
            hasPRD: true,
            jiraTicket: 'VOC-105',
          },
          {
            id: 'act-onboarding',
            opportunityTitle: 'First-Week Onboarding',
            priority: 'P1',
            problem: 'New workspaces struggle to locate export controls and clear initial setup.',
            suggestedSolution: 'Expose export controls in the primary toolbar and add dismissible guidance.',
            suggestedUserStory: 'As a new user, I want quick access to export features so that I can share reports with my team immediately.',
            successMetrics: [
              'Onboarding task completion rate (>85%)',
              'Time-to-first-export (<5 min)',
              '14-day team retention (+18%)',
            ],
            hasPRD: true,
            jiraTicket: 'VOC-106',
          },
        ],
      },
      {
        step: 7,
        id: 'copilot',
        name: 'VoC Copilot',
        description: 'AI conversational agent sitting on top of the entire pipeline, letting PMs query any stage directly.',
      },
    ],
  };

  // Pipeline State Endpoint
  app.get('/api/pipeline', (req, res) => {
    res.json(VOC_PIPELINE_DATA);
  });

  // Run Pipeline on input feedback items
  app.post('/api/pipeline/run', async (req, res) => {
    try {
      const { items } = req.body as { items: Array<{ id: string; text: string; source?: string }> };
      const rawItems = Array.isArray(items) && items.length > 0 ? items : [
        { id: 'sample-1', text: 'Payment failed twice and money was debited from my account', source: 'Zendesk' },
        { id: 'sample-2', text: 'Checkout is too slow and takes 20 seconds to load', source: 'Google Play' },
        { id: 'sample-3', text: 'Great dashboard reports, love the automated export', source: 'G2' },
        { id: 'sample-4', text: 'Onboarding tutorial was stuck and blocked my screen', source: 'Intercom' },
      ];

      // Step 2: Extract Information (Sentiment, Topic, Type, Pain Point)
      const extracted = rawItems.map((item) => ({
        id: item.id,
        text: item.text,
        source: item.source || 'General',
        ...ruleBasedAnalysis(item.text),
      }));

      // Step 3: Group Similar Feedback -> Themes
      const themeMap = new Map<string, { mentions: number; negativeCount: number; quotes: string[] }>();
      extracted.forEach((item) => {
        const current = themeMap.get(item.topic) || { mentions: 0, negativeCount: 0, quotes: [] };
        current.mentions += 1;
        if (item.sentiment === 'Negative') current.negativeCount += 1;
        if (current.quotes.length < 3) current.quotes.push(item.text);
        themeMap.set(item.topic, current);
      });

      const themes = Array.from(themeMap.entries()).map(([topic, data], idx) => ({
        id: `theme-${idx + 1}`,
        title: `${topic} Experience`,
        mentions: data.mentions,
        negativeRate: Math.round((data.negativeCount / data.mentions) * 100),
        sampleQuotes: data.quotes,
      }));

      // Step 4: Identify Important Problems -> Insights
      const insights = themes
        .filter((t) => t.negativeRate >= 50 || t.mentions >= 2)
        .map((t, idx) => ({
          id: `ins-${idx + 1}`,
          title: `Friction in ${t.title}`,
          severity: t.negativeRate > 70 ? 'High' : 'Medium',
          whyItMatters: `High negative rate (${t.negativeRate}%) indicates significant customer dissatisfaction leading to churn.`,
          evidenceQuotes: t.sampleQuotes,
        }));

      // Step 5: Calculate Priority -> Opportunities (RICE)
      const opportunities = insights.map((ins, idx) => {
        const reach = (themes.find((t) => ins.title.includes(t.title))?.mentions || 1) * 100;
        const impact = ins.severity === 'High' ? 9 : 6;
        const confidence = 85;
        const effort = ins.severity === 'High' ? 4 : 2;
        const riceScore = Math.round((reach * impact * (confidence / 100)) / effort);
        const priority = riceScore > 80 ? 'P0' : riceScore > 60 ? 'P1' : 'P2';

        return {
          id: `opp-${idx + 1}`,
          title: ins.title,
          priority,
          riceScore,
          reach,
          impact: ins.severity === 'High' ? 'High' : 'Medium',
          confidence,
          effort: ins.severity === 'High' ? 'M' : 'S',
        };
      });

      // Step 6: Recommend Actions
      const actions = opportunities.map((opp, idx) => ({
        id: `act-${idx + 1}`,
        opportunityTitle: opp.title,
        priority: opp.priority,
        problem: `Customers struggle with ${opp.title.toLowerCase()}.`,
        suggestedSolution: `Implement automated diagnostics, retry workflows, and streamlined UX for ${opp.title}.`,
        suggestedUserStory: `As a customer, I want ${opp.title.toLowerCase()} to be frictionless so that I can achieve my goals seamlessly.`,
        successMetrics: ['Error rate reduction (>50%)', 'Customer satisfaction CSAT (>4.5/5)', 'Conversion uplift (+3%)'],
      }));

      res.json({
        success: true,
        pipelineRun: {
          extractedCount: extracted.length,
          themesCount: themes.length,
          insightsCount: insights.length,
          opportunitiesCount: opportunities.length,
          actionsCount: actions.length,
          results: {
            extracted,
            themes,
            insights,
            opportunities,
            actions,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Pipeline run failed' });
    }
  });

  // Rich semantic grounded fallback answering engine
  const getSemanticGroundedReply = (text: string): string => {
    const q = text.toLowerCase().trim();

    // 0. VoC Pipeline architecture questions
    if (
      q.includes('how does the ai work') ||
      q.includes('how the ai works') ||
      q.includes('backend do') ||
      q.includes('pipeline') ||
      q.includes('architecture') ||
      q.includes('workflow') ||
      q.includes('process') ||
      q.includes('how do you work')
    ) {
      return 'The VoC backend runs a 7-step pipeline: Customer Feedback → AI reads feedback & extracts information (Sentiment, Topic, Type, Pain Point) → Group similar feedback into Themes → Identify important problems into Insights → Calculate priority into Opportunities (RICE) → Recommend actions (Problem, Solution, User Story, Success Metrics) → Copilot on top to let you query any step.';
    }

    // 1. Off-topic queries
    if (
      q.includes('write code') ||
      q.includes('python') ||
      q.includes('capital of') ||
      q.includes('write a poem') ||
      q.includes('tell me a joke') ||
      q.includes('who is the president') ||
      q.includes('weather today') ||
      q.includes('recipe')
    ) {
      return 'I am focused solely on your customer feedback data. I can answer questions about customer complaints, feature requests, sentiment, themes, and product prioritization based on your 12,482 customer signals.';
    }

    // 2. Complaints / Problems / Frustrations
    if (
      q.includes('complaining about the most') ||
      q.includes('biggest complaint') ||
      q.includes('most complained') ||
      q.includes('top complaint') ||
      q.includes('what are customers complaining') ||
      q.includes('frustrat') ||
      q.includes('pain point') ||
      q.includes('unhappy')
    ) {
      return 'Payment reliability is the biggest complaint. It appears in 437 feedback items, with 82% of mentions being negative due to checkout timeouts, UPI failures, and money deducted without order confirmation.';
    }

    // 3. Prioritization / Roadmap / What to build first
    if (
      q.includes('what should we prioritize') ||
      q.includes('what to prioritize') ||
      q.includes('priority') ||
      q.includes('prioritize first') ||
      q.includes('what to build') ||
      q.includes('roadmap') ||
      q.includes('rice') ||
      q.includes('next sprint')
    ) {
      return 'Payment reliability should be prioritized first (P0, RICE score 92) because it has high frequency (437 mentions) and high customer impact with $184,000 ARR at churn risk. App Performance is second priority (P0, RICE score 87).';
    }

    // 4. Feature Requests / Customer Wishlist
    if (
      q.includes('what are customers asking for') ||
      q.includes('asking for') ||
      q.includes('feature requests') ||
      q.includes('top requests') ||
      q.includes('wishlist') ||
      q.includes('new feature')
    ) {
      return 'The most requested improvements are faster checkout with payment retry, better payment reliability, clearer onboarding walkthroughs, and automated CSV/PDF report scheduling.';
    }

    // 5. App Performance / Speed / Crashes
    if (
      q.includes('performance') ||
      q.includes('slow') ||
      q.includes('speed') ||
      q.includes('crash') ||
      q.includes('freeze') ||
      q.includes('latency') ||
      q.includes('lag')
    ) {
      return 'Slow app performance is the second biggest issue with 312 mentions (74% negative). Users highlight 4.2-second startup latency, freezes on older Android devices, and media upload timeouts.';
    }

    // 6. Payment / Billing / Checkout / ARR
    if (
      q.includes('payment') ||
      q.includes('checkout') ||
      q.includes('upi') ||
      q.includes('card') ||
      q.includes('stripe') ||
      q.includes('deduct') ||
      q.includes('arr') ||
      q.includes('revenue') ||
      q.includes('churn')
    ) {
      return 'Payment failures put approximately $184,000 in Annual Recurring Revenue at churn risk across 437 customer tickets. Core issues are gateway timeouts and lack of auto-retry fallback.';
    }

    // 7. Onboarding / Setup / Checklist
    if (
      q.includes('onboarding') ||
      q.includes('setup') ||
      q.includes('checklist') ||
      q.includes('getting started') ||
      q.includes('new user')
    ) {
      return 'Onboarding difficulties account for 185 mentions (68% negative). Customers struggle with hidden export controls tucked into nested sub-menus and an undismissible checklist blocking the screen.';
    }

    // 8. Customer Support / Helpdesk / Tickets
    if (
      q.includes('support') ||
      q.includes('ticket') ||
      q.includes('helpdesk') ||
      q.includes('agent') ||
      q.includes('zendesk') ||
      q.includes('intercom')
    ) {
      return 'Customer support inquiries total 143 mentions (45% negative). Customers report long response wait times on Zendesk and repetitive automated chatbot loops before reaching a live representative.';
    }

    // 9. Export / Reports / CSV / PDF
    if (
      q.includes('export') ||
      q.includes('csv') ||
      q.includes('pdf') ||
      q.includes('report') ||
      q.includes('download')
    ) {
      return 'Export capabilities have 86 mentions. Customers request one-click CSV/PDF report downloads and automated weekly email exports rather than having to manually filter data each time.';
    }

    // 10. Dark Mode
    if (q.includes('dark mode') || q.includes('theme') || q.includes('night mode')) {
      return 'Dark mode has 28 mentions with low frequency and low business impact. It is scored as a P3 (nice-to-have) candidate with a RICE score of 38.';
    }

    // 11. Sentiment / NPS / Overall Mood
    if (
      q.includes('sentiment') ||
      q.includes('nps') ||
      q.includes('happy') ||
      q.includes('satisfaction') ||
      q.includes('overall')
    ) {
      return 'Overall Net Sentiment is currently -14% across 12,482 customer feedback items. Negative sentiment is concentrated in Payments (82% negative) and App Latency (74% negative), while UI clarity has positive praise.';
    }

    // 12. Channels / Sources
    if (
      q.includes('channel') ||
      q.includes('source') ||
      q.includes('where') ||
      q.includes('play store') ||
      q.includes('app store') ||
      q.includes('g2')
    ) {
      return 'Feedback is ingested across 5 channels: Zendesk (4,120 tickets), App Store (2,890 reviews), Google Play (2,410 reviews), G2 (1,840 reviews), and Intercom (1,222 chats). Google Play has the lowest average rating (2.8/5).';
    }

    // 13. Default comprehensive PM summary
    return `Based on 12,482 analyzed customer signals, your top priority is Payment Reliability (437 mentions, 82% negative, P0), followed by Slow App Performance (312 mentions, P0) and Onboarding Friction (185 mentions, P1). Addressing Payment Reliability resolves $184,000 in ARR churn risk.`;
  };

  // Feature 7: VoC Copilot endpoint
  app.post('/api/copilot', async (req, res) => {
    try {
      const { message } = req.body as { message: string };
      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.json({ reply: getSemanticGroundedReply(message), source: 'grounded-engine' });
      }

      const prompt = `You are VoC Copilot, an expert AI assistant for Product Managers analyzing customer feedback.
CRITICAL INSTRUCTIONS:
1. Answer questions ONLY about customer feedback, complaints, requests, sentiment, and product opportunities.
2. If the user asks an unrelated topic (e.g. general coding, creative writing, trivia), politely state: "I am focused solely on your customer feedback data. I can answer questions about customer complaints, feature requests, sentiment, themes, and product prioritization based on your uploaded feedback."
3. Keep responses direct, actionable, and grounded (1-3 sentences maximum).

DATA GROUNDING:
- THE VOC BACKEND AI PIPELINE:
  1. Customer Feedback: 12,482 customer feedback records ingested across Zendesk, App Store, Google Play, G2, and Intercom.
  2. Extract Information: AI reads feedback and extracts 4 core dimensions: Sentiment (Positive/Negative/Neutral), Topic, Type (Complaint/Feature Request/Praise/Inquiry), and Pain Point (the specific friction).
  3. Group Similar Feedback into Themes: Clustered by similarity into themes like Payment Problems (437 mentions, 82% negative), Slow Performance (312 mentions, 74% negative), and Difficult Onboarding (185 mentions, 68% negative).
  4. Identify Important Problems into Insights: Analyzes severity and business impact (e.g. Checkout payment failures put $184,000 ARR at churn risk).
  5. Calculate Priority into Opportunities: RICE formula = (Reach × Impact × Confidence) / Effort. P0 = Payment Reliability (Score 92) and App Performance (Score 87), P1 = Onboarding (Score 79).
  6. Recommend Actions: Generates problem statements, suggested solutions (e.g. payment retry & error handling), user stories ("As a customer, I want..."), measurable success metrics (Payment success rate, checkout conversion), and PRD drafts.
  7. VoC Copilot: Sits on top of this entire pipeline to let the PM ask questions about any stage.

- Total Customer Signals: 12,482 records across 5 channels:
  * Zendesk: 4,120 tickets
  * App Store: 2,890 reviews (3.4 / 5 avg)
  * Google Play Store: 2,410 reviews (2.8 / 5 avg)
  * G2: 1,840 reviews (3.8 / 5 avg)
  * Intercom: 1,222 conversations
- Key Themes:
  * Payment Problems: 437 mentions, 82% negative. Root causes: payment failure during checkout, UPI timeout, money deducted without order confirmation, card gateway errors. $184,000 ARR at churn risk.
  * Slow App Performance: 312 mentions, 74% negative. Root causes: 4.2s startup lag, media upload timeout, freezes on older Android devices. $92,000 ARR at risk.
  * Difficult Onboarding: 185 mentions, 68% negative. Root causes: export button hidden in sub-menus, undismissible checklist blocking the screen. $45,000 ARR at risk.
  * Customer Support: 143 mentions, 45% negative. Root causes: long ticket response times, repetitive automated chatbot loops.
  * Dark Mode: 28 mentions, cosmetic request (Low frequency, Low impact, P3).
- Prioritization & RICE Matrix:
  * P0: Improve Payment Reliability (Reach: 437, Impact: 9, Confidence: 89%, Effort: 4, RICE Score: 92)
  * P0: Optimize App Performance (Reach: 312, Impact: 8, Confidence: 92%, Effort: 3, RICE Score: 87)
  * P1: Streamline Onboarding (Reach: 185, Impact: 7, Confidence: 84%, Effort: 2, RICE Score: 79)
  * P2: Customer Support Escalation (Reach: 143, Impact: 5, Confidence: 78%, Effort: 2, RICE Score: 64)
  * P3: Dark Mode (Reach: 28, Impact: 2, Confidence: 72%, Effort: 1, RICE Score: 38)
- Net Sentiment: -14% overall.

User Question: "${message}"`;

      let reply = '';
      try {
        // Fast timeout to ensure the user is never kept waiting
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 7000)
        );

        const apiPromise = client.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
        });

        const response: any = await Promise.race([apiPromise, timeoutPromise]);
        reply = response.text?.trim() || '';
      } catch (geminiError: any) {
        console.warn('Gemini 3.6 call failed or timed out, trying backup model:', geminiError?.message);
        try {
          const backupPromise = client.models.generateContent({
            model: 'gemini-flash-latest',
            contents: prompt,
          });
          const timeoutPromise2 = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Backup timeout')), 4000)
          );
          const backupResponse: any = await Promise.race([backupPromise, timeoutPromise2]);
          reply = backupResponse.text?.trim() || '';
        } catch (backupError: any) {
          console.warn('Backup model also unavailable, activating semantic engine:', backupError?.message);
        }
      }

      if (!reply) {
        reply = getSemanticGroundedReply(message);
      }

      res.json({ reply, source: reply ? 'voc-ai' : 'grounded-engine' });
    } catch (error: any) {
      console.error('Error in Copilot endpoint:', error);
      const { message } = req.body as { message: string };
      res.json({
        reply: getSemanticGroundedReply(message || ''),
        source: 'fallback',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
