const { SlashCommandBuilder } = require('@discordjs/builders');
const { IntegrationApplication } = require('discord.js');
const Diploma = require('../../models/diplomaModel.js');

const weekdays = [['Sunday', 0], ['Monday', 1], ['Tuesday', 2], ['Wednesday', 3], ['Thursday', 4], ['Friday', 5], ['Saturday', 6]];
const weapons = []

module.exports = {
	data: new SlashCommandBuilder()
		.setName('domains')
		.setDescription('Says what Genshin Domains are available')
		.addStringOption(option => 
			option.setName('type')
				.setDescription('What type')
				.setRequired(false)
				.addChoices([['Character', 'Char'], ['Weapon', 'Weap']]))
		.addIntegerOption(option =>
			option.setName('day')
				.setDescription('The day. If empty, defaults to today.')
				.setRequired(false)
				// choices match JS Date()
				.addChoices(weekdays)),
	async execute(interaction) {
		const day = interaction.options.getInteger('day') ?? (new Date()).getDay();
		await interaction.reply(`Displaying materials for **${weekdays[day][0]}**`);
	},
};
