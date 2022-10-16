import { Client, ClientEvents, Collection, Partials } from 'discord.js';
import 'dotenv/config';

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import Command from './Command';
import Event from './Event';

export default class DiscordClient extends Client<true> {
    public readonly commands: Collection<string, Command> = new Collection();
    constructor() {
        super({
            allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: false },
            intents: 131071,
            partials: [ 
                Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, 
                Partials.GuildMember, Partials.ThreadMember, Partials.GuildScheduledEvent
            ],
            presence: { activities: [{ name: 'Picturee production', type: 2 }], status: 'idle' },
            failIfNotExists: false,
            sweepers: { messages: { interval: 900, lifetime: 1800 } }, // Clearing the cache
        });
    };
    public override async login(token?: string) {
        await Promise.all([
            this.setClientCommands(process.cwd() + '/src/commands/'),
            this.setEventControllers(process.cwd() + '/src/events/')
        ]);
        return super.login(token);
    };
    private async setClientCommands(paths: string): Promise<void> {
        if ((await stat(paths)).isDirectory()) {
            return (await readdir(path.resolve(paths))).forEach(async (category: string) => {
                const commands: string[] = (await readdir(path.resolve(paths, category))).filter((name: string) => name.endsWith('.ts') || name.endsWith('.js'));
                return commands.forEach(async (file: string) => {
                    const command: Command = new ((await import(path.resolve(paths, category, file)))?.default);
                    this.commands.set(command.structur.data.name, command);
                    return delete require.cache[require.resolve(path.resolve(paths, category, file))];
                });
            });
        };
    };
    private async setEventControllers(paths: string): Promise<void> {
        if ((await stat(paths)).isDirectory()) {
            return (await readdir(path.resolve(paths))).filter((name: string) => name.endsWith('.ts') || name.endsWith('.js')).forEach(async (file: string) => {
                const controllers: Event<keyof ClientEvents> = ((await import(path.resolve(paths, file)))?.default);
                this.on(controllers.event, async (...args) => controllers.listener(this, ...args));
                return delete require.cache[require.resolve(path.resolve(paths, file))];
            });
        };
    };
};