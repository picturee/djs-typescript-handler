import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder, time } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';

export default class extends Command {
    constructor() {
        super({
            data: new SlashCommandBuilder().setName('serverinfo').setDescription('Server information')
        });
    };
    public async run(client: Client, interaction: ChatInputCommandInteraction<'cached'>) {
        if (!interaction.inCachedGuild()) return;
            await interaction.deferReply().catch((e: Error) => console.error(e));

            const getChannelTypeSizes = (type: ChannelType[]) => interaction.guild.channels.cache.filter((channel) => type.includes(channel.type)).size;
            const members = {
                members: interaction.guild.memberCount,
                bot: interaction.guild.members.cache.filter((x: GuildMember) => x.user?.bot).size,
                boosters: interaction.guild.members.cache.filter((x: GuildMember) => x.roles.premiumSubscriberRole).size,
                presence: {
                    online: interaction.guild.members.cache.filter((x: GuildMember) => x.presence?.status === 'online').size,
                    idle: interaction.guild.members.cache.filter((x: GuildMember) => x.presence?.status === 'idle').size,
                    dnd: interaction.guild.members.cache.filter((x: GuildMember) => x.presence?.status === 'dnd').size,
                    offline: interaction.guild.members.cache.filter((x: GuildMember) => !x.presence?.status || x.presence?.status === 'offline').size
                },
            };
        return void (await interaction.guild.fetchOwner().then((owner: GuildMember) => {
            return interaction.editReply({ embeds: [new EmbedBuilder()
                .setTitle(`Server Information ${interaction.guild.name}`)
                .setColor('DarkVividPink')
                .addFields(
                    { name: '💬 Channels', value: `Total: **${interaction.guild.channels.cache.size}**\n Text: **${getChannelTypeSizes([ ChannelType.GuildText ])}**\n Voice: **${getChannelTypeSizes([ChannelType.GuildVoice])}**\n Stage: **${getChannelTypeSizes([ChannelType.GuildStageVoice])}**\n Forum: **${getChannelTypeSizes([ChannelType.GuildForum])}**`, inline: true },
                    { name: '💻 By status', value: `Online: **${members.presence.online}**\n Inactive: **${members.presence.idle}**\n Do not disturb: **${members.presence.dnd}**\n Offline: **${members.presence.offline}**`, inline: true },
                    { name: '👦 Members', value: `People: **${members.members - members.bot}**\n Bots: **${members.bot}**\n Boosters: **${members.boosters}**`, inline: true },
                    { name: '👑 Owner', value: owner.user.tag, inline: true },
                    { name: '📆 Date of creation:', value: `📆 ${time(interaction.guild.createdAt, 'D')}`, inline: true }
                ).setThumbnail(interaction.guild.iconURL({ size: 1024 })).setImage(interaction.guild.bannerURL({ size: 1024 }))
            ]});
        }));
    };
};