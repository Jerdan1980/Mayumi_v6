const { SlashCommandBuilder, IntegrationApplication } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stackify')
		.setDescription('Returns number of stacks, defaults to a stack size of 64.')
		.addIntegerOption(option => 
			option.setName('items')
				.setDescription('The number of items!')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('size')
				.setDescription('Size of a single stack')
				.setRequired(false)),
	async execute(interaction) {
		const num = interaction.options.getInteger('items');
		const stack = interaction.options.getInteger('size') ?? 64;

		if ((num % stack) == 0) {
			await interaction.reply(`${Math.floor(num / stack)} stack(s)`);
		} else {
			await interaction.reply(`${Math.floor(num / stack)} stack(s) and ${num % stack} left over`);
		}
	},
};