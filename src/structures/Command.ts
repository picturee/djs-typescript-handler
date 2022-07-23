'use strict';

import { ApplicationCommandOptionData } from 'discord.js';

export default class Command {
    config: CommandOptions;
    constructor(config: CommandOptions) {
        this.config = config;
    };
    public run (client: any, interaction: any) {
        throw new Error(`The function to run the command ${this.config.name} is not specified`);
    };
};

export interface CommandOptions {
    name: string;
    description?: string;
    type?: string | Number;
    options?: ApplicationCommandOptionData[];
    cooldown?: Number;
};