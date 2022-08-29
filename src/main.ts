import DiscordClient from './structures/Client';
export const client: DiscordClient = new DiscordClient();
client.login(process.env.token);