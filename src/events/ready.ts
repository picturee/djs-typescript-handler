import { ApplicationCommandDataResolvable } from 'discord.js';
import Client from '../structures/Client';
import Command from '../structures/Command';
import Event from '../structures/Event';

export default new Event('ready', async (client: Client) => {
    console.clear();
    console.log(`[INFORMATION] - Bot launched. Authorized as ${client.user.tag} | Servers: ${client.guilds.cache.size} | Users: ${client.users.cache.size}
        [INFORMATION] - Time: ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow'})}
        [INFORMATION] - RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
    await client.application?.commands.set(client.commands.map((command: Command) => command.structur.data as ApplicationCommandDataResolvable)); // Global application registration
    // await client.application?.commands.set(client.commands.map((command: Command) => command.structur.data as ApplicationCommandDataResolvable), '885570820066402314'); // Registration for a guild
    const catchs: string[] = ['unhandledRejection', 'uncaughtException', 'uncaughtExceptionMonitor'];
    catchs.forEach((error: string) => {
        process.on(error, function warnUnhandled(e): void {
            return console.error(`[antiCrash] :: ${e}`);
        });
    });
});