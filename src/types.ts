import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import DiscordBot from "./bot";

export interface Message {
    from: 'human' | 'assistant';
    username: string;
    content: string;
}

export interface ApiOptions {
    max_length ? : number;
    temperature ? : number;
    top_p ? : number;
    frequency_penalty ? : number;
    presence_penalty ? : number;
    [key: string]: any;
}

export interface ApiResponse {
    content: string;
    usage ? : {
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
    ) => Promise < ApiResponse > ;
}

interface ServerSettings {
    apiName: string;
    modelName: string;
    systemPrompt: string;
    serverContext: string;
    apiKey: string;
    settings: {
      max_length: number;
      max_ctx: number;
      additional_stop_seq: string;
      temperature: number;
      top_k: number;
      top_p: number;
      typical_p: number;
      repetition_penalty: number;
      presence_penalty: number;
      frequency_penalty: number;
      dynamic_temp: boolean;
      dyn_temp_min: number;
      dyn_temp_max: number;
      dyn_temp_exponent: number;
      mirostat: number;
      tau: number;
      eta: number;
    };
  }
  
  export interface Config {
    DISCORD_TOKEN: string;
    CLIENT_ID: string;
    DEVELOPER_ID: string;
    DEFAULT_API: string;
    DEFAULT_MODEL: string;
    KOBOLDCPP_API_URL: string;
    OLLAMA_API_URL: string;
    ANTHROPIC_API_KEY: string;
    DEFAULT_SERVER_SETTINGS: ServerSettings;
    LOG_LEVEL: string;
    DATABASE_URL: string;
    FLUSH_COMMANDS: boolean;
  }


  export interface DbServerSettings {
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
    max_length: number;
    max_ctx: number;
    additional_stop_seq: string;
    temperature: number;
    top_k: number;
    top_p: number;
    typical_p: number;
    repetition_penalty: number;
    presence_penalty: number;
    frequency_penalty: number;
    dynamic_temp: boolean;
    dyn_temp_min: number;
    dyn_temp_max: number;
    dyn_temp_exponent: number;
    mirostat: number;
    tau: number;
    eta: number;
  }

  export interface ChannelContext {
    channelName: string;
    serverName: string;
    serverContext: string;
    currentDate: Date;
    timeZone: string;
    senderUsername: string;
  }

  export interface Command {
    data: SlashCommandBuilder;
    execute: (interaction: CommandInteraction, bot: DiscordBot) => Promise<void>;
  }