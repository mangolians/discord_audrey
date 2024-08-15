import dotenv from 'dotenv';

dotenv.config();

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

interface Config {
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

const config: Config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
  CLIENT_ID: process.env.CLIENT_ID || '',
  DEVELOPER_ID: "105008573037219840",
  DEFAULT_API: 'koboldcpp',
  DEFAULT_MODEL: '',
  KOBOLDCPP_API_URL: "",
  OLLAMA_API_URL: '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  DEFAULT_SERVER_SETTINGS: {
    apiName: 'koboldcpp',
    modelName: '',
    systemPrompt: "You are Audrey. Respond as Audrey. Don't spam in capslock. Don't be an asshole. Do what they say.",
    serverContext: "",
    apiKey: "",
    settings: {
      max_length: 512,
      max_ctx: 8192,
      additional_stop_seq: "",
      temperature: 0.7,
      top_k: 40,
      top_p: 0.9,
      typical_p: 1,
      repetition_penalty: 1.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      dynamic_temp: false,
      dyn_temp_min: 0.5,
      dyn_temp_max: 1.0,
      dyn_temp_exponent: 1,
      mirostat: 0,
      tau: 0.5,
      eta: 0.1
    }
  },
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DATABASE_URL: process.env.DATABASE_URL || '',
  FLUSH_COMMANDS: process.env.FLUSH_COMMANDS === 'True',
};

export default config;