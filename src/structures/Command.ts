import { ApplicationCommandData, ApplicationCommandDataResolvable, ChatInputCommandInteraction, CommandInteractionOptionResolver } from 'discord.js';
import DiscordClient from './Client';

export default class Command {
    config: CommandOptions;
    constructor(config: CommandOptions) {
        this.config = config;
    };
    public run (client: DiscordClient, interaction: ChatInputCommandInteraction) {
        throw new Error(`The function to run the command ${this.config.name} is not specified`);
    };
};

export type CommandOptions = ApplicationCommandData & {
    cooldown?: Number;
};