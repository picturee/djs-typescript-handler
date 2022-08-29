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
            partials: [ Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.ThreadMember, Partials.GuildScheduledEvent ],
        });
    };
    public override async login(token?: string) {
        await Promise.all([ 
                this.commandLoader(process.cwd() + '/src/commands'), 
                this.eventLoader(process.cwd() + '/src/events')
            ]);
        return super.login(token);
    };
    private async eventLoader(paths: string) {
        if ((await stat(paths)).isDirectory()) {
            return (await readdir(path.resolve(paths))).filter((name: string) => name.endsWith('.ts') || name.endsWith('.js')).forEach(async (file: string) => {
                const event: Event<keyof ClientEvents> = ((await import(path.resolve(paths, file)))?.default);
                this.on(event.event, (...args) => event.listener(this, ...args));
                delete require.cache[require.resolve(path.resolve(paths, file))];
            });
        };
    };
    private async commandLoader(paths: string) {
        if ((await stat(paths)).isDirectory()) {
            return (await readdir(path.resolve(paths))).forEach(async (category: string) => {
                const commands: string[] = (await readdir(path.resolve(paths, category))).filter((name: string) => name.endsWith('.ts') || name.endsWith('.js'));
                return commands.forEach(async (file: string) => {
                    const command: Command = new ((await import(path.resolve(paths, category, file)))?.default);
                    this.commands.set(command.structur.name, command);
                    delete require.cache[require.resolve(path.resolve(paths, category, file))];
                });
            });
        };
    };
};