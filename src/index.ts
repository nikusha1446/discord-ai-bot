import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { addToHistory, clearHistory, getHistory } from './history.js';
import { openai } from './openai.js';
import { config } from './config.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  if (message.content === '!clear') {
    clearHistory(message.channelId);
    message.reply('Conversation history cleared!');
    return;
  }

  if (!message.mentions.has(client.user!)) return;

  const userMessage = message.content.replace(/<@!?\d+>/g, '').trim();

  if (!userMessage) {
    message.reply('How can I help you?');
    return;
  }

  try {
    await message.channel.sendTyping();

    const displayName = message.member?.displayName ?? message.author.username;
    addToHistory(message.channelId, 'user', `${displayName}: ${userMessage}`);

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

client.login(config.discordToken);
