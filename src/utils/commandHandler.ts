import { Collection, CommandInteraction } from 'discord.js';
import fs from 'fs';
import path from 'path';
import DiscordBot from '../bot';
import { Command } from '../types';

class CommandHandler {
  private bot: DiscordBot;
  private commands: Collection<string, Command>;

  constructor(bot: DiscordBot) {
    this.bot = bot;
    this.commands = new Collection();
    this.loadCommands();
  }

  private loadCommands(): void {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath) as Command;
      if ('data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command);
      } else {
        console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }

  async handleCommand(interaction: CommandInteraction): Promise<void> {
    const command = this.commands.get(interaction.commandName);

    if (!command) {
      console.warn(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction, this.bot);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}`);
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}

export default CommandHandler;