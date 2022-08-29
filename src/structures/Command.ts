import { ApplicationCommandOptionData, ChatInputCommandInteraction } from 'discord.js';
import Client from './Client';

export default class Command {
    structur: options;
    constructor(structur: options) {
        this.structur = structur;
    };
    public run(client: Client, interaction: ChatInputCommandInteraction) {
        throw new Error(`The function to run the command ${this.structur.name} is not specified`);
    };
};

export interface options {
    name: string;
    description: string;
    type?: string | number;
    options?: ApplicationCommandOptionData[];
    cooldown?: number;
};