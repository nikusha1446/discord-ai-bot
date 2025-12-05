import 'dotenv/config';

const token = process.env.DISCORD_TOKEN;
const openaiKey = process.env.OPENAI_API_KEY;

if (!token || !openaiKey) {
  console.error(
    'Missing environment variables: DISCORD_TOKEN and OPENAI_API_KEY are required'
  );
  process.exit(1);
}

export const config = {
  discordToken: token,
  openaiKey: openaiKey,
};
