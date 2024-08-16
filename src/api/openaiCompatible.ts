import axios, { AxiosInstance } from 'axios';
import { Message, ApiOptions, ApiResponse, ApiClient } from '../types';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class OpenAICompatibleApi implements ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = 'https://api.openai.com/v1', apiKey: string = '') {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
    });
  }

  async generate(model: string, messages: Message[], systemPrompt: string, options: ApiOptions): Promise<ApiResponse> {
    const formattedMessages: OpenAIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.from === 'assistant' ? 'assistant' : 'user',
        content: `${msg.username}: ${msg.content}`
      })) as OpenAIMessage[]
    ];

    try {
      const response = await this.client.post('/chat/completions', {
        model: model,
        messages: formattedMessages,
        max_tokens: options.max_length,
        temperature: options.temperature,
        top_p: options.top_p,
        frequency_penalty: options.frequency_penalty,
        presence_penalty: options.presence_penalty
      });

      return {
        content: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('OpenAI Compatible API Error:', (error as any).response?.data || (error as Error).message);
      throw error;
    }
  }
}

export default OpenAICompatibleApi;