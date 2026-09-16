/**
 * OpenAI Client Interface & Foundation
 * Architecture stub for later parts (Part 2+).
 * NOTE: As per Part 1 requirements, no external OpenAI calls are made.
 */

export interface AIModelConfig {
  model: 'gpt-4o' | 'gpt-4o-mini' | 'o3-mini';
  temperature?: number;
  maxTokens?: number;
}

export const isOpenAIConfigured = Boolean(
  typeof process !== 'undefined' &&
  process.env?.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY !== 'your-openai-api-key'
);

export const DEFAULT_AI_CONFIG: AIModelConfig = {
  model: 'gpt-4o',
  temperature: 0.2,
  maxTokens: 2000,
};

/**
 * Placeholder client initialization helper to be populated in Part 2.
 */
export function getOpenAIConfig() {
  return {
    apiKeyConfigured: isOpenAIConfigured,
    defaultConfig: DEFAULT_AI_CONFIG,
  };
}
