# Audrey - Multi-API Discord AI Assistant

# DOCS NOT UP TO DATE

Audrey is a versatile Discord bot that integrates with multiple AI APIs to provide intelligent conversation and assistance in your Discord server. It supports OpenAI, Anthropic's Claude, Ollama, and KoboldCpp APIs, allowing for flexible and powerful AI interactions.

## Features

- Multi-API support: OpenAI, Claude, Ollama, and KoboldCpp
- Per-server configuration for API, model, and settings
- Conversation memory and context management
- Slash command support for easy interaction and configuration
- Whitelist system for server and channel management
- Customizable system prompts and server contexts

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A Discord Bot Token
- API keys for OpenAI and/or Anthropic (if using those services)
- Ollama or KoboldCpp running locally or on a accessible server (if using those services)


# Installation Guide is not Completed

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/LumiWasTaken/discord_audrey.git
   cd discord_audrey
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your configuration:
   ```
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_client_id
   GUILD_ID=your_discord_guild_id
   OPENAI_API_KEY=your_openai_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   KOBOLDCPP_API_URL=http://localhost:5000
   OLLAMA_API_URL=http://localhost:11434
   DATABASE_URL=your_database_url
   ```

4. Set up the database:
   ```
   npx prisma migrate dev
   ```

5. Deploy slash commands:
   ```
   node src/utils/deploy-commands.js
   ```

## Usage

1. Start the bot:
   ```
   npm start
   ```

2. Invite the bot to your Discord server using the OAuth2 URL generated in the Discord Developer Portal.

3. Use slash commands to configure the bot for your server:
   - `/setapi`: Set the API and model for the bot to use
   - `/setsystemprompt`: Set the system prompt for the AI
   - `/setservercontext`: Set server-specific context for AI interactions

4. Interact with the bot by mentioning it or using the `/chat` command.

## Commands

- `/setapi`: Set the API and model for the bot
- `/chat`: Start a new conversation with the AI
- `/help`: Display available commands and usage information

## Configuration

The bot can be configured on a per-server basis. Each server can have its own:

- API (OpenAI, Claude, Ollama, or KoboldCpp)
- Model
- System prompt
- Server context
- API-specific settings (temperature, max tokens, etc.)

## Contributing

Don't contribute please, I'm not ready for this yet. I work a lot offline and this only acts as a backup

## Acknowledgements

- OpenAI for their OpenAI API
- Anthropic for the Claude API
- Ollama and KoboldCpp projects for local AI options
- Discord.js library for Discord integration