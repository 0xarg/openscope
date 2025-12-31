import OpenAI from "openai";

/**
 * Lazily creates OpenAI client at runtime
 * Safe for CI builds (no env access at build time)
 */
export function getOpenAI() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  return new OpenAI({ apiKey });
}
