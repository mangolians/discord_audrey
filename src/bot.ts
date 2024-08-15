import { Client, GatewayIntentBits, Message, Interaction, CommandInteraction, Guild } from 'discord.js';
import CONFIG from "./config";
import ServerManager from './utils/serverManager';
import MessageHandler from './utils/messageHandler';
import CommandHandler from './utils/commandHandler';

class DiscordBot {
  private token: string;
  public client: Client;
  public serverManager: ServerManager;
  public messageHandler: MessageHandler;
  public commandHandler: CommandHandler;

  constructor(token: string) {
    this.token = token;
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.serverManager = new ServerManager();
    this.messageHandler = new MessageHandler(this);
    this.commandHandler = new CommandHandler(this);
  }

  async start(): Promise<void> {
    await this.registerEventHandlers();
    await this.client.login(this.token);
    console.log(`Logged in as ${this.client.user?.tag}!`);
    
    // Initialize servers after login
    await this.initializeServers();
  }

  async registerEventHandlers(): Promise<void> {
    this.client.on('messageCreate', async (message: Message) => {
      await this.messageHandler.handleMessage(message);
    });

    this.client.on('interactionCreate', async (interaction: Interaction) => {
      if (interaction.isCommand()) {
        await this.commandHandler.handleCommand(interaction as CommandInteraction);
      }
    });

    this.client.on('guildCreate', async (guild: Guild) => {
      await this.handleNewGuild(guild);
    });
  }

  async getServer(serverId: string) {
    return this.serverManager.getServer(serverId);
  }

  async initializeServers(): Promise<void> {
    const guilds = this.client.guilds.cache.map(guild => ({ id: guild.id, name: guild.name }));
    const guildMap = new Map(guilds.map(guild => [guild.id, { name: guild.name }]));
    await this.serverManager.initializeServers(guildMap);
    console.log(`Initialized ${guilds.length} servers`);
  }

  async handleNewGuild(guild: Guild): Promise<void> {
    await this.serverManager.addNewServer(guild.id, guild.name);
    console.log(`Bot joined a new server: ${guild.name} (${guild.id})`);
  }
}

const bot = new DiscordBot(CONFIG.DISCORD_TOKEN);

bot.start()
  .then(() => console.log('Bot started successfully'))
  .catch(error => console.error('Error starting bot:', error));

export default DiscordBot;