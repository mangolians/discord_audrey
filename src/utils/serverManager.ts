import { getServerSettings, updateServerSettings } from './databaseManager';
import Server from './server';
import { ServerSettings } from './server';
import config from '../config';

class ServerManager {
  private servers: Map<string, Server>;

  constructor() {
    this.servers = new Map();
  }

  async getServer(serverId: string): Promise<Server | null> {
    if (!this.servers.has(serverId)) {
      const serverData = await getServerSettings(serverId);
      if (serverData) {
        const server = new Server(serverData);
        this.servers.set(serverId, server);
      } else {
        return null; // Server not found or not whitelisted
      }
    }
    return this.servers.get(serverId) || null;
  }

  async updateServerSettings(serverId: string, settings: Partial<ServerSettings>): Promise<void> {
    const server = await this.getServer(serverId);
    if (server) {
      await server.updateSettings(settings);
      this.servers.set(serverId, server);
    }
  }

  async addNewServer(serverId: string, serverName: string): Promise<void> {
    const existingServer = await this.getServer(serverId);
    if (!existingServer) {
      const newServerSettings: Partial<ServerSettings> = {
        serverId,
        serverName,
        apiName: config.DEFAULT_SERVER_SETTINGS.apiName,
        apiKey: config.DEFAULT_SERVER_SETTINGS.apiKey,
        modelName: config.DEFAULT_SERVER_SETTINGS.modelName,
        systemPrompt: config.DEFAULT_SERVER_SETTINGS.systemPrompt,
        serverContext: config.DEFAULT_SERVER_SETTINGS.serverContext,
        whitelistedChannels: '',
        ...config.DEFAULT_SERVER_SETTINGS.settings,
      };
      await updateServerSettings(serverId, newServerSettings);
      const newServer = new Server(newServerSettings);
      this.servers.set(serverId, newServer);
      console.log(`Added new server to database: ${serverName} (${serverId})`);
    }
  }

  async initializeServers(guilds: Map<string, { name: string }>): Promise<void> {
    for (const [serverId, guild] of guilds) {
      await this.addNewServer(serverId, guild.name);
    }
  }
}

export default ServerManager;