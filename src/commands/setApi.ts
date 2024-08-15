import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { updateServerSettings, getServerSettings } from '../utils/databaseManager';
import logger from '../utils/logger';
import DiscordBot from '../bot';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setapi')
    .setDescription('Set the API for the bot to use (Admin only)')
    .addStringOption(option => 
      option.setName('api')
        .setDescription('The API to use (ollama, koboldcpp, openai)')
        .setRequired(true)
        .addChoices(
          { name: 'Ollama', value: 'ollama' },
          { name: 'KoboldCpp', value: 'koboldcpp' },
          { name: 'OpenAI', value: 'openai' },
        ))
    .addStringOption(option => 
      option.setName('model')
        .setDescription('The model to use')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('url')
        .setDescription('The API URL (required for ollama and koboldcpp)')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('key')
        .setDescription('The API Key')
        .setRequired(false)),
    
  async execute(interaction: CommandInteraction, bot: DiscordBot): Promise<void> {
    const server = await getServerSettings(interaction.guild!.id);
    if (!server) {
      await interaction.reply({ content: 'This server is not in my database :(', ephemeral: true });
      return;
    }

    if (!interaction.memberPermissions?.has('Administrator')) {
      await interaction.reply({ content: 'This command can only be used by server admins.', ephemeral: true });
      return;
    }

    const apiName = interaction.options.get('api')?.value as string;
    const modelName = interaction.options.get('model')?.value as string;
    const apiUrl = interaction.options.get('url')?.value as string | undefined;
    const apiKey = interaction.options.get('key')?.value as string | undefined;

    if ((apiName === 'ollama' || apiName === 'koboldcpp') && !apiUrl) {
      await interaction.reply({ content: 'URL is required for Ollama and KoboldCpp APIs.', ephemeral: true });
      return;
    }

    try {
      await updateServerSettings(interaction.guild!.id, { apiName, modelName, apiUrl, apiKey });
      
      console.log(`API set to ${apiName} with model ${modelName} for server ${interaction.guild!.name}`);
      
      await interaction.reply({ content: `API set to ${apiName} with model ${modelName}.`, ephemeral: true });
    } catch (error) {
      console.error(`Error setting API:`, error);
      await interaction.reply({ content: 'An error occurred while setting the API.', ephemeral: true });
    }
  },
};