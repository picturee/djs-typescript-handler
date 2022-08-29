import Client from './Client';
import { ClientEvents } from 'discord.js';

export default class Event<Key extends keyof ClientEvents> {
    constructor(public event: Key, public listener: (client: Client, ...args: ClientEvents[Key]) => any) {};
};