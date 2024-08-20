import BaseApi from './baseApi';
import { Message, ApiOptions, ApiResponse, ChannelContext } from '../types';

class KoboldCppChatApi extends BaseApi {
  constructor(baseUrl: string, apiKey: string = '') {
    super('koboldcpp', baseUrl, apiKey);
  }

  async generate(model: string, messages: Message[], systemPrompt: string, channelContext: ChannelContext, options: ApiOptions = {}): Promise<ApiResponse> {
    const enhancedSystemPrompt = this.preprocessSystemMessage(systemPrompt, messages, channelContext);
    const lastMessage = messages[messages.length - 1];
    return this._generateInternal(model, lastMessage.content, enhancedSystemPrompt, messages, channelContext.senderUsername, options);
  }

  protected async _generateInternal(
    model: string,
    prompt: string,
    system: string,
    conversationHistory: Message[],
    senderUsername: string,
    options: ApiOptions = {}
  ): Promise<ApiResponse> {
    console.log(conversationHistory);
  
    try {
      const messages = [
        { role: "system", content: system },
        ...conversationHistory.map(msg => ({
          role: msg.from === "human" ? "user" : "assistant",
          content: `${msg.username}:${msg.content}`
        })),
        { role: "user", content: `${senderUsername}:${prompt}` }
      ];
  
      const response = await this.client.post('/v1/chat/completions', {
        messages: messages,
        max_context_length: options.max_ctx,
        max_tokens: options.max_length || 500,
        temperature: options.temperature,
        stream: false,
        top_p: options.top_p,
        stop: [`${senderUsername}:`]
      });
  
      if (!response.data || !response.data.choices || response.data.choices.length === 0) {
        throw new Error('Invalid response from KoboldCPP API');
      }
      
      const generatedText = response.data.choices[0].message.content.trim();

      const removeAudreyPrefix = (text: string) => text.replace(/^Audrey:\s*/i, '');

      return {
        content: removeAudreyPrefix(generatedText),
        usage: {
          prompt_tokens: response.data.usage.prompt_tokens,
          completion_tokens: response.data.usage.completion_tokens,
          total_tokens: response.data.usage.total_tokens
        }
      };
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

export default KoboldCppChatApi;