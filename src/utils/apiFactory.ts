import OpenAICompatibleApi from '../api/openaiCompatible';
import KoboldCppApi from '../api/koboldCppApi';
//import OllamaApi from '../api/ollamaApi';
import { ChannelContext } from '../utils/messagePreprocessor';

export interface Message {
  from: 'human' | 'assistant';
  username: string;
  content: string;
}

export interface ApiOptions {
  max_length?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  [key: string]: any;
}

export interface ApiResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ApiClient {
  generate: (
    model: string,
    messages: Message[],
    systemPrompt: string,
    channelContext: ChannelContext,
    options: ApiOptions
  ) => Promise<ApiResponse>;
}

class ApiFactory {
  static createApi(apiName: string, apiUrl: string, apiKey: string): ApiClient {
    switch (apiName.toLowerCase()) {
      case 'openai':
        return new OpenAICompatibleApi(apiUrl, apiKey) as ApiClient;
      case 'koboldcpp':
        return new KoboldCppApi(apiUrl, apiKey) as ApiClient;
//      case 'ollama':
//        return new OllamaApi(apiUrl, apiKey) as ApiClient;
      default:
        throw new Error(`Unsupported API: ${apiName}`);
    }
  }
}

export default ApiFactory;