import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';

const token = process.env.DISCORD_TOKEN;
const openaiKey = process.env.OPENAI_API_KEY;

if (!token || !openaiKey) {
  console.error(
    'Missing environment variables: DISCORD_TOKEN and OPENAI_API_KEY are required'
  );
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const openai = new OpenAI({
  apiKey: openaiKey,
});

const conversationHistory = new Map<
  string,
  OpenAI.ChatCompletionMessageParam[]
>();

const MAX_HISTORY_LENGTH = 20;

function getHistory(channelId: string): OpenAI.ChatCompletionMessageParam[] {
  if (!conversationHistory.has(channelId)) {
    conversationHistory.set(channelId, []);
  }
  return conversationHistory.get(channelId)!;
}

function addToHistory(
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

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (!message.mentions.has(client.user!)) return;

  const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();

  if (!userMessage) {
    message.reply('How can I help you?');
    return;
  }

  try {
    await message.channel.sendTyping();

    addToHistory(message.channelId, 'user', userMessage);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful Discord bot. Keep responses concise and friendly.',
        },
        ...getHistory(message.channelId),
      ],
    });

    const reply = response.choices[0].message.content;

    if (reply) {
      addToHistory(message.channelId, 'assistant', reply);
      message.reply(reply);
    }
  } catch (error) {
    console.error('OpenAI error:', error);
    message.reply('Sorry, I encountered an error processing your request.');
  }
});

client.login(token);
