import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getServerSettings } from '../utils/databaseManager';
import DiscordBot from '../bot';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverstats')
    .setDescription('Display server statistics and settings'),
  async execute(interaction: CommandInteraction, bot: DiscordBot): Promise<void> {
    const server = await getServerSettings(interaction.guild!.id);
    if (!server) {
      await interaction.reply({ content: 'This server does not exist in my database :(', ephemeral: true });
      return
    }


    if (!interaction.memberPermissions?.has('Administrator')) {
      await interaction.reply({ content: 'This command can only be used by server admins.', ephemeral: true });
      return;
    }

    try {
      const whitelistedChannelIds = server.whitelistedChannels.split(',').filter(id => id.trim() !== '');
      const stats = {
        serverName: interaction.guild!.name,
        apiName: server.apiName,
        modelName: server.modelName,
        whitelistedChannels: whitelistedChannelIds.length,
      };

      const whitelistedChannelNames = whitelistedChannelIds.map(channelId => {
        const channel = interaction.guild!.channels.cache.get(channelId.trim());
        return channel ? channel.name : 'Unknown Channel';
      }).join(', ');

      const statsMessage = `
Server Stats for ${stats.serverName}:
API: ${stats.apiName}
Model: ${stats.modelName}
Whitelisted Channels: ${stats.whitelistedChannels} (${whitelistedChannelNames})

Settings:
${Object.entries(server).filter(([key, value]) => typeof value !== 'object' && key !== 'id' && key !== 'serverId' && key !== 'serverName' && key !== 'apiName' && key !== 'modelName' && key !== 'whitelistedChannels').map(([key, value]) => `${key}: ${value}`).join('\n')}

System Prompt:
${server.systemPrompt}

Server Context:
${server.serverContext || 'Not set'}
      `;

      console.log(`Server stats displayed for ${interaction.guild!.name}`);
      
      // Split the message if it's too long
      if (statsMessage.length > 2000) {
        const parts = statsMessage.match(/[\s\S]{1,2000}/g) || [];
        for (let i = 0; i < parts.length; i++) {
          if (i === 0) {
            await interaction.reply({ content: parts[i], ephemeral: true });
          } else {
            await interaction.followUp({ content: parts[i], ephemeral: true });
          }
        }
      } else {
        await interaction.reply({ content: statsMessage, ephemeral: true });
      }
    } catch (error) {
      console.error(`Error displaying server stats:`, error);
      await interaction.reply({ content: 'An error occurred while fetching server statistics.', ephemeral: true });
    }
  },
};