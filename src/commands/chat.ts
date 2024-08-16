import { SlashCommandBuilder } from '@discordjs/builders';
import { ChannelType, CommandInteraction } from 'discord.js';
import { getServerSettings, handleNewMessage, handleAiResponse } from '../utils/databaseManager';
import Server from '../utils/server';
import DiscordBot from '../bot';
import { Message, ChannelContext } from '../types';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Start a conversation with the bot')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Your message to the bot')
        .setRequired(true)),
  async execute(interaction: CommandInteraction, bot: DiscordBot): Promise<void> {
    if(interaction.channel?.type !== ChannelType.GuildText) {
      await interaction.reply({ content: 'This command can only be used in a server text channel.', ephemeral: true });
      return;
    }
    
    const serverData = await getServerSettings(interaction.guild!.id);
    if (!serverData) {
      await interaction.reply({ content: 'This Server does not exist in my database :(', ephemeral: true });
      return;
    }

    const server = new Server(serverData);

    if(!server.isChannelWhitelisted(interaction.channel.id)) {
      await interaction.reply({ content: 'This channel is not whitelisted you muppet.', ephemeral: true });
    }
    
    const prompt = interaction.options.get('message')?.value as string;
    if (prompt.length > 2000) {
      await interaction.reply({ content: 'Your message is too long. Please keep it under 2000 characters.', ephemeral: true });
      return;
    }

    await interaction.deferReply();

    try {
      const newMessage: Message = await handleNewMessage(
        interaction.client,
        server.id,
        interaction.user.id,
        interaction.user.username,
        interaction.id,
        prompt,
        interaction.channel.id
      );

      const channelContext: ChannelContext = {
        channelName: interaction.channel.name,
        serverName: interaction.guild!.name,
        senderUsername: interaction.user.username,
        serverContext: server.serverContext,
        currentDate: new Date(),
        timeZone: 'Europe/Berlin' // You might want to make this configurable
      };

      const response = await server.generateResponse([newMessage], channelContext);
      
      const botMessage = await interaction.editReply(response.content);
      
      await handleAiResponse(
        server.id,
        botMessage.id,
        response.content,
        interaction.id,
      );

      console.log(`Chat command executed by ${interaction.user.tag} in ${interaction.guild!.name}`);
    } catch (error) {
      console.error(`Error executing chat command: ${error}`);
      await interaction.editReply({ content: 'An error occurred while processing your request.' });
    }
  },
};