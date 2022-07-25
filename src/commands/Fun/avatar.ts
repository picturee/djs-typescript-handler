
import { CommandInteraction } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';

export = class extends Command {
    constructor() {
        super({
            name: 'avatar',
            description: 'View member avatar',
            type: ApplicationCommandType.ChatInput,
            options: [{
                name: 'member',
                description: "View another member's avatar",
                type: ApplicationCommandOptionType.User,
                required: false,
            }],
        });
    };
    public run(client: Client, interaction: CommandInteraction<'cached'>) {
        if (!interaction.inCachedGuild()) return;
        const member = interaction.options.getMember('member') || interaction.member;
        return interaction.reply({ embeds: [{
            title: `Member avatar ${interaction.member.displayName}`,
                color: 0x276DAB,
                image: { url: member.displayAvatarURL({ size: 1024 }) }, 
            }],
        });
    };
};