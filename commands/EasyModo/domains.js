const { IntegrationApplication, SlashCommandBuilder } = require('discord.js');
const Diploma = require('../../models/diplomaModel.js');

const weapons = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('domains')
		.setDescription('Says what Genshin Domains are available')
		.addStringOption(option => 
			option.setName('type')
				.setDescription('What type')
				.setRequired(false)
				.addChoices(
					{ name: 'Character', value: 'Char'}, 
					{ name: 'Weapon', value: 'Weap'}
				))
		.addIntegerOption(option =>
			option.setName('day')
				.setDescription('The day. If empty, defaults to today.')
				.setRequired(false)
				// choices match JS Date()
				.addChoices(
					{ name: 'Sunday', value: 0},
					{ name: 'Monday', value: 1},
					{ name: 'Tuesday', value: 2},
					{ name: 'Wednesday', value: 3},
					{ name: 'Thursday', value: 4},
					{ name: 'Friday', value: 5},
					{ name: 'Saturday', value: 6}
				)),
	async execute(interaction) {
		const day = interaction.options.getInteger('day') ?? (new Date()).getDay();
		await interaction.reply(`Displaying materials for **${weekdays[day][0]}**`);
	},
};
