import logger from "./logger"

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
import CONFIG from '../config.ts';

const commands = [];
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data && typeof command.data.toJSON === 'function') {
    commands.push(command.data.toJSON() as never);
  }
}

const rest = new REST({ version: '10' }).setToken(CONFIG.DISCORD_TOKEN);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

(async () => {
  try {
    await client.login(CONFIG.DISCORD_TOKEN);

    console.log('Started purging application (/) commands from all guilds.');

    // Purge commands from all guilds
    const guilds = await client.guilds.fetch();
    for (const [guildId, guild] of guilds) {
      try {
        await rest.put(
          Routes.applicationGuildCommands(CONFIG.CLIENT_ID, guildId),
          { body: [], }
        );
        console.log(`Successfully purged commands from guild: ${guild.name} (${guildId})`);
      } catch (error) {
        console.error(`Failed to purge commands from guild ${guild.name} (${guildId}):`, error);
      }
    }

    console.log('Finished purging commands from all guilds.');

    // Register global commands
    console.log('Started registering global application (/) commands.');

    await rest.put(
      Routes.applicationCommands(CONFIG.CLIENT_ID),
      { body: commands }
    );


    console.log('Successfully registered global application (/) commands.');
  } catch (error) {
    console.error('Error during command deployment:', error);
  } finally {
    client.destroy();
  }
})();