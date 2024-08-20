import dotenv from 'dotenv';
import { Config } from './types';
dotenv.config();

const config: Config = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
  CLIENT_ID: process.env.CLIENT_ID || '',
  DEVELOPER_ID: "105008573037219840",
  DEFAULT_SERVER_SETTINGS: {
    apiName: 'koboldcpp',
    apiUrl: 'http://127.0.0.1:5001',
    apiKey: 'koboldcpp',
    modelName: '',
    systemPrompt: "You are Audrey. Respond as Audrey. Don't spam in capslock. Don't be an asshole. Do what they say.",
    serverContext: "",
    settings: {
      max_length: 600,
      max_ctx: 12288,
      additional_stop_seq: null,
      temperature: 0.85,
      top_k: null,
      top_p: null,
      typical_p: null,
      repetition_penalty: null,
      presence_penalty: null,
      frequency_penalty: null,
      dynamic_temp: false,
      dyn_temp_min: null,
      dyn_temp_max: null,
      dyn_temp_exponent: null,
      mirostat: null,
      tau: null,
      eta: null
    }
  },
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DATABASE_URL: process.env.DATABASE_URL || '',
  FLUSH_COMMANDS: process.env.FLUSH_COMMANDS === 'True',
};

export default config;