import { PrismaClient, Server as PrismaServer, Message as PrismaMessage, Conversation } from '@prisma/client';
import { Message } from '../types';
import { Client, Guild, Snowflake } from 'discord.js';

const prisma = new PrismaClient();

export async function getServerSettings(serverId: string): Promise<PrismaServer | null> {
  return prisma.server.findUnique({ where: { serverId } });
}

export async function updateServerSettings(serverId: string, settings: Partial<PrismaServer>): Promise<PrismaServer> {
  return prisma.server.upsert({
    where: { serverId },
    update: settings,
    create: {
      serverId,
      ...settings,
      serverName: settings.serverName || 'Unknown Server',
      apiName: settings.apiName || 'default',
      apiKey: settings.apiKey || '',
      modelName: settings.modelName || 'default',
      systemPrompt: settings.systemPrompt || '',
      serverContext: settings.serverContext || '',
      whitelistedChannels: settings.whitelistedChannels || '',
    },
  });
}

export async function handleNewMessage(
  client: Client,
  serverId: string,
  authorId: string,
  username: string,
  messageId: string,
  content: string,
  channelId: string,
  referencedMessageId: string | null = null
): Promise<Message> {
  // Replace mentions with actual usernames


  let conversationId: string;
  if (referencedMessageId) {
    const referencedMessage = await prisma.message.findUnique({
      where: { discordMessageId: referencedMessageId },
      include: { conversation: true }
    });
    if (referencedMessage) {
      conversationId = referencedMessage.conversation.id;
    } else {
      // If referenced message not found, create a new conversation
      const newConversation = await prisma.conversation.create({
        data: { serverId, channelId }
      });
      conversationId = newConversation.id;
    }
  } else {
    // New conversation
    const newConversation = await prisma.conversation.create({
      data: { serverId, channelId }
    });
    conversationId = newConversation.id;
  }

  const newMessage = await prisma.message.create({
    data: {
      conversationId,
      from: 'human',
      username,
      discordAuthorId: authorId,
      content,
      discordMessageId: messageId
    }
  });

  return {
    from: newMessage.from as 'human' | 'assistant',
    username: newMessage.username,
    content: newMessage.content
  };
}

export async function handleAiResponse(
  serverId: string,
  messageId: string,
  content: string,
  referencedMessageId: string
): Promise<Message> {
  try {
    const referencedMessage = await prisma.message.findUnique({
      where: { discordMessageId: referencedMessageId },
      include: { conversation: true }
    });

    if (!referencedMessage) {
      throw new Error(`Referenced message not found: ${referencedMessageId}`);
    }

    const newMessage = await prisma.message.create({
      data: {
        conversationId: referencedMessage.conversation.id,
        from: 'assistant',
        username: 'Audrey',
        content,
        discordMessageId: messageId
      }
    });

    return {
      from: newMessage.from as 'human' | 'assistant',
      username: newMessage.username,
      content: newMessage.content
    };
  } catch (error) {
    console.error(`Error in handleAiResponse: ${error}`);
    throw error;
  }
}

export async function getConversationContext(messageId: string): Promise<Message[]> {
  const message = await prisma.message.findUnique({
    where: { discordMessageId: messageId },
    include: { conversation: true }
  });

  if (!message) {
    throw new Error(`Message not found: ${messageId}`);
  }

  const conversationMessages = await prisma.message.findMany({
    where: { conversationId: message.conversation.id },
    orderBy: { createdAt: 'asc' },
  });

  return conversationMessages.map(msg => ({
    from: msg.from as 'human' | 'assistant',
    username: msg.username,
    content: msg.content
  }));
}