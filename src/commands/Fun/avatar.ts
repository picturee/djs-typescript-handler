import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';

export default class extends Command {
    constructor() {
        super({
            name: 'avatar',
            description: 'View member avatar',
            type: 1,
            options: [{
                name: 'member',
                description: "View another member's avatar",
                type: 6,
                required: false,
            }],
        });
    };
    public run(client: Client, interaction: ChatInputCommandInteraction<'cached'>) {
        if (!interaction.inCachedGuild()) return;
        const member: GuildMember = interaction.options.getMember('member') || interaction.member;
        return interaction.reply({ embeds: [{
                title: `Member avatar ${interaction.member.displayName}`,
                color: 0x276DAB,
                image: { url: member.displayAvatarURL({ size: 1024 }) }, 
            }],
        });
    };
};