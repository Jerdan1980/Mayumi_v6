const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('echo')
		.setDescription('Replies with your string!')
		.addStringOption(option => 
			option.setName('string')
				.setDescription('Enter a string!')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.reply(interaction.options.getString('string'));
	},
};