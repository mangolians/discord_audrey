import axios, { AxiosInstance } from 'axios';
import logger from '../utils/logger';
import { ChannelContext } from '../utils/messagePreprocessor';
import { Message, ApiOptions, ApiResponse } from '../utils/apiFactory';

abstract class BaseApi {
  protected apiType: string;
  protected baseUrl: string;
  protected apiKey: string;
  protected client: AxiosInstance;

  constructor(apiType: string, baseUrl: string, apiKey: string = '') {
    this.apiType = apiType;
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: this.apiKey ? { 'Authorization': `Bearer ${this.apiKey}` } : {}
    });
  }

  abstract generate(model: string, messages: Message[], systemPrompt: string, channelContext: ChannelContext, options: ApiOptions): Promise<ApiResponse>;

  protected preprocessSystemMessage(systemPrompt: string, messages: Message[], channelContext: ChannelContext): string {
    const { channelName, serverName, serverContext, currentDate, timeZone } = channelContext;

    const currentTimeString = currentDate.toLocaleTimeString('de-DE', { timeZone });
    const currentDateString = currentDate.toLocaleDateString('de-DE', { timeZone });

    return `
${systemPrompt}

<channel_context>
<channel_name>${channelName}</channel_name>
<server_name>${serverName}</server_name>
<server_context>${serverContext}</server_context>
</channel_context>

<current_date>The current time is ${currentTimeString}.
Your time zone is ${timeZone}. The current date is: ${currentDateString}</current_date>
    `.trim();
  }

  protected async _generateInternal(model: string, prompt: string, system: string, conversationHistory: Message[], senderUsername: string, options: ApiOptions): Promise<ApiResponse> {
    throw new Error('Method not implemented');
  }

  protected handleApiError(error: any): never {
    logger.error(`${this.apiType} API Error:`, error.response?.data || error.message);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
}

export default BaseApi;