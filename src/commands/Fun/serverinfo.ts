import { ChatInputCommandInteraction, GuildBasedChannel, GuildMember } from 'discord.js';
import Client from '../../structures/Client';
import Command from '../../structures/Command';

export default class extends Command {
    constructor() {
        super({
            name: 'serverinfo',
            description: 'Server Information',
            type: 1,
        });
    };
    public async run(client: Client, interaction: ChatInputCommandInteraction<'cached'>) {
        if (!interaction.inCachedGuild()) return;
        const members = {
            general: interaction.guild.memberCount,
            real: interaction.guild.members.cache.filter((x: GuildMember) => !x.user?.bot).size,
            bot: interaction.guild.members.cache.filter((x: GuildMember) => x.user?.bot).size,
            presence: {
                online: interaction.guild.members.cache.filter((x: GuildMember) => x.presence?.status === 'online').size,
                idle: interaction.guild.members.cache.filter((x: GuildMember) => x.presence?.status === 'idle').size,
                dnd: interaction.guild.members.cache.filter((x: GuildMember) => x.presence?.status === 'dnd').size,
                offline: interaction.guild.members.cache.filter((x: GuildMember) => !x.presence?.status || x.presence?.status === 'offline').size
            },
        };
        const channels = {
            total: interaction.guild.channels.cache.size,
            text: interaction.guild.channels.cache.filter((x: GuildBasedChannel) => x?.type === 0).size,
            voice: interaction.guild.channels.cache.filter((x: GuildBasedChannel) => x?.type === 2).size,
            stage: interaction.guild.channels.cache.filter((x: GuildBasedChannel) => x?.type === 13).size
        };
        await interaction.guild.fetchOwner().then(async (owner: GuildMember) => {
            return interaction.reply({ embeds: [{
                    title: `Server Information ${interaction.guild.name}`,
                    color: 0x276DAB,
                        fields: [
                            { name: 'Members:', value: `Total: **${members.general}**\n People: **${members.real}**\n Bots: **${members.bot}**`, inline: true },
                            { name: 'By status:', value: `Online: **${members.presence.online}**\n Inactive: **${members.presence.idle}**\nDo not disturb: **${members.presence.dnd}**\n Offline: **${members.presence.offline}**`, inline: true },
                            { name: 'Channels:', value: `Total: **${channels.total}**\n Text: **${channels.text}**\n Voice: **${channels.voice}**\n Stage: **${channels.stage}**`, inline: true },
                            { name: 'Owner:', value: `${owner.user.tag}`, inline: true },
                            { name: 'Date of creation:', value: `📆 <t:${Math.round(interaction.guild.createdTimestamp / 1000)}:D>`, inline: true }
                        ],
                    thumbnail: { url: `${interaction.guild.iconURL()}`},
                    timestamp: new Date().toISOString()
                }],
            });
        });
    };
};