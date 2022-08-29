import Client from '../structures/Client';
import Event from '../structures/Event';

export default new Event('ready', (client: Client) => {
    console.clear();
    console.log(`[INFORMATION] - Bot launched. Authorized as ${client.user.tag} | Servers: ${client.guilds.cache.size} | Users: ${client.users.cache.size}
        [INFORMATION] - Time: ${new Date().toLocaleTimeString('ru-RU', { timeZone: 'Europe/Moscow'})}
        [INFORMATION] - RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
    client.user?.setPresence({ activities: [{ name: 'picturee production', type: 2 }], status: 'idle' });

    const commands: any = [];
    client.commands.each(command => commands.push(command.structur));
    client.application?.commands.set(commands, '885570820066402314');

    process.on('unhandledRejection', (reason: unknown, p: Promise<unknown>) => {
        console.log(' [antiCrash] :: Unhandled Rejection/Catch');
        console.error(reason, p);
    });
    process.on('uncaughtException', (err: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch');
        console.error(err, origin);
    });
    process.on('uncaughtExceptionMonitor', (err: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
        console.log(' [antiCrash] :: Uncaught Exception/Catch (MONITOR)');
        console.error(err, origin);
    });
});