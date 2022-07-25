import { Client, Collection, Partials } from 'discord.js';
    require('dotenv').config({ path: '.env' });
import fs from 'node:fs';
import path from 'node:path';
import Command from './Command';

export default class DiscordClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public constructor() {
        super({
            allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: false },
            intents: 131071,
            partials: [
                Partials.Message, 
                Partials.Channel, 
                Partials.Reaction, 
                Partials.User, 
                Partials.GuildMember, 
                Partials.ThreadMember, 
                Partials.GuildScheduledEvent
            ],
        });
    };
    public start() {
        this.login(process.env.token).then(() => {
            this.eventsLoad();
            this.commandsLoad();
        }).catch(() => process.exit(1));
    };
    public eventsLoad() {
        fs.readdirSync(path.resolve(__dirname, '..', 'events')).filter(name => name.endsWith('.ts')).forEach(async (file: string) => {
            const event = (await import(path.join(__dirname, '..', 'events', file))).default;
            const eventname = file.split('.')[0];
            this.on(eventname, event.bind(null, this));
            delete require.cache[require.resolve(path.resolve(__dirname, '..', 'events', file))]; // If you are going to reload events in the future
        });
    }; 
    public commandsLoad() {
        fs.readdirSync(path.resolve(__dirname, '..', 'commands')).forEach((category: string) => {
            const commands = fs.readdirSync(path.resolve(__dirname, '..', 'commands', category)).filter(file => file.endsWith('.ts'));
            commands.forEach(async (file: string) => {
                const command: Command = new ((await import(path.resolve(__dirname, '..', 'commands', category, file))).default);
                this.commands.set(command.config?.name, command);
                delete require.cache[require.resolve(path.resolve(__dirname, '..', 'commands', category, file))]; // If you are going to reload commands in the future
            }); 
        });
    };
};