import { SlashCommandBuilder, EmbedBuilder, CommandInteraction } from 'discord.js';
import DiscordBot from '../bot';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows available commands'),
  async execute(interaction: CommandInteraction, bot: DiscordBot): Promise<void> {
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Available Commands')
      .setDescription('Here are the available commands:')
      .addFields(
        { name: '/set-api', value: 'Set the API to use (Admin only)' },
        { name: '/set-model', value: 'Set the model to use (Admin only)' },
        { name: '/set-server-context', value: 'Set the server context (Admin only)' },
        { name: '/help', value: 'Show this help message' },
        { name: 'Other Stuff', value: 'Just type / and see what comes up smh' }
      );

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};