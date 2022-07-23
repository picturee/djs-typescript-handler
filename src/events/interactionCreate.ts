'use strict';
import Client from '../structures/Client';
import { Interaction } from 'discord.js';

export = (client: Client, interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) {
            try {
                command.run(client, interaction);
            } catch (error: unknown) {
                return console.error(error);
            };
        };
    };
}; 