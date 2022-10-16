import Client from '../structures/Client';
import Command from '../structures/Command';
import Event from '../structures/Event';

import { Collection, Interaction, EmbedBuilder } from 'discord.js';
const cooldowns: Map<string, Collection<string, number>> = new Map();

export default new Event('interactionCreate', async (client: Client, interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command: Command | undefined = client.commands.get(interaction.commandName);
        if (command) {
            try {
                if (!cooldowns.has(command.structur.data.name)) cooldowns.set(command.structur.data.name, new Collection());
                    const current_time: number = Date.now();
                    const time_stamps: Collection<string, number> | undefined = cooldowns.get(command.structur.data.name);
                    const cooldown_amount: number = (command.structur.cooldown || 1) * 1000;
                if (time_stamps?.has(interaction.user.id) && (current_time < time_stamps?.get(interaction.user.id)! + cooldown_amount)) return interaction.reply({ embeds: [new EmbedBuilder()
                        .setTitle(`❌ - Please wait a moment ${(((time_stamps.get(interaction.user.id)! + cooldown_amount) - current_time) / 1000).toFixed(1)}`)
                        .setColor('DarkVividPink')
                    ], ephemeral: true
                });
                time_stamps?.set(interaction.user.id, current_time);
                    setTimeout(() => time_stamps?.delete(interaction.user.id), cooldown_amount);
                command.run(client, interaction);
            } catch (error: unknown) {
                await interaction.deferReply().then(() => interaction.deleteReply());
                return console.error(error);
            };
        };
    };
});