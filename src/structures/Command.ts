import { SlashCommandBuilder, ChatInputCommandInteraction, ApplicationCommandOptionBase, SharedSlashCommandOptions, SharedNameAndDescription } from 'discord.js';
import Client from './Client';

export default class Command {
    structur: SlashCommand;
    constructor(structur: SlashCommand) {
        this.structur = structur;
    };
    public run(client: Client, interaction: ChatInputCommandInteraction) {
        throw new Error(`The function to run the command ${this.structur.data.name} is not specified`);
    };
};

export interface SlashCommand {
    data: SlashCommandBuilder | SharedNameAndDescription;
    cooldown?: number;
};