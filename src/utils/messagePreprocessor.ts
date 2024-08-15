import { Message } from './apiFactory';

export interface ChannelContext {
  channelName: string;
  serverName: string;
  serverContext: string;
  currentDate: Date;
  timeZone: string;
  senderUsername: string;
}

function preprocessSystemMessage(peronaSystemMessage: string, databaseHistory: Message[], channelContext: ChannelContext): string {
  const {
    channelName,
    serverName,
    serverContext,
    currentDate,
    timeZone
  } = channelContext;

  const currentTimeString = currentDate.toLocaleTimeString('de-DE', { timeZone });
  const currentDateString = currentDate.toLocaleDateString('de-DE', { timeZone });

  const enhancedSystemMessage = `
${peronaSystemMessage}

<channel_context>
<channel_name>${channelName}</channel_name>
<server_name>${serverName}</server_name>
<server_context>${serverContext}</server_context>
</channel_context>

<current_date>The current time is ${currentTimeString}.
Your time zone is ${timeZone}. The current date is: ${currentDateString}</current_date>
  `.trim();

  return enhancedSystemMessage;
}

export { preprocessSystemMessage };