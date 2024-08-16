import BaseApi from './baseApi';
import { Message, ApiOptions, ApiResponse, ChannelContext } from '../types';

class KoboldCppApi extends BaseApi {
  constructor(baseUrl: string, apiKey: string = '') {
    super('koboldcpp', baseUrl, apiKey);
  }

  async generate(model: string, messages: Message[], systemPrompt: string, channelContext: ChannelContext, options: ApiOptions = {}): Promise<ApiResponse> {
    const enhancedSystemPrompt = this.preprocessSystemMessage(systemPrompt, messages, channelContext);
    const lastMessage = messages[messages.length - 1];
    return this._generateInternal(model, lastMessage.content, enhancedSystemPrompt, messages, channelContext.senderUsername, options);
  }

  protected async _generateInternal(model: string, prompt: string, system: string, conversationHistory: Message[], senderUsername: string, options: ApiOptions = {}): Promise<ApiResponse> {

    /*
    let formattedPrompt = `<|start_header_id|>system<|end_header_id|>\n\n${system}<|eot_id|>`;
    
    if(conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        const role = msg.from === 'assistant' ? 'assistant' : 'user';
        formattedPrompt += `<|start_header_id|>${role}<|end_header_id|>\n\n${msg.username}: ${msg.content}<|eot_id|>`;
      }
    }
    
    formattedPrompt += `<|start_header_id|>user<|end_header_id|>\n\n${username}:${prompt}<|eot_id|>`;
    formattedPrompt += `<|start_header_id|>assistant<|end_header_id|>\n\nAudrey:`;



    let formattedPrompt = `<s>`;

    if (system) {
      formattedPrompt += `[INST] ${system} [/INST]`;
    }
    
    if (conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        if (msg.from === 'assistant') {
          formattedPrompt += `Audrey:${msg.content}</s>`;
        } else {
          if(msg.content !== prompt) 
          formattedPrompt += `[INST]${msg.username}:${msg.content}[/INST]`;
        }
      }
    }
    
    // Add the final user prompt
    formattedPrompt += `[INST]${senderUsername}:${prompt}[/INST]\nAudrey:`;
    */

    let formattedPrompt = `<|im_start|>system\n${system}<|im_end|>\n`;

    if (conversationHistory.length > 0) {
      for (const msg of conversationHistory) {
        const role = msg.from === 'assistant' ? 'assistant' : 'user';
        if (role === 'assistant') {
          formattedPrompt += `<|im_start|>${role}\nAudrey:${msg.content}<|im_end|>\n`;
        } else {
          formattedPrompt += `<|im_start|>${role}\n${msg.username}:${msg.content}<|im_end|>\n`;
        }
      }
    }
    
    formattedPrompt += `<|im_start|>assistant\nAudrey:`;

    try {
      const response = await this.client.post('/api/v1/generate', {
        prompt: formattedPrompt,
        max_context_length: options.max_ctx,
        max_length: options.max_length,
        temperature: options.temperature,
        top_k: options.top_k,
        top_p: options.top_p,
        typical: options.typical_p,
        rep_pen: options.repetition_penalty,
        stop_sequence: options.additional_stop_seq ? options.additional_stop_seq.split(',') : undefined,
      });

      if (!response.data || !response.data.results || response.data.results.length === 0) {
        throw new Error('Invalid response from KoboldCPP API');
      }

      const generatedText = response.data.results[0].text.trim();
      const promptTokens = formattedPrompt.length;
      const completionTokens = generatedText.length;

      return {
        content: generatedText,
        usage: { 
          prompt_tokens: promptTokens,
          completion_tokens: completionTokens,
          total_tokens: promptTokens + completionTokens
        }
      };
    } catch (error) {
      return this.handleApiError(error);
    }
  }
}

export default KoboldCppApi;