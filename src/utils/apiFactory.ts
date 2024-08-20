import OpenAICompatibleApi from '../api/openaiCompatible';
import KoboldCppApi from '../api/koboldCppApi';
import KoboldCppChatApi from '../api/koboldCppChat';
import {  ApiClient } from '../types';

class ApiFactory {
  static createApi(apiName: string, apiUrl: string, apiKey: string): ApiClient {
    switch (apiName.toLowerCase()) {
      case 'openai':
        return new OpenAICompatibleApi(apiUrl, apiKey) as ApiClient;
      case 'koboldcpp':
        return new KoboldCppApi(apiUrl, apiKey) as ApiClient;
      case 'koboldcppchatapi':
        return new KoboldCppChatApi(apiUrl, apiKey) as ApiClient;
      default:
        throw new Error(`Unsupported API: ${apiName}`);
    }
  }
}

export default ApiFactory;