import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';

export default class extends Command {
    constructor() {
        super({
            data: new SlashCommandBuilder().setName('avatar').setDescription('View member avatar').addUserOption(option =>
                option.setName('member').setDescription("View another member's avatar").setRequired(false)),
            });
        };
    public async run(client: Client, interaction: ChatInputCommandInteraction<'cached'>) { 
        if (!interaction.inCachedGuild()) return;
        const member: GuildMember = interaction.options.getMember('member') || interaction.member;
            await interaction.deferReply().catch((e: Error) => console.error(e));
        return interaction.editReply({ embeds: [new EmbedBuilder()
            .setTitle(`Member avatar ${interaction.member.displayName}`)
                .setColor('DarkVividPink')
                .setImage(member.displayAvatarURL({ size: 1024 }))
            ],
        });
    };
};