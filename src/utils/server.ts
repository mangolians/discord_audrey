import { updateServerSettings } from './databaseManager';
import ApiFactory from './apiFactory';
import config from '../config';
import { Message, ApiOptions, ApiResponse, ApiClient, ChannelContext, DbServerSettings } from '../types';

class Server implements DbServerSettings {
  id: string;
  serverId: string;
  serverName: string;
  apiName: string;
  apiUrl: string | null;
  apiKey: string;
  modelName: string;
  systemPrompt: string;
  serverContext: string;
  adminRoleId: string | null;
  whitelistedChannels: string;
  max_length!: number;
  max_ctx!: number;
  additional_stop_seq!: string;
  temperature!: number;
  top_k!: number;
  top_p!: number;
  typical_p!: number;
  repetition_penalty!: number;
  presence_penalty!: number;
  frequency_penalty!: number;
  dynamic_temp!: boolean;
  dyn_temp_min!: number;
  dyn_temp_max!: number;
  dyn_temp_exponent!: number;
  mirostat!: number;
  tau!: number;
  eta!: number;

  apiClient: ApiClient;

  constructor(serverData: Partial<DbServerSettings>) {
    Object.assign(this, config.DEFAULT_SERVER_SETTINGS, serverData);
    this.apiClient = ApiFactory.createApi(this.apiName, this.apiUrl || '', this.apiKey || '');
  }

  async updateSettings(newSettings: Partial<DbServerSettings>): Promise<void> {
    const updatedData = await updateServerSettings(this.serverId, newSettings);
    Object.assign(this, updatedData);

    if (newSettings.apiName || newSettings.apiUrl || newSettings.apiKey) {
      this.apiClient = ApiFactory.createApi(this.apiName, this.apiUrl || '', this.apiKey || '');
    }
  }

  async generateResponse(messages: Message[], channelContext: ChannelContext): Promise<ApiResponse> {
    const systemPrompt = this.getEnhancedSystemPrompt(channelContext.channelName);
    return this.apiClient.generate(
      this.modelName,
      messages,
      systemPrompt,
      channelContext,
      this.getSettings()
    );
  }

  getEnhancedSystemPrompt(channelName: string): string {
    return `
      ${this.systemPrompt}
      
      Server Name: ${this.serverName}
      Channel Name: ${channelName}
      ${this.serverContext}
    `.trim();
  }

  getSettings(): ApiOptions {
    return {
      max_length: this.max_length,
      max_ctx: this.max_ctx,
      additional_stop_seq: this.additional_stop_seq,
      temperature: this.temperature,
      top_k: this.top_k,
      top_p: this.top_p,
      typical_p: this.typical_p,
      repetition_penalty: this.repetition_penalty,
      presence_penalty: this.presence_penalty,
      frequency_penalty: this.frequency_penalty,
      dynamic_temp: this.dynamic_temp,
      dyn_temp_min: this.dyn_temp_min,
      dyn_temp_max: this.dyn_temp_max,
      dyn_temp_exponent: this.dyn_temp_exponent,
      mirostat: this.mirostat,
      tau: this.tau,
      eta: this.eta
    };
  }

  isChannelWhitelisted(channelId: string): boolean {
    if (!this.whitelistedChannels) return false;
    const whitelistedChannelIds = this.whitelistedChannels.split(',').map(id => id.trim());
    return whitelistedChannelIds.includes(channelId);
  }
}

export default Server;