import BaseApi from './baseApi';
import logger from '../utils/logger';
import { Message, ApiOptions, ApiResponse, ApiClient } from '../utils/apiFactory';

class OllamaApi extends BaseApi {
  constructor(baseUrl: string, apiKey: string) {
    super('ollama', baseUrl);
  }

  protected async _generateInternal(model: string, prompt: string, system: string, conversationHistory: Message[], options: ApiOptions = {}): Promise<{ content: string }> {
    const url = `/api/generate`;
    
    let formatted_prompt = `${system}\n\n`;
    for (const msg of conversationHistory) {
      formatted_prompt += `${msg.from === 'assistant' ? 'Audrey' : msg.username}: ${msg.content}\n`;
    }
    formatted_prompt += `Human: ${prompt}\nAudrey:`;

    const data = {
      model: model,
      prompt: formatted_prompt,
      system: system,
      stream: false,
      options: {
        num_predict: options.max_length || 1024,
        num_ctx: options.max_ctx || 4096,
        top_k: options.top_k || 40,
        top_p: options.top_p || 0.9,
        repeat_penalty: options.repetition_penalty || 1.1,
        temperature: options.temperature || 0.7
      }
    };

    try {
      const response = await this.client.post(url, data);
      return { content: response.data.response };
    } catch (error) {
      console.error(`Error calling Ollama API:`, error);
      throw error;
    }
  }
}

export default OllamaApi;