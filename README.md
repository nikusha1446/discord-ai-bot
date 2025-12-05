# Discord AI Bot

A Discord bot powered by OpenAI's API, built with Node.js and TypeScript. Provides AI-generated responses in Discord channels.

## Features

- AI-powered responses using OpenAI's GPT-4o-mini
- Conversation history for context-aware replies
- Multi-user support with display names
- Typing indicator while generating responses

## Setup

### Prerequisites

- Node.js 18+
- Discord bot token
- OpenAI API key

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/nikusha1446/discord-ai-bot.git
   cd discord-ai-bot
```

2. Install dependencies:
```bash
   npm install
```

3. Create a `.env` file:
```
   DISCORD_TOKEN=your_discord_bot_token
   OPENAI_API_KEY=your_openai_api_key
```

4. Start the bot:
```bash
   npm run dev
```

## Usage

- **@AI Bot [message]** — Ask the bot a question
- **!clear** — Clear conversation history in the current channel

## Scripts

- `npm run dev` — Run in development mode with auto-reload
- `npm run build` — Compile TypeScript to JavaScript
- `npm run start` — Run compiled JavaScript (production)

## Project Structure
```
src/
├── index.ts    # Discord client and event handlers
├── config.ts   # Environment variables
├── openai.ts   # OpenAI client
└── history.ts  # Conversation history management
```

## License

ISC
