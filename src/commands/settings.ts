import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMemberRoleManager } from 'discord.js';
import { updateServerSettings, getServerSettings } from '../utils/databaseManager';
import DiscordBot from '../bot';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Update bot settings (Admin only)')
    .addIntegerOption(option =>
      option.setName('max_length')
      .setDescription('Maximum length of generated text')
      .setMinValue(256)
      .setMaxValue(1024))
    .addIntegerOption(option =>
      option.setName('max_ctx')
      .setDescription('Maximum context length')
      .setMinValue(2048)
      .setMaxValue(8192))
    .addStringOption(option =>
      option.setName('additional_stop_seq')
      .setDescription('Additional stop sequences (comma-separated)'))
    .addNumberOption(option =>
      option.setName('temperature')
      .setDescription('Temperature for text generation')
      .setMinValue(0)
      .setMaxValue(2))
    .addIntegerOption(option =>
      option.setName('top_k')
      .setDescription('Top-k sampling')
      .setMinValue(0))
    .addNumberOption(option =>
      option.setName('top_p')
      .setDescription('Top-p sampling')
      .setMinValue(0)
      .setMaxValue(1))
    .addNumberOption(option =>
      option.setName('typical_p')
      .setDescription('Typical-p sampling')
      .setMinValue(0)
      .setMaxValue(1))
    .addNumberOption(option =>
      option.setName('repetition_penalty')
      .setDescription('Repetition penalty')
      .setMinValue(1))
    .addNumberOption(option =>
      option.setName('presence_penalty')
      .setDescription('Presence penalty')
      .setMinValue(-2)
      .setMaxValue(2))
    .addNumberOption(option =>
      option.setName('frequency_penalty')
      .setDescription('Frequency penalty')
      .setMinValue(-2)
      .setMaxValue(2))
    .addBooleanOption(option =>
      option.setName('dynamic_temp')
      .setDescription('Enable dynamic temperature'))
    .addNumberOption(option =>
      option.setName('dyn_temp_min')
      .setDescription('Minimum dynamic temperature')
      .setMinValue(0)
      .setMaxValue(2))
    .addNumberOption(option =>
      option.setName('dyn_temp_max')
      .setDescription('Maximum dynamic temperature')
      .setMinValue(0)
      .setMaxValue(2))
    .addNumberOption(option =>
      option.setName('dyn_temp_exponent')
      .setDescription('Dynamic temperature exponent')
      .setMinValue(0))
    .addIntegerOption(option =>
      option.setName('mirostat')
      .setDescription('Mirostat sampling (0, 1, or 2)')
      .setMinValue(0)
      .setMaxValue(2))
    .addNumberOption(option =>
      option.setName('tau')
      .setDescription('Tau value for mirostat')
      .setMinValue(0))
    .addNumberOption(option =>
      option.setName('eta')
      .setDescription('Eta value for mirostat')
      .setMinValue(0)),
  async execute(interaction: CommandInteraction, bot: DiscordBot): Promise<void> {
    const server = await getServerSettings(interaction.guild!.id);
    if (!server) {
      await interaction.reply({
        content: 'This server is not in my database :(',
        ephemeral: true
      });
      return;
    }

    if (!interaction.member || !interaction.memberPermissions?.has('Administrator')) {
      await interaction.reply({
        content: 'This command can only be used by server admins.',
        ephemeral: true
      });
      return;
    }

    const settings: { [key: string]: any } = {};
    const options = interaction.options.data;

    for (const option of options) {
      settings[option.name] = option.value;
    }

    if (settings.additional_stop_seq) {
      settings.additional_stop_seq = settings.additional_stop_seq.split(',').map((seq: string) => seq.trim()).join(',');
    }

    try {
      await updateServerSettings(interaction.guild!.id, settings);

      console.log(`Settings updated for server ${interaction.guild!.name}`);

      await interaction.reply({
        content: 'Settings have been updated successfully.',
        ephemeral: true
      });
      return
    } catch (error) {
      console.error(`Error updating settings:`, error);
      await interaction.reply({
        content: 'An error occurred while updating the settings.',
        ephemeral: true
      });
      return
    }
  },
};