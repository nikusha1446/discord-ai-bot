import OpenAI from 'openai';

const MAX_HISTORY_LENGTH = 20;

const conversationHistory = new Map<
  string,
  OpenAI.ChatCompletionMessageParam[]
>();

export function getHistory(
  channelId: string
): OpenAI.ChatCompletionMessageParam[] {
  if (!conversationHistory.has(channelId)) {
    conversationHistory.set(channelId, []);
  }
  return conversationHistory.get(channelId)!;
}

export function addToHistory(
  channelId: string,
  role: 'user' | 'assistant',
  content: string
): void {
  const history = getHistory(channelId);
  history.push({ role, content });

  if (history.length > MAX_HISTORY_LENGTH) {
    history.splice(0, history.length - MAX_HISTORY_LENGTH);
  }
}

export function clearHistory(channelId: string): void {
  conversationHistory.delete(channelId);
}
