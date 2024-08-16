import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { updateServerSettings, getServerSettings } from '../utils/databaseManager';
import DiscordBot from '../bot';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('whitelistchannel')
    .setDescription('Whitelist a channel for bot usage (Admin only)')
    .addChannelOption(option => 
      option.setName('channel')
        .setDescription('The channel to whitelist')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('remove')
        .setDescription('Remove the channel from whitelist instead of adding')
        .setRequired(false)),
  async execute(interaction: CommandInteraction, bot: DiscordBot): Promise<void> {
    const server = await getServerSettings(interaction.guild!.id);
    if (!server) {
      await interaction.reply({ content: 'This server is not in my database :(.', ephemeral: true });
      return;
    }

    if (!interaction.member || !interaction.memberPermissions?.has('Administrator')) {
      await interaction.reply({ content: 'This command can only be used by server admins.', ephemeral: true });
      return;
    }

    const channel = interaction.options.get('channel')!.channel!;
    const remove = interaction.options.get('remove')?.value as boolean || false;

    try {
      let whitelistedChannels = server.whitelistedChannels ? server.whitelistedChannels.split(',') : [];
      
      if (remove) {
        whitelistedChannels = whitelistedChannels.filter(id => id !== channel.id);
      } else if (!whitelistedChannels.includes(channel.id)) {
        whitelistedChannels.push(channel.id);
      }

      await updateServerSettings(interaction.guild!.id, { whitelistedChannels: whitelistedChannels.join(',') });
      
      console.log(`Channel ${channel.name} (${channel.id}) ${remove ? 'removed from' : 'added to'} whitelist in server ${interaction.guild!.name}`);
      
      await interaction.reply({ content: `Channel ${channel.name} has been ${remove ? 'removed from' : 'added to'} the whitelist.`, ephemeral: true });
      return;
    } catch (error) {
      console.error(`Error updating whitelisted channels:`, error);
      await interaction.reply({ content: 'An error occurred while updating the channel whitelist.', ephemeral: true });
      return;
    }
  },
};