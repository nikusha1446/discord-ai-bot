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

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful Discord bot. Keep responses concise and friendly.',
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    const reply = response.choices[0].message.content;

    if (reply) {
      message.reply(reply);
    }
  } catch (error) {
    console.error('OpenAI error:', error);
    message.reply('Sorry, I encountered an error processing your request.');
  }
});

client.login(token);
